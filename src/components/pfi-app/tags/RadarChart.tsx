import Link from 'next/link';
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip
} from 'recharts';

const RadarComponent = ({ dataRow, selectedKeys }: { dataRow: any; selectedKeys: string }) => {

  const tooltipContent = (props: any) => {
    const { payload } = props;
    if (!payload || !payload.length) return null;

    return (
      <div className="m-auto bg-[#1C9EB6] rounded-lg w-60 py-4 px-3 top-0">
        <div className="flex">
          <span className="text-white text-sm me-auto">{payload[0].payload.subject}</span>
          <span className="text-white text-sm">{payload[0].value}</span>
        </div>
        <Link href={`/pfi-app/tags/${selectedKeys}?features_id=${payload[0].payload.id}&sensor_id=b538d5d4-7e3c-46ac-b3f0-c35136317557`} className="text-sm text-neutral-200 pt-5">
          see details {">"}
        </Link>
      </div>
    );
  };

  return (
    <ResponsiveContainer width="100%" height="100%" className='relative'>
      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={dataRow} >
        <PolarGrid />
        <Tooltip
          content={tooltipContent}
          isAnimationActive={false}
          cursor={false}
          wrapperStyle={{ pointerEvents: 'auto' }}
          viewBox={{ x: 0, y: 0, width: 100, height: 100 }}
          active={true}
          position={{ x: 70, y: 100 }}
        />
        <PolarAngleAxis dataKey="subject" />
        <PolarRadiusAxis />
        <Radar
          dataKey="A"
          stroke="#8884d8"
          fill="#8884d8"
          fillOpacity={0.6}
          cursor={'pointer'}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
};

export default RadarComponent;
