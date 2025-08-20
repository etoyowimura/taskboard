import { Button, Card, message } from "antd";
import { CopyOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

interface CopyCardProps {
  recordTask?: any;
}

const CopyCard: React.FC<CopyCardProps> = ({ recordTask }) => {
  const formatDateTime = (date?: string) =>
    date ? dayjs(date).format("DD MMM YYYY HH:mm:ss") : "—";

  const shiftInfo = {
    pickUpDate: formatDateTime(recordTask?.pickup_date) || "—",
    pickUpLocation: recordTask?.pickup_location || "—",
    shiftDate: formatDateTime(recordTask?.shift_date) || "—",
    shiftLocation: recordTask?.shift_location || "—",
    cycleDate: formatDateTime(recordTask?.cycle_date) || "—",
    cycleLocation: recordTask?.cycle_location || "—",
  };

  const coDriverInfo = {
    driverName: recordTask?.driver_name || "—",
    coDriverName: recordTask?.co_driver_name || "—",
    coDriverPickUpLocation: recordTask?.co_driver_pickup_location || "—",
    coDriverPickUpDate:
      formatDateTime(recordTask?.co_driver_pickup_date) || "—",
    coDriverDropLocation: recordTask?.co_driver_drop_location || "—",
    coDriverDropDate: formatDateTime(recordTask?.co_driver_drop_date) || "—",
  };

  const handleCopy = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => message.success("Data copied successfully!"))
      .catch(() => message.error("Failed to copy!"));
  };

  const text = `
SHIFT INFO
Shift Date: ${shiftInfo.shiftDate}
Shift Location: ${shiftInfo.shiftLocation}

Pick up Date: ${shiftInfo.pickUpDate}
Pick Up Location: ${shiftInfo.pickUpLocation}

Cycle Date: ${shiftInfo.cycleDate}
Cycle Location: ${shiftInfo.cycleLocation}


CO DRIVER INFO
Driver's name: ${coDriverInfo.driverName}
Co-Driver's name: ${coDriverInfo.coDriverName}

Co-driver pickup date: ${coDriverInfo.coDriverPickUpDate}
Co-driver pickup location: ${coDriverInfo.coDriverPickUpLocation}

Co-driver drop date: ${coDriverInfo.coDriverDropDate}
Co-driver drop location: ${coDriverInfo.coDriverDropLocation}
  `.trim();

  const textRu = `
ИНФОРМАЦИЯ О СМЕНЕ
Дата пикапа: ${shiftInfo.pickUpDate}
Место пикапа: ${shiftInfo.pickUpLocation}

Дата шифта: ${shiftInfo.shiftDate}
Место шифта: ${shiftInfo.shiftLocation}

Дата сайкла: ${shiftInfo.cycleDate}
Место сайкла: ${shiftInfo.cycleLocation}

ИНФОРМАЦИЯ О СО-ВОДИТЕЛЕ
Имя драйвера: ${coDriverInfo.driverName}
Имя ко-драйвера: ${coDriverInfo.coDriverName}

Время пикапа ко-драйвера: ${coDriverInfo.coDriverPickUpDate}
Место пикапа ко-драйвера: ${coDriverInfo.coDriverPickUpLocation}

Время высадки ко-драйвера: ${coDriverInfo.coDriverDropDate}
Место высадки ко-драйвера: ${coDriverInfo.coDriverDropLocation}
  `.trim();

  return (
    <>
      <Card
        title="Shift & Co-Driver Info"
        extra={
          <Button icon={<CopyOutlined />} onClick={() => handleCopy(text)}>
            Copy
          </Button>
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
          <Button icon={<CopyOutlined />} onClick={() => handleCopy(textRu)}>
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
        <p>Время пикапа ко-драйвера {coDriverInfo.coDriverPickUpDate}</p>
        <p>Место высадки ко-драйвера:{coDriverInfo.coDriverDropLocation}</p>
        <p>Время высадки ко-драйвера: {coDriverInfo.coDriverDropDate}</p>
      </Card>
    </>
  );
};

export default CopyCard;
