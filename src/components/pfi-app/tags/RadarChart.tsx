import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip
} from 'recharts';

const RadarComponent = ({ dataRow, encryptedKey }: { dataRow: any, encryptedKey: string }) => {
  const router = useRouter();

  const tooltipContent = (props: any) => {
    const { payload } = props;
    if (!payload || !payload.length) return null;

    return (
      <div className="m-auto bg-[#1C9EB6] rounded-lg w-60 py-4 px-3">
        <div className="flex">
          <span className="text-white text-sm me-auto">{payload[0].payload.subject}</span>
          <span className="text-white text-sm">{payload[0].value}</span>
        </div>
        <Link href={`/pfi-app/tags/#}`} className="text-sm text-neutral-200 pt-5 ">
          see details {">"}</Link>
      </div>
    );
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={dataRow} onClick={() => router.push(`/pfi-app/tags/${encodeURIComponent(encryptedKey)}`)}>
        <PolarGrid />
        <Tooltip
          content={tooltipContent}
          isAnimationActive={false}
          cursor={false}
          wrapperStyle={{ pointerEvents: 'auto' }} // Allow interaction with tooltip content
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
