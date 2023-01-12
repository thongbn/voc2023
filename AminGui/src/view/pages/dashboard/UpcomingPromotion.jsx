import React, {useState} from "react";

import {useSelector} from "react-redux";

import {Row, Col, Avatar, Card, Button} from "antd";
import cardCircleBg from "../../../assets/images/dasboard/nft-card-circle-bg.svg";
import {Link} from "react-router-dom";

const UpcomingPromotion = (props) => {

    const {cardBg, shortDescription, commissionValue, startTime, linkTo} = props;

    // Theme
    const theme = useSelector(state => state.customise.theme);

    // Wish Check
    const [wishCheck, setWishCheck] = useState(false);

    return (
        <Card
            className="hp-border--xxl hp-overflow-hidden hp-card-3 hp-border-1 hp-border-color-black-40 hp-border-color-dark-80">
            {
                theme === "dark" && (
                    <div
                        className="hp-position-absolute-top-left hp-w-100 hp-h-100 hp-nft-dashboard-bid-card-dark-image"
                        style={{
                            backgroundImage: "url(" + cardCircleBg + ")",
                            backgroundSize: "cover",
                            backgroundPosition: "center right"
                        }}
                    />
                )
            }

            <div
                className="hp-position-relative hp-border-radius-xxl hp-nft-dashboard-bid-card-image"
                style={{
                    backgroundImage: "url(" + cardBg + ")",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    height: 168
                }}
            >
                <div className="hp-position-absolute-bottom-left hp-w-100 hp-py-10 hp-px-16" style={{backgroundColor: "rgba(0,0,0,0.3)"}}>
                    <Row align="middle" justify="space-between">
                        <Col md={18} span={24}>
                          <span className="h4 hp-text-color-black-0 hp-text-overflow-ellipsis">
                              {shortDescription}
                          </span>
                        </Col>
                    </Row>
                </div>
            </div>

            <Row align="bottom" justify="space-between" className="hp-mt-8">
                <Col>
                    <Row>
                        <Col className="hp-pr-64 hp-pr-sm-16">
                            <span
                                className="hp-d-block hp-w-100 hp-caption hp-text-color-black-80 hp-text-color-dark-20">Tỷ lệ Hoa hồng</span>

                            <div className="hp-d-flex-center hp-mb-4">
                                <span
                                    className="h5 hp-text-color-primary-1 hp-text-color-dark-primary-2 hp-font-weight-500 hp-mr-6">
                                    {commissionValue} %
                                </span>
                            </div>
                        </Col>

                        <Col>
                            <span
                                className="hp-d-block hp-w-100 hp-caption hp-text-color-black-80 hp-text-color-dark-20 hp-mb-4">
                                Ngày bắt đầu
                            </span>

                            <Row>
                                <Col>
                                    <span
                                        className="h4 hp-text-color-primary-1 hp-text-color-dark-primary-2 hp-font-weight-500 hp-mb-8">
                                        {startTime}
                                    </span>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Col>

                <Col className="hp-mt-sm-24">
                    <Row gutter={[16, 16]}>
                        <Col>
                            <Link to={linkTo}>
                                <Button type="primary" ghost className="hp-border-radius-full">Chi tiết</Button>
                            </Link>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Card>
    );
};

export default UpcomingPromotion;