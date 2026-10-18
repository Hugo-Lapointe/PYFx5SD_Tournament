
import { getTeamById } from "../data/teams";

export default function MatchCard({ match }) {
  const team1 = getTeamById(match.team1Id);
  const team2 = getTeamById(match.team2Id);

  const completed = match.status === "completed";
  const isBO3 = match.format === "BO3";

  const score1 = isBO3
    ? match.score1
    : match.rounds1 ?? match.score1;

  const score2 = isBO3
    ? match.score2
    : match.rounds2 ?? match.score2;

  const team1Won =
    completed &&
    typeof match.score1 === "number" &&
    typeof match.score2 === "number" &&
    match.score1 > match.score2;

  const team2Won =
    completed &&
    typeof match.score1 === "number" &&
    typeof match.score2 === "number" &&
    match.score2 > match.score1;

  return (
    <article className="match-card">
      <div className="match-card-header">
        <div className="match-card-meta">
          <span className="match-card-time">
            {match.time}
          </span>

          <span className="match-card-divider">•</span>

          <span>
            {match.division === "upper"
              ? "Upper Division"
              : "Lower Division"}
          </span>
        </div>

        <span
          className={
            completed
              ? "match-status completed"
              : "match-status scheduled"
          }
        >
          {completed ? "FINAL" : "UPCOMING"}
        </span>
      </div>

      <div className="match-card-body">
        <div
          className={`match-card-team ${
            team1Won ? "match-card-winner" : ""
          }`}
        >
          <span
            className="match-team-dot"
            style={{
              backgroundColor: team1?.color || "#8e97b0",
            }}
          />

          <span className="match-team-name">
            {team1?.name || "TBD"}
          </span>
        </div>

        <div className="match-card-center">
          {completed ? (
            <div className="match-result-score">
              <strong>
                {score1} - {score2}
              </strong>

              {!isBO3 && match.overtime && (
                <span className="match-overtime-label">
                  OT
                </span>
              )}
            </div>
          ) : (
            <span className="match-card-vs">VS</span>
          )}
        </div>

        <div
          className={`match-card-team match-card-team-right ${
            team2Won ? "match-card-winner" : ""
          }`}
        >
          <span className="match-team-name">
            {team2?.name || "TBD"}
          </span>

          <span
            className="match-team-dot"
            style={{
              backgroundColor: team2?.color || "#8e97b0",
            }}
          />
        </div>
      </div>

      <div className="match-card-footer">
        <div className="match-card-footer-left">
          <span>{match.stage || "Round Robin"}</span>
          <span>·</span>
          <span>{match.format || "BO1"}</span>

          {match.label && (
            <>
              <span>·</span>
              <span>{match.label}</span>
            </>
          )}
        </div>

        <span className="match-card-stream">
          {match.stream?.toUpperCase() || "TBD"}
        </span>
      </div>

      {completed && isBO3 && match.maps?.length > 0 && (
        <div className="match-card-maps">
          {match.maps.map((map, index) => (
            <span key={index}>
              Map {index + 1}: {map.rounds1}–{map.rounds2}
              {map.overtime ? " OT" : ""}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}
