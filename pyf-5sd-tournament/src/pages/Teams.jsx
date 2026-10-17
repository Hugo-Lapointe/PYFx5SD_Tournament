
import { useState } from "react";
import { Search, Users } from "lucide-react";
import TeamCard from "../components/TeamCard";
import { teams } from "../data/teams";

export default function Teams() {
  const [division, setDivision] = useState("all");
  const [search, setSearch] = useState("");

  const filteredTeams = teams.filter((team) => {
    const matchesDivision =
      division === "all" || team.division === division;

    const query = search.trim().toLowerCase();

    const matchesSearch =
      team.name.toLowerCase().includes(query) ||
      team.players.some((player) =>
        player.name.toLowerCase().includes(query)
      );

    return matchesDivision && matchesSearch;
  });

  return (
    <main className="container teams-page">
      <div className="page-heading">
        <p className="section-label">THE COMPETITORS</p>
        <h1>
          MEET THE <span className="gradient-text">TEAMS</span>
        </h1>
        <p>
          Explore the teams and players competing in the
          PYF × 5SD VALORANT Tournament.
        </p>
      </div>

      <div className="teams-toolbar">
        <div className="division-filters">
          <button
            className={division === "all" ? "selected" : ""}
            onClick={() => setDivision("all")}
          >
            All Teams
          </button>

          <button
            className={division === "upper" ? "selected" : ""}
            onClick={() => setDivision("upper")}
          >
            Upper Division
          </button>

          <button
            className={division === "lower" ? "selected" : ""}
            onClick={() => setDivision("lower")}
          >
            Lower Division
          </button>
        </div>

        <div className="team-search">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search teams or players..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="teams-results">
        <Users size={16} />
        Showing {filteredTeams.length} of {teams.length} teams
      </div>

      {filteredTeams.length > 0 ? (
        <div className="teams-grid">
          {filteredTeams.map((team) => (
            <TeamCard key={team.id} team={team} />
          ))}
        </div>
      ) : (
        <div className="teams-empty">
          No teams found. Try a different search.
        </div>
      )}
    </main>
  );
}
