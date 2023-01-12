import React, {useEffect, useState, useCallback} from "react";

import {Row, Col, Select} from "antd";
import SummaryItem from "../../components/widgets/cards/statistics/summaryItem";
import ApiHelper from "../../../utils/ApiHelper";
import RevenueItem from "./RevenueItem";
import CommissionItem from "./CommissionItem";

const {Option} = Select;

export default function SummaryNFT() {

    const [revenueData, setRevenueData] = useState([]);
    const [commissionData, setCommissionData] = useState([]);
    const [type, setType] = useState("7days");

    useEffect(() => {
        getData(type);
    }, [type]);

    const getData = async (type) => {
        const req1 = ApiHelper().get("/reports/revenue-data", {
            params: {
                type
            }
        });
        const req2 = ApiHelper().get("/reports/commission-data", {
            params: {
                type
            }
        });

        const [res1, res2] = await Promise.all([req1, req2]);
        console.log(res1.data, res2.data);
        setRevenueData(res1.data.data);
        setCommissionData(res2.data.data);
    };

    return (
        <>
            <Row align="middle" justify="space-between" style={{marginBottom: 13}}>
                <Col span={12}>
                    <span className="h3 hp-text-color-black-100 hp-text-color-dark-0">Báo cáo</span>
                </Col>

                <Col>
                    <Select defaultValue={type} value={type} onChange={(val) => {
                        setType(val);
                    }}>
                        <Option value="7days">7 ngày</Option>
                        <Option value="14days">14 ngày</Option>
                        <Option value="30days">30 ngày</Option>
                        <Option value="month">3 tháng</Option>
                    </Select>
                </Col>
            </Row>
            <Row gutter={[32, 32]}>
                <Col md={12} xs={24}>
                    <RevenueItem data={revenueData}/>
                </Col>

                <Col md={12} span={24}>
                    <CommissionItem data={commissionData}/>
                </Col>
            </Row>
        </>
    );
}
