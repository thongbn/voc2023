import React, {memo, useEffect, useState} from "react";
import ApiHelper, {errorCatch} from "../../../utils/ApiHelper";
import {Button, Col, Form, Input, Row, Segmented, Typography} from "antd";
import {RiStickyNoteLine, RiSave2Line} from "react-icons/ri";
import {useDispatch, useSelector} from "react-redux";
import {updateNotes} from "../../../redux/ticket";
import {renderCaseStatusTag} from "../../../utils/AppRenderHelper";
import {CASE_STATUS_DONE, CASE_STATUS_NEW, CASE_STATUS_PROGRESSING} from "../../../configs/appConfig";

const {Paragraph, Text, Title} = Typography;

const TicketCaseStatus = () => {

    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const {ticket, ticketStatus} = useSelector(({ticket}) => ticket);
    const [loading, setLoading] = useState(false);

    return <Segmented
        size="small"
        block
        options={[
            {
                label: renderCaseStatusTag(CASE_STATUS_NEW, "text"),
                value: CASE_STATUS_NEW,
            },
            {
                label: renderCaseStatusTag(CASE_STATUS_PROGRESSING, "text"),
                value: CASE_STATUS_PROGRESSING,
            },
            {
                label: renderCaseStatusTag(CASE_STATUS_DONE, "text"),
                value: CASE_STATUS_DONE,
            }
        ]}/>
};

export default memo(TicketCaseStatus);