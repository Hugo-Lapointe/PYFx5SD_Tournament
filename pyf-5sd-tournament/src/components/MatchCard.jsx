
import { getTeamById } from "../data/teams";
import { Radio } from "lucide-react";

const streams = {
  pyf: {
    name: "PYF (Main)",
    url: "https://twitch.tv/pyfesports",
  },
  "5sd": {
    name: "5SD (Main)",
    url: "https://twitch.tv/5sdtourneys",
  },
  pyf2: {
    name: "PYF 2",
    url: "https://twitch.tv/pyfesports2",
  },
};

function formatTime(time) {
  if (!time) return "TBD";

  const [hours, minutes] = time.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const hour = hours % 12 || 12;

  return `${hour}:${String(minutes).padStart(2, "0")} ${period}`;
}

export default function MatchCard({ match }) {
  const team1 = getTeamById(match.team1Id);
  const team2 = getTeamById(match.team2Id);
  const stream = streams[match.stream];

  const completed = match.status === "completed";

  const renderTeam = (team, score, opponentScore) => {
    const winner =
      completed &&
      typeof score === "number" &&
      typeof opponentScore === "number" &&
      score > opponentScore;

    return (
      <div className={`match-team ${winner ? "winner" : ""}`}>
        <span
          className="match-team-dot"
          style={{
            background: team?.color || "#596177",
            boxShadow: team
              ? `0 0 10px ${team.color}66`
              : "none",
          }}
        />

        <span className="match-team-name">
          {team?.name || "To Be Determined"}
        </span>

        {completed && (
          <strong className="match-score">{score ?? "-"}</strong>
        )}
      </div>
    );
  };

  return (
    <article className="match-card">
      <div className="match-card-header">
        <span
          className={`match-division ${
            match.division === "upper"
              ? "upper-text"
              : "lower-text"
          }`}
        >
          {match.division === "upper"
            ? "Upper Division"
            : "Lower Division"}
        </span>

        <span className="match-stage">
          {match.stage} · {match.format}
        </span>
      </div>

      <div className="match-card-body">
        <div className="match-opponents">
          {match.label && (
            <span className="playoff-label">
              {match.label}
            </span>
          )}

          {renderTeam(team1, match.score1, match.score2)}
          {renderTeam(team2, match.score2, match.score1)}
        </div>

        <div className="match-details">
          <span className={`match-status ${match.status}`}>
            {completed
              ? "FINAL"
              : match.status === "live"
              ? "LIVE"
              : "UPCOMING"}
          </span>

          <strong className="match-time">
            {formatTime(match.time)} ET
          </strong>

          {stream && (
            <a
              className="match-stream"
              href={stream.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Radio size={13} />
              {stream.name}
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
