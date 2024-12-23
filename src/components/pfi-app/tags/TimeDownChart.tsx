import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis, ReferenceLine } from 'recharts';

const CustomTooltip = ({ active, payload, coordinate }) => {
  if (active && payload && payload.length) {
    const hours = 19;
    const days = 0;
    const months = 0;
    const years = 0;

    const xOffset = 200;
    const yOffset = 150;

    return (
      <div
        className="bg-[#00a5ba] text-white p-4 rounded-lg absolute"
        style={{
          left: `${xOffset}px`,
          top: `${yOffset}px`,
          width: '200px',
          pointerEvents: 'none',
          zIndex: 10
        }}
      >
        <p className="text-center font-bold mb-2">PFI Time Count Down</p>
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-xl font-bold">{hours}</div>
            <div className="text-sm">Hours</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold">{days}</div>
            <div className="text-sm">Days</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold">{months}</div>
            <div className="text-sm">Month</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold">{years}</div>
            <div className="text-sm">Years</div>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const TimeDownChart = ({ currentValue }: { currentValue: number }) => {
  const data = [
    { x: 0, condition: 100 },
    { x: currentValue / 2, condition: 100 },
    { x: currentValue, condition: 93 },
    { x: currentValue * 2, condition: 80 },
    { x: currentValue * 3, condition: 60 },
    { x: currentValue * 4, condition: 0 },
  ];

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex">
        <span className="text-center mb-4">Potential Failure Interval Chart</span>
      </div>
      <div className="flex gap-4 w-full h-60 sm:h-72 md:h-[400px] lg:h-[500px]">
        <LineChart
          width={800}
          height={400}
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="x" />
          <YAxis
            domain={[0, 100]}
            ticks={[0, 20, 40, 60, 80, 100]}
            label={{ value: 'Condition (%)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip
            content={<CustomTooltip active={undefined} payload={undefined} coordinate={undefined} />}
            position={{ x: 0, y: 0 }}
            wrapperStyle={{ visibility: 'visible' }}
          />
          {/* Add Reference Lines */}
          <ReferenceLine
            x={currentValue}
            stroke="#918E8E"
            strokeDasharray="3 3"
            label={{ value: 'Current Value', position: 'top' }}
          />
          <Line
            type="monotone"
            dataKey="condition"
            stroke="#00a5ba"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 8, fill: "#00a5ba" }}
          />
        </LineChart>
      </div>
    </div>
  );
};

export default TimeDownChart;