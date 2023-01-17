import { Descriptions } from "antd";
import moment from "moment";
import React, { memo, useState } from "react";

const TicketOtherInfo = (dataSource) => {
    const [data, setDataSource] = useState(null);

    return (
        <Descriptions size="small" bordered column={1}>
            <Descriptions.Item label="Created">{moment().format("DD/MM/YYYY H:m")}</Descriptions.Item>
            <Descriptions.Item label="Updated">{moment().format("DD/MM/YYYY H:m")}</Descriptions.Item>
            <Descriptions.Item label="Type">Inbox</Descriptions.Item>
            <Descriptions.Item label="Platform">Instagram</Descriptions.Item>
        </Descriptions>
    )
};

export default TicketOtherInfo;