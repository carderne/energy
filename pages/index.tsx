import { useState, useEffect } from "react";
import Head from "next/head";

import LineChart from "../components/chart";
import Table from "../components/table";
import Input from "../components/input";

const fetchOptions = (apikey: string) => ({
  method: "GET",
  headers: {
    Authorization: `Basic ${btoa(apikey)}:`,
  },
});

interface Acc {
  id: number;
  apikey: string;
  mpan: string;
  serial: string;
}

const load = async ({ apikey, mpan, serial }: Acc) => {
  const urlBase = "https://api.octopus.energy/v1";
  const urlCons = new URL(
    `${urlBase}/electricity-meter-points/${mpan}/meters/${serial}/consumption`
  );
  urlCons.searchParams.append("page_size", "2500");
  const today = new Date();
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  weekAgo.setUTCHours(0, 0, 0, 0);
  urlCons.searchParams.append("period_from", weekAgo.toISOString());
  urlCons.searchParams.append("period_to", today.toISOString());
  urlCons.searchParams.append("order_by", "period");
  try {
    const cons = await (await fetch(urlCons, fetchOptions(apikey))).json();

    urlCons.searchParams.append("group_by", "day");
    const daily = await (await fetch(urlCons, fetchOptions(apikey))).json();
    return [cons, daily];
  } catch (error) {
    return [{ results: [] }, { results: [] }];
  }
};

const setCookies = ({ apikey, mpan, serial }: Acc) => {
  document.cookie = `apikey=${apikey};max-age=31536000;samesite=lax`;
  document.cookie = `mpan=${mpan};max-age=31536000;samesite=lax`;
  document.cookie = `serial=${serial};max-age=31536000;samesite=lax`;
};

const getCookie = (name: string): string => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return (parts.pop() || "").split(";").shift() || "";
  return "";
};

export default function Home() {
  const [accs, setAccs] = useState([
    { id: 0, apikey: "", mpan: "", serial: "" },
  ]);

  const [consData, setConsData] = useState([]);
  const [dailyData, setDailyData] = useState([]);

  const addRow = () => {
    setAccs((prev) => [...prev, { id: 1, apikey: "", mpan: "", serial: "" }]);
  };

  useEffect(() => {
    const apikey = getCookie("apikey");
    const mpan = getCookie("mpan");
    const serial = getCookie("serial");
    (async () => {
      const [cons, daily] = await load({ id: 0, apikey, mpan, serial });
      setConsData(cons.results);
      setDailyData(daily.results);
    })().catch(console.error);
    setAccs([{ id: 0, apikey, mpan, serial }]);
  }, []);

  const handleClick = async () => {
    const [cons, daily] = await load(accs[0]);
    setConsData(cons.results);
    setDailyData(daily.results);
    setCookies(accs[0]);
  };

  return (
    <div>
      <Head>
        <title>Smart Meter</title>
        <meta name="description" content="Smart meter" />
      </Head>
      <div className="flex flex-row">
        <div className="m-4 ml-4">
          <button
            id="btn"
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            type="button"
            onClick={handleClick}
          >
            Load
          </button>
        </div>
        <div className="m-4 ml-4">
          <button
            id="btn"
            className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            type="button"
            onClick={addRow}
          >
            +
          </button>
        </div>
      </div>
      <div>
        {accs.map((acc, i: number) => (
          <div key={i}>
            <Input acc={acc} setAccs={setAccs} />
          </div>
        ))}
      </div>
      <div>
        <div className="h-[600px] w-[1200px]">
          <LineChart data={consData} />
        </div>
        <Table data={dailyData} />
      </div>
    </div>
  );
}
