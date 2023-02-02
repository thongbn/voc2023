import React, {memo, useEffect, useState} from "react";
import {List, Skeleton} from "antd";
import TicketComment from "./TicketComment";
import ApiHelper, {errorCatch} from "../../../../utils/ApiHelper";

const TicketCommentList = ({id}) => {
    const [loading, setLoadings] = useState(false);
    const [data, setData] = useState([]);

    useEffect(() => {
        if(id){
            getModels().catch(error => console.error(error));
        }
    }, [id]);

    const getModels = async () => {
        try {
            setLoadings(true);
            const res = await ApiHelper().get(`/tickets/${id}/messages`);
            setData(res.data.data);
        } catch (e) {
            errorCatch(e);
        } finally {
            setLoadings(false)
        }
    };

    return <Skeleton loading={loading} active>
        <List
            size="small"
            className="comment-list"
            itemLayout="horizontal"
            dataSource={data}
            renderItem={(item) => (
                <li>
                    <TicketComment data={item}/>
                </li>
            )}
        />
    </Skeleton>;
};

export default memo(TicketCommentList);