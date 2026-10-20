import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, FlaskConical, RotateCcw, Play, Trophy, Swords } from "lucide-react";
import { teams } from "../../data/teams";
import { matches } from "../../data/matches";
import { getStandings } from "../../data/standings";
import "./TournamentSimulator.css";

// This page intentionally has NO Firebase imports, reads, or writes.
const GROUPS = ["A", "B", "C", "D"];
const QUARTERS = {
  upper: ["qf-u1", "qf-u2", "qf-u3", "qf-u4"],
  lower: ["qf-l1", "qf-l3", "qf-l2", "qf-l4"],
};
const SEMIS = { upper: ["sf-u1", "sf-u2"], lower: ["sf-l1", "sf-l2"] };
const FINALS = { upper: "gf-u", lower: "gf-l" };
const PAIRINGS = [[0, 7], [1, 6], [2, 5], [3, 4]];
const byId = Object.fromEntries(teams.map((team) => [team.id, team]));
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pickWinner = (team1Id, team2Id) => Math.random() < 0.5 ? team1Id : team2Id;

function completeMatch(match, team1Id, team2Id) {
  const winnerId = pickWinner(team1Id, team2Id);
  const team1Won = winnerId === team1Id;
  const isBo3 = match.format === "BO3";
  const loserScore = isBo3 ? randomInt(0, 1) : 0;
  const score1 = team1Won ? (isBo3 ? 2 : 1) : loserScore;
  const score2 = team1Won ? loserScore : (isBo3 ? 2 : 1);
  // Round totals are illustrative, not per-map scores.
  const winningRounds = isBo3 ? (loserScore === 1 ? 39 : 26) : 13;
  const losingRounds = isBo3 ? randomInt(12, winningRounds - 1) : randomInt(3, 11);
  return {
    ...match,
    team1Id,
    team2Id,
    status: "completed",
    score1,
    score2,
    rounds1: team1Won ? winningRounds : losingRounds,
    rounds2: team1Won ? losingRounds : winningRounds,
  };
}

function winnerOf(match) {
  if (!match || match.status !== "completed" || !match.team1Id || !match.team2Id) return null;
  if (Number(match.score1) === Number(match.score2)) return null;
  return Number(match.score1) > Number(match.score2) ? match.team1Id : match.team2Id;
}

function buildSimulation() {
  const all = matches.map((match) => ({ ...match }));
  const index = new Map(all.map((match, i) => [match.id, i]));
  const replace = (match) => {
    const i = index.get(match.id);
    if (i !== undefined) all[i] = match;
  };

  // Round-robin results are created first, so seeding comes from actual simulated standings.
  all.filter((match) => match.stage === "Round Robin" && match.team1Id && match.team2Id)
    .forEach((match) => replace(completeMatch(match, match.team1Id, match.team2Id)));

  const seeds = {
    upper: getStandings(all, "upper").slice(0, 8).map((team) => team.id),
    // Lower qualification is top two from each group, in A/B/C/D order.
    lower: GROUPS.flatMap((group) =>
      getStandings(all, "lower", group).slice(0, 2).map((team) => team.id)
    ),
  };

  for (const division of ["upper", "lower"]) {
    if (seeds[division].length !== 8) continue;
    const quarterWinners = [];
    QUARTERS[division].forEach((id, i) => {
      const fixture = all[index.get(id)];
      if (!fixture) return;
      const [a, b] = PAIRINGS[i];
      const played = completeMatch(fixture, seeds[division][a], seeds[division][b]);
      replace(played);
      quarterWinners.push(winnerOf(played));
    });

    const semiWinners = [];
    SEMIS[division].forEach((id, i) => {
      const fixture = all[index.get(id)];
      const first = quarterWinners[i * 2];
      const second = quarterWinners[i * 2 + 1];
      if (!fixture || !first || !second) return;
      const played = completeMatch(fixture, first, second);
      replace(played);
      semiWinners.push(winnerOf(played));
    });

    const final = all[index.get(FINALS[division])];
    if (final && semiWinners.length === 2) {
      replace(completeMatch(final, semiWinners[0], semiWinners[1]));
    }
  }
  return all;
}

function TeamName({ id }) {
  const team = byId[id];
  return <span>{team?.name ?? (id ? id : "TBD")}</span>;
}

function MatchCard({ match }) {
  if (!match) return <div className="sim-match sim-empty">Fixture not found</div>;
  const winner = winnerOf(match);
  return (
    <div className="sim-match">
      <div className="sim-match-label">{match.label || match.id} <span>{match.format}</span></div>
      {[1, 2].map((side) => {
        const id = match[`team${side}Id`];
        return (
          <div className={`sim-match-team ${winner === id && id ? "sim-winner" : ""}`} key={side}>
            <TeamName id={id} />
            <strong>{match.status === "completed" ? match[`score${side}`] : "–"}</strong>
          </div>
        );
      })}
    </div>
  );
}

function StandingsTable({ rows, qualified = 0 }) {
  return (
    <div className="sim-table-scroll">
      <table className="sim-table">
        <thead><tr><th>#</th><th>TEAM</th><th>MP</th><th>W</th><th>L</th><th>RD</th></tr></thead>
        <tbody>
          {rows.map((team, index) => (
            <tr key={team.id} className={index < qualified ? "sim-qualified" : ""}>
              <td>{index + 1}</td><td><span className="sim-team-dot" style={{ background: team.color || "var(--blue)" }} />{team.name}</td>
              <td>{team.played}</td><td>{team.wins}</td><td>{team.losses}</td>
              <td>{team.roundDifferential > 0 ? "+" : ""}{team.roundDifferential}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Manual practice uses the same fixture IDs and getStandings function as the real app.
// It deliberately has no Firebase dependency and never calls the live admin handlers.
function ManualSimulator() {
  const [practice, setPractice] = useState(() => matches.map((m) => ({ ...m })));
  const [division, setDivision] = useState("upper");
  const [stage, setStage] = useState("Round Robin");
  const [selectedId, setSelectedId] = useState("");
  const [score1, setScore1] = useState("");
  const [score2, setScore2] = useState("");
  const [rounds1, setRounds1] = useState("");
  const [rounds2, setRounds2] = useState("");
  const [seedOverrides, setSeedOverrides] = useState({ upper: null, lower: null });
  const [notice, setNotice] = useState("");
  const matchMap = useMemo(() => Object.fromEntries(practice.map((m) => [m.id, m])), [practice]);
  const rr = practice.filter((m) => m.division === division && m.stage === "Round Robin");
  const playoffIds = [...QUARTERS[division], ...SEMIS[division], FINALS[division]];
  const shown = stage === "Round Robin" ? rr : playoffIds.map((id) => matchMap[id]).filter(Boolean);
  const chosen = matchMap[selectedId];
  const computedSeeds = {
    upper: getStandings(practice, "upper").slice(0, 8).map((t) => t.id),
    lower: GROUPS.flatMap((g) => getStandings(practice, "lower", g).slice(0, 2).map((t) => t.id)),
  };
  const seeds = seedOverrides[division] || computedSeeds[division];
  const completedRR = rr.filter((m) => m.status === "completed").length;
  const resetResult = (m) => ({ ...m, status: "scheduled", score1: null, score2: null, rounds1: null, rounds2: null });
  const updateFixture = (id, next) => setPractice((prev) => prev.map((m) => m.id === id ? next(m) : m));
  const openFixture = (m) => {
    setSelectedId(m.id);
    setScore1(m.score1 == null ? "" : String(m.score1));
    setScore2(m.score2 == null ? "" : String(m.score2));
    setRounds1(m.rounds1 == null ? "" : String(m.rounds1));
    setRounds2(m.rounds2 == null ? "" : String(m.rounds2));
    setNotice("");
  };
  const save = (event) => {
    event.preventDefault();
    if (!chosen?.team1Id || !chosen?.team2Id) return setNotice("Assign both teams before entering a result.");
    const a = Number(score1), b = Number(score2);
    const bo3 = chosen.format === "BO3";
    const valid = Number.isInteger(a) && Number.isInteger(b) && a >= 0 && b >= 0 && a !== b &&
      (bo3 ? (Math.max(a,b) === 2 && Math.min(a,b) <= 1) : (Math.max(a,b) === 1 && Math.min(a,b) === 0));
    if (!valid || score1.trim() === "" || score2.trim() === "") {
      return setNotice(bo3 ? "BO3 needs 2–0 or 2–1." : "BO1 needs 1–0 or 0–1.");
    }
    const r1 = rounds1.trim() === "" ? null : Number(rounds1);
    const r2 = rounds2.trim() === "" ? null : Number(rounds2);
    if ((r1 !== null && (!Number.isInteger(r1) || r1 < 0)) ||
        (r2 !== null && (!Number.isInteger(r2) || r2 < 0)) ||
        ((r1 === null) !== (r2 === null))) {
      return setNotice("Enter both nonnegative round totals, or leave both blank.");
    }
    updateFixture(chosen.id, (m) => ({ ...m, status: "completed", score1: a, score2: b, rounds1: r1, rounds2: r2 }));
    setNotice(`Saved ${chosen.id} locally. No Firebase changes.`);
  };
  const resetSelected = () => {
    if (!chosen) return;
    updateFixture(chosen.id, resetResult);
    openFixture(resetResult(chosen));
    setNotice("Practice result cleared. Recheck downstream playoff assignments if you changed a winner.");
  };
  const publishQuarterfinals = () => {
    if (seeds.length !== 8 || new Set(seeds).size !== 8 || seeds.some((id) => !id)) return setNotice("Choose eight different teams.");
    if (division === "lower" && GROUPS.some((g) => seeds.filter((id) => byId[id]?.group === g).length !== 2)) {
      return setNotice("Lower Division requires exactly two qualifiers from each group.");
    }
    if (QUARTERS[division].some((id) => matchMap[id]?.status === "completed")) return setNotice("Reset completed quarterfinals before changing seeds.");
    setPractice((prev) => prev.map((m) => {
      const index = QUARTERS[division].indexOf(m.id);
      if (index < 0) return m;
      const [a,b] = PAIRINGS[index];
      return resetResult({ ...m, team1Id: seeds[a], team2Id: seeds[b] });
    }));
    setNotice("Quarterfinals seeded locally. Select a match to enter its score.");
    setStage("Playoffs");
  };
  const advance = (fromIds, toIds) => {
    const winners = fromIds.map((id) => winnerOf(matchMap[id]));
    if (winners.some((id) => !id)) return setNotice("Finish all matches in the previous round first.");
    if (toIds.some((id) => matchMap[id]?.status === "completed")) return setNotice("Reset completed destination matches before changing their teams.");
    setPractice((prev) => prev.map((m) => {
      const index = toIds.indexOf(m.id);
      if (index < 0) return m;
      return resetResult({ ...m, team1Id: winners[index * 2], team2Id: winners[index * 2 + 1] });
    }));
    setNotice("Winners advanced locally. Enter the next-round scores when ready.");
  };
  const selectDivision = (value) => { setDivision(value); setSelectedId(""); setNotice(""); };
  const resetAll = () => {
    setPractice(matches.map((m) => ({ ...m })));
    setSeedOverrides({ upper: null, lower: null });
    setSelectedId("");
    setNotice("All practice data cleared from browser memory.");
  };
  const currentChampion = winnerOf(matchMap[FINALS[division]]);

  return (
    <div className="sim-manual">
      <div className="sim-controls">
        <button className="sim-secondary" type="button" onClick={resetAll}><RotateCcw size={16}/> Reset All Practice</button>
        <span className="sim-count">LOCAL ONLY · Nothing saved to Firebase</span>
      </div>
      <div className="sim-tabs">
        <button className={division === "upper" ? "active" : ""} onClick={() => selectDivision("upper")}>Upper Division</button>
        <button className={division === "lower" ? "active" : ""} onClick={() => selectDivision("lower")}>Lower Division</button>
      </div>
      <div className="sim-tabs sim-view-tabs">
        <button className={stage === "Round Robin" ? "active" : ""} onClick={() => {setStage("Round Robin");setSelectedId("");}}>Round Robin</button>
        <button className={stage === "Playoffs" ? "active" : ""} onClick={() => {setStage("Playoffs");setSelectedId("");}}>Playoffs</button>
      </div>
      {notice && <div className="sim-note" role="status">{notice}</div>}
      <div className="sim-manual-layout">
        <section className="sim-section">
          <h2>{stage === "Round Robin" ? "Practice Match Results" : "Practice Playoff Results"}</h2>
          <p>{stage === "Round Robin" ? `${completedRR} / ${rr.length} Round Robin fixtures completed` : "Assign seeds, advance winners, and enter results in order."}</p>
          <div className="sim-match-list">
            {shown.map((m) => (
              <button type="button" key={m.id} className={`sim-match-choice ${selectedId === m.id ? "active" : ""}`} onClick={() => openFixture(m)}>
                <span className="sim-match-choice-meta">{m.label || m.id} · {m.format} · {m.status === "completed" ? "Completed" : "Scheduled"}</span>
                <span><TeamName id={m.team1Id}/> <strong>{m.status === "completed" ? `${m.score1}–${m.score2}` : "vs"}</strong> <TeamName id={m.team2Id}/></span>
              </button>
            ))}
          </div>
        </section>
        <section className="sim-section sim-editor">
          <h2>Match Editor</h2>
          {chosen ? (
            <form onSubmit={save}>
              <p>{chosen.id} · {chosen.format}</p>
              <div className="sim-score-grid">
                <label><TeamName id={chosen.team1Id}/><input type="number" min="0" value={score1} onChange={(e) => setScore1(e.target.value)} placeholder="Maps" required/></label>
                <label><TeamName id={chosen.team2Id}/><input type="number" min="0" value={score2} onChange={(e) => setScore2(e.target.value)} placeholder="Maps" required/></label>
                <label>Team 1 total rounds<input type="number" min="0" value={rounds1} onChange={(e) => setRounds1(e.target.value)} placeholder="Optional"/></label>
                <label>Team 2 total rounds<input type="number" min="0" value={rounds2} onChange={(e) => setRounds2(e.target.value)} placeholder="Optional"/></label>
              </div>
              <p className="sim-footnote">Use 1–0 for BO1 or 2–0 / 2–1 for BO3. Round totals are optional.</p>
              <div className="sim-controls"><button className="sim-primary" type="submit">Save Practice Result</button><button className="sim-secondary" type="button" onClick={resetSelected}>Reset This Result</button></div>
            </form>
          ) : <p>Choose a fixture on the left to enter or reset its practice score.</p>}
        </section>
      </div>
      <section className="sim-section sim-manual-standings">
        <h2>Live Practice Standings</h2>
        {division === "upper" ? <StandingsTable rows={getStandings(practice,"upper")} qualified={8}/> :
          <div className="sim-groups">{GROUPS.map((g) => <div key={g}><h3>Group {g}</h3><StandingsTable rows={getStandings(practice,"lower",g)} qualified={2}/></div>)}</div>}
      </section>
      <section className="sim-section sim-manual-standings">
        <h2>Playoff Seeding & Advancement</h2>
        <p>Seed order is editable. Publish quarterfinals only after reviewing standings. Lower defaults to A1, A2, B1, B2, C1, C2, D1, D2—not official cross-group ranking.</p>
        <div className="sim-seed-grid">
          {seeds.map((id,i) => <label key={`${division}-${i}`}>Seed {i+1}
            <select value={id || ""} onChange={(e) => setSeedOverrides((prev) => ({...prev,[division]:seeds.map((value,j) => i === j ? e.target.value : value)}))}>
              <option value="">Choose team</option>
              {teams.filter((t) => t.division === division).map((t) => <option key={t.id} value={t.id}>{t.name}{t.group ? ` (${t.group})` : ""}</option>)}
            </select>
          </label>)}
        </div>
        <div className="sim-controls">
          <button className="sim-primary" type="button" onClick={publishQuarterfinals}>Publish Practice Quarterfinals</button>
          <button className="sim-secondary" type="button" onClick={() => advance(QUARTERS[division],SEMIS[division])}>Advance QF Winners → Semifinals</button>
          <button className="sim-secondary" type="button" onClick={() => advance(SEMIS[division],[FINALS[division]])}>Advance SF Winners → Final</button>
        </div>
        <div className="sim-bracket">
          <div className="sim-round"><h3>Quarterfinals</h3>{QUARTERS[division].map((id) => <MatchCard key={id} match={matchMap[id]}/>)}</div>
          <div className="sim-round"><h3>Semifinals</h3>{SEMIS[division].map((id) => <MatchCard key={id} match={matchMap[id]}/>)}</div>
          <div className="sim-round"><h3>Grand Final</h3><MatchCard match={matchMap[FINALS[division]]}/>{currentChampion && <div className="sim-champion"><Trophy size={20}/><span>PRACTICE CHAMPION</span><strong><TeamName id={currentChampion}/></strong></div>}</div>
        </div>
      </section>
    </div>
  );
}

export default function TournamentSimulator() {
  const [mode, setMode] = useState("automatic");
  const [simulated, setSimulated] = useState(null);
  const [division, setDivision] = useState("upper");
  const [view, setView] = useState("playoffs");
  const current = simulated ?? matches;
  const matchMap = useMemo(() => Object.fromEntries(current.map((match) => [match.id, match])), [current]);
  const standings = useMemo(() => ({
    upper: getStandings(current, "upper"),
    lower: Object.fromEntries(GROUPS.map((group) => [group, getStandings(current, "lower", group)])),
  }), [current]);
  const playedCount = current.filter((match) => match.status === "completed").length;
  const champion = simulated ? winnerOf(matchMap[FINALS[division]]) : null;

  return (
    <main className="container sim-page">
      <Link to="/admin" className="sim-back"><ArrowLeft size={17} /> Back to Admin Dashboard</Link>
      <div className="sim-header">
        <div>
          <p className="sim-eyebrow"><FlaskConical size={16} /> LOCAL TESTING ONLY</p>
          <h1>TOURNAMENT <span>SIMULATOR</span></h1>
          <p>Generate an entire practice tournament without reading or writing Firebase.</p>
        </div>
        <span className="sim-safe">NO FIREBASE CHANGES</span>
      </div>

      <div className="sim-tabs"><button type="button" className={mode === "automatic" ? "active" : ""} onClick={() => setMode("automatic")}>Automatic Simulation</button><button type="button" className={mode === "manual" ? "active" : ""} onClick={() => setMode("manual")}>Manual Admin Practice</button></div>
      {mode === "manual" ? <ManualSimulator /> : <>
      <div className="sim-controls">
        <button type="button" className="sim-primary" onClick={() => setSimulated(buildSimulation())}>
          <Play size={17} /> {simulated ? "Generate New Simulation" : "Simulate Entire Tournament"}
        </button>
        <button type="button" className="sim-secondary" onClick={() => setSimulated(null)} disabled={!simulated}>
          <RotateCcw size={17} /> Reset Simulation
        </button>
        <span className="sim-count"><Swords size={16} /> {simulated ? `${playedCount} simulated completed matches` : "No simulation running"}</span>
      </div>

      <div className="sim-note">This page uses temporary React state only. Reloading or leaving this page clears the simulated results. No admin match results, playoff assignments, or public standings are changed.</div>

      <div className="sim-tabs">
        <button type="button" className={division === "upper" ? "active" : ""} onClick={() => setDivision("upper")}>Upper Division</button>
        <button type="button" className={division === "lower" ? "active" : ""} onClick={() => setDivision("lower")}>Lower Division</button>
      </div>
      <div className="sim-tabs sim-view-tabs">
        <button type="button" className={view === "playoffs" ? "active" : ""} onClick={() => setView("playoffs")}>Playoff Bracket</button>
        <button type="button" className={view === "standings" ? "active" : ""} onClick={() => setView("standings")}>Round Robin Standings</button>
      </div>

      {view === "standings" ? (
        division === "upper" ? (
          <section className="sim-section"><h2>Upper Division Standings</h2><p>Top eight qualify for playoffs.</p><StandingsTable rows={standings.upper} qualified={8} /></section>
        ) : (
          <div className="sim-groups">{GROUPS.map((group) => (
            <section className="sim-section" key={group}><h2>Group {group}</h2><p>Top two qualify for playoffs.</p><StandingsTable rows={standings.lower[group]} qualified={2} /></section>
          ))}</div>
        )
      ) : (
        <section className="sim-section">
          <h2>{division === "upper" ? "Upper" : "Lower"} Division Playoffs</h2>
          <p>{simulated ? "Bracket generated from simulated Round Robin standings." : "Run a simulation to populate the bracket."}</p>
          <div className="sim-bracket">
            <div className="sim-round"><h3>Quarterfinals</h3>{QUARTERS[division].map((id) => <MatchCard key={id} match={matchMap[id]} />)}</div>
            <div className="sim-round"><h3>Semifinals</h3>{SEMIS[division].map((id) => <MatchCard key={id} match={matchMap[id]} />)}</div>
            <div className="sim-round"><h3>Grand Final</h3><MatchCard match={matchMap[FINALS[division]]} />
              {champion && <div className="sim-champion"><Trophy size={20} /><span>SIMULATED CHAMPION</span><strong><TeamName id={champion} /></strong></div>}
            </div>
          </div>
          {division === "lower" && <p className="sim-footnote">Lower seeds use Group A top two, then B, C, and D. This is a demonstration seeding order, not an official cross-group ranking.</p>}
        </section>
      )}
      </>}
    </main>
  );
}
