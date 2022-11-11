interface dailyData {
  interval_start: string;
  consumption: string;
}

export default function Table({ data = [] }: { data: dailyData[] }) {
  return (
    <table className="table-auto">
      <thead>
        <tr>
          <th className="px-4 py-2">Date</th>
          <th className="px-4 py-2">Energy</th>
        </tr>
      </thead>
      <tbody>
        {data.map((r, i: number) => (
          <tr key={i}>
            <td className="px-4 py-2">{r.interval_start.slice(0, 10)}</td>
            <td className="px-4 py-2">{r.consumption}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
