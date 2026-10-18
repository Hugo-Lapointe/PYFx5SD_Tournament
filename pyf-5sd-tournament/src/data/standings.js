
import { teams } from "./teams";

export function getStandings(matches, division, group = null) {
  const divisionTeams = teams.filter((team) => {
    if (team.division !== division) return false;

    if (division === "lower" && group) {
      return team.group === group;
    }

    return true;
  });

  const standings = divisionTeams.map((team) => {
    const teamMatches = matches.filter((match) => {
      return (
        match.stage === "Round Robin" &&
        match.division === division &&
        match.status === "completed" &&
        (match.team1Id === team.id ||
          match.team2Id === team.id)
      );
    });

    let wins = 0;
    let losses = 0;
    let roundsWon = 0;
    let roundsLost = 0;

    teamMatches.forEach((match) => {
      const isTeam1 = match.team1Id === team.id;

      const ownMaps = Number(
        isTeam1 ? match.score1 : match.score2
      );

      const opponentMaps = Number(
        isTeam1 ? match.score2 : match.score1
      );

      if (
        !Number.isFinite(ownMaps) ||
        !Number.isFinite(opponentMaps) ||
        ownMaps === opponentMaps
      ) {
        return;
      }

      if (ownMaps > opponentMaps) wins++;
      else losses++;

      const ownRounds = isTeam1
        ? match.rounds1
        : match.rounds2;

      const opponentRounds = isTeam1
        ? match.rounds2
        : match.rounds1;

      if (
        typeof ownRounds === "number" &&
        typeof opponentRounds === "number"
      ) {
        roundsWon += ownRounds;
        roundsLost += opponentRounds;
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

  return standings.sort((a, b) => {
    if (b.wins !== a.wins) return b.wins - a.wins;

    if (b.roundDifferential !== a.roundDifferential) {
      return b.roundDifferential - a.roundDifferential;
    }

    return a.name.localeCompare(b.name);
  });
}
