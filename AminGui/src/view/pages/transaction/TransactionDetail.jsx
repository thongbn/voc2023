import React, {useEffect, useState} from "react";
import {Col, Row, Descriptions, Skeleton, Space, Tag} from "antd";
import {formatDate, formatNumber} from "../../../utils/StringHelper";
import {TRANS_LOG_TYPE, TRANS_PAID_STATUS} from "../../../configs/appConfig";
import TransactionDetailRelateWidget from "./TransactionDetailRelateWidget";
import ApiHelper from "../../../utils/ApiHelper";

const TransactionDetail = ({model, loading}) => {

    const [isLoading, setLoading] = useState(false);
    const [isLoadingRelate, setLoadingRelate] = useState(false);
    const [currentModal, setCurrentModal] = useState(null);

    useEffect(() => {
        setLoading(loading);
    }, [
        loading
    ]);

    useEffect(() => {
        setCurrentModal(model);
        //Update get order detail, relate payment
    }, [
        model
    ]);

    if (isLoading || !currentModal) {
        return <Skeleton active loading={isLoading}/>;
    }

    const {transaction, from, appointment, owner} = currentModal;

    const renderType = (text) => {
        let color = "default";
        let name = text;
        if (TRANS_LOG_TYPE[text]) {
            name = TRANS_LOG_TYPE[text].name;
            color = TRANS_LOG_TYPE[text].color;
        }
        return <Tag color={color}>{name}</Tag>;
    };

    const renderPaidStatus = (val) => {
        let color = "default";
        let name = val;
        if (TRANS_PAID_STATUS[val]) {
            name = TRANS_PAID_STATUS[val].name;
            color = TRANS_PAID_STATUS[val].color;
        }
        return <Tag color={color}>{name}</Tag>;
    };

    const getDetail = async (id) => {
        const res = await ApiHelper().get(`/transactions/log/${id}`);
        const {data} = res.data;
        setCurrentModal(data);
    };

    return <Space direction={"horizontal"} style={{width: "100%"}}>
        <Row gutter={[16,16]}>
            <Col xs={24} md={24}>
                <Descriptions
                    bordered
                    size={'small'}
                    column={2}
                >
                    <Descriptions.Item label="Mã thanh toán">
                        {`#${currentModal.transactionOpenId}`}
                    </Descriptions.Item>
                    <Descriptions.Item label="Lịch hẹn">
                        {appointment ? `#${appointment.id} | ${formatDate(appointment.createdAt)}` : ""}
                    </Descriptions.Item>
                    <Descriptions.Item label="Từ">
                        {from ? `${from.firstName} ${from.lastName}` : ""}
                    </Descriptions.Item>
                    <Descriptions.Item label="Giá trị">
                        <strong>{formatNumber(currentModal.total)} VND</strong>
                    </Descriptions.Item>
                    <Descriptions.Item label="Hoa hồng">
                        <strong>{formatNumber(currentModal.totalCommission)} VND</strong> |
                        ({currentModal.commission} %)
                    </Descriptions.Item>
                    <Descriptions.Item label="Loại">
                        {renderType(currentModal.type)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Xử lý">
                        {renderPaidStatus(currentModal.paidStatus)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Ngày tạo">
                        {formatDate(currentModal.createdAt)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Ngày cập nhập">
                        {formatDate(currentModal.updatedAt)}
                    </Descriptions.Item>
                </Descriptions>
            </Col>
            <Col xs={24} md={24}>
                <TransactionDetailRelateWidget model={currentModal} getDetail={getDetail}/>
            </Col>
        </Row>
    </Space>;
};

export default TransactionDetail;