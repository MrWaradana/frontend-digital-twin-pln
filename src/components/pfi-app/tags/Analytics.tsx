import React from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";
import CanvasJSReact from "@canvasjs/react-charts";

const Analytics = ({ selectedKeys, tagValues }: { selectedKeys: any, tagValues: any }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const CanvasJSChart = CanvasJSReact.CanvasJSChart;

  const chartData: any = React.useMemo(() => {
    if (!tagValues) return {};

    const dataSetAttributes = tagValues!!.map((data: any) => {
      const datasets = {
        type: "line",
        name: data.name,
        showInLegend: false,
      };

      datasets["dataPoints"] = datasets["dataPoints"] || [];

      data.values.forEach((values: any) => {
        datasets["dataPoints"].push({
          x: new Date(values.time_stamp),
          y: values.value,
        });
      });

      return datasets;
    });

    return {
      dataSetAttributes,
    };
  }, [tagValues]);

  const options = {
    responsive: true,
    zoomEnabled: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Tag Value Chart",
      },
    },
    toolTip: {
      shared: true,
    },
    data: chartData.dataSetAttributes,
    scales: {
      x: {
        type: "linear",
        position: "bottom",
        title: {
          display: true,
          text: "Data Point",
        },
      },
      y: {
        type: "linear",
        position: "left",
        title: {
          display: true,
          text: "Value",
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-3xl p-3 sm:p-5 mx-2 sm:mx-4 border border-gray-200 shadow-xl col-span-1 md:col-span-2">
      <Button onPress={onOpen}>See Prescription</Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false} isKeyboardDismissDisabled={true} size='3xl'>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Modal {selectedKeys}</ModalHeader>
              <ModalBody>
                <CanvasJSChart options={options} />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Action
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  )
}

export default Analytics
