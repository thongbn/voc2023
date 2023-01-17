import React, {useEffect, useMemo, useState} from "react";
import {useLocation, useHistory} from 'react-router-dom';
import {Card, Form, Space} from "antd";
import IntlMessages from "../../../layout/components/lang/IntlMessages";
import TicketFilter from "./TicketFilter";
import moment from "moment";

const Page = () => {
    const {search} = useLocation();
    const history = useHistory();
    const params = useMemo(() => new URLSearchParams(search), [search]);
    const [activeKey, setActiveKey] = useState(params.get("tab"));
    const [filterForm] = Form.useForm();

    const onSubmitFilter = (values) => {
        console.log(values);
    };

    const onTabChange = (key) => {
        history.push(`/case?tab=${key}`);
    };

    useEffect(() => {
        setActiveKey(params.has("tab") ? params.get("tab") : "all");
        filterForm.setFields([
            {
                name: "type",
                value: params.has("tab") ? params.get("tab") : null
            },
            {
                name: "id",
                value: params.has("id") ? params.get("id") : null
            },
            {
                name: "status",
                value: params.has("status") ? params.get("status") : null
            },
            {
                name: "createdAt",
                value: params.has("createdAt") ? moment(params.get("createdAt")) : moment()
            },
            {
                name: "tags",
                value: params.has("tags") ? params.get("tags").split(",") : []
            },
        ]);
    }, [params]);

    const tabList = [
        {
            key: "all",
            tab: <IntlMessages id="all"/>,
        },
        {
            key: "inbox",
            tab: <IntlMessages id="inbox"/>,
        },
        {
            key: "rating",
            tab: <IntlMessages id="rating"/>,
        },
        {
            key: "custom",
            tab: <IntlMessages id="custom"/>,
        },
        {
            key: "feed-back",
            tab: <IntlMessages id="feedback"/>,
        },
        {
            key: "post-comment",
            tab: <IntlMessages id="post-comment"/>,
        },
    ];

    const contentList = {
        article: <p>article content</p>,
        app: <p>app content</p>,
        project: <p>project content</p>,
    };

    return (
        <Card
            tabList={tabList}
            tabProps={{size: "small"}}
            activeTabKey={activeKey}
            size={"small"}
            onTabChange={(key) => {
                onTabChange(key);
            }}
        >
            <Space size="small">
                <TicketFilter form={filterForm} onSubmit={onSubmitFilter}/>
                {contentList[activeKey]}
            </Space>
        </Card>
    );
};

export default Page;
