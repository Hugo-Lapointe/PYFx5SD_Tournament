
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import {
  ArrowLeft,
  Save,
  Users,
  UserRoundPlus,
  Trash2,
} from "lucide-react";

import { db } from "../../firebase";
import useTeams from "../../hooks/useTeams";

const playerName = (player) =>
  typeof player === "string"
    ? player
    : player?.riotId || player?.name || "";

export default function ManageTeams() {
  const { teams, loading, error: loadError } = useTeams();

  const [selectedId, setSelectedId] = useState("");
  const [players, setPlayers] = useState([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const selectedTeam = teams.find(
    (team) => team.id === selectedId
  );

  useEffect(() => {
    if (!selectedId && teams.length) {
      setSelectedId(teams[0].id);
    }
  }, [teams, selectedId]);

  // Load the roster only when switching teams.
  // This avoids overwriting unsaved edits when snapshots arrive.
  const chooseTeam = (id) => {
    setSelectedId(id);
    const team = teams.find((item) => item.id === id);
    setPlayers((team?.players || []).map(playerName));
    setMessage("");
    setError("");
  };

  // Populate the initial team once its data is loaded.
  useEffect(() => {
    if (selectedId && players.length === 0 && !loading) {
      const team = teams.find((item) => item.id === selectedId);
      if (team) setPlayers(team.players.map(playerName));
    }
    // Initial population only; subsequent team changes use chooseTeam.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId, loading]);

  const updatePlayer = (index, value) => {
    setPlayers((current) =>
      current.map((name, i) => i === index ? value : name)
    );
    setMessage("");
  };

  const saveRoster = async () => {
    if (!selectedTeam) return;

    const cleaned = players.map((name) => name.trim());

    if (cleaned.some((name) => !name)) {
      setError("Every roster slot must have a player name.");
      return;
    }

    if (new Set(cleaned.map((name) => name.toLowerCase())).size !== cleaned.length) {
      setError("The same player cannot appear twice on a roster.");
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");

    try {
      await setDoc(
        doc(db, "teams", selectedTeam.id),
        {
          players: cleaned,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      setMessage("Roster saved successfully!");
    } catch (err) {
      console.error(err);
      setError("Unable to save roster. Check Firestore permissions.");
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
            TEAM <span>MANAGEMENT</span>
          </h1>
          <p>Edit player rosters and substitutions.</p>
        </div>
      </div>

      <div className="admin-matches-layout">
        <section className="admin-match-list-panel">
          <div className="admin-panel-heading">
            <h2>Teams</h2>
            <span>{teams.length} registered</span>
          </div>

          <div className="admin-team-picker">
            {teams.map((team) => (
              <button
                type="button"
                key={team.id}
                className={`admin-team-picker-item ${
                  selectedId === team.id ? "selected" : ""
                }`}
                onClick={() => chooseTeam(team.id)}
              >
                <span
                  className="admin-team-color"
                  style={{ background: team.color }}
                />
                <span>{team.name}</span>
                <small>
                  {team.division === "upper" ? "UPPER" : "LOWER"}
                </small>
              </button>
            ))}
          </div>
        </section>

        <section className="admin-match-editor-panel">
          <div className="admin-panel-heading">
            <h2>
              <Users size={18} /> Player Roster
            </h2>
            <span>{selectedTeam?.name || "Select a team"}</span>
          </div>

          <div className="admin-roster-editor">
            {loading && <p>Loading rosters...</p>}
            {loadError && <p role="alert">Could not load saved rosters.</p>}

            {players.map((player, index) => (
              <div className="admin-roster-row" key={index}>
                <span className="admin-roster-number">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <input
                  type="text"
                  value={player}
                  placeholder="Player Riot ID"
                  onChange={(e) =>
                    updatePlayer(index, e.target.value)
                  }
                />

                <button
                  type="button"
                  title="Remove player"
                  onClick={() =>
                    setPlayers((current) =>
                      current.filter((_, i) => i !== index)
                    )
                  }
                >
                  <Trash2 size={17} />
                </button>
              </div>
            ))}

            <button
              type="button"
              className="admin-add-map"
              onClick={() =>
                setPlayers((current) => [...current, ""])
              }
            >
              <UserRoundPlus size={16} />
              Add Player / Substitute
            </button>

            {message && (
              <p className="admin-roster-success">{message}</p>
            )}

            {error && (
              <p className="admin-roster-error">{error}</p>
            )}

            <button
              type="button"
              className="admin-save-result"
              onClick={saveRoster}
              disabled={saving || loading || !selectedTeam}
            >
              <Save size={17} />
              {saving ? "Saving..." : "Save Roster"}
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
