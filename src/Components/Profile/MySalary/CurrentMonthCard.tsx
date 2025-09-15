import { Card, Statistic, Row, Col } from "antd";
import dayjs from "dayjs";
import { CurrentMonth } from "../../../types/Profile/TProfile";

type Props = {
  current: CurrentMonth;
};

const CurrentMonthCard: React.FC<Props> = ({ current }) => {
  return (
    <Card>
      <Statistic
        title={
          <span
            style={{
              fontFamily: "Geist Mono",
              fontSize: "12px",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "16px",
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
          fontStyle: "normal",
          fontWeight: 700,
          lineHeight: "28px",
          letterSpacing: "-0.96px",
        }}
      />
      <Row gutter={12} style={{ marginTop: 12 }}>
        <Col span={4}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <span
              style={{
                color: "#9b9daa",
                fontFamily: "Inter",
                fontSize: "14px",
                fontWeight: 500,
                lineHeight: "20px",
              }}
            >
              Bonuses:
            </span>
            <Statistic
              value={current.total_bonuses}
              prefix="+$"
              valueStyle={{
                fontFamily: "Inter",
                fontSize: "14px",
                fontWeight: 500,
              }}
            />
          </div>
        </Col>

        <Col span={4}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              style={{
                color: "#9b9daa",
                fontFamily: "Inter",
                fontSize: "14px",
                fontWeight: 500,
                lineHeight: "20px",
              }}
            >
              Charges:
            </span>
            <Statistic
              value={current.total_charges}
              prefix="-$"
              valueStyle={{
                fontFamily: "Inter",
                fontSize: "14px",
                fontWeight: 500,
              }}
            />
          </div>
        </Col>

        <Col span={4}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              style={{
                color: "#9b9daa",
                fontFamily: "Inter",
                fontSize: "14px",
                fontWeight: 500,
                lineHeight: "20px",
              }}
            >
              Tasks:
            </span>
            <Statistic
              value={current.number_of_tasks}
              valueStyle={{
                fontFamily: "Inter",
                fontSize: "14px",
                fontWeight: 500,
              }}
            />
          </div>
        </Col>

        <Col span={4}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              style={{
                color: "#9b9daa",
                fontFamily: "Inter",
                fontSize: "14px",
                fontWeight: 500,
                lineHeight: "20px",
              }}
            >
              Points:
            </span>
            <Statistic
              value={current.total_points}
              valueStyle={{
                fontFamily: "Inter",
                fontSize: "14px",
                fontWeight: 500,
              }}
            />
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default CurrentMonthCard;
