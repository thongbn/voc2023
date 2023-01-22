import {message, Button, Skeleton, Table, Tooltip, Typography, Space, Divider} from "antd";
import React, {memo, useCallback, useEffect, useState} from "react";
import moment from "moment";
import ApiHelper, {errorCatch} from "../../../utils/ApiHelper";
import {useHistory} from 'react-router-dom';
import {formatDate} from "../../../utils/StringHelper";
import {
    renderCaseStatusTag,
    renderInboxTimeWarning,
    renderPlatformIcon,
    renderTicketTag,
    renderType
} from "../../../utils/AppRenderHelper";
import qs from 'qs';
import {CASE_TYPE_MESSAGE} from "../../../configs/appConfig";

const {Paragraph, Link} = Typography;

const TicketList = ({query, onChangePage}) => {
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const [loadingTags, setLoadingTags] = useState(false);
    const [dataList, setDataList] = useState({
        data: [],
        pagination: {
            page: 1,
            limit: 20
        }
    });
    const [dataTagList, setDataTagList] = useState({});

    useEffect(() => {
        searchModels(query).catch(e => errorCatch(e));
    }, [query]);

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
                sort: "caseStatus,-createdAt"
            };


            const q = qs.stringify(formatQuery, {
                    encodeValuesOnly: true,
                    skipNulls: true
                }
            );

            const res = await ApiHelper().get(`/tickets?${q}`);
            const listTickets = res.data.data;

            const ticketIds = listTickets.map(item => item.id);
            console.log(ticketIds);

            //Run async
            loadingTagTickets(ticketIds);

            setDataList(res.data);
        } catch (e) {
            await message.error(e.message);
        } finally {
            setLoading(false);
        }
    };

    const onOpenDetail = (id) => {
        history.push(`/case/${id}`);
    };

    const openCustomerDetail = (customerId) => {

    };

    const loadingTagTickets = async (ticketIds = []) => {
        try {
            setLoadingTags(true);
            const res = await ApiHelper().get(`/tickets/tags`, {
                params: {
                    ticketIds: ticketIds.join(",")
                }
            });
            const tagModels = {};
            res?.data?.data.forEach((item, idx) => {
                if (!tagModels[item.model_id]) {
                    tagModels[item.model_id] = [];
                }
                tagModels[item.model_id].push(item.tag);
            });
            console.log(tagModels);
            setDataTagList(tagModels);
        } catch (e) {
            errorCatch(e);
        } finally {
            setLoadingTags(false)
        }
    };

    const columns = [
        {
            key: "platform",
            title: "Platform",
            dataIndex: "platform",
            render: (text, row) => <Typography.Text>
                <Link onClick={() => onOpenDetail(row.id)}>
                    #{row.id} {renderType(row.type)}
                </Link>
            </Typography.Text>,
        },
        {
            key: "firstMessage",
            title: "Message",
            dataIndex: "firstMessage",
            render: (text, row) => {
                return (
                    <Space direction="vertical" size="small">
                        <Typography.Text>
                            <Link onClick={() => openCustomerDetail(row.customer?.id)}>
                                <strong>{row.customer?.name || '---'}: </strong>
                            </Link>
                            {text}
                        </Typography.Text>
                        <Space size="small" split={<Divider type="vertical"/>}>
                            {renderPlatformIcon(row.platform)}
                            {row.type === CASE_TYPE_MESSAGE && renderInboxTimeWarning(row)}
                            <Space wrap size={"small"}>
                                {dataTagList[row.id]?.map((item, idx) => {
                                    return renderTicketTag(item, "tag-sm");
                                }) || <Typography.Text italic>Not tagging yet</Typography.Text>}
                            </Space>
                        </Space>
                    </Space>
                )
            },
        },
        {
            key: "caseStatus",
            title: "Trạng thái",
            dataIndex: "caseStatus",
            render: (text) => renderCaseStatusTag(text),
        },
        {
            key: "updatedAt",
            title: "Updated",
            dataIndex: "updatedAt",
            render: (text, row) => {
                return <Tooltip title={`Updated at: ${formatDate(row.updatedAt)}`}>
                    {formatDate(text)}
                </Tooltip>
            },
        },
    ];

    return (
        <Skeleton active={true} loading={loading}>
            <Table columns={columns}
                   bordered
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