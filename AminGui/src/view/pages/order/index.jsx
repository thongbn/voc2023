import React, {useEffect, useState} from "react";

import {Row, Card, Col, Button, Spin, Space, Table, Tag, Modal, message, Form} from "antd";

import {formatNumber, removeEmptyProperties} from "../../../utils/StringHelper";
import ApiHelper, {errorCatch} from "../../../utils/ApiHelper";
import {ORDER_CONFIRM_STATUS, TRANS_LOG_TYPE} from "../../../configs/appConfig";
import moment from "moment";
import TransactionFilter from "./../transaction/TransactionFilter";
import TransactionDetail from "./../transaction/TransactionDetail";
import OrderFilter from "./OrderFilter";
import {Link} from "react-router-dom";

const OrderList = () => {
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
        console.log(val);
        if (ORDER_CONFIRM_STATUS[val]) {
            name = ORDER_CONFIRM_STATUS[val].name;
            color = ORDER_CONFIRM_STATUS[val].color;
        }
        return <Tag color={color}>{name}</Tag>;
    };

    const columns = [
        {
            key: "id",
            title: "Đơn hàng | Mã TT",
            dataIndex: "transactionId",
            render: (text, row) => (
                <Link to={`/transactions?orderId=${row.orderId}`}>
                    <Button type="link">
                        #{row.orderId} | #{text}
                    </Button>
                </Link>
            )
        },
        {
            key: "total",
            title: "Giá trị thanh toán",
            dataIndex: "total",
            render: (text) => formatNumber(text),
        },
        {
            key: "discount",
            title: "Chiết khấu",
            dataIndex: "selfDiscount",
            render: (text, row) => `${formatNumber(text / row.totalOrder * 100)}%`,
        },
        {
            key: "totalOrder",
            title: "Tổng giá trị",
            dataIndex: "totalOrder",
            render: (text, row) => `${formatNumber(text)}`,
        },
        {
            key: "com",
            title: "Hoa hồng",
            dataIndex: "commission",
            render: (text, row) => `${formatNumber(text)}%`,
        },
        {
            key: "confirmStatus",
            title: "Trạng thái",
            dataIndex: "confirmStatus",
            render: (text) => renderPaidStatus(text),
        },
        {
            key: "updatedAt",
            title: "Cập nhập",
            dataIndex: "updatedAt",
            render: (text) => {
                return moment(text).format("DD/MM/YYYY hh:ss");
            },
        },
    ];

    const onChangePage = async (page) => {
        await searchModels(page, currentQuery);
    };

    const onOpenDetail = async (id) => {
        setModalVisible(true);
        try {
            setLoading(true);
            const res = await ApiHelper().get(`/transactions/log/${id}`);
            const {data} = res.data;
            setCurrentSelected(data);
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
            query = removeEmptyProperties(query);
            //Preload query
            const formatQuery = {
                id: query.id,
                transactionId: query.transactionId,
                orderId: query.orderId,
                confirmStatus: query.confirmStatus,
                page
            };

            const res = await ApiHelper().get("/transactions", {
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
        <Card title="Đơn hàng">
            <OrderFilter form={filterForm} onSubmit={onFilter}/>
            <Table columns={columns}
                   rowKey={row => `tranLog${row.id}`}
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
            <TransactionDetail model={currentSelected} loading={loading}/>
        </Modal>
    </Spin>;
};

export default OrderList;
