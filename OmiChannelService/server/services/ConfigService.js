export const getFacebookSettings = async () => {
    return {
        verifyToken: process.env.FACEBOOK_VERIFY_TOKEN,
        appSecret: process.env.FACEBOOK_APP_SECRET
    }
};