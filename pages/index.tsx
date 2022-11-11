import { useState, useEffect } from "react";
import Head from "next/head";

import LineChart from "../components/chart";
import Table from "../components/table";

const fetchOptions = (key: string) => ({
  method: "GET",
  headers: {
    Authorization: `Basic ${btoa(key)}:`,
  },
});

const load = async (key: string, mpan: string, serial: string) => {
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
  const cons = await (await fetch(urlCons, fetchOptions(key))).json();

  urlCons.searchParams.append("group_by", "day");
  const daily = await (await fetch(urlCons, fetchOptions(key))).json();

  return [cons, daily];
};

const setCookies = (key: string, mpan: string, serial: string) => {
  document.cookie = `key=${key};max-age=31536000;samesite=lax`;
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
  const [key, setKey] = useState("");
  const [mpan, setMpan] = useState("");
  const [serial, setSerial] = useState("");

  const [consData, setConsData] = useState([]);
  const [dailyData, setDailyData] = useState([]);

  useEffect(() => {
    const key = getCookie("key");
    const mpan = getCookie("mpan");
    const serial = getCookie("serial");
    (async () => {
      const [cons, daily] = await load(key, mpan, serial);
      setConsData(cons.results);
      setDailyData(daily.results);
    })().catch(console.error);
    setKey(key);
    setMpan(mpan);
    setSerial(serial);
  }, []);
  const handleClick = async () => {
    const [cons, daily] = await load(key, mpan, serial);
    setConsData(cons.results);
    setDailyData(daily.results);
    setCookies(key, mpan, serial);
  };
  return (
    <div>
      <Head>
        <title>Smart Meter</title>
        <meta name="description" content="Smart meter" />
      </Head>
      <div>
        <div className="flex flex-row">
          <div className="m-4 w-60">
            <input
              className="w-full shadow border rounded py-2 px-3 text-gray-700"
              id="key"
              type="text"
              placeholder="key"
              value={key}
              onChange={(e) => setKey(e.target.value)}
            />
          </div>
          <div className="m-4 w-60">
            <input
              className="w-full shadow border rounded py-2 px-3 text-gray-700"
              id="mpan"
              type="text"
              placeholder="mpan"
              value={mpan}
              onChange={(e) => setMpan(e.target.value)}
            />
          </div>
          <div className="m-4 w-60">
            <input
              className="w-full shadow border rounded py-2 px-3 text-gray-700"
              id="serial"
              type="text"
              placeholder="serial"
              value={serial}
              onChange={(e) => setSerial(e.target.value)}
            />
          </div>
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
        </div>

        <div className="h-[600px] w-[1200px]">
          <LineChart data={consData} />
        </div>
          <Table data={dailyData} />
      </div>
    </div>
  );
}
