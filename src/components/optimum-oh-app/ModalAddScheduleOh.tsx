import { getLocalTimeZone, parseDate } from "@internationalized/date";
import { Button, DatePicker, DateRangePicker, DateValue, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, useDisclosure } from "@nextui-org/react";
import { Crosshair, Database } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useDateFormatter } from "@react-aria/i18n";
import toast from "react-hot-toast";
import { usePostNewOHSchedule } from "@/lib/APIs/mutation/useApiNewOHSchedule";

interface ModalAddScheduleProps {
  mutate: () => void
}

export function ModalAddSchedule({ mutate }: ModalAddScheduleProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const { data: session } = useSession();
  const [selectedScope, setSelectedScope] = useState("");
  const [dateRange, setDateRange] = useState<{
    start: DateValue;
    end: DateValue;
  }>({
    start: parseDate("2024-12-12"),
    end: parseDate("2025-01-01"),
  });

  const { trigger, isLoading, error } = usePostNewOHSchedule(session?.user.access_token)

  // Validation state
  const [errors, setErrors] = useState({
    scope: "",
    dateRange: ""
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      scope: "",
      dateRange: ""
    };

    // Validate scope
    if (!selectedScope) {
      newErrors.scope = "Scope is required";
      isValid = false;
    }

    // Validate date range
    if (!dateRange.start || !dateRange.end) {
      newErrors.dateRange = "Both start and end dates are required";
      isValid = false;
    } else if (dateRange.start > dateRange.end) {
      newErrors.dateRange = "End date must be after start date";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      // Your API call here
      console.log("Form submitted:", {
        scope: selectedScope,
        dateRange
      });

      const result = await trigger({
        token: session?.user.access_token,
        body: {
          scope_id: selectedScope,
          start_date: dateRange.start.toString(),
          end_date: dateRange.end.toString()
        },
      });


      toast.success("Successfully add new schedule")

      setSelectedScope("");
      setDateRange({
        start: parseDate("2024-12-12"),
        end: parseDate("2025-01-01"),
      });
      setErrors({ scope: "", dateRange: "" });
      mutate();
      onOpenChange();
    }
  };

  // Reset everything when modal closes
  const handleModalChange = (open: boolean) => {
    if (!open) {
      setSelectedScope("");
      setDateRange({
        start: parseDate("2024-12-12"),
        end: parseDate("2025-01-01"),
      });
      setErrors({ scope: "", dateRange: "" });
    }
    onOpenChange();
  };


  let formatter = useDateFormatter({ dateStyle: "long" });
  return (
    <>
      <Button
        className={`bg-[#1C9EB6] text-white`}
        startContent={<Database />}
        size={"lg"}
        onPress={() => handleModalChange(true)}
        isLoading={isLoading}
      >
        Add OH Schedule
      </Button>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl" radius="lg">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Add New Schedule
          </ModalHeader>
          <ModalBody>
            <div className="grid grid-cols-1 gap-6">
              {/* Form Container */}
              <div className="grid grid-cols-3 gap-4 items-start">
                {/* Label Column */}
                <div className="self-center">
                  <label className="text-sm font-medium">Scope</label>
                </div>

                {/* Input Column */}
                <div className="col-span-2">
                  <Select
                    size="sm"
                    className="w-full"
                    selectedKeys={[selectedScope]}
                    onChange={(e) => {
                      setSelectedScope(e.target.value);
                      if (errors.scope) setErrors({ ...errors, scope: "" });
                    }}
                    isInvalid={!!errors.scope}
                    errorMessage={errors.scope}
                  >
                    <SelectItem key="A">A</SelectItem>
                    <SelectItem key="B">B</SelectItem>
                  </Select>
                </div>
              </div>

              {/* Date Range Container */}
              <div className="grid grid-cols-3 gap-4 items-start">
                {/* Label Column */}
                <div className="self-center">
                  <label className="text-sm font-medium">OH Schedule</label>
                </div>

                {/* Input Column */}
                <div className="col-span-2 space-y-2">
                  <DateRangePicker
                    className="w-full"
                    value={dateRange}
                    onChange={(value) => {
                      setDateRange(value);
                      if (errors.dateRange) setErrors({ ...errors, dateRange: "" });
                    }}
                    isInvalid={!!errors.dateRange}
                  />
                  {errors.dateRange && (
                    <p className="text-danger text-sm">
                      {errors.dateRange}
                    </p>
                  )}
                  <p className="text-default-500 text-sm">
                    Selected date:{" "}
                    {dateRange
                      ? formatter.formatRange(
                        dateRange.start.toDate(getLocalTimeZone()),
                        dateRange.end.toDate(getLocalTimeZone()),
                      )
                      : "--"}
                  </p>
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              variant="light"
              onPress={onOpenChange}
            >
              Cancel
            </Button>
            <Button
              color="primary"
              onClick={handleSubmit}
              isLoading={isLoading}
            >
              Add Schedule
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}


