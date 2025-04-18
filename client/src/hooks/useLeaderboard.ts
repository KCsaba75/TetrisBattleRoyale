import { useState, useEffect } from "react";
import { getFirestore, collection, query, orderBy, limit, getDocs, DocumentData } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { db as firebaseDb } from "@/lib/firebase";

export function useLeaderboard() {
  const [leaderboard, setLeaderboard] = useState<Array<{
    id: string;
    rank: number;
    username: string;
    score: number;
    level: number;
    lines: number;
    date: string;
  }>>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const db = firebaseDb; // Használjuk a már inicializált adatbázist

  useEffect(() => {
    async function fetchLeaderboard() {
      setLoading(true);
      try {
        // Ellenőrizzük, hogy a gyűjtemény létezik-e
        try {
          const scoresRef = collection(db, "scores");
          const q = query(scoresRef, orderBy("score", "desc"), limit(50));
          const querySnapshot = await getDocs(q);
          
          const leaderboardData = querySnapshot.docs.map((doc, index) => {
            const data = doc.data();
            return {
              id: doc.id,
              rank: index + 1,
              username: data.username || "Anonymous",
              score: data.score || 0,
              level: data.level || 1,
              lines: data.lines || 0,
              date: data.createdAt ? new Date(data.createdAt.toDate()).toLocaleDateString() : "N/A"
            };
          });
          
          setLeaderboard(leaderboardData);
        } catch (firestoreError) {
          console.log("Scores collection might not exist yet:", firestoreError);
          // Inicializáljuk üres listával, mivel még nincs adat
          setLeaderboard([]);
        }
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
        toast({
          title: "Failed to load leaderboard",
          description: "Could not connect to database. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchLeaderboard();
  }, [db, toast]);

  return {
    leaderboard,
    loading
  };
}
