import React, { memo, useEffect, useState } from "react";
import { Avatar, Card, Col, Row, Segmented, Skeleton, Space, Tag, Typography } from "antd";
import { useHistory, useParams } from "react-router-dom";
import TicketConversation from "./TicketConversation";
import TicketTags from "./TicketTags";
import { Check } from "iconsax-react";
import TicketLogs from "./TicketLogs";
import TicketOtherInfo from "./TicketOtherInfo";

const Page = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [ticketStatus, setTicketStatus] = useState("1_new");
    const [activeTab, setActiveTab] = useState("conversation");
    const history = useHistory();

    useEffect(() => {

    }, [id]);

    const tabList = [
        {
            key: 'conversation',
            tab: 'Conversation',
        },
        {
            key: 'log',
            tab: 'Activity logs',
        },
        {
            key: 'info',
            tab: 'Information',
        },
    ];

    const contentList = {
        conversation: <TicketConversation dataSource={null} isLoading={loading} />,
        log: <TicketLogs id={id} />,
        info: <TicketOtherInfo />,
    };

    const onTabChange = (key) => {
        setActiveTab(key);
    };

    return (
        <Row gutter={[8, 8]}>
            <Col md={16}>
                <Space direction="vertical" size={"small"} style={{ width: "100%" }}>
                    <Card size="small"
                        tabList={tabList}
                        tabProps={{ size: "small" }}
                        activeTabKey={activeTab}
                        onTabChange={onTabChange}
                    >
                        <Skeleton loading={loading} active>
                            {contentList[activeTab]}
                        </Skeleton>
                    </Card>
                </Space>
            </Col>
            <Col md={8}>
                <Space direction="vertical" size={"small"} style={{ width: "100%" }}>
                    <Card size="small" title={`Trạng thái`}>
                        <Skeleton loading={loading} active>
                            <Segmented
                                block
                                options={[
                                    {
                                        label: (
                                            <Typography.Text type="secondary">New</Typography.Text>
                                        ),
                                        value: "1_new",
                                    },
                                    {
                                        label: <Typography.Text type="warning">Processing</Typography.Text>,
                                        value: "2_processing",
                                    },
                                    {
                                        label: <Typography.Text type="success">Done</Typography.Text>,
                                        value: "3_done",
                                    }
                                ]} />
                        </Skeleton>
                    </Card>
                    <Card size="small" title={`Tags`}>
                        <TicketTags id={id} />
                    </Card>
                </Space>
            </Col>
        </Row>
    )
}

export default memo(Page);