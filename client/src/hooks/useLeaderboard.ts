import { useState, useEffect } from "react";
import { getFirestore, collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";

export function useLeaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const db = getFirestore();

  useEffect(() => {
    async function fetchLeaderboard() {
      setLoading(true);
      try {
        const scoresRef = collection(db, "scores");
        const q = query(scoresRef, orderBy("score", "desc"), limit(50));
        const querySnapshot = await getDocs(q);
        
        const leaderboardData = querySnapshot.docs.map((doc, index) => {
          const data = doc.data();
          return {
            id: doc.id,
            rank: index + 1,
            username: data.username,
            score: data.score,
            level: data.level,
            lines: data.lines,
            date: data.createdAt ? new Date(data.createdAt.toDate()).toLocaleDateString() : "N/A"
          };
        });
        
        setLeaderboard(leaderboardData);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
        toast({
          title: "Failed to load leaderboard",
          description: error.message,
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
