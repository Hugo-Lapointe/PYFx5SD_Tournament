
const upperTeams = [
  {
    id: "u1",
    name: "Team Ruby",
    color: "#f05b92",
    players: ["cold._.2", "cntrlln", "leilapurr", "xmos", "carpiiboi"],
  },
  {
    id: "u2",
    name: "Team Crimson",
    color: "#ef526b",
    players: ["riczerra", "piealex", "proof you exist", "miyagi", "Monkey Girl"],
  },
  {
    id: "u3",
    name: "Team Scarlet",
    color: "#ff7167",
    players: ["giraffejoy", "Hasty", "bbokkari", "Rynx", "Kachow"],
  },
  {
    id: "u4",
    name: "Team Copper",
    color: "#dba678",
    players: ["wish come true", "sorcy", "jahkon", "mouse", "mimic"],
  },
  {
    id: "u5",
    name: "Team Amber",
    color: "#ffc451",
    players: ["henitin", "alan", "Haunter", "preripped", "number dude"],
  },
  {
    id: "u6",
    name: "Team Emerald",
    color: "#56cda1",
    players: ["Mia", "Lalo", "Maddie2Humble", "Omar", "Mis"],
  },
  {
    id: "u7",
    name: "Team Jade",
    color: "#56b68c",
    players: ["LLLooogggyyy", "kumal123", "reconrl", "apollo", "thorns"],
  },
  {
    id: "u8",
    name: "Team Azure",
    color: "#65b5fa",
    players: ["Enjoyer", "Matt", "Weary", "Cadoin", "Space"],
  },
  {
    id: "u9",
    name: "Team Navy",
    color: "#899be7",
    players: ["cjs", "souls", "wii sports", "burken", "kunigami"],
  },
  {
    id: "u10",
    name: "Team Lavender",
    color: "#c5b3e6",
    players: ["Jordan", "Ryxn", "Lollipops", "sheedz", "SB"],
  },
  {
    id: "u11",
    name: "Team Violet",
    color: "#ae81e9",
    players: ["fishrawn", "clow", "Shadow", "Brick", "Khoa"],
  },
  {
    id: "u12",
    name: "Team Orchid",
    color: "#e078e1",
    players: ["Yuta", "Yandorsochi", "Kenzo", "sliace", "Near"],
  },
  {
    id: "u13",
    name: "Team Ivory",
    color: "#eae6d5",
    players: ["terrance", "LostHunter", "ashval", "Anemal", "drewzerra"],
  },
  {
    id: "u14",
    name: "Team Onyx",
    color: "#858b96",
    players: ["AceShrimpin", "Primatis", "Shmeow", "Vexsen", "undisclosed"],
  },
];

const lowerTeams = [
  {
    id: "l1",
    name: "Team Cherry",
    color: "#ff536d",
    group: "A",
    players: ["Shan", "Slixx", "Stryct", "Joe1", "Cayden"],
  },
  {
    id: "l2",
    name: "Team Coral",
    color: "#ff9b9e",
    group: "B",
    players: ["renxvii", "2007accord", "Jessica", "Cinnamon Pretzel", "Tristan"],
  },
  {
    id: "l3",
    name: "Team Tangerine",
    color: "#ff861e",
    group: "A",
    players: ["llumi", "Drew", "babyicantdance", "Annihilate", "Antics"],
  },
  {
    id: "l4",
    name: "Team Gold",
    color: "#ffbd37",
    group: "C",
    players: ["Eeiixee", "TonyStark", "Lykos", "Burhum", "Rando"],
  },
  {
    id: "l5",
    name: "Team Lemon",
    color: "#ffe574",
    group: "D",
    players: ["Nyx", "Droxz", "Shukaku", "Mezclamal", "Zappers"],
  },
  {
    id: "l6",
    name: "Team Lime",
    color: "#c5f238",
    group: "C",
    players: ["Ray", "Phanum", "asianfroggy", "Noraka", "Neo"],
  },
  {
    id: "l7",
    name: "Team Evergreen",
    color: "#4ee477",
    group: "D",
    players: ["Wolf", "Vault", "Thickit", "Darkrai", "Wish"],
  },
  {
    id: "l8",
    name: "Team Mint",
    color: "#48e5b7",
    group: "C",
    players: ["aros", "hazel", "guardian", "SillyFish", "lyaxo"],
  },
  {
    id: "l9",
    name: "Team Teal",
    color: "#55dbc9",
    group: "D",
    players: ["Shark bait", "Pixel", "Fellsting", "Arkitekt", "cashmere"],
  },
  {
    id: "l10",
    name: "Team Cyan",
    color: "#43d7ec",
    group: "B",
    players: ["MeatyGrey", "Carti", "Koolvdor", "BlazingOxLion", "Tangerine"],
  },
  {
    id: "l11",
    name: "Team Cobalt",
    color: "#54b7f2",
    group: "B",
    players: ["Karma", "MrMagicMan", "Big dog", "Ruby", "Rainbow"],
  },
  {
    id: "l12",
    name: "Team Indigo",
    color: "#7485f6",
    group: "D",
    players: ["Zeckenz", "Ghost", "SteezyAk", "Nocturn", "C9 X3RO"],
  },
  {
    id: "l13",
    name: "Team Plum",
    color: "#b06cf4",
    group: "A",
    players: ["Amor Yadi", "Exile", "Rex", "PlutoQuo", "lastlifegamer"],
  },
  {
    id: "l14",
    name: "Team Magenta",
    color: "#e444e5",
    group: "A",
    players: ["Zary", "Lilboichu", "Blake", "Justin", "Luffy"],
  },
  {
    id: "l15",
    name: "Team Rose",
    color: "#f75a9b",
    group: "C",
    players: ["pokefunker", "Quich", "Xullvy", "Flyers", "Cherry"],
  },
  {
    id: "l16",
    name: "Team Maroon",
    color: "#c34d72",
    group: "B",
    players: ["kendikane", "Moji", "Taxman", "WJD Gaster", "undisclosed"],
  },
];

// Combine all 30 teams into one array.
// Upper teams do not have groups.
// Lower teams belong to groups A, B, C, or D.

export const teams = [
  ...upperTeams.map((team) => ({
    ...team,
    division: "upper",
    group: null,
  })),
  ...lowerTeams.map((team) => ({
    ...team,
    division: "lower",
  })),
];

// Helper functions used throughout the website.

export const getTeamById = (id) =>
  teams.find((team) => team.id === id);

export const getTeamsByDivision = (division) =>
  teams.filter((team) => team.division === division);

export const getTeamsByGroup = (group) =>
  teams.filter(
    (team) =>
      team.division === "lower" && team.group === group
  );

export const getTeamByName = (name) =>
  teams.find(
    (team) =>
      team.name.toLowerCase() === name.toLowerCase()
  );
