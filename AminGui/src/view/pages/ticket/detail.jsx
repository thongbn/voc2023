import React, {memo, useEffect, useState} from "react";
import {Button, Card, Col, Row, Segmented, Skeleton, Space, Tag, Typography} from "antd";
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
import {renderCaseStatusTag} from "../../../utils/AppRenderHelper";
import {CASE_STATUS_NEW, CASE_STATUS_DONE, CASE_STATUS_PROGRESSING} from "../../../configs/appConfig";
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
                    {renderCaseStatusTag(ticketReducer?.ticket?.caseStatus)}
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