
import { useState } from "react";
import { Trophy, Info } from "lucide-react";
import { getStandings } from "../data/standings";

function StandingsTable({ division, group = null }) {
  const standings = getStandings(division, group);
  const qualifyingSpots = division === "upper" ? 8 : 2;

  return (
    <div className="standings-table-wrap">
      <table className="standings-table">
        <thead>
          <tr>
            <th>#</th>
            <th>TEAM</th>
            <th>MP</th>
            <th>W</th>
            <th>L</th>
            <th>RD</th>
          </tr>
        </thead>

        <tbody>
          {standings.map((team, index) => (
            <tr key={team.id}>
              <td>
                <span
                  className={
                    index < qualifyingSpots
                      ? "standings-rank qualified"
                      : "standings-rank"
                  }
                >
                  {index + 1}
                </span>
              </td>

              <td>
                <div className="standings-team">
                  <span
                    className="standings-team-dot"
                    style={{ background: team.color }}
                  />
                  <strong>{team.name}</strong>
                </div>
              </td>

              <td>{team.played}</td>
              <td className="standings-wins">{team.wins}</td>
              <td>{team.losses}</td>             
              <td
                className={
                    team.roundDifferential > 0
                    ? "rd-positive"
                    : team.roundDifferential < 0
                    ? "rd-negative"
                    : "rd-neutral"
                }
              >
                {team.roundDifferential > 0 ? "+" : ""}
                {team.roundDifferential}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function Standings() {
  const [division, setDivision] = useState("upper");

  const groups = ["A", "B", "C", "D"];

  return (
    <main className="container standings-page">
      <div className="page-heading">
        <p className="section-label">
          PYF × 5SD · VALORANT 2026
        </p>

        <h1>
          TOURNAMENT{" "}
          <span className="gradient-text">STANDINGS</span>
        </h1>

        <p>
          Follow the road to playoffs in both divisions.
        </p>
      </div>

      <div className="standings-tabs">
        <button
          className={division === "upper" ? "active" : ""}
          onClick={() => setDivision("upper")}
        >
          Upper Division
        </button>

        <button
          className={division === "lower" ? "active" : ""}
          onClick={() => setDivision("lower")}
        >
          Lower Division
        </button>
      </div>

      {division === "upper" ? (
        <section className="standings-section">
          <div className="standings-section-header">
            <div>
              <h2>Upper Division</h2>
              <p>14 Teams · One League Table</p>
            </div>

            <span className="standings-qualification">
              <Trophy size={15} />
              TOP 8 ADVANCE
            </span>
          </div>

          <StandingsTable division="upper" />
        </section>
      ) : (
        <div className="standings-groups">
          {groups.map((group) => (
            <section className="standings-section" key={group}>
              <div className="standings-section-header">
                <div>
                  <h2>Group {group}</h2>
                  <p>4 Teams · Round Robin</p>
                </div>

                <span className="standings-qualification">
                  <Trophy size={15} />
                  TOP 2 ADVANCE
                </span>
              </div>

              <StandingsTable
                division="lower"
                group={group}
              />
            </section>
          ))}
        </div>
      )}

      <div className="standings-notice">
        <Info size={18} />
        <p>
          Standings update from completed Round Robin
          results. Highlighted positions indicate
          provisional playoff qualification.
          Tied teams require official tiebreakers.
        </p>
      </div>
    </main>
  );
}
