import React, { useRef, useEffect, useState, useMemo } from 'react';
import Chart from 'chart.js/auto';
import ChartJS from 'chart.js/auto';
import { SavingsGoal } from '../../../../lib/types/AccountTypes';



interface ChartProps {
  goal: SavingsGoal;
}

const ChartComponent: React.FC<ChartProps> = ({ goal }) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const [chartInstance, setChartInstance] = useState<Chart<'doughnut'> | null>(null);

  const {goal: goalAmount, balance } = goal;
  const remaining = goalAmount - balance;


  useEffect(() => {
    console.log('Goal:', goal);
  }
  , [goal]);
  const data = useMemo(
    () => ({
      datasets: [
        {
          label: 'Goal',
          data: [ remaining, balance],
          backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)'],
          borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
          borderWidth: 1,
        },
      ],
      labels: ['Remaining', 'Saved'],
    }),
    [balance, remaining]
  );

  const options = useMemo(
    () => ({
      cutout: '70%',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        tooltip: {
          callbacks: {
            label: (tooltipItem: any) => `${tooltipItem.label}: ${tooltipItem.raw}`,
          },
        },
      },
    }),
    []
  );

  useEffect(() => {
    if (chartInstance) {
      chartInstance.destroy();
    }

    const newChartInstance = new ChartJS(chartRef.current as HTMLCanvasElement, {
      type: 'doughnut',
      data: data,
      options: options,
    });

    setChartInstance(newChartInstance);

    // Cleanup chart instance on component unmount or update
    return () => {
      if (newChartInstance) {
        newChartInstance.destroy();
      }
    };
  }, [data, options]);

  return (
    <div>
      <canvas ref={chartRef} className="w-40 h-40" />
    </div>
  );
};

export default ChartComponent;
