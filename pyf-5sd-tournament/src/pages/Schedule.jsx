
import { useState } from "react";
import { CalendarDays, Search, Trophy } from "lucide-react";
import { matches } from "../data/matches";
import { getTeamById } from "../data/teams";
import MatchCard from "../components/MatchCard";

const dates = [
  { value: "2026-10-23", day: "Friday", label: "OCT 23" },
  { value: "2026-10-24", day: "Saturday", label: "OCT 24" },
  { value: "2026-10-25", day: "Sunday", label: "OCT 25" },
];

const stages = [
  "Round Robin",
  "Quarterfinals",
  "Semifinals",
  "Grand Final",
];

export default function Schedule() {
  const [date, setDate] = useState("2026-10-23");
  const [division, setDivision] = useState("all");
  const [stream, setStream] = useState("all");
  const [search, setSearch] = useState("");

  const dailyMatches = matches.filter(
    (match) => match.date === date
  );

  const filteredMatches = dailyMatches
    .filter((match) => {
      const divisionMatch =
        division === "all" || match.division === division;

      const streamMatch =
        stream === "all" || match.stream === stream;

      const team1 = getTeamById(match.team1Id);
      const team2 = getTeamById(match.team2Id);
      const query = search.trim().toLowerCase();

      const searchMatch =
        !query ||
        [team1?.name, team2?.name, match.label]
          .some((name) => name?.toLowerCase().includes(query));

      return divisionMatch && streamMatch && searchMatch;
    })
    .sort((a, b) => a.time.localeCompare(b.time));

  return (
    <main className="container schedule-page">
      <div className="page-heading">
        <p className="section-label">
          PYF × 5SD · OCTOBER 23–25, 2026
        </p>

        <h1>
          MATCH <span className="gradient-text">SCHEDULE</span>
        </h1>

        <p>
          Official matchups, tournament streams,
          and results. All times Eastern (ET).
        </p>
      </div>

      <div className="schedule-dates">
        {dates.map((day) => (
          <button
            key={day.value}
            className={date === day.value ? "active" : ""}
            onClick={() => setDate(day.value)}
          >
            <span>{day.day}</span>
            <strong>{day.label}</strong>
          </button>
        ))}
      </div>

      <div className="schedule-summary">
        <div>
          <CalendarDays size={19} />
          <strong>{dailyMatches.length} Matches</strong>
        </div>

        <div>
          <Trophy size={19} />
          <strong>
            {date === "2026-10-23"
              ? "Round Robin"
              : date === "2026-10-24"
              ? "Round Robin + Quarterfinals"
              : "Championship Day"}
          </strong>
        </div>
      </div>

      <div className="schedule-filters">
        <div className="division-filters">
          {[
            ["all", "All Divisions"],
            ["upper", "Upper"],
            ["lower", "Lower"],
          ].map(([value, label]) => (
            <button
              key={value}
              className={division === value ? "selected" : ""}
              onClick={() => setDivision(value)}
            >
              {label}
            </button>
          ))}
        </div>

        <select
          className="schedule-select"
          value={stream}
          onChange={(e) => setStream(e.target.value)}
          aria-label="Filter by stream"
        >
          <option value="all">All Streams</option>
          <option value="pyf">PYF (Main)</option>
          <option value="5sd">5SD (Main)</option>
          <option value="pyf2">PYF 2</option>
        </select>

        <div className="team-search">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search team..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {filteredMatches.length === 0 ? (
        <div className="teams-empty">
          No matches found for these filters.
        </div>
      ) : (
        stages.map((stage) => {
          const stageMatches = filteredMatches.filter(
            (match) => match.stage === stage
          );

          if (stageMatches.length === 0) return null;

          return (
            <section className="schedule-stage" key={stage}>
              <div className="schedule-stage-heading">
                <h2>{stage}</h2>
                <span>{stageMatches.length} MATCHES</span>
              </div>

              <div className="matches-grid">
                {stageMatches.map((match) => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </div>
            </section>
          );
        })
      )}

      <p className="timezone-note">
        All match times are Eastern Time (ET).
        Times and match assignments may be subject to change.
      </p>
    </main>
  );
}
