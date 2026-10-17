
import { teams } from "./teams";
import { matches } from "./matches";

export function getStandings(division, group = null) {
  const selectedTeams = teams.filter(
    (team) =>
      team.division === division &&
      (group === null || team.group === group)
  );

  const standings = selectedTeams.map((team) => {
    const teamMatches = matches.filter(
      (match) =>
        match.stage === "Round Robin" &&
        match.status === "completed" &&
        match.division === division &&
        (match.team1Id === team.id ||
          match.team2Id === team.id) &&
        typeof match.score1 === "number" &&
        typeof match.score2 === "number" &&
        match.score1 !== match.score2
    );

    let wins = 0;
    let losses = 0;
    let roundsWon = 0;
    let roundsLost = 0;

    teamMatches.forEach((match) => {
      const isTeam1 = match.team1Id === team.id;

      const teamScore = isTeam1
        ? match.score1
        : match.score2;

      const opponentScore = isTeam1
        ? match.score2
        : match.score1;

      if (teamScore > opponentScore) {
        wins++;
      } else {
        losses++;
      }

      // Round scores are stored separately
      // from map wins.
      if (
        typeof match.rounds1 === "number" &&
        typeof match.rounds2 === "number"
      ) {
        roundsWon += isTeam1
          ? match.rounds1
          : match.rounds2;

        roundsLost += isTeam1
          ? match.rounds2
          : match.rounds1;
      }
    });

    return {
      ...team,
      played: wins + losses,
      wins,
      losses,
      roundsWon,
      roundsLost,
      roundDifferential: roundsWon - roundsLost,
    };
  });

  return standings.sort(
    (a, b) =>
      b.wins - a.wins ||
      b.roundDifferential - a.roundDifferential ||
      a.name.localeCompare(b.name)
  );
}
