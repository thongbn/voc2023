import { Skeleton, Spin, Table } from "antd";
import React, { memo, useEffect, useState } from "react";

const TicketList = ({ query, onChangePage }) => {
    const [loading, setLoading] = useState(false);
    const [dataList, setDataList] = useState({
        data: [],
        pagination: {
            page: 1,
            limit: 20
        }
    });

    useEffect(() => {
        searchModels(query);
    }, [query])

    const columns = [
        {
            key: "type",
            title: "Type",
            dataIndex: "type",
            render: (text) => <p>{text}</p>,
        },
        {
            key: "id",
            title: "Mã",
            dataIndex: "id",
            render: (text, row) => <Button onClick={() => onOpenDetail(row)} type="link">#{text}</Button>,
        },
        {
            key: "message",
            title: "Message",
            dataIndex: "message",
            render: (text, row) => {
                return <p><small>{text}</small></p>
            },
        },
        {
            key: "customer",
            title: "Khách hàng",
            dataIndex: "customer",
            render: (text) => <p>{text}</p>,
        },
        {
            key: "tags",
            title: "Tags",
            dataIndex: "tags",
            render: (text, row) => {
                return <Space></Space>
            },
        },
        {
            key: "status",
            title: "Trạng thái",
            dataIndex: "status",
            render: (text) => <p>{text}</p>,
        },
        {
            key: "createdAt",
            title: "Created",
            dataIndex: "createdAt",
            render: (text) => {
                return formatDate(text);
            },
        },
        {
            key: "updatedAt",
            title: "Updated",
            dataIndex: "updatedAt",
            render: (text) => {
                return formatDate(text);
            },
        },
    ];

    const searchModels = async (query) => {
        try {
            if (query == null) {
                return;
            }
            console.log("Get Ticket", query);
            setLoading(true);
            // console.log(query);
            // //Preload query
            // const formatQuery = {
            //     id: query.id,
            //     email: query.appointmentId,
            //     phone: query.paidStatus,
            //     page
            // };

            // console.log(formatQuery);

            // const res = await ApiHelper().get("/members", {
            //     params: formatQuery
            // });
            // console.log(res.data);
            // setDataList(res.data);
        } catch (e) {
            await message.error(e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Skeleton active={true} loading={loading}>
            <Table columns={columns}
                dataSource={dataList.data}
                size="small"
                scroll={{ x: 500 }}
                key={"tbl"}
                pagination={
                    {
                        pageSize: dataList.pagination.limit,
                        current: dataList.pagination.page,
                        onChange: onChangePage,
                    }
                }
            >
            </Table>
        </Skeleton>
    )
}

export default memo(TicketList);