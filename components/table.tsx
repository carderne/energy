import { Daily } from "../types/types";

interface Props {
  dailyData: Daily[];
}

export default function Table({ dailyData }: Props) {
  const data = dailyData[0]?.data || [];
  const rows = dailyData[0]?.data || [];
  return (
    <div className="flex flex-col">
      <div className="flex flex-row font-bold">
        <div className="px-4 py-4">Date</div>
        {dailyData.map((c, i) => (
          <div key={i} className="px-4 py-2">
            {c.label}
          </div>
        ))}
      </div>
      <div className="flex flex-row">
        <div className="flex flex-col">
          {rows.map((r, i) => (
            <div key={i} className="px-4 py-2">
              {r.interval_start.slice(0, 10)}
            </div>
          ))}
        </div>
        {dailyData.map((c, i) => (
          <div key={i} className="flex flex-col">
            {c.data.map((r, i) => (
              <div key={i} className="px-4 py-2">
                {r.consumption}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
