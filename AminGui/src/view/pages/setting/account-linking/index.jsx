import React, {useEffect, useState} from "react";
import {Card, Descriptions, Space, Tag, Skeleton, Button} from "antd";
import {CloseOutlined, FacebookFilled} from "@ant-design/icons";
import {initFacebookSdk} from "../../../../utils/FacebookHelper";

const AccountLinking = () => {

    const [loadingSdk, setLoadingSdk] = useState(true);
    const [isFBLogged, setIsFbLogged] = useState(false);

    useEffect(() => {
        initFacebookSdk().then(() => {
            console.log("Loading success");
            setLoadingSdk(false);
        }).catch(e => console.error(e))
    }, []);

    const checkLoginStatus = async () => {
        window.FB.getLoginStatus((response) => {
            console.log(response);
            if (response.status === 'connected') {
                setIsFbLogged(true);
            } else {
                console.log("Please log into this facebook.");
                setIsFbLogged(false);
            }
        });
    };

    const handleFacebookLogin = () => {

    };

    const handleFacebookLogout = () => {

    };

    const renderLoginButton = () => {
        if (!isFBLogged) {
            return <Button
                icon={<FacebookFilled/>}
                onClick={() => handleFacebookLogin()}>Login to Facebook</Button>
        } else {
            return <Button
                icon={<FacebookFilled/>}
                onClick={() => handleFacebookLogout()}>Log out</Button>
        }
    };

    return (
        <Skeleton active loading={loadingSdk}>
            <Space direction="vertical" style={{width: "100%"}}>
                <Card size={"small"}>
                    <Descriptions title={"Facebook"} bordered size={"small"} column={1}>
                        <Descriptions.Item label="Status">{renderLoginButton()}</Descriptions.Item>
                        <Descriptions.Item label="User information">bacsssssssssssssssssssssssssss</Descriptions.Item>
                        <Descriptions.Item label="Long-live token">
                            <Tag color={"error"}
                                 icon={<CloseOutlined/>}>None</Tag>
                        </Descriptions.Item>
                    </Descriptions>
                </Card>
                <Card size={"small"}>
                    <Descriptions title={"Instagram"} bordered size={"small"} column={1}>
                        <Descriptions.Item label="Status">Login</Descriptions.Item>
                        <Descriptions.Item label="User information">bac</Descriptions.Item>
                        <Descriptions.Item label="Long-live token">
                            <Tag color={"error"}
                                 icon={<CloseOutlined/>}>None</Tag>
                        </Descriptions.Item>
                    </Descriptions>
                </Card>
            </Space>
        </Skeleton>
    )
};

export default AccountLinking;
