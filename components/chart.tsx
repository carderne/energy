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

import { Cons } from "../types/types";

const options: any = {
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

const colors = ["#1b9e77", "#d95f02", "#7570b3", "#e7298a"];

interface Props {
  consData: Cons[];
}

export default function LineChart({ consData }: Props) {
  const chartData: ChartData<"line"> = {
    datasets: consData.map((cd, i) => ({
      data: cd.data.map((d) => ({
        x: d.interval_end,
        y: d.consumption,
      })),
      label: cd.label,
      borderColor: colors[i],
      borderWidth: 2,
      borderCapStyle: "round",
      pointBorderWidth: 1,
    })),
  };
  return (
    <div className="h-[600px] w-[1200px]">
      <Line options={options} data={chartData} />
    </div>
  );
}
