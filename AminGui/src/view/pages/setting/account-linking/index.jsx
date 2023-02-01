import React, {useEffect, useState} from "react";
import {Card, Descriptions, Space, Tag, Skeleton, Button, message} from "antd";
import {CloseOutlined, FacebookFilled} from "@ant-design/icons";
import {initFacebookSdk} from "../../../../utils/FacebookHelper";
import ApiHelper from "../../../../utils/ApiHelper";

const tokenConfigKey = "token-config";

const AccountLinking = () => {

    const [loadingSdk, setLoadingSdk] = useState(true);
    const [isFBLogged, setIsFbLogged] = useState(false);
    const [authInformation, setAuthInformation] = useState("");
    const [tokenInfos, setTokenInfos] = useState("");

    useEffect(() => {
        initFacebookSdk().then(() => {
            console.log("Loading success");
            setLoadingSdk(false);
            checkLoginStatus().catch(e => console.error(e));
        }).catch(e => console.error(e));

        //Get current config
        getCurrentConfig().catch(e => console.error(e));

    }, []);

    const getCurrentConfig = async () => {
        try {
            const res = await ApiHelper().get(`/config/${tokenConfigKey}`);
            console.log("Current config", res.data);
            setTokenInfos(JSON.stringify(res.data));
        } catch (e) {
            message.error("Could not get config");
        }
    };

    const checkLoginStatus = async () => {
        window.FB.getLoginStatus((response) => {
            console.log(response.authResponse);
            if (response.status === 'connected') {
                setIsFbLogged(true);
                setAuthInformation(JSON.stringify(response.authResponse));
            } else {
                console.log("Please log into this facebook.");
                setIsFbLogged(false);
            }
        });
    };

    const handleFacebookLogin = () => {
        window.FB.login((response) => {
            console.log(response);
            if (response.authResponse) {
                console.log('Welcome!  Fetching your information.... ');
                setAuthInformation(JSON.stringify(response.authResponse));
            }
        }, {
            scope: ['email'
                , 'instagram_basic'
                , 'instagram_manage_comments'
                , 'instagram_manage_insights'
                , 'pages_manage_engagement'
                , 'pages_manage_metadata'
                , 'pages_messaging'
                , 'pages_show_list'
                , 'public_profile'
                , 'pages_read_engagement'
            ].join(",")
        });
    };

    const handleFacebookLogout = () => {
        window.FB.logout();
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
                        <Descriptions.Item label="User information">
                            {authInformation}
                        </Descriptions.Item>
                        <Descriptions.Item label="Setting">
                            {tokenInfos}
                        </Descriptions.Item>
                        <Descriptions.Item label="Action">
                            <Button>Save to Setting</Button>
                        </Descriptions.Item>
                    </Descriptions>
                </Card>
                {/*<Card size={"small"}>*/}
                {/*    <Descriptions title={"Instagram"} bordered size={"small"} column={1}>*/}
                {/*        <Descriptions.Item label="Status">Login</Descriptions.Item>*/}
                {/*        <Descriptions.Item label="User information"></Descriptions.Item>*/}
                {/*        <Descriptions.Item label="Long-live token">*/}
                {/*            <Tag color={"error"}*/}
                {/*                 icon={<CloseOutlined/>}>None</Tag>*/}
                {/*        </Descriptions.Item>*/}
                {/*    </Descriptions>*/}
                {/*</Card>*/}
            </Space>
        </Skeleton>
    )
};

export default AccountLinking;
