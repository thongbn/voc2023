import React, {useEffect, useState} from "react";
import {Button, Col, Row, Skeleton, Descriptions, Spin, List, Space, Tag, Typography} from "antd";
import {formatDate, formatNumber} from "../../../utils/StringHelper";
import {TRANS_LOG_TYPE, TRANS_PAID_STATUS} from "../../../configs/appConfig";
import {Link} from "react-router-dom";
import ApiHelper, {errorCatch} from "../../../utils/ApiHelper";

const TransactionDetailRelateWidget = ({model, getDetail}) => {

    const [isLoading, setLoading] = useState(false);
    const [data, setData] = useState(null);

    useEffect(async () => {
        await getRelateTrans(model.transactionId);
    }, [
        model
    ]);

    const renderType = (text) => {
        let color = "default";
        let name = text;
        if (TRANS_LOG_TYPE[text]) {
            name = TRANS_LOG_TYPE[text].name;
            color = TRANS_LOG_TYPE[text].color;
        }
        return <Tag color={color}>{name}</Tag>;
    };

    //Update get order detail, relate payment
    const getRelateTrans = async (id) => {
        try {
            setLoading(true);
            const res = await ApiHelper().get(`/transactions/${id}`);
            const {data} = res.data;
            const res2 = await ApiHelper().get(`/transactions/logs?orderId=${data.orderId}`);
            data.logs = res2.data ? res2.data.data : [];
            setData(data);

        } catch (e) {
            errorCatch(e);
        } finally {
            setLoading(false);
        }
    };

    const onClickTransaction = async (id) => {
        if (getDetail) {
            await getDetail(id);
        }
    };

    if (!data) {
        return <Skeleton loading={isLoading} active/>;
    }

    const getRemainMoney = () => {
        let remainTotal = data.totalOrder ? data.totalOrder : 0;
        if (!data.logs) return remainTotal;
        data.logs.forEach(item => {
            remainTotal -= item.total;
            console.log(remainTotal, item);
        });
        remainTotal -= data.selfDiscount;
        return remainTotal;
    };

    return <Spin spinning={isLoading}>
        <Space direction={"vertical"} style={{width: "100%"}}>
            <div>
                <h5>Đơn hàng</h5>
                <Descriptions
                    bordered
                    size={'small'}
                    column={1}
                >
                    <Descriptions.Item label="Mã">
                        #{data.orderId}
                    </Descriptions.Item>
                    <Descriptions.Item label="Sản phẩm">
                        {data.productName}
                    </Descriptions.Item>
                    <Descriptions.Item label="Tổng đơn">
                        {formatNumber(data.totalOrder)} VND
                    </Descriptions.Item>
                    <Descriptions.Item label="Chiết khấu giới thiệu">
                        {data.commission} %
                    </Descriptions.Item>
                    <Descriptions.Item label="Giảm giá">
                        {formatNumber(data.selfDiscount)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Còn lại">
                        {formatNumber(getRemainMoney())} VND
                    </Descriptions.Item>
                </Descriptions>
            </div>
            <div>
                <h5>Thanh toán khác cùng đơn hàng</h5>
                {data.logs && <List size="small"
                                    dataSource={data.logs.filter((item) => item.id !== model.id)}
                                    renderItem={(i, idx) => (
                                        <List.Item key={`subTranLogs${idx}`}>
                                            <Space size="small">
                                                <a onClick={() => onClickTransaction(i.id)}>
                                                    Thanh toán #{i.transactionOpenId}
                                                </a>
                                                {renderType(i.type)}
                                                <small>{formatNumber(i.totalCommission)} VND</small>
                                            </Space>
                                        </List.Item>
                                    )}
                />}
            </div>
        </Space>
    </Spin>;
};

export default TransactionDetailRelateWidget;