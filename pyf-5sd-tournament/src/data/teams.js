
const createTeam = (id, name, division, color, players) => ({
  id,
  name,
  division,
  color,
  logo: null,
  group: null,
  players: players.map((name, index) => ({
    id: `${id}-p${index + 1}`,
    name,
    captain: false,
  })),
});

export const teams = [
  // ============================
  // UPPER DIVISION — 14 TEAMS
  // ============================

  createTeam("u1", "Team Ruby", "upper", "#f06292", [
    "cold._.2",
    "cntrlln",
    "leilapurr",
    "xmos",
    "carpiiboi",
  ]),

  createTeam("u2", "Team Crimson", "upper", "#f45b69", [
    "riczerra",
    "piealex",
    "proof you exist",
    "miyagi",
    "Monkey Girl",
  ]),

  createTeam("u3", "Team Scarlet", "upper", "#ff6659", [
    "giraffejoy",
    "Hasty",
    "bbokkari",
    "Rynx",
    "Kachow",
  ]),

  createTeam("u4", "Team Copper", "upper", "#d99665", [
    "wish come true",
    "sorcy",
    "jahkon",
    "mouse",
    "mimic",
  ]),

  createTeam("u5", "Team Amber", "upper", "#ffbd4a", [
    "henitin",
    "alan",
    "Haunter",
    "preripped",
    "number dude",
  ]),

  createTeam("u6", "Team Emerald", "upper", "#39c68c", [
    "Mia",
    "Lalo",
    "Maddie2Humble",
    "Omar",
    "Mis",
  ]),

  createTeam("u7", "Team Jade", "upper", "#65b99a", [
    "LLLooogggyyy",
    "kumal123",
    "reconrl",
    "apollo",
    "thorns",
  ]),

  createTeam("u8", "Team Azure", "upper", "#58b1ff", [
    "Enjoyer",
    "Matt",
    "Weary",
    "Cadoin",
    "Space",
  ]),

  createTeam("u9", "Team Navy", "upper", "#697ce8", [
    "cjs",
    "souls",
    "wii sports",
    "burken",
    "kunigami",
  ]),

  createTeam("u10", "Team Lavender", "upper", "#c6b4ed", [
    "Jordan",
    "Ryxn",
    "Lollipops",
    "sheedz",
    "SB",
  ]),

  createTeam("u11", "Team Violet", "upper", "#a06af0", [
    "fishrawn",
    "clow",
    "Shadow",
    "Brick",
    "Khoa",
  ]),

  createTeam("u12", "Team Orchid", "upper", "#d85bd5", [
    "Yuta",
    "Yandorsochi",
    "Kenzo",
    "sliace",
    "Near",
  ]),

  createTeam("u13", "Team Ivory", "upper", "#e7e3c9", [
    "terrance",
    "LostHunter",
    "ashval",
    "Anemal",
    "drewzerra",
  ]),

  createTeam("u14", "Team Onyx", "upper", "#9ca3af", [
    "AceShrimpin",
    "Primatis",
    "Shmeow",
    "Vexsen",
    "undisclosed",
  ]),

  // ============================
  // LOWER DIVISION — 16 TEAMS
  // ============================

  createTeam("l1", "Team Cherry", "lower", "#ff4e6d", [
    "Shan",
    "Slixx",
    "Stryct",
    "Joe1",
    "Cayden",
  ]),

  createTeam("l2", "Team Coral", "lower", "#ff8398", [
    "renxvii",
    "2007accord",
    "Jessica",
    "Cinnamon Pretzel",
    "Tristan",
  ]),

  createTeam("l3", "Team Tangerine", "lower", "#ff851c", [
    "Illumi",
    "Drew",
    "babyicantdance",
    "Annihilate",
    "Antics",
  ]),

  createTeam("l4", "Team Gold", "lower", "#ffba26", [
    "Eeiixee",
    "TonyStark",
    "Lykos",
    "Burhum",
    "Rando",
  ]),

  createTeam("l5", "Team Lemon", "lower", "#ffe665", [
    "Nyx",
    "Droxz",
    "Shukaku",
    "Mezclamal",
    "Zappers",
  ]),

  createTeam("l6", "Team Lime", "lower", "#c9f21c", [
    "Ray",
    "Phanum",
    "asianfroggy",
    "Noraka",
    "Neo",
  ]),

  createTeam("l7", "Team Evergreen", "lower", "#19db58", [
    "Wolf",
    "Vault",
    "Thickit",
    "Darkrai",
    "Wish",
  ]),

  createTeam("l8", "Team Mint", "lower", "#36dfb2", [
    "aros",
    "hazel",
    "guardian",
    "SillyFish",
    "lyaxo",
  ]),

  createTeam("l9", "Team Teal", "lower", "#49dec6", [
    "Shark bait",
    "Pixel",
    "Fellsting",
    "Arkitekt",
    "cashmere",
  ]),

  createTeam("l10", "Team Cyan", "lower", "#13cddd", [
    "MeatyGrey",
    "Carti",
    "Koolvdor",
    "BlazingOxLion",
    "Tangerine",
  ]),

  createTeam("l11", "Team Cobalt", "lower", "#42baf0", [
    "Karma",
    "MrMagicMan",
    "Big dog",
    "Ruby",
    "Rainbow",
  ]),

  createTeam("l12", "Team Indigo", "lower", "#4c68f3", [
    "Zeckenz",
    "Ghost",
    "SteezyAk",
    "Nocturn",
    "C9 X3RO",
  ]),

  createTeam("l13", "Team Plum", "lower", "#a55df1", [
    "Amor Yadi",
    "Exile",
    "Rex",
    "PlutoQuo",
    "lastlifegamer",
  ]),

  createTeam("l14", "Team Magenta", "lower", "#e72be5", [
    "Zary",
    "Lilboichu",
    "Blake",
    "Justin",
    "Luffy",
  ]),

  createTeam("l15", "Team Rose", "lower", "#ff4fa4", [
    "pokefunker",
    "Quich",
    "Xullvy",
    "Flyers",
    "Cherry",
  ]),

  createTeam("l16", "Team Maroon", "lower", "#e83e68", [
    "kendikane",
    "Moji",
    "Taxman",
    "W.D Gaster",
    "undisclosed",
  ]),
];

// ============================
// HELPER FUNCTIONS
// ============================

export const getTeamById = (id) =>
  teams.find((team) => team.id === id);

export const getTeamsByDivision = (division) =>
  teams.filter((team) => team.division === division);
