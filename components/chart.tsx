import {
  Chart as ChartJS,
  ChartOptions,
  ChartData,
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import "chartjs-adapter-date-fns";

ChartJS.register(
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const options: any = {
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    x: {
      type: "time",
      time: {
        unit: "hour",
        stepSize: 6,
      },
      ticks: {
        autoSkip: false,
        major: {
          enabled: true,
        },
        font: (ctx: any) =>
          ctx.tick && ctx.tick.major && { weight: "bold", size: 19 },
      },
    },
    y: {
      title: {
        display: true,
        text: "kWh",
      },
      ticks: {
        font: {
          size: 16,
        },
      },
    },
  },
  responsive: true,
  maintainAspectRatio: false,
};

interface lineData {
  interval_end: number;
  consumption: number;
}

export default function LineChart({ data = [] }: { data: lineData[] }) {
  const chartData: ChartData<"line"> = {
    datasets: [
      {
        data: data.map((d) => ({
          x: d.interval_end,
          y: d.consumption,
        })),
        label: "consumption",
        borderColor: "rgba(151, 189, 61, 1)",
        fill: true,
        borderWidth: 2,
        backgroundColor: "rgba(151, 189, 61, 0.15)",
        borderCapStyle: "round",
        pointBorderWidth: 1,
      },
    ],
  };
  return <Line options={options} data={chartData} />;
}
