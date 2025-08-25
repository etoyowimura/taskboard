import { Button, Card, message } from "antd";
import { CopyOutlined, EditOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useState } from "react";
import ShiftAndCoDriverEditModal from "./ShiftAndCoDriverEditModal";

interface ShiftDataTabProps {
  recordTask?: any;
}

const ShiftDataTab: React.FC<ShiftDataTabProps> = ({ recordTask }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatDateTime = (date?: string) =>
    date ? dayjs(date).format("MM-DD-YYYY hh:mm:ss A") : null;

  const displayValue = (val?: string | null) => val ?? "—";

  const shiftInfo = {
    pickUpDate: formatDateTime(recordTask?.pickup_date),
    pickUpLocation: recordTask?.pickup_location ?? null,
    shiftDate: formatDateTime(recordTask?.shift_date),
    shiftLocation: recordTask?.shift_location ?? null,
    cycleDate: formatDateTime(recordTask?.cycle_date),
    cycleLocation: recordTask?.cycle_location ?? null,
  };

  const coDriverInfo = {
    driverName: recordTask?.driver_name ?? null,
    coDriverName: recordTask?.co_driver_name ?? null,
    coDriverPickUpLocation: recordTask?.co_driver_pickup_location ?? null,
    coDriverPickUpDate: formatDateTime(recordTask?.co_driver_pickup_date),
    coDriverDropLocation: recordTask?.co_driver_drop_location ?? null,
    coDriverDropDate: formatDateTime(recordTask?.co_driver_drop_date),
  };

  const buildTextBlock = (title: string, items: [string, string | null][]) => {
    const lines = items
      .filter(([, value]) => value)
      .map(([label, value]) => `${label}: ${value}`);
    return lines.length ? `${title}\n${lines.join("\n")}` : "";
  };

  const handleCopy = (lang: "en" | "ru") => {
    let text = "";

    if (lang === "en") {
      text = [
        buildTextBlock("SHIFT INFO", [
          ["Shift Date", shiftInfo.shiftDate],
          ["Shift Location", shiftInfo.shiftLocation],
          ["Pick up Date", shiftInfo.pickUpDate],
          ["Pick Up Location", shiftInfo.pickUpLocation],
          ["Cycle Date", shiftInfo.cycleDate],
          ["Cycle Location", shiftInfo.cycleLocation],
        ]),
        buildTextBlock("CO DRIVER INFO", [
          ["Driver's name", coDriverInfo.driverName],
          ["Co-Driver's name", coDriverInfo.coDriverName],
          ["Co-driver pickup date", coDriverInfo.coDriverPickUpDate],
          ["Co-driver pickup location", coDriverInfo.coDriverPickUpLocation],
          ["Co-driver drop date", coDriverInfo.coDriverDropDate],
          ["Co-driver drop location", coDriverInfo.coDriverDropLocation],
        ]),
      ]
        .filter(Boolean)
        .join("\n\n");
    } else {
      text = [
        buildTextBlock("ИНФОРМАЦИЯ О СМЕНЕ", [
          ["Дата пикапа", shiftInfo.pickUpDate],
          ["Место пикапа", shiftInfo.pickUpLocation],
          ["Дата шифта", shiftInfo.shiftDate],
          ["Место шифта", shiftInfo.shiftLocation],
          ["Дата сайкла", shiftInfo.cycleDate],
          ["Место сайкла", shiftInfo.cycleLocation],
        ]),
        buildTextBlock("ИНФОРМАЦИЯ О СО-ВОДИТЕЛЕ", [
          ["Имя драйвера", coDriverInfo.driverName],
          ["Имя ко-драйвера", coDriverInfo.coDriverName],
          ["Время пикапа ко-драйвера", coDriverInfo.coDriverPickUpDate],
          ["Место пикапа ко-драйвера", coDriverInfo.coDriverPickUpLocation],
          ["Время высадки ко-драйвера", coDriverInfo.coDriverDropDate],
          ["Место высадки ко-драйвера", coDriverInfo.coDriverDropLocation],
        ]),
      ]
        .filter(Boolean)
        .join("\n\n");
    }

    if (!text) {
      message.warning("Nothing to copy!");
      return;
    }

    navigator.clipboard
      .writeText(text)
      .then(() => message.success("Data copied successfully!"))
      .catch(() => message.error("Failed to copy!"));
  };

  return (
    <>
      <Card
        title="Shift & Co-Driver Information"
        extra={
          <>
            <Button
              style={{ marginRight: 5 }}
              icon={<EditOutlined />}
              onClick={() => setIsModalOpen(true)}
            >
              Edit
            </Button>

            <Button icon={<CopyOutlined />} onClick={() => handleCopy("en")}>
              Copy
            </Button>
          </>
        }
        style={{ width: "100%", marginBottom: 20 }}
      >
        <h4>SHIFT INFO</h4>
        <p>Shift Date: {shiftInfo.shiftDate}</p>
        <p>Shift Location: {shiftInfo.shiftLocation}</p>
        <p>Pick up Date: {shiftInfo.pickUpDate}</p>
        <p>Pick Up Location: {shiftInfo.pickUpLocation}</p>
        <p>Cycle Date: {shiftInfo.cycleDate}</p>
        <p>Cycle Location: {shiftInfo.cycleLocation}</p>

        <h4>CO-DRIVER INFO</h4>
        <p>Driver's name: {coDriverInfo.driverName}</p>
        <p>Co-driver's name: {coDriverInfo.coDriverName}</p>
        <p>Co-driver pickup date: {coDriverInfo.coDriverPickUpDate}</p>
        <p>Co-driver pickup location: {coDriverInfo.coDriverPickUpLocation}</p>
        <p>Co-driver drop date: {coDriverInfo.coDriverDropDate}</p>
        <p>Co-driver drop location: {coDriverInfo.coDriverDropLocation}</p>
      </Card>

      <Card
        title="Информация о смене"
        extra={
          <Button icon={<CopyOutlined />} onClick={() => handleCopy("ru")}>
            Copy
          </Button>
        }
        style={{ width: "100%" }}
      >
        <h4>ИНФОРМАЦИЯ О СМЕНЕ</h4>
        <p>Дата шифта: {shiftInfo.shiftDate}</p>
        <p>Место шифта: {shiftInfo.shiftLocation}</p>
        <p>Дата сайкла: {shiftInfo.cycleDate}</p>
        <p>Место сайкла: {shiftInfo.cycleLocation}</p>
        <p>Дата пикапа: {shiftInfo.pickUpDate}</p>
        <p>Место пикапа: {shiftInfo.pickUpLocation}</p>

        <h4>ИНФОРМАЦИЯ О СО-ВОДИТЕЛЕ</h4>
        <p>Имя драйвера: {coDriverInfo.driverName}</p>
        <p>Имя ко-драйвера: {coDriverInfo.coDriverName}</p>
        <p>Место пикапа ко-драйвера: {coDriverInfo.coDriverPickUpLocation}</p>
        <p>Время пикапа ко-драйвера: {coDriverInfo.coDriverPickUpDate}</p>
        <p>Место высадки ко-драйвера: {coDriverInfo.coDriverDropLocation}</p>
        <p>Время высадки ко-драйвера: {coDriverInfo.coDriverDropDate}</p>
      </Card>

      <ShiftAndCoDriverEditModal
        recordTask={recordTask}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default ShiftDataTab;
