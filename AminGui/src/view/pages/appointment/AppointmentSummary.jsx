import {Col, Row, Space, Table} from "antd";
import React from "react";
import FeatureCard from "../../components/widgets/cards/advance/FeatureCard";
import {ArrowUp, Discount, People, TimeCircle} from "react-iconly";

const AppointmentSummary = () => {
    return <Row gutter={[16, {xs: 8, sm: 16, md: 24, lg: 32}]}>
        <Col sm={6} span={12}>
            <FeatureCard
                icon={<ArrowUp className="hp-text-color-primary-1 hp-text-color-dark-primary-2 remix-icon"/>}
                numberPrimary={`--`}
                numberSecondary={`VND`}
                title={"DT chốt (Tháng)"}
            />
        </Col>
        <Col sm={6} span={12}>
            <FeatureCard
                icon={<Discount className="hp-text-color-primary-1 hp-text-color-dark-primary-2 remix-icon"/>}
                numberPrimary={`--`}
                numberSecondary={`VND`}
                title={"HH chốt (Tháng)"}
            />
        </Col>
        <Col sm={6} span={12}>
            <FeatureCard
                icon={<People className="hp-text-color-primary-1 hp-text-color-dark-primary-2 remix-icon"/>}
                numberPrimary={`--`}
                numberSecondary={`liên hệ`}
                title={"Chờ xử lý"}
            />
        </Col>
        <Col sm={6} span={12}>
            <FeatureCard
                icon={<TimeCircle className="hp-text-color-primary-1 hp-text-color-dark-primary-2 remix-icon"/>}
                numberPrimary={`--`}
                numberSecondary={`VND`}
                title={"HH Chờ xử lý"}
            />
        </Col>
    </Row>
};

export default AppointmentSummary;