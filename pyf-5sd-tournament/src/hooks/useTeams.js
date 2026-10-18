
import { useEffect, useMemo, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { teams as originalTeams } from "../data/teams";

export default function useTeams() {
  const [overrides, setOverrides] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    return onSnapshot(
      collection(db, "teams"),
      (snapshot) => {
        const next = {};

        snapshot.forEach((document) => {
          next[document.id] = document.data();
        });

        setOverrides(next);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Error loading teams:", err);
        setError(err);
        setLoading(false);
      }
    );
  }, []);

  const teams = useMemo(
    () =>
      originalTeams.map((team) => ({
        ...team,
        players: Array.isArray(overrides[team.id]?.players)
          ? overrides[team.id].players
          : team.players ?? [],
      })),
    [overrides]
  );

  return { teams, loading, error };
}
