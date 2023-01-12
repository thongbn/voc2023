import React, {useEffect, useState} from "react";

import {useSelector} from "react-redux";

import {Card, Row, Col, Tag, Spin, message, Empty} from "antd";

import {Link} from "react-router-dom";
import ApiHelper from "../../../utils/ApiHelper";
import {searchTransactionLogs} from "../../../repository/TransactionRepository";
import {formatDate, formatNumber} from "../../../utils/StringHelper";
import {TRANS_LOG_TYPE, TRANS_PAID_STATUS} from "../../../configs/appConfig";

export default function RecentActivityNFT() {
    const direction = useSelector(state => state.customise.direction)

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        try {
            setLoading(true);
            const res = await searchTransactionLogs(1);
            setData(res.data.data);
        } catch (e) {
            await message.error(e.message);
        } finally {
            setLoading(false);
        }
    };

    const RenderList = () => {
        if (data.length === 0) {
            return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>;
        }


        return <Row gutter={[16, 16]}>
            {data.map((item, idx) => {
                return <RenderItem item={item} key={`ri-${idx}`}/>
            })}
        </Row>
    };

    const RenderItem = ({item, key}) => {
        return <Col xs={12} md={8} key={key}>
            <div className="site-card-border-less-wrapper">
                <Card bordered={false}>
                    <span className="hp-d-block h5 hp-text-color-black-100 hp-text-color-dark-0">
                    <Link to={`/transactions?orderId=${item.orderId}`}>
                        #{item.transactionOpenId}
                    </Link>
                            <span
                                className="hp-ml-8 hp-caption hp-font-weight-500 hp-text-color-black-60 hp-text-color-dark-40">
                                {formatDate(item.updatedAt, "DD-MM-YYYY")}
                            </span>
                        </span>
                    <p className="hp-p1-body hp-text-overflow-ellipsis hp-text-color-black-80 hp-text-color-dark-20 hp-mb-4"
                       title="Khách hàng: ABC">
                        <strong>Hoa hồng</strong>: {formatNumber(item.total)} VND
                        <br/>
                        <strong>Tỷ lệ</strong>: {formatNumber(item.commission)} %
                    </p>

                    <RenderType val={item.type}/>
                    <RenderPaidStatus val={item.paidStatus}/>
                </Card>
            </div>
        </Col>
    };

    const RenderPaidStatus = ({val}) => {
        let color = "default";
        let name = val;
        if (TRANS_PAID_STATUS[val]) {
            name = TRANS_PAID_STATUS[val].name;
            color = TRANS_PAID_STATUS[val].color;
        }
        return <Tag color={color}>{name}</Tag>;
    };

    const RenderType = ({val}) => {
        let color = "default";
        let name = val;
        if (TRANS_LOG_TYPE[val]) {
            name = TRANS_LOG_TYPE[val].name;
            color = TRANS_LOG_TYPE[val].color;
        }
        return <Tag color={color}>{name}</Tag>;
    };

    return (
        <Spin spinning={loading}>
            <Row align="middle" justify="space-between" className="hp-mb-24">
                <Col span={17}>
                    <span className="h3 hp-text-color-black-100 hp-text-color-dark-0">Hoa hồng</span>
                </Col>

                <Col>
                    <Link to={`/transactions`}>
                        <a className="hp-d-flex-center">
                            <div style={direction === "rtl" ? {transform: "rotate(180deg)"} : {}} className="hp-d-flex">
                                <svg className="hp-fill-dark-20" width="14" height="15" viewBox="0 0 14 15" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M7.00016 0.833374C3.32016 0.833374 0.333496 3.82004 0.333496 7.50004C0.333496 11.18 3.32016 14.1667 7.00016 14.1667C10.6802 14.1667 13.6668 11.18 13.6668 7.50004C13.6668 3.82004 10.6802 0.833374 7.00016 0.833374ZM9.68683 7.85337L7.68683 9.85337C7.58683 9.95337 7.46016 10 7.3335 10C7.20683 10 7.08016 9.95337 6.98016 9.85337C6.78683 9.66004 6.78683 9.34004 6.98016 9.14671L8.12683 8.00004H4.66683C4.3935 8.00004 4.16683 7.77337 4.16683 7.50004C4.16683 7.22671 4.3935 7.00004 4.66683 7.00004H8.12683L6.98016 5.85337C6.78683 5.66004 6.78683 5.34004 6.98016 5.14671C7.1735 4.95337 7.4935 4.95337 7.68683 5.14671L9.68683 7.14671C9.88016 7.34004 9.88016 7.66004 9.68683 7.85337Z"
                                        fill="#292D32"/>
                                </svg>
                            </div>
                        </a>
                    </Link>
                </Col>
            </Row>
            <RenderList/>
        </Spin>
    );
}
