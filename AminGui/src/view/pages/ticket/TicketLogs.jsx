import { Timeline } from "antd";
import React, { memo } from "react";

const TicketLogs = ({ id }) => {
    return (
        <Timeline style={{marginTop: "1.5rem"}}>
            <Timeline.Item>Create a services site 2015-09-01</Timeline.Item>
            <Timeline.Item>Solve initial network problems 2015-09-01</Timeline.Item>
            <Timeline.Item>Technical testing 2015-09-01</Timeline.Item>
            <Timeline.Item>Network problems being solved 2015-09-01</Timeline.Item>
        </Timeline>
    )
};

export default memo(TicketLogs);