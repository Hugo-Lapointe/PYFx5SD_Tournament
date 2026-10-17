
export const tournament = {
  name: "PYF × 5SD",
  game: "VALORANT",
  dates: "October 23–25, 2026",
  timezone: "Eastern Time (ET)",
  totalTeams: 30,
  prizePerPlayer: 25,

  divisions: [
    {
      id: "upper",
      name: "Upper Division",
      teams: 14,
      playoffTeams: 8,
      color: "#ff788d",
      description: "14 teams competing in one league table.",
    },
    {
      id: "lower",
      name: "Lower Division",
      teams: 16,
      playoffTeams: 8,
      color: "#78b8ff",
      description: "16 teams split into four groups of four.",
    },
  ],

  schedule: [
    {
      day: "Friday",
      date: "October 23",
      stage: "Round Robin Begins",
    },
    {
      day: "Saturday",
      date: "October 24",
      stage: "Remaining Round Robin + Quarterfinals",
    },
    {
      day: "Sunday",
      date: "October 25",
      stage: "Semifinals + Grand Finals",
    },
  ],

  streams: [
    {
      name: "PYFEsports",
      url: "https://twitch.tv/pyfesports",
      stage: "Main Stage",
    },
    {
      name: "5SDtourneys",
      url: "https://twitch.tv/5sdtourneys",
      stage: "Main Stage",
    },
    {
      name: "pyfesports2",
      url: "https://twitch.tv/pyfesports2",
      stage: "Extra Stage",
    },
  ],
};
