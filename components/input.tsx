import { Dispatch, SetStateAction } from "react";

interface Acc {
  id: number;
  apikey: string;
  mpan: string;
  serial: string;
}

interface Props {
  acc: Acc;
  setAccs: Dispatch<SetStateAction<Acc[]>>;
}

export default function Input({ acc, setAccs }: Props) {
  const setApikey = (value: string, key: string) => {
    setAccs((prev) =>
      prev.map((item) =>
        item.id === acc.id ? { ...item, [key]: value } : item
      )
    );
  };

  return (
    <div className="flex flex-row">
      <div className="m-4 w-60">
        <input
          className="w-full shadow border rounded py-2 px-3 text-gray-700"
          type="text"
          placeholder="apikey"
          value={acc.apikey}
          onChange={(e) => setApikey(e.target.value, "apikey")}
        />
      </div>
      <div className="m-4 w-60">
        <input
          className="w-full shadow border rounded py-2 px-3 text-gray-700"
          type="text"
          placeholder="mpan"
          value={acc.mpan}
          onChange={(e) => setApikey(e.target.value, "mpan")}
        />
      </div>
      <div className="m-4 w-60">
        <input
          className="w-full shadow border rounded py-2 px-3 text-gray-700"
          type="text"
          placeholder="serial"
          value={acc.serial}
          onChange={(e) => setApikey(e.target.value, "serial")}
        />
      </div>
    </div>
  );
}
