import React from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const PredictChart = ({
  equipmentValues,
}: {
  equipmentValues: any;
}) => {

  const formatter = new Intl.DateTimeFormat('id', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });

  // Proses data dengan memoized function
  const values = React.useMemo(() => {
    if (!equipmentValues) return [];
    return equipmentValues.flatMap((item: any) =>
      item.values?.map((value: any) => ({
        category: formatter.format(new Date(value.date_time)),
        value: value.value,
      })) || []
    );
  }, [equipmentValues]);

  const predictions = React.useMemo(() => {
    if (!equipmentValues) return [];
    return equipmentValues.flatMap((item: any) =>
      item.predictions?.map((value: any) => ({
        category: formatter.format(new Date(value.date_time)),
        value: value.pfi_value,
      })) || []
    );
  }, [equipmentValues]);

  const series = [
    {
      name: 'Values',
      data: values,
      stroke: '#8884d8',
    },
    {
      name: 'Predictions',
      data: predictions,
      stroke: '#82ca9d',
    },
  ];

  if (!equipmentValues || equipmentValues.length === 0) {
    return <div>Loading data...</div>;
  }

  return (
    <div className="col-span-2 flex flex-col items-center w-full">
      <div className="flex">
        <span className="text-center mb-4">Potential Failure Interval Chart</span>
      </div>
      <div className="w-full h-80 md:h-[400px] lg:h-[500px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={series}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" type="category" allowDuplicatedCategory={false} />
            <YAxis dataKey="value" />
            <Tooltip />
            <Legend />
            <ReferenceLine y={90} label="Trip" stroke="red" name="Trip" />
            {series.map((s) => (
              <Line
                key={s.name}
                type="monotone"
                dataKey="value"
                data={s.data}
                name={s.name}
                stroke={s.stroke}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PredictChart;
