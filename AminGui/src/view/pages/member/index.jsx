import React, {useEffect, useState} from "react";

import {Row, Col, Card, Button, Spin, Space, Table, Tag, Typography, Modal, message, Form, Tooltip} from "antd";

import ApiHelper, {errorCatch} from "../../../utils/ApiHelper";
import moment from "moment";
import TransactionFilter from "./../transaction/TransactionFilter";
import TransactionDetail from "./../transaction/TransactionDetail";
import ColumnChart from "../../components/widgets/charts/columnChart";
import DonutChart from "../../components/widgets/charts/donutChart";
import {RiMailCheckFill, RiCheckboxCircleFill} from "react-icons/ri";
import MemberFilter from "./MemberFilter";
import {formatDate} from "../../../utils/StringHelper";
import MemberDetail from "./MemberDetail";

const MemberList = () => {
    const [filterForm] = Form.useForm();
    const [currentSelected, setCurrentSelected] = useState(null);
    const [loading, setLoading] = useState(false);
    const [dataList, setDataList] = useState({
        data: [],
        pagination: {
            page: 1,
            limit: 20
        }
    });
    const [currentQuery, setCurrentQuery] = useState({
        id: undefined,
        appointmentId: undefined,
        orderId: undefined,
        status: undefined,
        type: undefined,
        createdAt: undefined,
        updatedAt: undefined,
    });
    const [modalVisible, setModalVisible] = useState(false);

    const columns = [
        {
            key: "id",
            title: "Mã",
            dataIndex: "id",
            render: (text, row) => <Button onClick={() => onOpenDetail(row)} type="link">#{text}</Button>,
        },
        {
            key: "email",
            title: "Tài khoản",
            dataIndex: "email",
            render: (text, row) => {
                return <p>
                    <strong>{`${row.firstName} ${row.lastName}`}</strong>
                    <br/>
                    <small>{text}</small>
                </p>
            },
        },
        {
            key: "phone",
            title: "Số điện thoại",
            dataIndex: "phone",
            render: (text) => <a href={`tel:${text}`}>{text}</a>,
        },
        {
            key: "isActive",
            title: "Trạng thái",
            dataIndex: "isActive",
            render: (text, row) => {
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
            },
        },
        {
            key: "updatedAt",
            title: "Cập nhập",
            dataIndex: "updatedAt",
            render: (text) => {
                return formatDate(text);
            },
        },
    ];

    const onChangePage = async (page) => {
        await searchModels(page, query);
    };

    const onOpenDetail = async (row) => {
        setModalVisible(true);
        try {
            setLoading(true);
            setCurrentSelected(row);
        } catch (e) {
            errorCatch(e);
        } finally {
            setLoading(false);
        }
    };

    const searchModels = async (page, query) => {
        try {
            setLoading(true);
            console.log(query);
            //Preload query
            const formatQuery = {
                id: query.id,
                email: query.appointmentId,
                phone: query.paidStatus,
                page
            };

            console.log(formatQuery);

            const res = await ApiHelper().get("/members", {
                params: formatQuery
            });
            console.log(res.data);
            setDataList(res.data);
            setCurrentQuery(query);
        } catch (e) {
            await message.error(e.message);
        } finally {
            setLoading(false);
        }
    };

    const onFilter = async (values) => {
        await searchModels(1, values);
    };

    useEffect(async () => {
        await searchModels(1, currentQuery);
    }, []);

    return <Spin spinning={loading}>
        <Row gutter={[16, 16]}>
            <Col xs={24} xl={18}>
                <Card title="Thành viên">
                    <Space direction={"vertical"} style={{width: "100%"}}>
                        <MemberFilter form={filterForm} onSubmit={onFilter}/>
                        <Table columns={columns}
                               dataSource={dataList.data}
                               size="small"
                               scroll={{x: 500}}
                               key={"tbl"}
                               pagination={
                                   {
                                       pageSize: dataList.pagination.limit,
                                       current: dataList.pagination.page,
                                       onChange: onChangePage,
                                   }
                               }
                        />
                    </Space>
                </Card>
                <Modal
                    centered
                    title={"Chi tiết"}
                    onCancel={() => {
                        setModalVisible(false);
                        setCurrentSelected(null);
                    }}
                    open={modalVisible}
                    width={1000}
                    key={"md"}
                    footer={[]}
                >
                    <MemberDetail model={currentSelected} loading={loading}/>
                </Modal>
            </Col>
            <Col xs={24} xl={6}>
                <Space direction="vertical" size="small">
                    <Spin spinning={true}>
                        <DonutChart/>
                    </Spin>
                    <Spin spinning={true}>
                        <ColumnChart/>
                    </Spin>
                </Space>
            </Col>
        </Row>

    </Spin>;
};

export default MemberList;
