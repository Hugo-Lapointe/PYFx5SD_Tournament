
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  collection,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
  deleteField,
} from "firebase/firestore";
import {
  ArrowLeft,
  Search,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";

import { db } from "../../firebase";
import { matches } from "../../data/matches";
import { getTeamById } from "../../data/teams";
import {
  calculateMatchResult,
  validateValorantScore,
} from "../../utils/valorantScores";

const emptyMap = () => ({ rounds1: "", rounds2: "" });

const VALORANT_MAPS = [
  "Abyss", "Ascent", "Bind", "Breeze", "Corrode", "Fracture",
  "Haven", "Icebox", "Lotus", "Pearl", "Split", "Sunset",
];

const formatDate = (date) =>
  new Date(`${date}T12:00:00`).toLocaleDateString("en-CA", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

export default function ManageMatches() {
  const [savedResults, setSavedResults] = useState({});
  const [selectedId, setSelectedId] = useState(null);
  const [dateFilter, setDateFilter] = useState("all");
  const [divisionFilter, setDivisionFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [mapScores, setMapScores] = useState([emptyMap()]);
  const [selectedMaps, setSelectedMaps] = useState(["", "", ""]);
  const [savingMaps, setSavingMaps] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "matches"),
      (snapshot) => {
        const results = {};

        snapshot.forEach((item) => {
          results[item.id] = item.data();
        });

        setSavedResults(results);
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setError("Unable to load Firebase results.");
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  const allMatches = useMemo(
    () =>
      matches.map((match) => ({
        ...match,
        ...(savedResults[match.id] || {}),
      })),
    [savedResults]
  );

  const filteredMatches = useMemo(() => {
    return allMatches.filter((match) => {
      const team1 = getTeamById(match.team1Id);
      const team2 = getTeamById(match.team2Id);

      const query = search.trim().toLowerCase();

      const matchesSearch =
        !query ||
        match.id.toLowerCase().includes(query) ||
        (team1?.name || "").toLowerCase().includes(query) ||
        (team2?.name || "").toLowerCase().includes(query);

      return (
        (dateFilter === "all" || match.date === dateFilter) &&
        (divisionFilter === "all" ||
          match.division === divisionFilter) &&
        matchesSearch
      );
    });
  }, [allMatches, dateFilter, divisionFilter, search]);

  const selectedMatch = allMatches.find(
    (match) => match.id === selectedId
  );

  const selectedTeam1 = selectedMatch
    ? getTeamById(selectedMatch.team1Id)
    : null;

  const selectedTeam2 = selectedMatch
    ? getTeamById(selectedMatch.team2Id)
    : null;

  const selectedFormat = selectedMatch?.format || "BO1";
  const isBO3 = selectedFormat === "BO3";

  const resultPreview = selectedMatch
    ? calculateMatchResult(mapScores, selectedFormat)
    : null;

  const dates = [...new Set(matches.map((match) => match.date))].sort();

  const completedCount = allMatches.filter(
    (match) => match.status === "completed"
  ).length;

  const selectMatch = (match) => {
    setSelectedId(match.id);
    setMessage("");
    setError("");

    const saved = savedResults[match.id];
    const announced = saved?.selectedMaps || match.selectedMaps || [];
    setSelectedMaps(Array.from({ length: 3 }, (_, index) => announced[index] || ""));

    if (saved?.maps?.length) {
      setMapScores(
        saved.maps.map((map) => ({
          rounds1: String(map.rounds1),
          rounds2: String(map.rounds2),
        }))
      );
    } else if (
      saved?.status === "completed" &&
      Number.isInteger(saved.rounds1) &&
      Number.isInteger(saved.rounds2) &&
      match.format !== "BO3"
    ) {
      setMapScores([
        {
          rounds1: String(saved.rounds1),
          rounds2: String(saved.rounds2),
        },
      ]);
    } else {
      setMapScores([emptyMap()]);
    }
  };

  const updateMap = (index, field, value) => {
    setMapScores((previous) =>
      previous.map((map, i) =>
        i === index ? { ...map, [field]: value } : map
      )
    );

    setMessage("");
    setError("");
  };

  const addMap = () => {
    if (mapScores.length >= 3) return;
    setMapScores((previous) => [...previous, emptyMap()]);
  };

  const removeMap = (index) => {
    setMapScores((previous) =>
      previous.filter((_, i) => i !== index)
    );
  };

  const saveSelectedMaps = async () => {
    if (!selectedMatch) return;

    const count = selectedMatch.format === "BO3" ? 3 : 1;
    const announced = selectedMaps.slice(0, count);
    const nonempty = announced.filter(Boolean);
    if (new Set(nonempty).size !== nonempty.length) {
      setError("The same map cannot be assigned twice in one match.");
      return;
    }

    setSavingMaps(true);
    setError("");
    setMessage("");
    try {
      await setDoc(
        doc(db, "matches", selectedMatch.id),
        {
          selectedMaps: announced,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
      setMessage("Map announcements saved and published to the schedule!");
    } catch (err) {
      console.error(err);
      setError("Could not save map announcements. Check Firebase permissions.");
    } finally {
      setSavingMaps(false);
    }
  };

  const saveResult = async () => {
    if (!selectedMatch || !resultPreview?.valid) return;

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const {
        valid,
        winner,
        ...resultData
      } = resultPreview;

      await setDoc(
        doc(db, "matches", selectedMatch.id),
        {
          ...resultData,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      setMessage("Match result saved successfully!");
    } catch (err) {
      console.error(err);
      setError("Could not save the result. Check Firebase permissions.");
    } finally {
      setSaving(false);
    }
  };

  
  const resetResult = async () => {
    if (!selectedMatch) return;

    const confirmed = window.confirm(
      "Remove this match result and mark it as scheduled again?"
    );

    if (!confirmed) return;

    setSaving(true);
    setError("");
    setMessage("");

    try {
      await updateDoc(doc(db, "matches", selectedMatch.id), {
        status: "scheduled",
        score1: deleteField(),
        score2: deleteField(),
        rounds1: deleteField(),
        rounds2: deleteField(),
        maps: deleteField(),
        overtime: deleteField(),
        updatedAt: serverTimestamp(),
      });

      setMapScores([emptyMap()]);
      setMessage("Result removed. Match is scheduled again.");
    } catch (err) {
      console.error(err);
      setError("Could not reset the result.");
    } finally {
      setSaving(false);
    }
  };


  return (
    <main className="container admin-matches-page">
      <Link to="/admin" className="admin-back-link">
        <ArrowLeft size={16} />
        Back to Dashboard
      </Link>

      <div className="admin-matches-heading">
        <div>
          <p className="admin-eyebrow">TOURNAMENT OPERATIONS</p>
          <h1>
            MATCH <span>MANAGEMENT</span>
          </h1>
          <p>Enter, edit, and publish tournament results.</p>
        </div>

        <div className="admin-matches-counter">
          <strong>{completedCount} / {matches.length}</strong>
          <span>Matches completed</span>
        </div>
      </div>

      {error && !selectedMatch && (
        <div className="admin-form-error">{error}</div>
      )}

      <div className="admin-matches-layout">
        <section className="admin-match-list-panel">
          <div className="admin-panel-heading">
            <h2>Matches</h2>
            <span>{filteredMatches.length} shown</span>
          </div>

          <div className="admin-match-filters">
            <div className="admin-match-search">
              <Search size={17} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search teams or match ID..."
              />
            </div>

            <div className="admin-filter-row">
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              >
                <option value="all">All dates</option>
                {dates.map((date) => (
                  <option key={date} value={date}>
                    {formatDate(date)}
                  </option>
                ))}
              </select>

              <select
                value={divisionFilter}
                onChange={(e) => setDivisionFilter(e.target.value)}
              >
                <option value="all">All divisions</option>
                <option value="upper">Upper</option>
                <option value="lower">Lower</option>
              </select>
            </div>
          </div>

          <div className="admin-match-list">
            {loading ? (
              <p className="admin-empty-message">
                Loading results...
              </p>
            ) : filteredMatches.length === 0 ? (
              <p className="admin-empty-message">
                No matches found.
              </p>
            ) : (
              filteredMatches.map((match) => {
                const team1 = getTeamById(match.team1Id);
                const team2 = getTeamById(match.team2Id);
                const completed = match.status === "completed";

                return (
                  <button
                    type="button"
                    key={match.id}
                    onClick={() => selectMatch(match)}
                    className={`admin-match-list-item ${
                      selectedId === match.id ? "selected" : ""
                    }`}
                  >
                    <div className="admin-match-list-top">
                      <span>
                        {formatDate(match.date)} · {match.time}
                      </span>
                      <span className={
                        completed
                          ? "admin-status-completed"
                          : "admin-status-scheduled"
                      }>
                        {completed ? "COMPLETED" : "SCHEDULED"}
                      </span>
                    </div>

                    <div className="admin-match-list-teams">
                      <strong>{team1?.name || "TBD"}</strong>
                      <span>VS</span>
                      <strong>{team2?.name || "TBD"}</strong>
                    </div>

                    <div className="admin-match-list-bottom">
                      <span>
                        {match.division?.toUpperCase()} · {match.format}
                      </span>

                      {completed && (
                        <strong>
                          {match.rounds1} - {match.rounds2}
                        </strong>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </section>

        <section className="admin-match-editor-panel">
          {!selectedMatch ? (
            <div className="admin-editor-empty">
              <CheckCircle2 size={36} />
              <h2>Select a match</h2>
              <p>
                Choose a match from the list to enter
                or edit its result.
              </p>
            </div>
          ) : (
            <>
              <div className="admin-panel-heading">
                <h2>Edit Result</h2>
                <span>{selectedMatch.id.toUpperCase()}</span>
              </div>

              <div className="admin-selected-match-info">
                <span>
                  {formatDate(selectedMatch.date)} · {selectedMatch.time}
                </span>
                <span>
                  {selectedMatch.division?.toUpperCase()} · {selectedFormat}
                </span>
              </div>

              <div className="admin-selected-teams">
                <div>
                  <span className="admin-team-color" style={{
                    background: selectedTeam1?.color || "#8e97b0",
                  }} />
                  <strong>{selectedTeam1?.name || "TBD"}</strong>
                </div>

                <span>VS</span>

                <div>
                  <span className="admin-team-color" style={{
                    background: selectedTeam2?.color || "#8e97b0",
                  }} />
                  <strong>{selectedTeam2?.name || "TBD"}</strong>
                </div>
              </div>

              {/* Map announcements are separate from result scores. */}
              <div className="admin-map-editor">
                <h3>Announced Maps</h3>
                <p style={{ color: "var(--muted)", marginBottom: 16 }}>
                  Select maps when announced. Unselected slots show TBD on the public schedule.
                </p>
                <div className="admin-announced-maps">
                  {Array.from({ length: isBO3 ? 3 : 1 }, (_, index) => (
                    <label className="admin-announced-map" key={index}>
                      <span>Map {index + 1}</span>
                      <select
                        value={selectedMaps[index] || ""}
                        onChange={(event) => {
                          const value = event.target.value;
                          setSelectedMaps((previous) =>
                            previous.map((item, i) => i === index ? value : item)
                          );
                          setError("");
                          setMessage("");
                        }}
                      >
                        <option value="">TBD — Not announced</option>
                        {VALORANT_MAPS.map((name) => (
                          <option key={name} value={name}>{name}</option>
                        ))}
                      </select>
                    </label>
                  ))}
                </div>
                <button
                  type="button"
                  className="admin-save-result"
                  onClick={saveSelectedMaps}
                  disabled={savingMaps || saving}
                  style={{ marginTop: 16 }}
                >
                  <Save size={17} />
                  {savingMaps ? "Saving maps..." : "Save Map Announcements"}
                </button>
              </div>

              <div className="admin-map-editor">
                <h3>
                  {isBO3 ? "Map Scores" : "Final Round Score"}
                </h3>

                {mapScores.map((map, index) => {
                  const mapValidation = validateValorantScore(
                    map.rounds1,
                    map.rounds2
                  );

                  return (
                    <div className="admin-map-row" key={index}>
                      <div className="admin-map-row-heading">
                        <strong>Map {index + 1}</strong>

                        {isBO3 && index > 0 && (
                          <button
                            type="button"
                            onClick={() => removeMap(index)}
                          >
                            Remove
                          </button>
                        )}
                      </div>

                      <div className="admin-score-inputs">
                        <div>
                          <label>{selectedTeam1?.name || "Team 1"}</label>
                          <input
                            type="number"
                            min="0"
                            step="1"
                            placeholder="0"
                            value={map.rounds1}
                            onChange={(e) =>
                              updateMap(index, "rounds1", e.target.value)
                            }
                          />
                        </div>

                        <span>—</span>

                        <div>
                          <label>{selectedTeam2?.name || "Team 2"}</label>
                          <input
                            type="number"
                            min="0"
                            step="1"
                            placeholder="0"
                            value={map.rounds2}
                            onChange={(e) =>
                              updateMap(index, "rounds2", e.target.value)
                            }
                          />
                        </div>
                      </div>

                      {mapValidation.valid && (
                        <p className="admin-map-valid">
                          {mapValidation.overtime
                            ? "Overtime"
                            : "Regulation"}{" "}
                          · Winner:{" "}
                          {mapValidation.winner === 1
                            ? selectedTeam1?.name
                            : selectedTeam2?.name}
                        </p>
                      )}
                    </div>
                  );
                })}

                {isBO3 && mapScores.length < 3 && (
                  <button
                    type="button"
                    className="admin-add-map"
                    onClick={addMap}
                  >
                    + Add Map
                  </button>
                )}
              </div>

              {resultPreview?.valid ? (
                <div className="admin-result-preview">
                  <p>RESULT PREVIEW</p>

                  <strong>
                    {resultPreview.score1} - {resultPreview.score2}
                  </strong>

                  <span>
                    Winner:{" "}
                    {resultPreview.winner === 1
                      ? selectedTeam1?.name
                      : selectedTeam2?.name}
                  </span>

                  <span>
                    Total rounds: {resultPreview.rounds1} -{" "}
                    {resultPreview.rounds2}
                  </span>

                  <span>
                    Round differential:{" "}
                    {resultPreview.rounds1 - resultPreview.rounds2 > 0
                      ? "+"
                      : ""}
                    {resultPreview.rounds1 - resultPreview.rounds2}
                  </span>

                  {resultPreview.overtime && (
                    <span>Includes overtime</span>
                  )}
                </div>
              ) : (
                <div className="admin-validation-message">
                  <AlertCircle size={17} />
                  {resultPreview?.error || "Enter a valid score."}
                </div>
              )}

              {message && (
                <div className="admin-form-success">
                  <CheckCircle2 size={17} />
                  {message}
                </div>
              )}

              {error && (
                <div className="admin-form-error">
                  <AlertCircle size={17} />
                  {error}
                </div>
              )}

              <div className="admin-editor-actions">
                <button
                  type="button"
                  className="admin-save-result"
                  onClick={saveResult}
                  disabled={!resultPreview?.valid || saving}
                >
                  {saving ? (
                    <Loader2 size={17} />
                  ) : (
                    <Save size={17} />
                  )}
                  {saving ? "Saving..." : "Save Result"}
                </button>

                {savedResults[selectedMatch.id] && (
                  <button
                    type="button"
                    className="admin-reset-result"
                    onClick={resetResult}
                    disabled={saving}
                  >
                    <RotateCcw size={16} />
                    Reset
                  </button>
                )}
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
