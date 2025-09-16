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
} from "recharts";

type ChartProps = {
  data: any[];
  YUnits?: (value: any) => string;
};

export function LineChartComponent({ data, YUnits }: ChartProps) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="5 5" />
        <XAxis dataKey="name" />
        <YAxis tickFormatter={YUnits} />
        <Tooltip viewBox={{ background: "var(--bg-card)" }} />
        <Legend align="center" />
        <Line type="monotone" dataKey="Min" stroke="#8884d8" />
        <Line type="monotone" dataKey="Avg" stroke="#ffc658" />
        <Line type="monotone" dataKey="Max" stroke="#82ca9d" />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function BarChartComponent({ data, YUnits }: ChartProps) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="5 5" />
        <XAxis dataKey="name" />
        <YAxis tickFormatter={YUnits} />
        <Tooltip />
        <Legend />
        <Bar dataKey="Min" fill="#8884d8" />
        <Bar dataKey="Avg" fill="#82ca9d" />
        <Bar dataKey="Max" fill="#ffc658" />
      </BarChart>
    </ResponsiveContainer>
  );
}
