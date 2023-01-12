import React, {useEffect, useState} from "react";
import {Row, Col, Descriptions, Skeleton, Spin, Space, Tag, Typography, Tooltip} from "antd";
import {formatDate, formatNumber} from "../../../utils/StringHelper";
import {RiCheckboxCircleFill, RiMailCheckFill} from "react-icons/ri";
import DonutChart from "../../components/widgets/charts/donutChart";
import MemberTransactionTable from "./MemberTransactionTable";

const MemberDetail = ({model, loading}) => {

    const [isLoading, setLoading] = useState(false);
    const [currentModal, setCurrentModal] = useState(null);

    useEffect(() => {
        setLoading(loading);
    }, [
        loading
    ]);

    useEffect(() => {
        setCurrentModal(model);
    }, [
        model
    ]);

    if (isLoading || !currentModal) {
        return <Skeleton active loading={isLoading}/>;
    }

    const renderStatus = (row) => {
        const emailValidate = row.isEmailValidated ? "success" : "secondary";
        const isActive = row.isActive ? "success" : "secondary";
        return <Space>
            <Typography.Text type={emailValidate}>
                <Tooltip title={"Xác nhận email"}>
                    <RiMailCheckFill/>
                </Tooltip>
            </Typography.Text>
            <Typography.Text type={isActive}>
                <Tooltip title={"Kích hoạt tài khoản"}>
                    <RiCheckboxCircleFill/>
                </Tooltip>
            </Typography.Text>
        </Space>
    };

    return <Row gutter={[16, 16]}>
        <Col xs={24} md={16}>
            <Space style={{width: "100%"}} direction="vertical">
                <Descriptions
                    bordered
                    column={2}
                    size={'small'}
                >
                    <Descriptions.Item label="Mã">
                        {currentModal.id}
                    </Descriptions.Item>
                    <Descriptions.Item label="Họ và tên">
                        {`${currentModal.firstName} ${currentModal.lastName}`}
                    </Descriptions.Item>
                    <Descriptions.Item label="Email">
                        <a href={`mailto: ${currentModal.email}`}>{currentModal.email}</a>
                    </Descriptions.Item>
                    <Descriptions.Item label="Số điện thoại">
                        <a href={`tel: ${currentModal.phone}`}>{currentModal.phone}</a>
                    </Descriptions.Item>
                    <Descriptions.Item label="Kích hoạt">
                        <strong>{renderStatus(currentModal)}</strong>
                    </Descriptions.Item>
                    <Descriptions.Item label="Ngày cập nhập">
                        {formatDate(currentModal.updatedAt)}
                    </Descriptions.Item>
                </Descriptions>
                <MemberTransactionTable/>
            </Space>
        </Col>
        <Col xs={24} md={8}>
            <Spin spinning={true}>
                <DonutChart/>
            </Spin>
        </Col>
    </Row>;
};

export default MemberDetail;