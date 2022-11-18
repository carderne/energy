import { useState, useEffect } from "react";
import Head from "next/head";

import { Acc, Cons, Daily } from "../types/types";
import LineChart from "../components/chart";
import Table from "../components/table";
import Input from "../components/input";

const fetchOptions = (apikey: string) => ({
  method: "GET",
  headers: {
    Authorization: `Basic ${btoa(apikey)}:`,
  },
});

const load = async (accs: Acc[], startDate: Date, endDate: Date): Promise<[Cons, Daily][]> => {
  const urlBase = "https://api.octopus.energy/v1";

  const results = await Promise.all(
    accs.map(async (acc: Acc): Promise<[Cons, Daily]> => {
      const { mpan, serial, apikey } = acc;
      const urlCons = new URL(
        `${urlBase}/electricity-meter-points/${mpan}/meters/${serial}/consumption`
      );
      urlCons.searchParams.append("page_size", "2500");
      urlCons.searchParams.append("period_from", startDate.toISOString());
      urlCons.searchParams.append("period_to", endDate.toISOString());
      urlCons.searchParams.append("order_by", "period");
      try {
        const cons = await (await fetch(urlCons, fetchOptions(apikey))).json();
        urlCons.searchParams.append("group_by", "day");
        const daily = await (await fetch(urlCons, fetchOptions(apikey))).json();
        return [
          { label: acc.label, data: cons.results },
          { label: acc.label, data: daily.results },
        ];
      } catch (error) {
        return [
          { label: "err", data: [] },
          { label: "err", data: [] },
        ];
      }
    })
  );
  const resultsFilt: [Cons, Daily][] = results.filter(
    (r) => r[0].label !== "err" && r[0].data !== undefined
  );

  return resultsFilt;
};

const setCookies = (accs: Acc[]): void => {
  document.cookie = `numAccs=${accs.length};max-age=31536000;samesite=lax`;
  accs.forEach((acc, i) => {
    document.cookie = `label_${i}=${acc.label};max-age=31536000;samesite=lax`;
    document.cookie = `mpan_${i}=${acc.mpan};max-age=31536000;samesite=lax`;
    document.cookie = `serial_${i}=${acc.serial};max-age=31536000;samesite=lax`;
    document.cookie = `apikey_${i}=${acc.apikey};max-age=31536000;samesite=lax`;
  });
};

const getCookie = (name: string): string => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return (parts.pop() || "").split(";").shift() || "";
  return "";
};

const getAccsFromCookies = (): Acc[] => {
  const numAccs = parseInt(getCookie("numAccs")) || 0;
  return Array.from(Array(numAccs).keys()).map((i) => {
    const label = getCookie(`label_${i}`);
    const mpan = getCookie(`mpan_${i}`);
    const serial = getCookie(`serial_${i}`);
    const apikey = getCookie(`apikey_${i}`);
    return { label, mpan, serial, apikey };
  });
};

export default function Home() {
  const [accs, setAccs] = useState<Acc[]>([]);
  const [adding, setAdding] = useState(false);

  const [consData, setConsData] = useState<Cons[]>([]);
  const [dailyData, setDailyData] = useState<Daily[]>([]);

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  weekAgo.setUTCHours(0, 0, 0, 0);
  const today = new Date();
  const [startDate, setStartDate] = useState(weekAgo);
  const [endDate, setEndDate] = useState(today);

  useEffect(() => {
    const accs = getAccsFromCookies();
    (async () => {
      const loadResults = await load(accs, startDate, endDate);
      setConsData(loadResults.map((lr) => lr[0]));
      setDailyData(loadResults.map((lr) => lr[1]));
    })().catch(console.error);
    setAccs(accs);
  }, []);

  const handleClick = async () => {
    const loadResults = await load(accs, startDate, endDate);
    setConsData(loadResults.map((lr) => lr[0]));
    setDailyData(loadResults.map((lr) => lr[1]));
    const goodAccLabels = loadResults.map((lr) => lr[0].label);
    setCookies(accs.filter((acc) => goodAccLabels.includes(acc.label)));
  };

  const addAcc = (acc: Acc) => {
    setAccs((prev) => [...prev, acc]);
    setAdding(false);
  };

  const deleteAcc = (acc: Acc) => {
    setAccs((prev) => prev.filter((a) => a.mpan !== acc.mpan));
  };

  return (
    <div>
      <Head>
        <title>Smart Meter</title>
        <meta name="description" content="Smart meter" />
      </Head>
      <div className="py-2">
        {accs.map((acc) => (
          <div key={acc.mpan} className="flex flex-row p-2">
            <div>{acc.label}:</div>
            <div className="px-4">{acc.mpan}</div>
            <button
              className="w-10 bg-red-500 hover:bg-red-700 text-white rounded"
              type="button"
              onClick={() => deleteAcc(acc)}
            >
              X
            </button>
          </div>
        ))}
      </div>
      <div className="flex flex-row">
        <div className="m-4 ml-4">
          <button
            className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            type="button"
            onClick={() => setAdding(!adding)}
          >
            Add account
          </button>
        </div>
      </div>
      <div>{adding && <Input addAcc={addAcc} />}</div>
      <div>
        From:
        <input
          type="date"
          name="start"
          className="mx-4 bg-blue-200"
          value={startDate.toISOString().slice(0, 10)}
          onChange={(e) => setStartDate(new Date(e.target.value))}
        />
        To:
        <input
          type="date"
          name="start"
          className="mx-4 bg-blue-200"
          value={endDate.toISOString().slice(0, 10)}
          onChange={(e) => setEndDate(new Date(e.target.value))}
        />
      </div>
      <div className="m-4 ml-4">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          type="button"
          onClick={handleClick}
        >
          Load
        </button>
      </div>
      <div>
        <LineChart consData={consData} />
        <Table dailyData={dailyData} />
      </div>
    </div>
  );
}
