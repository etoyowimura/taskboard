import { Row, Col } from "antd";
import { Total } from "../../../types/Profile/TProfile";

type Props = {
  total: Total;
};

const Item = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div style={{ display: "flex", flexDirection: "column", rowGap: 4 }}>
    <span
      style={{
        fontFamily: "Geist Mono",
        fontSize: "12px",
        fontWeight: 400,
        lineHeight: "16px",
        color: "#9B9DAA",
      }}
    >
      {label}
    </span>
    <span
      style={{
        fontFamily: "Inter",
        fontSize: "14px",
        fontWeight: 600,
        lineHeight: "20px",
        letterSpacing: "-0.14px",
      }}
    >
      {value}
    </span>
  </div>
);

const TotalStatistics: React.FC<Props> = ({ total }) => {
  return (
    <Row gutter={[16, 16]}>
      <Col xs={12} sm={12} md={8} lg={4}>
        <Item label="Total salary" value={`$${total.total_earned_salary}`} />
      </Col>

      <Col xs={12} sm={12} md={8} lg={4}>
        <Item label="Total bonuses" value={`+$${total.total_bonuses}`} />
      </Col>

      <Col xs={12} sm={12} md={8} lg={4}>
        <Item label="Total charges" value={`-$${total.total_charges}`} />
      </Col>

      <Col xs={12} sm={12} md={8} lg={4}>
        <Item label="Total tasks" value={total.total_number_of_tasks} />
      </Col>

      <Col xs={12} sm={12} md={8} lg={4}>
        <Item label="Total points" value={total.total_earned_points} />
      </Col>
    </Row>
  );
};

export default TotalStatistics;
