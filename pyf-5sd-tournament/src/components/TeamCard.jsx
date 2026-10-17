
import { Users, Crown } from "lucide-react";

export default function TeamCard({ team }) {
  return (
    <article
      className="team-card"
      style={{ "--team-color": team.color }}
    >
      <div className="team-card-header">
        <div className="team-avatar">
        {team.logo ? (
            <img src={team.logo} alt={`${team.name} logo`} />
        ) : (
            <div
            className="team-color-dot"
            style={{ backgroundColor: team.color }}
            />
        )}
        </div>

        <div className="team-heading">
          <h3>{team.name}</h3>
          <span>
            {team.division === "upper"
              ? "Upper Division"
              : "Lower Division"}
            {team.group ? ` · Group ${team.group}` : ""}
          </span>
        </div>

        <Users size={18} className="team-users-icon" />
      </div>

      <div className="team-roster">
        <p className="team-roster-label">ACTIVE ROSTER</p>

        {team.players.map((player, index) => (
          <div className="team-player" key={player.id}>
            <span className="player-number">
              {String(index + 1).padStart(2, "0")}
            </span>

            <span className="player-name">{player.name}</span>

            {player.captain && (
              <Crown
                size={15}
                className="captain-icon"
                aria-label="Team captain"
              />
            )}
          </div>
        ))}
      </div>
    </article>
  );
}
