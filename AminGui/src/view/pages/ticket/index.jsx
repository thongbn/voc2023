import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useHistory } from 'react-router-dom';
import { Card, Form, Space } from "antd";
import IntlMessages from "../../../layout/components/lang/IntlMessages";
import TicketFilter from "./TicketFilter";
import moment from "moment";
import TicketList from "./TicketList";
import qs from "qs";

const Page = () => {
    const { search } = useLocation();
    const history = useHistory();
    const [activeKey, setActiveKey] = useState(null);
    const [filterForm] = Form.useForm();
    const [currentQuery, setCurrentQuery] = useState(null);

    const onSubmitFilter = (values) => {
        console.log(values);
        const query = {
            ...currentQuery,
            ...values,
            createdAt: values.createdAt?.toDate() || null,
            page: 1,
        };
        history.push(`/case?${qs.stringify(query)}`);
    };

    const onTabChange = (key) => {
        const query = {
            ...currentQuery,
            type: key,
            page: 1,
        };
        history.push(`/case?${qs.stringify(query)}`);
    };

    const onChangePage = (page) => {
        const query = {
            ...currentQuery,
            page: page,
        };
        history.push(`/case?${qs.stringify(query)}`);
    };

    useEffect(() => {
        const params = qs.parse(search, { ignoreQueryPrefix: true });
        setActiveKey(params.type ? params.type : "");
        filterForm.setFields([
            {
                name: "type",
                value: params["type"] ? params["type"] : null
            },
            {
                name: "platform",
                value: params["platform"] ? params["platform"] : null
            },
            {
                name: "id",
                value: params["id"] ? params["id"] : null
            },
            {
                name: "caseStatus",
                value: params["caseStatus"] ? params["caseStatus"] : null
            },
            {
                name: "createdAt",
                value: params["createdAt"] ? moment(params["createdAt"]) : null
            },
            {
                name: "tags",
                value: params["tags"] ? params["tags"] : []
            },
        ]);
        setCurrentQuery({
            ...params
        });
    }, [search]);

    const tabList = [
        {
            key: "",
            tab: <IntlMessages id="all" />,
        },
        {
            key: "inbox",
            tab: <IntlMessages id="inbox" />,
        },
        {
            key: "rating",
            tab: <IntlMessages id="rating" />,
        },
        {
            key: "custom",
            tab: <IntlMessages id="custom" />,
        },
        {
            key: "feedback",
            tab: <IntlMessages id="feedback" />,
        },
        {
            key: "post-comment",
            tab: <IntlMessages id="post-comment" />,
        },
    ];

    return (
        <Card
            tabList={tabList}
            tabProps={{ size: "small" }}
            activeTabKey={activeKey}
            size={"small"}
            onTabChange={(key) => {
                onTabChange(key);
            }}
        >
            <Space size="small" direction="vertical" style={{width: "100%"}}>
                <TicketFilter form={filterForm} onSubmit={onSubmitFilter} />
                <TicketList query={currentQuery} onChangePage={onChangePage} />
            </Space>
        </Card>
    );
};

export default Page;
