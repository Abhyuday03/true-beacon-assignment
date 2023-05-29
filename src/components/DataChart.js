import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";
import { useState, useEffect } from "react";
import axios from "axios";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

const DataChart = () => {
  const [name, setName] = useState("NIFTY 50");
  const [from, setFrom] = useState("2017-01-02");
  const [to, setTo] = useState("2017-01-31");

  const [labels, setLabels] = useState([]);
  const [values, setValues] = useState([]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Chart.js Line Chart",
      },
    },
  };

  const data = {
    labels,
    datasets: [
      {
        label: "Dataset 1",
        data: values,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  const handleName = (e) => {
    setName(e.target.value);
    getData(e.target.value, from, to);
  };
  const handleFrom = (e) => {
    setFrom(e.target.value);
    getData(name, e.target.value, to);
  };
  const handleTo = (e) => {
    setTo(e.target.value);
    getData(name, from, e.target.value);
  };

  const getData = async (name, from, to) => {
    console.log(
      `api/v1/prices/getPrices?symbol=${name}&fromDate=${from}&toDate=${to}`
    );
    try {
      const config = {
        headers: { "Content-type": "application/json" },
      };
      const res = await axios.get(
        `api/v1/prices/getPrices?symbol=${name}&fromDate=${from}&toDate=${to}`,
        config
      );
      const stocks = res.data;
      const stockLabels = stocks.map((e) => e.date.substring(0, 10));
      const stockPrices = stocks.map((e) => e.price);
      setLabels(stockLabels);
      setValues(stockPrices);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData(name, from, to);
  }, []);

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          margin: "30px 160px",
        }}
      >
        <div>
          <label style={{ padding: "10px" }}>Select Stock</label>
          <select name="name" id="name" onChange={handleName} value={name}>
            <option default value="NONE">
              Select Stock
            </option>
            <option default value="NIFTY 50">
              Nifty 50
            </option>
            <option value="NIFTY BANK">Nifty Bank</option>
          </select>
        </div>

        <div>
          <label>From</label>
          <input type="date" value={from} onChange={handleFrom} />
        </div>

        <div>
          <label>To</label>
          <input type="date" value={to} onChange={handleTo} />
        </div>
      </div>

      <div
        className="chart-container"
        style={{
          position: "relative",
          height: "600px",
          width: "80%",
          margin: "auto ",
        }}
      >
        {" "}
        <Line options={options} data={data} />
      </div>
    </>
  );
};

export default DataChart;
