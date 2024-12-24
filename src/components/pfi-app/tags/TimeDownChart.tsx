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
          // left: `${xOffset}px`,
          // top: `${yOffset}px`,
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
  // Temukan nilai y untuk currentValue dengan interpolasi linear
  const getCurrentY = () => {
    const data = [
      { x: 0, condition: 100 },
      { x: currentValue / 2, condition: 100 },
      { x: currentValue, condition: 93 },
      { x: currentValue * 2, condition: 80 },
      { x: currentValue * 3, condition: 60 },
      { x: currentValue * 4, condition: 0 },
    ];

    const point = data.find(d => d.x === currentValue);
    if (point) return point.condition;

    // Jika tidak ada titik yang tepat, interpolasi linear
    const before = data.filter(d => d.x < currentValue).slice(-1)[0];
    const after = data.find(d => d.x > currentValue);

    if (before && after) {
      const ratio = (currentValue - before.x) / (after.x - before.x);
      return before.condition + ratio * (after.condition - before.condition);
    }

    return null;
  };

  const currentY = getCurrentY();

  const data = [
    { x: 0, condition: 100 },
    { x: currentValue / 2, condition: 100 },
    { x: currentValue, condition: 93 },
    { x: currentValue * 2, condition: 80 },
    { x: currentValue * 3, condition: 60 },
    { x: currentValue * 4, condition: 0 },
  ];

  // Custom dot renderer untuk menampilkan dot khusus pada currentValue
  const CustomDot = (props: any) => {
    const { cx, cy, payload } = props;
    if (payload.x === currentValue) {
      return (
        <g>
          {/* Outer circle */}
          <circle cx={cx} cy={cy} r={8} fill="#ffffff" stroke="#00a5ba" strokeWidth={2} />
          {/* Inner circle */}
          <circle cx={cx} cy={cy} r={4} fill="#00a5ba" />
        </g>
      );
    }
    return null;
  };

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
          <XAxis
            dataKey="x"
            tickFormatter={(value) => value.toFixed(0)}
          />
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
          {/* Vertical reference line */}
          <ReferenceLine
            x={currentValue}
            stroke="#918E8E"
            strokeDasharray="3 3"
            label={{
              value: `Current Value(${currentValue.toFixed(0)})`,
              position: 'top',
              fill: '#918E8E'
            }}
          />
          {/* Horizontal reference line for current Y value */}
          {currentY && (
            <ReferenceLine
              y={currentY}
              stroke="#918E8E"
              strokeDasharray="3 3"
              label={{
                value: `${currentY.toFixed(1)}%`,
                position: 'right',
                fill: '#918E8E'
              }}
            />
          )}
          <Line
            type="monotone"
            dataKey="condition"
            stroke="#00a5ba"
            strokeWidth={2}
            dot={<CustomDot />}
            activeDot={{ r: 8, fill: "#00a5ba" }}
          />
        </LineChart>
      </div>
    </div>
  );
};

export default TimeDownChart;