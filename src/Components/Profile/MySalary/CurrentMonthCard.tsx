import { Card, Statistic, Row, Col } from "antd";
import dayjs from "dayjs";
import { CurrentMonth } from "../../../types/Profile/TProfile";

type Props = {
  current: CurrentMonth;
};

const InfoItem = ({
  label,
  value,
  prefix,
}: {
  label: string;
  value: number;
  prefix?: string;
}) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
    }}
  >
    <span
      style={{
        color: "#9b9daa",
        fontFamily: "Inter",
        fontSize: "14px",
        fontWeight: 500,
        lineHeight: "20px",
      }}
    >
      {label}
    </span>
    <Statistic
      value={value}
      prefix={prefix}
      valueStyle={{
        fontFamily: "Inter",
        fontSize: "14px",
        fontWeight: 500,
      }}
    />
  </div>
);

const CurrentMonthCard: React.FC<Props> = ({ current }) => {
  return (
    <Card>
      <Statistic
        title={
          <span
            style={{
              fontFamily: "Geist Mono",
              fontSize: "12px",
              fontWeight: 400,
              lineHeight: "16px",
              color: "#9b9daa",
            }}
          >
            {`Current month / ${dayjs().format("MMMM")}`}
          </span>
        }
        value={current.salary}
        prefix="$"
        precision={2}
        valueStyle={{
          fontFamily: "Inter",
          fontSize: "24px",
          fontWeight: 700,
          lineHeight: "28px",
          letterSpacing: "-0.96px",
        }}
      />

      <Row gutter={[16, 16]} style={{ marginTop: 12 }}>
        <Col xs={12} sm={12} md={6} lg={6}>
          <InfoItem label="Bonuses" value={current.total_bonuses} prefix="+$" />
        </Col>

        <Col xs={12} sm={12} md={6} lg={6}>
          <InfoItem label="Charges" value={current.total_charges} prefix="-$" />
        </Col>

        <Col xs={12} sm={12} md={6} lg={6}>
          <InfoItem label="Tasks" value={current.number_of_tasks} />
        </Col>

        <Col xs={12} sm={12} md={6} lg={6}>
          <InfoItem label="Points" value={current.total_points} />
        </Col>
      </Row>
    </Card>
  );
};

export default CurrentMonthCard;
