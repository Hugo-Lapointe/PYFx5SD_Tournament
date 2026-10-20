
import { useEffect, useMemo, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";

import { db } from "../firebase";
import { matches as scheduledMatches } from "../data/matches";

export default function useMatches() {
  const [firebaseResults, setFirebaseResults] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "matches"),
      (snapshot) => {
        const results = {};

        snapshot.forEach((document) => {
          results[document.id] = document.data();
        });

        setFirebaseResults(results);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Error loading match results:", err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const matches = useMemo(() => {
    return scheduledMatches.map((match) => {
      const saved = firebaseResults[match.id];

      if (!saved) return match;

      return {
        ...match,

        // PLAYOFF TEAM ASSIGNMENTS
        // Teams assigned in Admin will appear on the public Schedule.
        team1Id: saved.team1Id ?? match.team1Id,
        team2Id: saved.team2Id ?? match.team2Id,

        // MATCH STATUS
        status: saved.status ?? match.status,

        // MATCH SCORES
        score1: saved.score1 ?? match.score1,
        score2: saved.score2 ?? match.score2,

        // ROUND SCORES
        rounds1: saved.rounds1 ?? match.rounds1 ?? null,
        rounds2: saved.rounds2 ?? match.rounds2 ?? null,

        // OVERTIME
        overtime: saved.overtime ?? false,

        // PER-MAP RESULTS
        maps: saved.maps ?? [],

        // ANNOUNCED MAPS
        // Separate from actual match results.
        selectedMaps:
          saved.selectedMaps ?? match.selectedMaps ?? [],
      };
    });
  }, [firebaseResults]);

  return {
    matches,
    loading,
    error,
  };
}
