import React, {useState} from "react";
import {Button, message, Spin, Table} from "antd";
import ApiHelper from "../../../utils/ApiHelper";
import {formatNumber} from "../../../utils/StringHelper";
import moment from "moment";

const MemberTransactionTable = ({userId}) => {

    const [currentQuery, setCurrentQuery] = useState({
        id: undefined,
        appointmentId: undefined,
        orderId: undefined,
        status: undefined,
        type: undefined,
        createdAt: undefined,
        updatedAt: undefined,
    });
    const [loading, setLoading] = useState(false);
    const [dataList, setDataList] = useState({
        data: [],
        pagination: {
            page: 1,
            limit: 20
        }
    });

    const searchModels = async (page, query) => {
        try {
            setLoading(true);
            console.log(query);
            //Preload query
            const formatQuery = {
                id: query.id,
                fromUser: userId,
                page
            };
            console.log(formatQuery);
            const res = await ApiHelper().get("/transactions/logs", {
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

    const onChangePage = async (page) => {
        await searchModels(page, currentQuery);
    };

    const columns = [
        {
            key: "id",
            title: "Mã",
            dataIndex: "id",
            render: (text) => <Button onClick={() => onOpenDetail(text)} type="link">#{text}</Button>,
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

    return <Spin spinning={loading}>
        <h5>Đơn hàng gần đây</h5>
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
    </Spin>
};

export default MemberTransactionTable;