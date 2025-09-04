import { Button, Card, message } from "antd";
import { CopyOutlined, EditOutlined } from "@ant-design/icons";
import { useState } from "react";
import ShiftAndCoDriverEditModal from "./ShiftAndCoDriverEditModal";

interface ShiftDataTabProps {
  recordTask?: any;
}

const ShiftDataTab: React.FC<ShiftDataTabProps> = ({ recordTask }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const shiftInfo = {
    shiftDate: recordTask?.shift_date,
    shiftLocation: recordTask?.shift_location ?? null,
    cycleDate: recordTask?.cycle_date,
    cycleLocation: recordTask?.cycle_location ?? null,
    pickUpDate: recordTask?.pickup_date,
    pickUpTime: recordTask?.pickup_time,
    pickUpLocation: recordTask?.pickup_location ?? null,
  };

  const coDriverInfo = {
    driverName: recordTask?.driver_name ?? null,
    coDriverName: recordTask?.co_driver_name ?? null,
    coDriverPickUpDate: recordTask?.co_driver_pickup_date,
    coDriverPickUpTime: recordTask?.co_driver_pickup_time,
    coDriverPickUpLocation: recordTask?.co_driver_pickup_location ?? null,
    coDriverDropDate: recordTask?.co_driver_drop_date,
    coDriverDropTime: recordTask?.co_driver_drop_time,
    coDriverDropLocation: recordTask?.co_driver_drop_location ?? null,
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
        buildTextBlock("SHIFT INFO ❗️❗️❗️", [
          ["Shift Date", shiftInfo.shiftDate],
          ["Shift Location", shiftInfo.shiftLocation],
          ["Cycle Date", shiftInfo.cycleDate],
          ["Cycle Location", shiftInfo.cycleLocation],
          ["Pick up Date", shiftInfo.pickUpDate],
          ["Pick up Time", shiftInfo.pickUpTime],
          ["Pick Up Location", shiftInfo.pickUpLocation],
        ]),
        buildTextBlock("CO DRIVER INFO", [
          ["Driver's name", coDriverInfo.driverName],
          ["Co-Driver's name", coDriverInfo.coDriverName],
          ["Co-driver pickup date", coDriverInfo.coDriverPickUpDate],
          ["Co-driver pickup time", coDriverInfo.coDriverPickUpTime],
          ["Co-driver pickup location", coDriverInfo.coDriverPickUpLocation],
          ["Co-driver drop date", coDriverInfo.coDriverDropDate],
          ["Co-driver drop time", coDriverInfo.coDriverDropDate],
          ["Co-driver drop location", coDriverInfo.coDriverDropLocation],
        ]),
      ]
        .filter(Boolean)
        .join("\n\n");
    } else {
      text = [
        buildTextBlock("ИНФОРМАЦИЯ О СМЕНЕ ❗️❗️❗️", [
          ["Дата шифта", shiftInfo.shiftDate],
          ["Место шифта", shiftInfo.shiftLocation],
          ["Дата сайкла", shiftInfo.cycleDate],
          ["Место сайкла", shiftInfo.cycleLocation],
          ["Дата пикапа", shiftInfo.pickUpDate],
          ["Время пикапа", shiftInfo.pickUpTime],
          ["Место пикапа", shiftInfo.pickUpLocation],
        ]),
        buildTextBlock("ИНФОРМАЦИЯ О КО-ДРАЙВЕРЕ", [
          ["Имя драйвера", coDriverInfo.driverName],
          ["Имя ко-драйвера", coDriverInfo.coDriverName],
          ["Дата пикапа ко-драйвера", coDriverInfo.coDriverPickUpDate],
          ["Время пикапа ко-драйвера", coDriverInfo.coDriverPickUpTime],
          ["Место пикапа ко-драйвера", coDriverInfo.coDriverPickUpLocation],
          ["Дата высадки ко-драйвера", coDriverInfo.coDriverDropDate],
          ["Время высадки ко-драйвера", coDriverInfo.coDriverDropTime],
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
        <h4>SHIFT INFO ❗️❗️❗️</h4>
        <p>Shift Date: {shiftInfo.shiftDate}</p>
        <p>Shift Location: {shiftInfo.shiftLocation}</p>
        <p>Cycle Date: {shiftInfo.cycleDate}</p>
        <p>Cycle Location: {shiftInfo.cycleLocation}</p>
        <p>Pick up Date: {shiftInfo.pickUpDate}</p>
        <p>Pick up Time: {shiftInfo.pickUpTime}</p>
        <p>Pick Up Location: {shiftInfo.pickUpLocation}</p>

        <h4>CO-DRIVER INFO</h4>
        <p>Driver's name: {coDriverInfo.driverName}</p>
        <p>Co-driver's name: {coDriverInfo.coDriverName}</p>
        <p>Co-driver pickup date: {coDriverInfo.coDriverPickUpDate}</p>
        <p>Co-driver pickup time: {coDriverInfo.coDriverPickUpTime}</p>
        <p>Co-driver pickup location: {coDriverInfo.coDriverPickUpLocation}</p>
        <p>Co-driver drop date: {coDriverInfo.coDriverDropDate}</p>
        <p>Co-driver drop time: {coDriverInfo.coDriverDropTime}</p>
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
        <h4>ИНФОРМАЦИЯ О СМЕНЕ ❗️❗️❗️</h4>
        <p>Дата шифта: {shiftInfo.shiftDate}</p>
        <p>Место шифта: {shiftInfo.shiftLocation}</p>
        <p>Дата сайкла: {shiftInfo.cycleDate}</p>
        <p>Место сайкла: {shiftInfo.cycleLocation}</p>
        <p>Дата пикапа: {shiftInfo.pickUpDate}</p>
        <p>Время пикапа: {shiftInfo.pickUpTime}</p>
        <p>Место пикапа: {shiftInfo.pickUpLocation}</p>

        <h4>ИНФОРМАЦИЯ О КО-ДРАЙВЕРЕ</h4>
        <p>Имя драйвера: {coDriverInfo.driverName}</p>
        <p>Имя ко-драйвера: {coDriverInfo.coDriverName}</p>
        <p>Дата пикапа ко-драйвера: {coDriverInfo.coDriverPickUpDate}</p>
        <p>Время пикапа ко-драйвера: {coDriverInfo.coDriverPickUpTime}</p>
        <p>Место пикапа ко-драйвера: {coDriverInfo.coDriverPickUpLocation}</p>
        <p>Дата высадки ко-драйвера: {coDriverInfo.coDriverDropDate}</p>
        <p>Время высадки ко-драйвера: {coDriverInfo.coDriverDropTime}</p>
        <p>Место высадки ко-драйвера: {coDriverInfo.coDriverDropLocation}</p>
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
