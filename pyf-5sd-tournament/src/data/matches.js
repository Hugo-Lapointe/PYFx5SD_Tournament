
const match = (
  id, date, time, stream, division,
  team1Id, team2Id, stage = "Round Robin",
  format = "BO1", label = null
) => ({
  id,
  date,
  time,
  stream,
  division,
  team1Id,
  team2Id,
  stage,
  format,
  label,
  status: "scheduled",
  score1: null,
  score2: null,
  rounds1: null,
  rounds2: null,
});

export const matches = [
  // =================================
  // FRIDAY — OCTOBER 23
  // =================================

  match("f01", "2026-10-23", "17:15", "pyf", "upper", "u13", "u11"),
  match("f02", "2026-10-23", "17:15", "5sd", "upper", "u3", "u10"),
  match("f03", "2026-10-23", "17:15", "pyf2", "upper", "u1", "u12"),

  match("f04", "2026-10-23", "18:00", "pyf", "lower", "l8", "l15"),
  match("f05", "2026-10-23", "18:00", "5sd", "upper", "u9", "u14"),
  match("f06", "2026-10-23", "18:00", "pyf2", "upper", "u4", "u8"),

  match("f07", "2026-10-23", "18:45", "pyf", "lower", "l2", "l16"),
  match("f08", "2026-10-23", "18:45", "5sd", "upper", "u11", "u1"),
  match("f09", "2026-10-23", "18:45", "pyf2", "upper", "u10", "u13"),

  match("f10", "2026-10-23", "19:30", "pyf", "lower", "l9", "l12"),
  match("f11", "2026-10-23", "19:30", "5sd", "lower", "l8", "l6"),
  match("f12", "2026-10-23", "19:30", "pyf2", "lower", "l3", "l14"),

  match("f13", "2026-10-23", "20:15", "pyf", "lower", "l5", "l7"),
  match("f14", "2026-10-23", "20:15", "5sd", "lower", "l4", "l15"),
  match("f15", "2026-10-23", "20:15", "pyf2", "upper", "u14", "u3"),

  match("f16", "2026-10-23", "21:00", "pyf", "upper", "u8", "u6"),
  match("f17", "2026-10-23", "21:00", "5sd", "upper", "u5", "u4"),
  match("f18", "2026-10-23", "21:00", "pyf2", "lower", "l16", "l10"),

  match("f19", "2026-10-23", "21:45", "pyf", "lower", "l1", "l14"),
  match("f20", "2026-10-23", "21:45", "5sd", "lower", "l5", "l12"),
  match("f21", "2026-10-23", "21:45", "pyf2", "lower", "l2", "l11"),

  match("f22", "2026-10-23", "22:30", "pyf", "lower", "l6", "l4"),
  match("f23", "2026-10-23", "22:30", "5sd", "lower", "l7", "l9"),
  match("f24", "2026-10-23", "22:30", "pyf2", "upper", "u2", "u5"),

  match("f25", "2026-10-23", "23:15", "pyf", "lower", "l10", "l11"),
  match("f26", "2026-10-23", "23:15", "5sd", "upper", "u6", "u7"),
  match("f27", "2026-10-23", "23:15", "pyf2", "lower", "l1", "l13"),

  // =================================
  // SATURDAY — OCTOBER 24
  // =================================

  match("s01", "2026-10-24", "17:15", "pyf", "lower", "l13", "l3"),
  match("s02", "2026-10-24", "17:15", "5sd", "lower", "l11", "l16"),
  match("s03", "2026-10-24", "17:15", "pyf2", "upper", "u7", "u9"),

  match("s04", "2026-10-24", "18:00", "pyf", "upper", "u3", "u5"),
  match("s05", "2026-10-24", "18:00", "5sd", "upper", "u12", "u2"),
  match("s06", "2026-10-24", "18:00", "pyf2", "lower", "l5", "l9"),

  match("s07", "2026-10-24", "18:45", "pyf", "upper", "u10", "u4"),
  match("s08", "2026-10-24", "18:45", "5sd", "lower", "l2", "l10"),
  match("s09", "2026-10-24", "18:45", "pyf2", "lower", "l12", "l7"),

  match("s10", "2026-10-24", "19:30", "pyf", "upper", "u12", "u9"),
  match("s11", "2026-10-24", "19:30", "5sd", "lower", "l14", "l13"),
  match("s12", "2026-10-24", "19:30", "pyf2", "lower", "l8", "l4"),

  match("s13", "2026-10-24", "20:15", "pyf", "upper", "u1", "u7"),
  match("s14", "2026-10-24", "20:15", "5sd", "lower", "l1", "l3"),
  match("s15", "2026-10-24", "20:15", "pyf2", "lower", "l15", "l6"),

  match("s16", "2026-10-24", "21:00", "pyf", "upper", "u2", "u14"),
  match("s17", "2026-10-24", "21:00", "5sd", "upper", "u13", "u8"),
  match("s18", "2026-10-24", "21:00", "pyf2", "upper", "u11", "u6"),

  // QUARTERFINALS
  // Seed numbers are stored in the labels.
  // Team IDs remain null until seeding is confirmed.

  match("qf-l1", "2026-10-24", "21:45", "pyf", "lower",
    null, null, "Quarterfinals", "BO1", "Lower QF · 1 vs 8"),

  match("qf-u1", "2026-10-24", "21:45", "5sd", "upper",
    null, null, "Quarterfinals", "BO1", "Upper QF · 1 vs 8"),

  match("qf-l2", "2026-10-24", "22:30", "pyf", "lower",
    null, null, "Quarterfinals", "BO1", "Lower QF · 3 vs 6"),

  match("qf-l3", "2026-10-24", "22:30", "5sd", "lower",
    null, null, "Quarterfinals", "BO1", "Lower QF · 2 vs 7"),

  match("qf-u2", "2026-10-24", "22:30", "pyf2", "upper",
    null, null, "Quarterfinals", "BO1", "Upper QF · 2 vs 7"),

  match("qf-u3", "2026-10-24", "23:15", "pyf", "upper",
    null, null, "Quarterfinals", "BO1", "Upper QF · 3 vs 6"),

  match("qf-u4", "2026-10-24", "23:15", "5sd", "upper",
    null, null, "Quarterfinals", "BO1", "Upper QF · 4 vs 5"),

  match("qf-l4", "2026-10-24", "23:15", "pyf2", "lower",
    null, null, "Quarterfinals", "BO1", "Lower QF · 4 vs 5"),

  // =================================
  // SUNDAY — OCTOBER 25
  // =================================

  match("sf-l1", "2026-10-25", "17:15", "pyf", "lower",
    null, null, "Semifinals", "BO1", "Lower Semifinal 1"),

  match("sf-l2", "2026-10-25", "17:15", "5sd", "lower",
    null, null, "Semifinals", "BO1", "Lower Semifinal 2"),

  match("sf-u1", "2026-10-25", "18:00", "pyf", "upper",
    null, null, "Semifinals", "BO1", "Upper Semifinal 1"),

  match("sf-u2", "2026-10-25", "18:00", "5sd", "upper",
    null, null, "Semifinals", "BO1", "Upper Semifinal 2"),

  match("gf-l", "2026-10-25", "18:45", "pyf", "lower",
    null, null, "Grand Final", "BO3", "Lower Grand Final"),

  match("gf-u", "2026-10-25", "21:00", "5sd", "upper",
    null, null, "Grand Final", "BO3", "Upper Grand Final"),
];

export const getMatchesByDate = (date) =>
  matches.filter((match) => match.date === date);

export const getMatchesByTeam = (teamId) =>
  matches.filter(
    (match) =>
      match.team1Id === teamId || match.team2Id === teamId
  );
