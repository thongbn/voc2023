import React from "react";

import {Row, Col, Button} from "antd";

import cardBg2 from "../../../assets/images/dasboard/nft-card-bg-2.png";

export default function OwnNFT() {
    return (
        <div className="hp-position-relative hp-bg-primary-1 hp-p-32 hp-border-radius-xxl hp-card-1 hp-overflow-hidden">
            <div
                className="hp-position-absolute-top-left hp-w-100 hp-h-100 hp-nft-dashboard-own-nft-bg"
                style={{
                    backgroundImage: "url(" + cardBg2 + ")",
                    backgroundSize: "cover",
                    backgroundPosition: "center right"
                }}
            />

            <Row align="middle" justify="space-between">
                <Col md={12} span={24} style={{backgroundColor: "rgba(0,0,0,0.5)", padding: "5px"}}>
                    <span className="h4 hp-text-color-black-0 hp-mb-10 hp-d-block">Khuyễn mại cho khách hàng tên Huy</span>

                    <p className="hp-p1-body hp-mb-0 hp-text-color-black-0">Ngày kết thúc: 15/09/2022</p>
                </Col>

                <Col className="hp-mt-sm-24">
                    <Button type="primary" className="hp-bg-black-0 hp-text-color-primary-1 hp-border-none">Chi tiết</Button>
                </Col>
            </Row>
        </div>
    );
}