import React, {memo, useEffect, useState} from "react";
import {Button, Card, Col, Row, Segmented, Skeleton, Space, Tag, Typography} from "antd";
import {useHistory, useParams} from "react-router-dom";
import TicketConversation from "./TicketConversation";
import TicketTags from "./TicketTags";
import {RiStickyNoteFill, RiInstagramLine} from "react-icons/ri";
import TicketLogs from "./TicketLogs";
import TicketOtherInfo from "./TicketOtherInfo";
import TicketLatestCase from "./TicketLastestCase";

const Page = () => {
    const {id} = useParams();
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
        {
            key: 'latestCase',
            tab: 'Latest Case',
        },
    ];

    const contentList = {
        conversation: <TicketConversation dataSource={null} isLoading={loading}/>,
        log: <TicketLogs id={id}/>,
        info: <TicketOtherInfo/>,
        latestCase: <TicketLatestCase/>
    };

    const onTabChange = (key) => {
        setActiveTab(key);
    };

    return (
        <Row gutter={[8, 8]}>
            <Col xs={24}>
                <Space>
                    <Typography.Title level={4} style={{marginBottom: 0}}>
                        <RiInstagramLine className="remix-icon"/> #{id}
                    </Typography.Title>
                    <Tag color="">New</Tag>
                </Space>
            </Col>
            <Col md={16}>
                <Space direction="vertical" size={"small"} style={{width: "100%"}}>
                    <Card size="small"
                          tabList={tabList}
                          tabProps={{size: "small"}}
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
                <Space direction="vertical" size={"small"} style={{width: "100%"}}>
                    <Card size="small" title={`Trạng thái`}>
                        <Skeleton loading={loading} active>
                            <Space direction="vertical" style={{width: "100%"}}>
                                <Segmented
                                    size="small"
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
                                    ]}/>
                                <Button
                                    size='small'
                                    icon={<RiStickyNoteFill className="remix-icon"/>}>
                                    Add note
                                </Button>
                            </Space>
                        </Skeleton>
                    </Card>
                    <Card size="small" title={`Tags`}>
                        <TicketTags id={id}/>
                    </Card>
                </Space>
            </Col>
        </Row>
    )
}

export default memo(Page);