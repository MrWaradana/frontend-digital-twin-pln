import React from 'react'
import { CartesianGrid, Legend, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const PredictChart = ({ tagValues }: { selectedKeys: any, tagValues: any }) => {

  const series = [
    {
      name: 'Original',
      data: tagValues[0].values.map((v) => ({ category: v.time_stamp, value: v.value })),
    },
    {
      name: 'Prediction',
      data: tagValues[1].values.map((v) => ({ category: v.time_stamp, value: v.value })),
    },
  ];

  return (
    <div className="col-span-2 flex flex-col items-center w-full">
      <span className="text-center mb-4">TEST</span>
      <div className="w-full h-80 md:h-[400px] lg:h-[500px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart width={500} height={300}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" type="category" allowDuplicatedCategory={false} />
            <YAxis dataKey="value" />
            <Tooltip />
            <Legend />
            <ReferenceLine y={90} label="Trip" stroke="red" />
            {series.map((s) => (
              <Line dataKey="value" data={s.data} name={s.name} key={s.name} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default PredictChart