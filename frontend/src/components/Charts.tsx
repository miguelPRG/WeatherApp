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
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ScatterChart,
  Scatter,
} from "recharts";

import { useState, useEffect } from "react";

type ChartProps = {
  data: any[];
  YUnits?: (value: any) => string;
  yLabel?: string;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    // Ordena os campos na ordem desejada
    const order = ["Max", "Avg", "Min"];
    const sortedPayload = [...payload].sort(
      (a, b) => order.indexOf(a.name) - order.indexOf(b.name)
    );

    return (
      <div
        style={{
          backgroundColor: "#fff",
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "10px",
        }}
      >
        <div
          style={{
            color: "#000",
            fontWeight: 700,
            fontSize: "1.05rem",
            marginBottom: "6px",
          }}
        >
          Day: {label}
        </div>
        {sortedPayload.map((entry, idx) => (
          <div key={idx} style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </div>
        ))}
      </div>
    );
  }
  return null;
};

function LineChartComponent({ data, YUnits, yLabel }: ChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%" minWidth={150}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="5 5" />
        <XAxis dataKey="day" />
        <YAxis
          tickFormatter={YUnits}
          label={{
            value: yLabel,
            angle: -90,
            position: "insideLeft",
            style: { textAnchor: "middle" }
          }}
        />
        <Tooltip content={<CustomTooltip />} />
        <div className="mb-10">
          <Legend wrapperStyle={{ position: 'absolute', bottom: -20 }} />
        </div>
        <Line type="monotone" dataKey="Max" stroke="#82ca9d" />
        <Line type="monotone" dataKey="Avg" stroke="#ffc658" />
        <Line type="monotone" dataKey="Min" stroke="#8884d8" />
      </LineChart>
    </ResponsiveContainer>
  );
}
function BarChartComponent({ data, YUnits, yLabel }: ChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%" minWidth={150}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="5 5" />
        <XAxis dataKey="day" />
        <YAxis
          tickFormatter={YUnits}
          label={{
            value: yLabel,
            angle: -90,
            position: "insideLeft",
            style: { textAnchor: "middle" }
          }}
        />
        <Tooltip content={<CustomTooltip />} />
        <div className="mb-10">
          <Legend wrapperStyle={{ position: 'absolute', bottom: -20 }} />
        </div>
        <Bar dataKey="Max" fill="#82ca9d" />
        <Bar dataKey="Avg" fill="#ffc658" />
        <Bar dataKey="Min" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
}

function AreaChartComponent({ data, YUnits, yLabel }: ChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%" minWidth={150}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="5 5" />
        <XAxis dataKey="day" scale="band" />
        <YAxis
          tickFormatter={YUnits}
          label={{
            value: yLabel,
            angle: -90,
            position: "insideLeft",
            style: { textAnchor: "middle" }
          }}
        />
        <Tooltip content={<CustomTooltip />} />
        <div className="mb-10">
            <Legend wrapperStyle={{ position: 'absolute', bottom: -20 }} />
        </div>
        <Area
          type="monotone"
          dataKey="Min"
          stroke="#8884d8"
          fill="#8884d8"
          stackId="1"
        />
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
      </AreaChart>
    </ResponsiveContainer>
  );
}

function ComposedChartComponent({ data, YUnits, yLabel }: ChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%" minWidth={150}>
      <ComposedChart data={data}>
        <CartesianGrid stroke="#f5f5f5" />
        <XAxis dataKey="day" scale="band" />
        <YAxis
          tickFormatter={YUnits}
          label={{
            value: yLabel,
            angle: -90,
            position: "insideLeft",
            style: { textAnchor: "middle" }
          }}
        />
        <Tooltip content={<CustomTooltip />} />
        <div>
          <Legend wrapperStyle={{ position: 'absolute', bottom: -20 }} />
        </div>
        <Bar dataKey="Max" barSize={20} fill="#82ca9d" />
        <Line type="monotone" dataKey="Max" stroke="#82ca9d" />
        <Bar dataKey="Avg" barSize={20} fill="#ffc658" />
        <Line type="monotone" dataKey="Avg" stroke="#ffc658" />
        <Bar dataKey="Min" barSize={20} fill="#8884d8" />
        <Line type="monotone" dataKey="Min" stroke="#8884d8" />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

function SimpleRadarChartComponent({ data }: ChartProps) {
   return (
      <ResponsiveContainer width="100%" height="100%" minWidth={150}>
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="day" />
          <PolarRadiusAxis />
          <Tooltip content={<CustomTooltip />} />
          <Radar name="Speed" dataKey="Avg" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
          <div className="mb-10">
            <Legend wrapperStyle={{ position: 'absolute', bottom: -20 }} />
          </div>
        </RadarChart>
      </ResponsiveContainer>
    );
}

function ScatterChartComponent({ data, YUnits, yLabel }: ChartProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <ResponsiveContainer width="100%" height="100%" minWidth={150}>
      <ScatterChart>
        <CartesianGrid />
        <XAxis
          dataKey="day"
          type="category"
          allowDuplicatedCategory={false}
          interval={0}
          angle={isMobile ? -60 : 25}
          textAnchor={isMobile ? "end" : "middle"}
          dy={isMobile ? 0 : 10}
          height={isMobile ? 50 : 30}
        />
        <YAxis
          type="number"
          tickFormatter={YUnits}
          label={{
            value: yLabel,
            angle: -90,
            position: "insideLeft",
            style: { textAnchor: "middle" }
          }}
        />
        <Tooltip />
        <div className="mb-10">
          <Legend wrapperStyle={{ position: 'absolute', bottom: -20 }} />
        </div>
        <Scatter name="Max" data={data} fill="#82ca9d" dataKey="Max" />
        <Scatter name="Avg" data={data} fill="#ffc658" dataKey="Avg" />
        <Scatter name="Min" data={data} fill="#8884d8" dataKey="Min" />
      </ScatterChart>
    </ResponsiveContainer>
  );
}

export {
  LineChartComponent,
  BarChartComponent,
  AreaChartComponent,
  ComposedChartComponent,
  SimpleRadarChartComponent,
  ScatterChartComponent,
};
