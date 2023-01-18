import {message, Button, Skeleton, Table, Space, Typography} from "antd";
import React, {memo, useEffect, useState} from "react";
import moment from "moment";
import ApiHelper from "../../../utils/ApiHelper";
import {useHistory} from 'react-router-dom';
import {formatDate} from "../../../utils/StringHelper";
import {renderPlatformIcon} from "../../../utils/AppRenderHelper";
import qs from 'qs';

const {Paragraph, Link} = Typography;

const TicketList = ({query, onChangePage}) => {
    const history = useHistory();
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
    }, [query]);

    const onOpenDetail = (id) => {
        history.push(`/case/${id}`);
    };

    const columns = [
        {
            key: "platform",
            title: "Platform",
            dataIndex: "platform",
            render: (text, row) => <Typography.Text>
                <Link onClick={() => onOpenDetail(row.id)}>#{row.id}</Link> {renderPlatformIcon(text)} {row.type}
            </Typography.Text>,
        },
        {
            key: "firstMessage",
            title: "Message",
            dataIndex: "firstMessage",
            render: (text, row) => {
                return (
                    <Typography>
                        <Paragraph>
                            {text}
                        </Paragraph>
                    </Typography>
                )
            },
        },
        {
            key: "caseStatus",
            title: "Trạng thái",
            dataIndex: "caseStatus",
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
            console.log(query);
            // //Preload query
            const formatQuery = {
                id: query.id || null,
                platform: query.platform || null,
                customerId: query.customerId || null,
                createdAt: query.createdAt ?
                    `between: ${moment(query.createdAt).format('YYYY-MM-DD 00:00:00')},${moment(query.createdAt).format('YYYY-MM-DD 23:59:59')}`
                    : null,
                tags: query.tags ? `in:${query.tags.join(",")}` : null,
                page: query.page,
                sort: "-createdAt"
            };


            const q  = qs.stringify(formatQuery, {
                    encodeValuesOnly: true,
                    skipNulls: true
                }
            );

            const res = await ApiHelper().get(`/tickets?${q}`);
            console.log(res.data);
            setDataList(res.data);
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
                   scroll={{x: 500}}
                   rowKey={"tbl"}
                   pagination={
                       {
                           pageSize: dataList.pagination.limit,
                           current: dataList.pagination.page,
                           onChange: onChangePage,
                       }
                   }
            />
        </Skeleton>
    )
};

export default memo(TicketList);