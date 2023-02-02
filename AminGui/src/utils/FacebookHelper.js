const facebookAppId = process.env.REACT_APP_FACEBOOK_APP_ID;

export const initFacebookSdk = async (appId) => {
    return new Promise(resolve => {
        // wait for facebook sdk to initialize before starting the react app
        console.log("Loading facebook");
        window.fbAsyncInit = function () {
            window.FB.init({
                appId: appId,
                autoLogAppEvents : true,
                xfbml: true,
                version: 'v15.0'
            });
            console.log("Init facebook success");
            resolve();
        };

        // load facebook sdk script
        (function (d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {
                return;
            }
            js = d.createElement(s);
            js.id = id;
            js.src = "https://connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
            console.log("Success loading facebook");
        }(document, 'script', 'facebook-jssdk'));
    });
};