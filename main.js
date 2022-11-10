/* global Chart moment */

const get = document.getElementById.bind(document);
const urlBase = "https://api.octopus.energy/v1";

const fetchOptions = (key) => ({
  method: "GET",
  headers: {
    Authorization: `Basic ${btoa(key)}:`,
  },
});

const makeChart = (meterData) => {
  const lineData = meterData.results.map((d) => ({
    x: d.interval_end,
    y: d.consumption,
  }));
  const data = {
    datasets: [
      {
        label: "consumption",
        borderColor: "rgba(151, 189, 61, 1)",
        data: lineData,
        fill: true,
        lineTension: 0.1,
        borderWidth: 2,
        backgroundColor: "rgba(151, 189, 61, 0.15)",
        borderCapStyle: "round",
        pointBorderWidth: 1,
      },
    ],
  };
  const options = {
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
          font: (ctx) =>
            ctx.tick && ctx.tick.major && { weight: "bold", size: 19 },
        },
      },
      y: {
        title: {
          display: true,
          text: "kWh",
        },
        suggestedMin: 0,
        gridLines: {
          drawBorder: false,
          lineWidth: 2,
          zeroLineWidth: 2,
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
  const chart = new Chart("chart", { type: "line", data, options });
  return chart;
};

const makeTable = (data) => {
  const table = get("daily");
  data.results.forEach((row) => {
    const tr = table.appendChild(document.createElement("tr"));
    const day = tr.appendChild(document.createElement("td"));
    const val = tr.appendChild(document.createElement("td"));
    day.innerText = row.interval_start.slice(0, 10);
    val.innerText = row.consumption;
  });
};

const load = async () => {
  const key = get("key").value;
  const mpan = get("mpan").value;
  const serial = get("serial").value;

  const urlCons = new URL(
    `${urlBase}/electricity-meter-points/${mpan}/meters/${serial}/consumption`
  );
  urlCons.searchParams.append("page_size", 2500);
  const today = moment();
  const weekAgo = moment().subtract(1, "week").startOf("day");
  urlCons.searchParams.append("period_from", weekAgo.toISOString());
  urlCons.searchParams.append("period_to", today.toISOString());
  urlCons.searchParams.append("order_by", "period");
  const cons = await (await fetch(urlCons, fetchOptions(key))).json();
  if ("results" in cons) {
    makeChart(cons);
    setCookies(key, mpan, serial);
  }

  urlCons.searchParams.append("group_by", "day");
  const consDaily = await (await fetch(urlCons, fetchOptions(key))).json();
  if ("results" in consDaily) {
    makeTable(consDaily);
  }
};

get("btn").onclick = load;

const setCookies = (key, mpan, serial) => {
  document.cookie = `key=${key};max-age=31536000;samesite=lax`;
  document.cookie = `mpan=${mpan};max-age=31536000;samesite=lax`;
  document.cookie = `serial=${serial};max-age=31536000;samesite=lax`;
};

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
};

(async () => {
  const key = getCookie("key");
  const mpan = getCookie("mpan");
  const serial = getCookie("serial");
  if (key) get("key").value = key;
  if (mpan) get("mpan").value = mpan;
  if (serial) get("serial").value = serial;
  load();
})();
