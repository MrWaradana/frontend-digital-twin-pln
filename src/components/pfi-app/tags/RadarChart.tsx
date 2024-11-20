import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react";
import * as echarts from "echarts";
import { useEffect, useRef, useState } from "react";

const RadarChart = () => {
  const chartRef = useRef(null); // Referensi ke elemen DOM untuk chart
  const [dropdownVisible, setDropdownVisible] = useState(false); // State untuk visibilitas dropdown
  const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 }); // Posisi dropdown
  const [clickedData, setClickedData]: any = useState(null); // Data dari elemen yang diklik

  useEffect(() => {
    let myChart;
    if (chartRef.current) {
      // Inisialisasi ECharts
      myChart = echarts.init(chartRef.current);

      // Konfigurasi Radar Chart
      const option = {
        tooltip: {
          trigger: "item", // Menampilkan tooltip saat elemen di-hover/klik
          formatter: (params) => {
            const { seriesName, value } = params;
            return `
              <b>${seriesName}</b><br />
              <b>Sales:</b> ${value[0]}<br />
              <b>Administration:</b> ${value[1]}<br />
              <b>Information Technology:</b> ${value[2]}<br />
              <b>Customer Support:</b> ${value[3]}<br />
              <b>Development:</b> ${value[4]}<br />
              <b>Marketing:</b> ${value[5]}<br />
            `;
          },
        },
        legend: {
          data: ["Allocated Budget", "Actual Spending"],
          orient: "horizontal",
          bottom: "0",
        },
        radar: {
          shape: "circle",
          indicator: [
            { name: "Sales", max: 6500 },
            { name: "Administration", max: 16000 },
            { name: "Information Technology", max: 30000 },
            { name: "Customer Support", max: 38000 },
            { name: "Development", max: 52000 },
            { name: "Marketing", max: 25000 },
          ],
        },
        series: [
          {
            name: "Budget vs spending",
            type: "radar",
            data: [
              {
                value: [4200, 3000, 20000, 35000, 50000, 18000],
                name: "Allocated Budget",
              },
              {
                value: [5000, 14000, 28000, 26000, 42000, 21000],
                name: "Actual Spending",
              },
            ],
          },
        ],
      };

      // Render chart
      myChart.setOption(option);

      // Event handler untuk klik
      myChart.on("click", (params) => {
        if (params) {
          setClickedData(params); // Simpan data yang diklik
          setDropdownPosition({ x: params.event.offsetX, y: params.event.offsetY }); // Simpan posisi klik
          setDropdownVisible(true); // Tampilkan dropdown
        }
      });

      // Tangani resize untuk responsivitas
      const handleResize = () => {
        if (myChart) {
          myChart.resize();
        }
      };

      window.addEventListener("resize", handleResize);

      // Bersihkan saat komponen unmount
      return () => {
        if (myChart) {
          myChart.dispose();
        }
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);

  return (
    <div style={{ position: "relative" }}>
      {/* Tempat untuk ECharts */}
      <div
        ref={chartRef}
        style={{ width: "100%", height: "100%" }}
        className="min-h-[400px] sm:min-h-[500px] lg:min-h-[600px]"
      />

      {/* Dropdown Menu */}
      {dropdownVisible && (
        <Dropdown
          isOpen={dropdownVisible}
          onClose={() => setDropdownVisible(false)} // Tutup dropdown saat di luar klik
          style={{
            position: "absolute",
            left: `${dropdownPosition.x}px`,
            top: `${dropdownPosition.y}px`,
            zIndex: 1000,
          }}
        >
          <DropdownTrigger>
            <Button>
              Menu
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Data Options"
            onAction={(key) => console.log(`Action selected: ${key}`)}
          >
            <DropdownItem key="details">
              Details: {clickedData?.data.name}
            </DropdownItem>
            <DropdownItem key="edit">Edit</DropdownItem>
            <DropdownItem key="delete" >
              Delete
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      )}
    </div>
  );
};

export default RadarChart;
