import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLeaderboard } from '@/hooks/useLeaderboard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { LeaderboardTable } from '@/components/leaderboard/LeaderboardTable';
import { MonthSelector } from '@/components/leaderboard/MonthSelector';
import { Trophy } from 'lucide-react';

export default function LeaderboardPage() {
  const { leaderboard, isLoading, error, loadLeaderboard, clearError } = useLeaderboard();
  const [currentMonth, setCurrentMonth] = useState('');
  const [currentYear, setCurrentYear] = useState(0);
  const [metric, setMetric] = useState<'steps' | 'calories'>('steps');

  // Initialize with current month
  useEffect(() => {
    const now = new Date();
    const month = now.toLocaleString('default', { month: 'long' });
    const year = now.getFullYear();
    
    setCurrentMonth(month);
    setCurrentYear(year);
    loadLeaderboard(month, year);
  }, [loadLeaderboard]);

  const handleMonthChange = (month: string, year: number) => {
    setCurrentMonth(month);
    setCurrentYear(year);
    clearError();
    loadLeaderboard(month, year);
  };

  if (isLoading && !leaderboard) {
    return <LoadingSpinner message="Loading leaderboard..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Trophy className="h-8 w-8 text-yellow-500" />
              <h1 className="text-3xl font-bold text-gray-900">
                Monthly Leaderboard
              </h1>
            </div>
            <p className="text-gray-600">
              See how teams are performing in this month's step and calorie competition.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex justify-center">
              <MonthSelector
                currentMonth={currentMonth}
                currentYear={currentYear}
                onMonthChange={handleMonthChange}
              />
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4 text-red-700">
                {error}
              </div>
            )}

            {leaderboard ? (
              <LeaderboardTable
                leaderboard={leaderboard}
                metric={metric}
                onMetricChange={setMetric}
              />
            ) : (
              <div className="text-center py-12">
                <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No leaderboard data
                </h3>
                <p className="text-gray-600">
                  No teams have competed in {currentMonth} {currentYear} yet.
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
