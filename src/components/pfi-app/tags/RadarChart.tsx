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
const RadarChartComponent: React.FC<RadarChartProps> = ({
  indicators,
  data,
  legendData,
  height = '400px',
  className = '',
  selectedKeys
}) => {

  const handleChartClick = (params: any) => {
    if (params.componentType === 'series') {
      const { name, dataIndex } = params;
      // console.log(`Clicked on ${name} at index ${dataIndex}`);
      // Lakukan tindakan yang diinginkan saat chart di-klik
    }
  };
  const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'];

  const option = {
    colors: colors,
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
          color: ['rgba(250, 250, 250, 0.8)', 'rgba(200, 200, 200, 0.8)']
        }
      },
      backgroundColor: 'rgba(128, 128, 128, 0.1)'
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
        const { value, name, data } = params;
        // make break word for name
        const formattedName = name.split(' ').join('<br/>');


        const features_id = data?.detail
          ?.filter((item: any) => typeof item === 'object' && item !== null && item.features_id)
          ?.map((item: any) => item.features_id)
          ?.join(',');
        const sensor_id = data?.detail
          ?.filter((item: any) => typeof item === 'object' && item !== null && item.sensor_id)
          ?.map((item: any) => item.sensor_id)
          ?.join(',');

        return `
          <div class="bg-[#1C9EB6] rounded-lg py-4 px-3">
            <div class="flex">
              <span class="text-white text-sm me-2 truncate max-w-[70%]">${formattedName}</span>
              <span class="text-white text-sm ms-auto">${value.filter((item: number) => item != 0)}</span>
            </div>
            <a href="/pfi-app/equipments/${selectedKeys}?features_id=${features_id}&sensor_id=${sensor_id}" 
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
        onEvents={{
          click: handleChartClick
        }}
      />
    </div>
  );
};
export default RadarChartComponent;