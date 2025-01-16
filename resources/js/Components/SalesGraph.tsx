import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Button } from './ui/button';

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
);

export interface SalesData {
  labels: string[];
  data: number[];
}

export default function SalesGraph({
  salesData,
  title,
  exportLink,
  labels,
  xScaleText,
}: {
  salesData: SalesData;
  title: string;
  exportLink: string;
  labels: string[];
  xScaleText: string;
}) {
  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Sales',
        data: salesData.data,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        fill: true,
        tension: 0.4,
        pointRadius: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: xScaleText,
        },
      },
      y: {
        title: {
          display: true,
          text: 'Sales (₱)',
        },
        ticks: {
          beginAtZero: true,
          callback: (value: number) => `₱ ${value.toLocaleString()}`,
        },
      },
    },
  };

  return (
    <div className="rounded-md bg-white p-4 shadow">
      <div className="flex items-start justify-between">
        <h3 className="text-xl font-semibold text-gray-800">
          Sales for {title}
        </h3>

        <Button size="sm" asChild>
          <a href={`${exportLink}?format=csv`} target="_blank" rel="noreferrer">
            Export to CSV
          </a>
        </Button>
        <Button size="sm" asChild>
          <a href={`${exportLink}?format=pdf`} target="_blank" rel="noreferrer">
            Export to PDF
          </a>
        </Button>
      </div>
      <p className="font-medium text-gray-700">
        ₱{' '}
        {salesData.data
          .reduce((total, sale) => (total += sale), 0)
          .toLocaleString()}
      </p>
      <div className="h-[30vh] overflow-hidden">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <Line data={data} options={options as any} />
      </div>
    </div>
  );
}
