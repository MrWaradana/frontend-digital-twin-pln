import React from 'react';
import ReactECharts from 'echarts-for-react';

interface RadarIndicator {
  id: string;
  name: string;
  max: number;
}

interface RadarDataItem {
  value: number[];
  name: string;
}

interface RadarChartProps {
  title?: string;
  indicators: RadarIndicator[];
  data: RadarDataItem[];
  legendData?: string[];
  height?: string | number;
  className?: string;
  selectedKeys: any;
}
const RadarChart: React.FC<RadarChartProps> = ({
  indicators,
  data,
  legendData,
  height = '400px',
  className = '',
  selectedKeys
}) => {
  const option = {
    legend: {
      data: legendData,
      orient: 'vertical',
      right: 0,
      top: 'middle'
    },
    radar: {
      indicator: indicators.map((indicator) => ({
        name: indicator.name,
        max: indicator.max,
        id: indicator.id
      })),
      center: ['45%', '50%'],
      radius: '60%',
      splitNumber: 4,
      shape: 'polygon',
      axisName: {
        color: '#333',
        fontSize: 12
      },
      splitArea: {
        areaStyle: {
          color: ['#F5F5F5', '#E8E8E8']
        }
      }
    },
    series: [{
      type: 'radar',
      data: data,
      symbol: 'circle',
      symbolSize: 6,
      lineStyle: {
        width: 2
      },
      areaStyle: {
        opacity: 0.3
      },
      emphasis: {
        lineStyle: {
          width: 3
        }
      }
    }],
    tooltip: {
      trigger: 'item',
      enterable: true,
      hideDelay: 3000,
      position: 'inside',
      formatter: (params: any) => {
        const { value, name } = params;

        return `
          <div class="bg-[#1C9EB6] rounded-lg w-60 py-4 px-3">
            <div class="flex">
               <span class="text-white text-sm me-2 truncate max-w-[70%]">${name.substring(0, 20)}${name.length > 20 ? '...' : ''}</span>
          </span>
            </div>
            <a href="/pfi-app/tags/${selectedKeys}?features_id=b538d5d4-7e3c-46ac-b3f0-c35136317557&sensor_id=b538d5d4-7e3c-46ac-b3f0-c35136317557" 
               class="text-sm text-neutral-200 pt-5 block hover:text-white">
              see details >
            </a>
          </div>
        `;
      },
      className: 'pfi-custom-tooltip'
    }
  };

  return (
    <div className={className}>
      <ReactECharts
        option={option}
        style={{ height }}
        opts={{ renderer: 'svg' }}
      />
    </div>
  );
};
export default RadarChart;