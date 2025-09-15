import { Row, Col, Statistic } from "antd";
import { Total } from "../../../types/Profile/TProfile";

type Props = {
  total: Total;
};

const TotalStatistics: React.FC<Props> = ({ total }) => {
  return (
    <Row gutter={16}>
      <Col span={4}>
        <div style={{ display: "flex", flexDirection: "column", rowGap: 4 }}>
          <span
            style={{
              fontFamily: "Geist Mono",
              fontSize: "12px",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "16px",
              color: "#9B9DAA",
            }}
          >
            Total salary
          </span>
          <span
            style={{
              fontFamily: "Inter",
              fontSize: "14px",
              fontStyle: "normal",
              fontWeight: 600,
              lineHeight: "20px",
              letterSpacing: "-0.14px",
            }}
          >
            ${total.total_earned_salary}
          </span>
        </div>
      </Col>

      <Col span={4}>
        <div style={{ display: "flex", flexDirection: "column", rowGap: 4 }}>
          <span
            style={{
              fontFamily: "Geist Mono",
              fontSize: "12px",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "16px",
              color: " #9B9DAA",
            }}
          >
            Total bonuses
          </span>
          <span
            style={{
              fontFamily: "Inter",
              fontSize: "14px",
              fontStyle: "normal",
              fontWeight: 600,
              lineHeight: "20px",
              letterSpacing: "-0.14px",
            }}
          >
            +${total.total_bonuses}
          </span>
        </div>
      </Col>

      <Col span={4}>
        <div style={{ display: "flex", flexDirection: "column", rowGap: 4 }}>
          <span
            style={{
              fontFamily: "Geist Mono",
              fontSize: "12px",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "16px",
              color: "#9B9DAA",
            }}
          >
            Total charges
          </span>
          <span
            style={{
              fontFamily: "Inter",
              fontSize: "14px",
              fontStyle: "normal",
              fontWeight: 600,
              lineHeight: "20px",
              letterSpacing: "-0.14px",
            }}
          >
            -${total.total_charges}
          </span>
        </div>
      </Col>

      <Col span={4}>
        <div style={{ display: "flex", flexDirection: "column", rowGap: 4 }}>
          <span
            style={{
              fontFamily: "Geist Mono",
              fontSize: "12px",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "16px",
              color: "#9B9DAA",
            }}
          >
            Total tasks
          </span>
          <span
            style={{
              fontFamily: "Inter",
              fontSize: "14px",
              fontStyle: "normal",
              fontWeight: 600,
              lineHeight: "20px",
              letterSpacing: "-0.14px",
            }}
          >
            {total.total_number_of_tasks}
          </span>
        </div>
      </Col>

      <Col span={4}>
        <div style={{ display: "flex", flexDirection: "column", rowGap: 4 }}>
          <span
            style={{
              fontFamily: "Geist Mono",
              fontSize: "12px",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "16px",
              color: "#9B9DAA",
            }}
          >
            Total points
          </span>
          <span
            style={{
              fontFamily: "Inter",
              fontSize: "14px",
              fontStyle: "normal",
              fontWeight: 600,
              lineHeight: "20px",
              letterSpacing: "-0.14px",
            }}
          >
            {total.total_earned_points}
          </span>
        </div>
      </Col>
    </Row>
  );
};

export default TotalStatistics;
