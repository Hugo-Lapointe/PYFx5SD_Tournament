import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { doc, writeBatch, serverTimestamp } from "firebase/firestore";
import { ArrowLeft, Trophy, Save, ArrowRight, AlertCircle } from "lucide-react";
import { db } from "../../firebase";
import { teams } from "../../data/teams";
import { getStandings } from "../../data/standings";
import useMatches from "../../hooks/useMatches";

const GROUPS = ["A", "B", "C", "D"];
const QF = {
  upper: ["qf-u1", "qf-u2", "qf-u3", "qf-u4"],
  lower: ["qf-l1", "qf-l3", "qf-l2", "qf-l4"],
};
const SF = { upper: ["sf-u1", "sf-u2"], lower: ["sf-l1", "sf-l2"] };
const GF = { upper: "gf-u", lower: "gf-l" };
const PAIRINGS = [[1, 8], [2, 7], [3, 6], [4, 5]];

const getWinner = (match) => {
  if (!match || match.status !== "completed" || !match.team1Id || !match.team2Id) return null;
  const a = Number(match.score1);
  const b = Number(match.score2);
  if (!Number.isFinite(a) || !Number.isFinite(b) || a === b || match.score1 == null || match.score2 == null) return null;
  return a > b ? match.team1Id : match.team2Id;
};

const nameOf = (id) => teams.find((team) => team.id === id)?.name || "TBD";

export default function ManageStandingsPlayoffs() {
  const { matches = [], loading, error: loadError } = useMatches();
  const [division, setDivision] = useState("upper");
  const [seeds, setSeeds] = useState({ upper: null, lower: null });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const matchById = useMemo(() => Object.fromEntries(matches.map((m) => [m.id, m])), [matches]);
  const upperStandings = useMemo(() => getStandings(matches, "upper"), [matches]);
  const lowerGroups = useMemo(() => Object.fromEntries(GROUPS.map((group) => [group, getStandings(matches, "lower", group)])), [matches]);
  const suggested = division === "upper"
    ? upperStandings.slice(0, 8).map((team) => team.id)
    : GROUPS.flatMap((group) => lowerGroups[group].slice(0, 2).map((team) => team.id));
  const currentSeeds = seeds[division] || suggested;
  const eligible = division === "upper" ? upperStandings : GROUPS.flatMap((group) => lowerGroups[group]);
  const qualifiedCount = division === "upper" ? 8 : 8;

  const setSeed = (index, id) => {
    setSeeds((previous) => ({ ...previous, [division]: currentSeeds.map((value, i) => i === index ? id : value) }));
    setMessage("");
  };

  const validateSeedIds = () => {
    if (currentSeeds.length !== qualifiedCount || currentSeeds.some((id) => !id)) return "Select all eight seeds.";
    if (new Set(currentSeeds).size !== qualifiedCount) return "Each team may occupy only one seed.";
    if (currentSeeds.some((id) => !eligible.some((team) => team.id === id))) return "A seed contains a team outside this division.";
    if (division === "lower") {
      for (const group of GROUPS) {
        if (currentSeeds.filter((id) => teams.find((team) => team.id === id)?.group === group).length !== 2) {
          return `Lower Division must include exactly two teams from Group ${group}.`;
        }
      }
    }
    return null;
  };

  const commitAssignments = async (assignments, successMessage) => {
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const batch = writeBatch(db);
      assignments.forEach(({ id, team1Id, team2Id }) => {
        batch.set(doc(db, "matches", id), {
          team1Id, team2Id, updatedAt: serverTimestamp(),
        }, { merge: true });
      });
      await batch.commit();
      setMessage(successMessage);
    } catch (err) {
      console.error(err);
      setError("Could not save assignments. Check Firestore permissions.");
    } finally {
      setSaving(false);
    }
  };

  const confirmQuarterfinals = async () => {
    const problem = validateSeedIds();
    if (problem) return setError(problem);
    const assignments = QF[division].map((id, index) => ({
      id,
      team1Id: currentSeeds[PAIRINGS[index][0] - 1],
      team2Id: currentSeeds[PAIRINGS[index][1] - 1],
    }));
    if (assignments.some(({ id }) => matchById[id]?.status === "completed")) {
      return setError("A quarterfinal already has a completed result. Reset its result before reseeding.");
    }
    if (!window.confirm(`Publish ${division} quarterfinal matchups? This will replace existing quarterfinal team assignments.`)) return;
    await commitAssignments(assignments, "Quarterfinal matchups published to the Schedule.");
  };

  const advance = async (round) => {
    const sourceIds = round === "semifinals" ? QF[division] : SF[division];
    const destinationIds = round === "semifinals" ? SF[division] : [GF[division]];
    const winners = sourceIds.map((id) => getWinner(matchById[id]));
    if (winners.some((winner) => !winner)) {
      return setError("All preceding matches must have completed, non-tied results before advancing.");
    }
    const assignments = destinationIds.map((id, index) => ({
      id,
      team1Id: winners[index * 2],
      team2Id: winners[index * 2 + 1],
    }));
    if (assignments.some(({ id }) => matchById[id]?.status === "completed")) {
      return setError("A destination match is already completed. Reset its result before changing teams.");
    }
    if (!window.confirm(`Advance winners to the ${round === "semifinals" ? "semifinals" : "grand final"}?`)) return;
    await commitAssignments(assignments, "Winners advanced successfully.");
  };

  const MatchRow = ({ id }) => {
    const match = matchById[id];
    return (
      <div className="asp-match">
        <div><strong>{match?.label || id.toUpperCase()}</strong><small>{match?.format || "BO1"} · {match?.status || "scheduled"}</small></div>
        <span>{nameOf(match?.team1Id)} <b>vs</b> {nameOf(match?.team2Id)}</span>
        {getWinner(match) && <small>Winner: {nameOf(getWinner(match))}</small>}
      </div>
    );
  };

  return (
    <main className="container asp-page admin-matches-page">
      <Link to="/admin" className="admin-back-link"><ArrowLeft size={16} /> Back to Dashboard</Link>
      <div className="page-heading">
        <p className="section-label">TOURNAMENT OPERATIONS</p>
        <h1>STANDINGS <span className="gradient-text">& PLAYOFFS</span></h1>
        <p>Review live standings, confirm seeds, and advance playoff winners.</p>
      </div>
      <div className="standings-tabs">
        <button className={division === "upper" ? "active" : ""} onClick={() => { setDivision("upper"); setError(""); setMessage(""); }}>Upper Division</button>
        <button className={division === "lower" ? "active" : ""} onClick={() => { setDivision("lower"); setError(""); setMessage(""); }}>Lower Division</button>
      </div>
      {loading && <p>Loading live match results...</p>}
      {loadError && <p className="asp-error">Unable to load live matches. Do not publish seeds until results load.</p>}
      {error && <p className="asp-error"><AlertCircle size={16} /> {error}</p>}
      {message && <p className="asp-success">{message}</p>}
      <section className="asp-panel">
        <h2><Trophy size={20} /> Live standings</h2>
        {(division === "upper" ? [{ title: "Upper Division", list: upperStandings }] : GROUPS.map((group) => ({ title: `Group ${group}`, list: lowerGroups[group] }))).map(({ title, list }) => (
          <div key={title} className="asp-standing-group">
            <h3>{title}</h3>
            <div className="standings-table-wrap"><table className="standings-table"><thead><tr><th>#</th><th>TEAM</th><th>MP</th><th>W</th><th>L</th><th>RD</th></tr></thead><tbody>
              {list.map((team, index) => <tr key={team.id}>
                <td><span className={`standings-rank ${index < (division === "upper" ? 8 : 2) ? "qualified" : ""}`}>{index + 1}</span></td>
                <td><div className="standings-team"><span className="standings-team-dot" style={{ background: team.color }} /><strong>{team.name}</strong></div></td>
                <td>{team.played}</td><td className="standings-wins">{team.wins}</td><td>{team.losses}</td><td>{team.roundDifferential > 0 ? "+" : ""}{team.roundDifferential}</td>
              </tr>)}
            </tbody></table></div>
          </div>
        ))}
      </section>
      <section className="asp-panel">
        <h2>Quarterfinal seeding</h2>
        <p className="asp-muted">Default seeds follow current standings (wins, round differential, then team name). Confirm official tiebreakers manually. Lower seeds must contain two teams from each group.</p>
        <div className="asp-seed-grid">
          {currentSeeds.map((id, index) => <label className="asp-seed" key={index}>
            <span>Seed {index + 1}</span>
            <select value={id || ""} onChange={(event) => setSeed(index, event.target.value)}>
              <option value="">Choose team</option>
              {eligible.map((team) => <option key={team.id} value={team.id}>{team.name}{division === "lower" ? ` · Group ${team.group}` : ""}</option>)}
            </select>
          </label>)}
        </div>
        <button className="asp-action" disabled={saving || loading || !!loadError} onClick={confirmQuarterfinals}><Save size={17} /> Publish quarterfinal matchups</button>
        <p className="asp-muted">Seed pairings: 1 vs 8, 2 vs 7, 3 vs 6, 4 vs 5. The Lower Division match IDs follow the labels in your existing schedule.</p>
      </section>
      <section className="asp-panel">
        <h2>Quarterfinals</h2>
        <div className="asp-match-grid">{QF[division].map((id) => <MatchRow key={id} id={id} />)}</div>
        <button className="asp-action" disabled={saving || loading || !!loadError} onClick={() => advance("semifinals")}><ArrowRight size={17} /> Advance quarterfinal winners</button>
      </section>
      <section className="asp-panel">
        <h2>Semifinals</h2>
        <div className="asp-match-grid">{SF[division].map((id) => <MatchRow key={id} id={id} />)}</div>
        <button className="asp-action" disabled={saving || loading || !!loadError} onClick={() => advance("final")}><ArrowRight size={17} /> Advance semifinal winners</button>
      </section>
      <section className="asp-panel">
        <h2>Grand Final</h2>
        <div className="asp-match-grid"><MatchRow id={GF[division]} /></div>
        {getWinner(matchById[GF[division]]) && <p className="asp-champion"><Trophy size={20} /> Champion: {nameOf(getWinner(matchById[GF[division]]))}</p>}
        <p className="asp-muted">Enter BO1 and BO3 results through <Link to="/admin/matches">Manage Matches</Link>. Results appear here automatically.</p>
      </section>
    </main>
  );
}
