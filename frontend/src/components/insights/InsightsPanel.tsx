// frontend/src/components/insights/InsightsPanel.tsx
import InsightCard from '@/components/shared/InsightCard';

export const InsightsPanel = () => {
  // Mock data since /api/spending-analysis isn't implemented
  const mockData = {
    categoryTotals: {
      Food: 1200,
      Housing: 3000,
      Transportation: 800,
    },
    insights: [
      { message: 'High Spending on Housing', amount: 3000 },
      { message: 'Moderate Spending on Food', amount: 1200 },
    ],
  };

  const totalSpending = Object.values(mockData.categoryTotals).reduce((sum: number, val: number) => sum + val, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {mockData.insights.map((insight, i) => (
        <InsightCard
          key={i}
          title={insight.message}
          description={`This category represents ${totalSpending > 0 ? ((insight.amount / totalSpending) * 100).toFixed(1) : 0}% of your total spending`}
          category="spending"
          actionText="View Details"
          onAction={() => window.location.href = '/dashboard/expenses'}
        />
      ))}
    </div>
  );
};