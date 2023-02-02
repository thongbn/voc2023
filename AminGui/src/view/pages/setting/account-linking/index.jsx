import React, {useEffect, useState} from "react";
import {Card, Descriptions, Space, Tag, Skeleton, Button, message} from "antd";
import {CloseOutlined, FacebookFilled} from "@ant-design/icons";
import {initFacebookSdk} from "../../../../utils/FacebookHelper";
import ApiHelper from "../../../../utils/ApiHelper";

const tokenConfigKey = "token-config";

const AccountLinking = () => {

    const [loadingSdk, setLoadingSdk] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [isFBLogged, setIsFbLogged] = useState(false);
    const [authInformation, setAuthInformation] = useState({});
    const [tokenInfos, setTokenInfos] = useState("");
    const [omiConfig, setOmiConfig] = useState({});
    const [longLiveToken, setLongLiveToken] = useState({});

    useEffect(() => {
        //Get current config
        getOmiConfig().catch(e => console.error(e));
        getCurrentConfig().catch(e => console.error(e));


    }, []);

    const getOmiConfig = async () => {
        try {
            const omiConfigRes = await ApiHelper().get(`/config/omi-config`);
            console.log(omiConfigRes.data.data);
            const cfg = omiConfigRes.data.data;
            setOmiConfig(cfg);

            const {facebook} = cfg;
            const clientId = facebook.appId;

            await initFacebookSdk(clientId);
            console.log("Loading success");
            setLoadingSdk(false);

            checkLoginStatus().catch(e => console.error(e));

        } catch (e) {
            throw e;
        }
    };

    const getCurrentConfig = async () => {
        try {
            const res = await ApiHelper().get(`/config/${tokenConfigKey}`);
            console.log("Current config", res.data);
            setTokenInfos(res.data.data);
        } catch (e) {
            throw e;
        }
    };

    const checkLoginStatus = async () => {
        window.FB.getLoginStatus((response) => {
            console.log(response.authResponse);
            if (response.status === 'connected') {
                setIsFbLogged(true);
                setAuthInformation(response.authResponse);
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

    const getLongLiveToken = async () => {

        try {
            setIsLoading(true);
            const {facebook} = omiConfig;
            const clientId = facebook.appId;
            const clientSecret = facebook.appSecret;

            window.FB.api("/oauth/access_token", 'get', {
                grant_type: "fb_exchange_token",
                "client_id": clientId,
                "client_secret": clientSecret,
                "fb_exchange_token": authInformation.accessToken,
            }, (response) => {
                console.log(response);
                setLongLiveToken(response);
            });

        } catch (e) {
            message.error(e.message);
        } finally {
            setIsLoading(false);
        }
    };

    const saveLongLiveToken = async () => {
        const res = await ApiHelper().post(`/config/${tokenConfigKey}`, {
            data: {
                ...tokenInfos,
                llt: longLiveToken.access_token,
            }
        });
        console.log(res.data.data);
        setTokenInfos(res.data.data);
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
                        {authInformation && (
                            <>
                                <Descriptions.Item label="User information">
                                    {JSON.stringify(authInformation)}
                                </Descriptions.Item>
                                <Descriptions.Item label="Step 1">
                                    <Button loading={isLoading} onClick={() => getLongLiveToken()}>
                                        Get Long Live Token
                                    </Button>
                                </Descriptions.Item>
                                <Descriptions.Item label="Long live token">
                                    {JSON.stringify(longLiveToken)}
                                </Descriptions.Item>
                            </>
                        )}
                        <Descriptions.Item label="Omi config">
                            {JSON.stringify(omiConfig)}
                        </Descriptions.Item>
                        <Descriptions.Item label="Setting">
                            {JSON.stringify(tokenInfos)}
                        </Descriptions.Item>
                        <Descriptions.Item label="Step 2">
                            <Button onClick={() => saveLongLiveToken()}>Save to Setting</Button>
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
