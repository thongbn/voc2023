import React, {useEffect, useState} from "react";

import {Row, Card, Col, Button, Spin, Space, Table, Tag, Modal, message, Form} from "antd";
import {Link} from "react-router-dom";
import {formatNumber} from "../../../utils/StringHelper";
import ApiHelper, {errorCatch} from "../../../utils/ApiHelper";
import {TRANS_LOG_TYPE, TRANS_PAID_STATUS} from "../../../configs/appConfig";
import moment from "moment";
import TransactionFilter from "./TransactionFilter";
import TransactionDetail from "./TransactionDetail";
import {searchTransactionLogs} from "../../../repository/TransactionRepository";

const TransactionList = ({location}) => {
    const params = new URLSearchParams(location.search);
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
        id: params.get("id"),
        appointmentId: params.get("appointmentId"),
        orderId: params.get("orderId"),
        status: params.get("status"),
        type: params.get("type"),
        page: params.get("page"),
        limit: params.get("limit")
    });

    useEffect(() => {
        filterForm.setFields([
            {
                name: "orderId",
                value: currentQuery.orderId
            },
            {
                name: "status",
                value: currentQuery.status
            },
            {
                name: "type",
                value: currentQuery.type
            },
            {
                name: "appointmentId",
                value: currentQuery.appointmentId
            },
            {
                name: "id",
                value: currentQuery.id
            },
        ]);
    }, []);

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
        if (TRANS_PAID_STATUS[val]) {
            name = TRANS_PAID_STATUS[val].name;
            color = TRANS_PAID_STATUS[val].color;
        }
        return <Tag color={color}>{name}</Tag>;
    };

    const columns = [
        {
            key: "id",
            title: "Mã",
            dataIndex: "id",
            render: (text, row) => <Button onClick={() => onOpenDetail(text)} type="link">
                Thanh toán #{row.transactionOpenId}
            </Button>,
        },
        {
            key: "total",
            title: "Giá trị",
            dataIndex: "total",
            render: (text) => formatNumber(text),
        },
        {
            key: "totalCommission",
            title: "Hoa hồng",
            dataIndex: "totalCommission",
            render: (text, row) => `${formatNumber(text)} (${row.commission}%)`,
        },
        {
            key: "type",
            title: "Loại",
            dataIndex: "type",
            render: (text) => renderType(text),
        },
        {
            key: "paidStatus",
            title: "Xử lý",
            dataIndex: "paidStatus",
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
            const res = await searchTransactionLogs(page, query);
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
        <Card title="Hoa hồng">
            <TransactionFilter form={filterForm} onSubmit={onFilter}/>
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

export default TransactionList;
