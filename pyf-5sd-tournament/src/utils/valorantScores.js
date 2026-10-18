
export function validateValorantScore(score1, score2) {
  if (score1 === "" || score2 === "") {
    return { valid: false, error: "Enter both round scores." };
  }

  const a = Number(score1);
  const b = Number(score2);

  if (
    !Number.isInteger(a) ||
    !Number.isInteger(b) ||
    a < 0 ||
    b < 0
  ) {
    return {
      valid: false,
      error: "Scores must be non-negative whole numbers.",
    };
  }

  const winner = Math.max(a, b);
  const loser = Math.min(a, b);

  const regulation = winner === 13 && loser <= 11;
  const overtime =
    winner >= 14 &&
    loser >= 12 &&
    winner - loser === 2;

  if (!regulation && !overtime) {
    return {
      valid: false,
      error: "Invalid score. A team must win 13 rounds in regulation or lead by 2 in overtime.",
    };
  }

  return {
    valid: true,
    rounds1: a,
    rounds2: b,
    winner: a > b ? 1 : 2,
    overtime,
  };
}

export function calculateMatchResult(mapScores, format = "BO1") {
  const requiredWins = format === "BO3" ? 2 : 1;
  const maximumMaps = format === "BO3" ? 3 : 1;

  if (!Array.isArray(mapScores) || mapScores.length === 0) {
    return { valid: false, error: "Enter at least one map." };
  }

  if (mapScores.length > maximumMaps) {
    return { valid: false, error: "Too many maps for this format." };
  }

  let score1 = 0;
  let score2 = 0;
  let rounds1 = 0;
  let rounds2 = 0;
  let overtime = false;

  const validatedMaps = [];

  for (const map of mapScores) {
    const result = validateValorantScore(
      map.rounds1,
      map.rounds2
    );

    if (!result.valid) return result;

    if (score1 === requiredWins || score2 === requiredWins) {
      return {
        valid: false,
        error: "No additional maps can be played after the match is won.",
      };
    }

    if (result.winner === 1) score1++;
    else score2++;

    rounds1 += result.rounds1;
    rounds2 += result.rounds2;
    overtime ||= result.overtime;

    validatedMaps.push({
      rounds1: result.rounds1,
      rounds2: result.rounds2,
      overtime: result.overtime,
    });
  }

  if (score1 !== requiredWins && score2 !== requiredWins) {
    return {
      valid: false,
      error: `The winner must win ${requiredWins} map(s).`,
    };
  }

  return {
    valid: true,
    status: "completed",
    score1,
    score2,
    rounds1,
    rounds2,
    overtime,
    maps: validatedMaps,
    winner: score1 > score2 ? 1 : 2,
  };
}
