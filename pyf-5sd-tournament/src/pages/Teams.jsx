
import { useState } from "react";
import { Users, Search, Crown } from "lucide-react";
import useTeams from "../hooks/useTeams";

const groups = ["A", "B", "C", "D"];

function getPlayerName(player) {
  if (typeof player === "string") {
    return player;
  }

  return player?.riotId || player?.name || "Unknown Player";
}

function TeamCard({ team }) {
  const players = Array.isArray(team.players)
    ? team.players.slice(0, 5)
    : [];

  const teamColor = team.color || "#ff788d";

  return (
    <article
      className="team-card"
      style={{ "--team-color": teamColor }}
    >
      {/* TEAM HEADER */}
      <div className="team-card-header">
        <div className="team-avatar">
          <span className="team-avatar-circle" />
        </div>

        <div className="team-heading">
          <h3>{team.name}</h3>

          <span>
            {team.division === "upper"
              ? "Upper Division"
              : `Lower Division · Group ${team.group || "TBD"}`}
          </span>
        </div>

        <Users
          size={20}
          className="team-users-icon"
        />
      </div>

      {/* PLAYER ROSTER */}
      <div className="team-roster">
        <p className="team-roster-label">
          PLAYER ROSTER · {players.length}{" "}
          {players.length === 1 ? "PLAYER" : "PLAYERS"}
        </p>

        {players.length > 0 ? (
          players.map((player, index) => (
            <div
              className="team-player"
              key={`${team.id}-${index}`}
            >
              <span className="player-number">
                {String(index + 1).padStart(2, "0")}
              </span>

              <span className="player-name">
                {getPlayerName(player)}
              </span>

              {typeof player === "object" &&
                player?.captain && (
                  <Crown
                    size={15}
                    className="captain-icon"
                    aria-label="Team Captain"
                  />
                )}
            </div>
          ))
        ) : (
          <p
            style={{
              color: "var(--muted)",
              fontSize: "13px",
            }}
          >
            Roster not announced.
          </p>
        )}
      </div>
    </article>
  );
}

export default function Teams() {
  const { teams, loading, error } = useTeams();

  const [division, setDivision] = useState("all");
  const [group, setGroup] = useState("all");
  const [search, setSearch] = useState("");

  const filteredTeams = teams.filter((team) => {
    // Division filter
    if (
      division !== "all" &&
      team.division !== division
    ) {
      return false;
    }

    // Lower division group filter
    if (
      division === "lower" &&
      group !== "all" &&
      team.group !== group
    ) {
      return false;
    }

    // Search by team name or player name
    const query = search.trim().toLowerCase();

    if (!query) return true;

    return (
      team.name.toLowerCase().includes(query) ||
      (team.players || []).some((player) =>
        getPlayerName(player)
          .toLowerCase()
          .includes(query)
      )
    );
  });

  const upperCount = teams.filter(
    (team) => team.division === "upper"
  ).length;

  const lowerCount = teams.filter(
    (team) => team.division === "lower"
  ).length;

  return (
    <main className="container teams-page">
      {/* PAGE HEADING */}
      <div className="page-heading">
        <p className="section-label">
          PYF × 5SD · VALORANT 2026
        </p>

        <h1>
          TOURNAMENT{" "}
          <span className="gradient-text">
            TEAMS
          </span>
        </h1>

        <p>
          Meet the teams competing across both
          divisions. Explore player rosters and
          group assignments.
        </p>
      </div>

      {/* DIVISION FILTERS */}
      <div className="teams-toolbar">
        <div className="division-filters">
          <button
            type="button"
            className={
              division === "all" ? "selected" : ""
            }
            onClick={() => {
              setDivision("all");
              setGroup("all");
            }}
          >
            All Teams ({teams.length})
          </button>

          <button
            type="button"
            className={
              division === "upper" ? "selected" : ""
            }
            onClick={() => {
              setDivision("upper");
              setGroup("all");
            }}
          >
            Upper Division ({upperCount})
          </button>

          <button
            type="button"
            className={
              division === "lower" ? "selected" : ""
            }
            onClick={() => {
              setDivision("lower");
              setGroup("all");
            }}
          >
            Lower Division ({lowerCount})
          </button>
        </div>

        {/* SEARCH */}
        <div className="team-search">
          <Search size={17} />

          <input
            type="text"
            placeholder="Search teams or players..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />
        </div>
      </div>

      {/* LOWER DIVISION GROUP FILTERS */}
      {division === "lower" && (
        <div
          className="division-filters"
          style={{ marginBottom: "25px" }}
        >
          <button
            type="button"
            className={
              group === "all" ? "selected" : ""
            }
            onClick={() => setGroup("all")}
          >
            All Groups
          </button>

          {groups.map((item) => (
            <button
              type="button"
              key={item}
              className={
                group === item ? "selected" : ""
              }
              onClick={() => setGroup(item)}
            >
              Group {item}
            </button>
          ))}
        </div>
      )}

      {/* RESULTS COUNT */}
      <div className="teams-results">
        <Users size={15} />

        <span>
          Showing {filteredTeams.length} of{" "}
          {teams.length} teams
        </span>
      </div>

      {/* FIREBASE STATUS */}
      {loading && (
        <p className="teams-loading">
          Loading live rosters...
        </p>
      )}

      {error && (
        <p className="teams-error" role="alert">
          Could not load Firebase rosters.
          Showing available team data.
        </p>
      )}

      {/* TEAM CARDS */}
      {filteredTeams.length > 0 ? (
        <div className="teams-grid">
          {filteredTeams.map((team) => (
            <TeamCard
              key={team.id}
              team={team}
            />
          ))}
        </div>
      ) : (
        <div className="teams-empty">
          <Users size={30} />

          <h3>No teams found</h3>

          <p>
            Try changing your filters or search.
          </p>
        </div>
      )}
    </main>
  );
}
