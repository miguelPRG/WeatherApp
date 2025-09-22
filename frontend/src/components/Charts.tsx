import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  ComposedChart,
  RadialBar,
  RadialBarChart,
  ScatterChart,
  Scatter,
} from "recharts";

import { useState, useEffect } from "react";

type ChartProps = {
  data: any[];
  YUnits?: (value: any) => string;
};

function LineChartComponent({ data, YUnits }: ChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%" minWidth={160} >
      <LineChart
        data={data}
      
      >
        <CartesianGrid strokeDasharray="5 5" />
        <XAxis dataKey="name" />
        <YAxis tickFormatter={YUnits} />
        <Legend align="center" />
        <Line type="monotone" dataKey="Avg" stroke="#ffc658" />
        <Line type="monotone" dataKey="Max" stroke="#82ca9d" />
        <Line type="monotone" dataKey="Min" stroke="#8884d8" />
      </LineChart>
    </ResponsiveContainer>
  );
}
function BarChartComponent({ data, YUnits }: ChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%" minWidth={160}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="5 5" />
        <XAxis dataKey="name" />
        <YAxis tickFormatter={YUnits} />
        <Tooltip />
        <Legend align="center" />
        <Bar dataKey="Avg" fill="#ffc658" />
        <Bar dataKey="Max" fill="#82ca9d" />
        <Bar dataKey="Min" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
}

function AreaChartComponent({ data, YUnits }: ChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%" minWidth={160}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="5 5" />
        <XAxis dataKey="name" scale="band" />
        <YAxis tickFormatter={YUnits} />
        <Tooltip />
        <Legend align="center" />
        <Area
          type="monotone"
          dataKey="Avg"
          stroke="#ffc658"
          fill="#ffc658"
          stackId="1"
        />
        <Area
          type="monotone"
          dataKey="Max"
          stroke="#82ca9d"
          fill="#82ca9d"
          stackId="1"
        />
        <Area
          type="monotone"
          dataKey="Min"
          stroke="#8884d8"
          fill="#8884d8"
          stackId="1"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function ComposedChartComponent({ data, YUnits }: ChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%" minWidth={160}>
      <ComposedChart data={data}>
        <CartesianGrid stroke="#f5f5f5" />
        <XAxis dataKey="name" scale="band" />
        <YAxis tickFormatter={YUnits} />
        <Tooltip />
        <Legend />
        <Bar dataKey="Avg" barSize={20} fill="#ffc658" />
        <Line type="monotone" dataKey="Avg" stroke="#ffc658" />
        <Bar dataKey="Max" barSize={20} fill="#82ca9d" />
        <Line type="monotone" dataKey="Max" stroke="#82ca9d" />
        <Bar dataKey="Min" barSize={20} fill="#8884d8" />
        <Line type="monotone" dataKey="Min" stroke="#8884d8" />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

function RadialBarChartComponent({ data, YUnits }: ChartProps) {
  // State to manage the selected metric (Min, Avg, Max)
  const [metric, setMetric] = useState<"Max" | "Min" | "Avg">("Avg");
  // Style for calculating the current screen width
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  const style = {
    top: 50,
    right: 10
  };

  return (
    <>
      <div className="flex gap-2 mb-5 flex-col sm:flex-row">
        <button
          className={`chart-btn${metric === "Min" ? " active" : ""}`}
          onClick={() => setMetric("Min")}
        >
          Min
        </button>
        <button
          className={`chart-btn${metric === "Avg" ? " active" : ""}`}
          onClick={() => setMetric("Avg")}
        >
          Avg
        </button>
        <button
          className={`chart-btn${metric === "Max" ? " active" : ""}`}
          onClick={() => setMetric("Max")}
        >
          Max
        </button>
      </div>
      <ResponsiveContainer width="100%" height="100%" minWidth={160}>
        <RadialBarChart cx="50%" cy="50%" innerRadius="10%" outerRadius="80%" barSize={10} data={data}>
          <RadialBar
            minAngle={15}
            label={{ position: 'insideStart', fill: '#fff' }}
            background
            clockWise
            dataKey={metric}
          />
          <Legend iconSize={5} layout="vertical" verticalAlign="middle" wrapperStyle={style} />
        </RadialBarChart>
      </ResponsiveContainer>
    </>
  );
}

function ScatterChartComponent({ data, YUnits }: ChartProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <ResponsiveContainer width="100%" height="100%" minWidth={170}>
      <ScatterChart
        margin={{
          top: 20,
          right: isMobile ? 10 : 30,
          left: isMobile ? 0 : 20,
          bottom: isMobile ? 40 : 30, // mais espaço para os labels
        }}
      >
        <CartesianGrid />
        <XAxis
          dataKey="name"
          type="category"
          allowDuplicatedCategory={false}
          interval={0}
          angle={isMobile ? -35 : 0}
          textAnchor={isMobile ? "end" : "middle"}
          dy={isMobile ? 20 : 10}
          height={isMobile ? 50 : 30}
        />
        <YAxis type="number" tickFormatter={YUnits} />
        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
        <Legend wrapperStyle={{ position: 'absolute', bottom: -20 }} />
        <Scatter name="Min" data={data} fill="#8884d8" dataKey="Min" />
        <Scatter name="Avg" data={data} fill="#ffc658" dataKey="Avg" />
        <Scatter name="Max" data={data} fill="#82ca9d" dataKey="Max" />
      </ScatterChart>
    </ResponsiveContainer>
  );
}

export {
  LineChartComponent,
  BarChartComponent,
  AreaChartComponent,
  ComposedChartComponent,
  RadialBarChartComponent,
  ScatterChartComponent,
};
