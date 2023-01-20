import React, {memo} from "react";
import {Card} from "antd";
import MediaManager from "../../components/media-manager/MediaManager";

const Page = () => {
    return (
        <Card title="Media Manager"
              size="small"
        >
            <MediaManager/>
        </Card>
    )
};

export default memo(Page);