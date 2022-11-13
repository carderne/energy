import { useState } from "react";
import { Dispatch, SetStateAction } from "react";

import { Acc } from "../types/types";

interface Props {
  addAcc: (acc: Acc) => void;
}

export default function Input({ addAcc }: Props) {
  const [label, setLabel] = useState("");
  const [mpan, setMpan] = useState("");
  const [serial, setSerial] = useState("");
  const [apikey, setApikey] = useState("");

  const handleSubmit = (e: any) => {
    e.preventDefault();
    addAcc({ label, mpan, serial, apikey });
    setLabel("");
    setMpan("");
    setSerial("");
    setApikey("");
  };

  return (
    <div className="flex flex-col">
      <form onSubmit={handleSubmit}>
        <div className="m-4 w-60">
          <input
            className="w-full shadow border rounded py-2 px-3 text-gray-700"
            type="text"
            placeholder="label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
        </div>
        <div className="m-4 w-60">
          <input
            className="w-full shadow border rounded py-2 px-3 text-gray-700"
            type="text"
            placeholder="mpan"
            value={mpan}
            onChange={(e) => setMpan(e.target.value)}
          />
        </div>
        <div className="m-4 w-60">
          <input
            className="w-full shadow border rounded py-2 px-3 text-gray-700"
            type="text"
            placeholder="serial"
            value={serial}
            onChange={(e) => setSerial(e.target.value)}
          />
        </div>
        <div className="m-4 w-60">
          <input
            className="w-full shadow border rounded py-2 px-3 text-gray-700"
            type="text"
            placeholder="apikey"
            value={apikey}
            onChange={(e) => setApikey(e.target.value)}
          />
        </div>
        <button
          className="w-20 bg-blue-500 hover:bg-blue-700 text-white rounded"
          type="submit"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
