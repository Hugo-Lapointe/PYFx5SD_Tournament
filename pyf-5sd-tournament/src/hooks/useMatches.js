
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

      // Only merge result fields. The local schedule remains authoritative.
      return {
        ...match,
        status: saved.status ?? match.status,
        score1: saved.score1 ?? match.score1,
        score2: saved.score2 ?? match.score2,
        rounds1: saved.rounds1 ?? match.rounds1 ?? null,
        rounds2: saved.rounds2 ?? match.rounds2 ?? null,
        overtime: saved.overtime ?? false,
        maps: saved.maps ?? [],
      };
    });
  }, [firebaseResults]);

  return { matches, loading, error };
}
