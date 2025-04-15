import { useLeaderboard } from "@/hooks/useLeaderboard";
import NavBar from "@/components/NavBar";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function LeaderboardPage() {
  const { leaderboard, loading } = useLeaderboard();

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-black to-gray-900 bg-fixed">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Cyan glow */}
        <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 rounded-full bg-cyan-500/10 blur-[100px]"></div>
        {/* Purple glow */}
        <div className="absolute bottom-1/4 right-1/4 w-1/2 h-1/2 rounded-full bg-fuchsia-500/10 blur-[100px]"></div>
      </div>
      
      <div className="container mx-auto px-4 py-6">
        <NavBar showLeaderboardButton={false} showGameButton={true} />
        
        <Card className="bg-black/50 backdrop-blur-sm border-cyan-500/30">
          <CardContent className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-2 px-4 text-cyan-400 font-['Orbitron']">#</th>
                    <th className="text-left py-2 px-4 text-cyan-400 font-['Orbitron']">Player</th>
                    <th className="text-left py-2 px-4 text-cyan-400 font-['Orbitron']">Score</th>
                    <th className="text-left py-2 px-4 text-cyan-400 font-['Orbitron']">Level</th>
                    <th className="text-left py-2 px-4 text-cyan-400 font-['Orbitron']">Lines</th>
                    <th className="text-left py-2 px-4 text-cyan-400 font-['Orbitron']">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    // Loading skeleton
                    Array(8).fill(0).map((_, index) => (
                      <tr key={index} className="border-b border-gray-800">
                        <td className="py-3 px-4">
                          <Skeleton className="h-5 w-5 bg-gray-800" />
                        </td>
                        <td className="py-3 px-4">
                          <Skeleton className="h-5 w-32 bg-gray-800" />
                        </td>
                        <td className="py-3 px-4">
                          <Skeleton className="h-5 w-16 bg-gray-800" />
                        </td>
                        <td className="py-3 px-4">
                          <Skeleton className="h-5 w-10 bg-gray-800" />
                        </td>
                        <td className="py-3 px-4">
                          <Skeleton className="h-5 w-10 bg-gray-800" />
                        </td>
                        <td className="py-3 px-4">
                          <Skeleton className="h-5 w-24 bg-gray-800" />
                        </td>
                      </tr>
                    ))
                  ) : leaderboard.length > 0 ? (
                    // Actual leaderboard data
                    leaderboard.map((entry, index) => (
                      <tr key={entry.id} className="border-b border-gray-800">
                        <td className="py-3 px-4 text-white font-bold">{entry.rank}</td>
                        <td className="py-3 px-4 text-white">{entry.username}</td>
                        <td className="py-3 px-4 text-cyan-400 font-bold">{entry.score.toLocaleString()}</td>
                        <td className="py-3 px-4 text-white">{entry.level}</td>
                        <td className="py-3 px-4 text-white">{entry.lines}</td>
                        <td className="py-3 px-4 text-gray-400">{entry.date}</td>
                      </tr>
                    ))
                  ) : (
                    // No data state
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-gray-400">
                        No scores available yet. Be the first to play!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
