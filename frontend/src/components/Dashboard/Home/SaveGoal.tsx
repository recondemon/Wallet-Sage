import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Doughnut } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

const SaveGoal = () => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const [chartInstance, setChartInstance] = useState<Chart | null>(null);

  const data = useMemo(() => ({
    labels: ['Saved', 'Remaining'],
    datasets: [
      {
        label: 'Goal',
        data: [50, 50],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
        ],
        borderWidth: 1,
      },
    ],
  }), []);

  const options = useMemo(() => ({
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
  }), []);

  useEffect(() => {
    if (chartInstance) {
      chartInstance.destroy();
    }

    const newChartInstance = new Chart(chartRef.current as HTMLCanvasElement, {
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
    <div className="flex flex-col p-4 w-1/2 bg-card border-2 rounded-lg">
      <canvas 
      ref={chartRef} 
      className='w-40 h-40'
      />
    </div>
  );
};

export default SaveGoal;
