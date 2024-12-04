"use client";

import { useState, useMemo } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Tabs,
  Tab,
  useDisclosure,
  RangeCalendar,
  Tooltip,
} from "@nextui-org/react";
import { Calendar, CalendarRange, CalendarDays } from "lucide-react";
import type { DateValue } from "@react-types/calendar";
import { parseDate } from "@internationalized/date";
import type { RangeValue } from "@react-types/shared";
import { today, getLocalTimeZone } from "@internationalized/date";
import {
  Calendar as BigCalendar,
  momentLocalizer,
  Views,
} from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const now = new Date();

export default function ScheduleOH({ scheduleData, overviewData }: any) {
  const [view, setView] = useState(Views.AGENDA);
  const [date, setDate] = useState(new Date(2025, 0, 1));
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  let scopeASchedule = scheduleData.find((item) => item.Overhaul === "A");
  let scopeBSchedule = scheduleData.find((item) => item.Overhaul === "B");
  let [value, setValue] = useState<RangeValue<DateValue>>({
    start: parseDate(overviewData?.start_date),
    // start: today(getLocalTimeZone()),
    end: parseDate(overviewData?.end_date),
  });

  // Define status colors
  const statusColors = {
    A: "#F49C38",
    B: "#1C9EB6",
  };

  const events = useMemo(() => {
    return scheduleData.map((schedule, index) => ({
      id: index,
      title: `Overhaul ${schedule.Overhaul}`,
      start: new Date(schedule.date),
      end: new Date(schedule.date),
      allDay: true,
      status: schedule.status,
      resource: schedule.Overhaul,
      tooltipContent: `Overhaul ${schedule.Overhaul} - ${schedule.status}
Date: ${moment(schedule.date).format("MMMM D, YYYY")}`,
    }));
  }, [scheduleData]);

  // Custom Agenda accessor to format the time display
  const agendaTimeAccessor = (event) => {
    return moment(event.start).format("MMMM D, YYYY");
  };

  const eventStyleGetter = (event) => {
    let backgroundColor = "#1C9EB6";

    if (event.resource === "B") {
      backgroundColor = "#1C9EB6";
    } else if (event.resource === "A") {
      backgroundColor = "#F49C38";
    }

    // if (event.status === "upcoming") {
    //   backgroundColor = "#1C9EB6";
    // } else if (event.status === "completed") {
    //   backgroundColor = "#4CAF50";
    // } else if (event.status === "delayed") {
    //   backgroundColor = "#f44336";
    // }

    return {
      style: {
        backgroundColor,
        borderRadius: "4px",
        opacity: 0.8,
        color: "white",
        border: "none",
        display: "block",
        padding: "2px 4px",
        whiteSpace: "normal", // Allow text to wrap
        overflow: "visible", // Show overflow
        height: "auto", // Allow height to adjust
        minHeight: "24px",
      },
    };
  };

  const handleNavigate = (newDate) => {
    setDate(newDate);
  };

  const handleViewChange = (newView) => {
    setView(newView);
  };

  // Get min and max dates for the full range
  const { views, messages } = useMemo(
    () => ({
      views: [Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA],
      // Custom messages to override default behavior
      messages: {
        agenda: "All Scheduled Overhauls",
      },
    }),
    []
  );

  const localizer = momentLocalizer(moment); // or globalizeLocalizer

  const { defaultDate } = useMemo(
    () => ({
      defaultDate: new Date(2015, 3, 13),
    }),
    []
  );

  // Custom event component with tooltip
  const EventComponent = ({ event }) => {
    return (
      <Tooltip content={event.tooltipContent} placement="top" showArrow={true}>
        <div className="h-full w-full p-1">
          {`Overhaul ${event.resource} (${event.status})`}
        </div>
      </Tooltip>
    );
  };

  // Custom Agenda components
  const AgendaEvent = ({ event }) => (
    <div
      className="flex items-center p-2 rounded"
      style={{ backgroundColor: statusColors[event.resource] }}
    >
      <span className="text-white">
        Overhaul {event.resource} ({event.status})
      </span>
    </div>
  );

  const Legend = () => (
    <div className="flex gap-4 items-center justify-end mb-2 text-sm">
      {Object.entries(statusColors).map(([resource, color]) => (
        <div key={resource} className="flex items-center gap-1">
          <div
            className="w-4 h-4 rounded"
            style={{ backgroundColor: color, opacity: 0.8 }}
          />
          <span className="capitalize">{resource}</span>
        </div>
      ))}
    </div>
  );

  return (
    <>
      <Button
        className={`text-white bg-[#1C9EB6]`}
        startContent={<Calendar size={128} width={15} />}
        onPress={onOpen}
      >
        Date
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size={`5xl`}
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1"></ModalHeader>
              <ModalBody>
                <div style={{ height: "500px" }}>
                  <BigCalendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    date={date}
                    onNavigate={handleNavigate}
                    view={view}
                    onView={handleViewChange}
                    views={views}
                    messages={messages}
                    popup
                    agendaTimeAccessor={agendaTimeAccessor}
                    agendaTimeFormat="MM/DD/YYYY"
                    agendaTimeRangeFormat={({ start }) => {
                      return moment(start).format("MMMM D, YYYY");
                    }}
                    eventPropGetter={eventStyleGetter}
                    components={{
                      event: EventComponent,
                      agenda: {
                        event: AgendaEvent,
                      },
                    }}
                    style={{
                      height: "100%",
                    }}
                    length={365}
                    formats={{
                      eventTimeRangeFormat: () => "", // Hide time range for all-day events
                      agendaTimeRangeFormat: ({ start }) => {
                        return moment(start).format("MMMM D, YYYY");
                      },
                    }}
                  />
                </div>
                <Legend />
                {/* <Tabs
                  aria-label="Schedule OH"
                  classNames={{
                    cursor: "w-full bg-[#1C9EB6]",
                    tabContent: "group-data-[selected=true]:text-white",
                  }}
                  defaultSelectedKey={"square"}
                >
                  <Tab
                    key="list"
                    title={
                      <div className="flex items-center space-x-2">
                        <CalendarRange />
                        <span>List</span>
                      </div>
                    }
                  ></Tab>
                  <Tab
                    key="square"
                    title={
                      <div className="flex items-center space-x-2">
                        <CalendarDays />
                        <span>Square</span>
                      </div>
                    }
                  >
                    <div className={`w-full flex items-center justify-center`}>
                      <RangeCalendar
                        calendarWidth={256}
                        visibleMonths={3}
                        value={value}
                        isReadOnly
                      />
                    </div>
                  </Tab>
                </Tabs> */}
              </ModalBody>
              <ModalFooter></ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
