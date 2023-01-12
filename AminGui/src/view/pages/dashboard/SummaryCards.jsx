import React, {memo, useEffect, useState} from "react";

import {useSelector} from "react-redux";

import {Row, Col, message} from "antd";

import FeatureCard from "../../components/widgets/cards/advance/FeatureCard";
import {ArrowUp, Discount, People, Scan} from "react-iconly";
import ApiHelper from "../../../utils/ApiHelper";
import {formatNumber} from "../../../utils/StringHelper";

const SummaryCards = () => {
    const [data, setData] = useState({
        totalOrder: 0,
        totalCommission: 0,
        totalMember: 0,
        totalChildrenCommission: 0
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        try {
            setLoading(true);
            const res = await ApiHelper().get("/reports/summary-data");
            setData(res.data);
        } catch (e) {
            await message.error(e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Row align="middle" justify="space-between" className="hp-mb-24" gutter={[16, 16]}>
                <Col md={17} span={12}>
                    <span className="h3 hp-text-color-black-100 hp-text-color-dark-0">Tổng quan</span>
                </Col>
                <Col xs={24}>
                    <FeatureCard
                        icon={<ArrowUp className="hp-text-color-primary-1 hp-text-color-dark-primary-2 remix-icon"/>}
                        numberPrimary={`${loading ? "--" : formatNumber(data.totalOrder)}`}
                        numberSecondary={`VND`}
                        title={"Doanh thu (tháng)"}
                    />
                </Col>
                <Col xs={24}>
                    <FeatureCard
                        icon={<Discount className="hp-text-color-primary-1 hp-text-color-dark-primary-2 remix-icon"/>}
                        numberPrimary={`${loading ? "--" : formatNumber(data.totalCommission)}`}
                        numberSecondary={`VND`}
                        title={"Hoa hồng (tháng)"}
                    />
                </Col>
                <Col xs={24}>
                    <FeatureCard
                        icon={<People className="hp-text-color-primary-1 hp-text-color-dark-primary-2 remix-icon"/>}
                        numberPrimary={`${loading ? "--" : formatNumber(data.totalMember)}`}
                        numberSecondary={`Thành viên`}
                        title={"Tổng thành viên"}
                    />
                </Col>
                <Col xs={24}>
                    <FeatureCard
                        icon={<Scan className="hp-text-color-primary-1 hp-text-color-dark-primary-2 remix-icon"/>}
                        numberPrimary={`${loading ? "--" : formatNumber(data.totalChildrenCommission)}`}
                        numberSecondary={`VND`}
                        title={"Hoa hồng (Thành viên)"}
                    />
                </Col>
            </Row>
        </>
    );
};

export default memo(SummaryCards);
