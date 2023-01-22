import React, {memo, useEffect, useState} from "react";
import {Button, Card, Col, Divider, Row, Segmented, Skeleton, Space, Tag, Typography} from "antd";
import {useHistory, useParams} from "react-router-dom";
import TicketConversation from "./TicketConversation";
import TicketTags from "./TicketTags";
import {RiInstagramLine} from "react-icons/ri";
import TicketLogs from "./TicketLogs";
import TicketOtherInfo from "./TicketOtherInfo";
import TicketLatestCase from "./TicketLastestCase";
import TicketNote from "./TicketNote";
import ApiHelper, {errorCatch} from "../../../utils/ApiHelper";
import {useDispatch, useSelector} from "react-redux";
import {updateTicket} from "../../../redux/ticket";
import {renderCaseStatusTag, renderPlatformIcon, renderType} from "../../../utils/AppRenderHelper";
import {CASE_STATUS_NEW, CASE_STATUS_DONE, CASE_STATUS_PROCESSING} from "../../../configs/appConfig";
import TicketCaseStatus from "./TicketCaseStatus";

const Page = () => {
    const dispatch = useDispatch();
    const ticketReducer = useSelector(({ticket}) => ticket);
    const {id} = useParams();
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("conversation");
    const history = useHistory();

    useEffect(() => {
        loadModel(id);
    }, [id]);

    const loadModel = async (id) => {
        if (!id) {
            return;
        }

        try {
            setLoading(true);
            const res = await ApiHelper().get(`/tickets/${id}`);
            dispatch(updateTicket(res.data.data));
            setLoading(false);
        } catch (e) {
            errorCatch(e);
        }
    };

    const tabList = [
        {
            key: 'conversation',
            tab: 'Conversation',
        },
        {
            key: 'info',
            tab: 'Information',
        },
        {
            key: 'latestCase',
            tab: 'Latest Case',
        },
        {
            key: 'log',
            tab: 'Activity logs',
        },
    ];

    const contentList = {
        conversation: <TicketConversation isLoading={loading}/>,
        info: <TicketOtherInfo/>,
        latestCase: <TicketLatestCase/>,
        log: <TicketLogs id={id}/>,
    };

    const onTabChange = (key) => {
        setActiveTab(key);
    };

    return (
        <Row gutter={[8, 8]}>
            <Col xs={24}>
                <Space split={<Divider type={"vertical"}/>}>
                    <Typography.Title level={4} style={{marginBottom: 0}}>
                        Case #{id}
                    </Typography.Title>
                    <Typography.Title level={4} style={{marginBottom: 0}}>
                        {renderPlatformIcon(ticketReducer?.ticket?.platform)}
                    </Typography.Title>
                    <Typography.Title level={4} style={{marginBottom: 0}}>
                        {renderType(ticketReducer?.ticket?.type)}
                    </Typography.Title>
                    {renderCaseStatusTag(ticketReducer?.ticketStatus)}
                </Space>
            </Col>
            <Col xs={24} md={16}>
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
            <Col xs={24} md={8}>
                <Space direction="vertical" size={"small"} style={{width: "100%"}}>
                    <Card size="small" title={`Trạng thái`}>
                        <Skeleton loading={loading} active>
                            <Space direction="vertical" style={{width: "100%"}}>
                                <TicketCaseStatus/>
                                <TicketNote/>
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