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
  tagValues,
}: {
  tagValues: any;
}) => {
  const [tagValuePercent, setTagValuePercent] = React.useState(0);

  // Proses data dengan memoized function
  const tagValuesData = React.useMemo(() => {
    if (!tagValues || tagValues.length === 0) return [];
    const processedData = tagValues.flatMap((v: any) => {
      setTagValuePercent(v.percentage || 0); // Ambil persentase dari data
      return v.data.map((d: any) => ({
        category: d.timestamp,
        value: d.value,
      }));
    });
    return processedData;
  }, [tagValues]);

  const series = React.useMemo(
    () => [
      {
        name: "Series 1",
        data: tagValuesData,
        stroke: "#8884d8",
      },
    ],
    [tagValuesData]
  );

  if (!tagValuesData || tagValuesData.length === 0) {
    return <div>Loading data...</div>;
  }

  return (
    <div className="col-span-2 flex flex-col items-center w-full">
      <div className="flex">
        <span className="text-center mb-4">Potential Failure Interval Chart</span>
        <span className="text-neutral-500 ms-4">{Math.round(tagValuePercent)} %</span>
        <span className="text-neutral-500 ms-4">{tagValuesData.length}</span>
      </div>
      <div className="w-full h-80 md:h-[400px] lg:h-[500px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={tagValuesData}>
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
