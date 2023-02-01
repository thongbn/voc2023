import React, {useCallback, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {ConfigProvider, message} from 'antd';
import {IntlProvider} from "react-intl";

import AppLocale from './languages';

import Router from "./router/Router";
import ApiHelper from "./utils/ApiHelper";
import {getTagsSuccess, setLoadingTagCategory} from "./redux/tags";

export default function App() {
    const dispatch = useDispatch();
    // Redux
    const {customise, tag} = useSelector(({customise, tag}) => ({customise, tag}));
    const {tagCategories} = tag;

    // Lang
    const currentAppLocale = AppLocale[customise.language];

    useEffect(() => {
        document.querySelector("html").setAttribute("lang", customise.language);
    }, [customise]);

    useEffect(() => {
        if (tagCategories?.length === 0) {
            loadTagCategory();
        }
    }, []);

    const loadTagCategory = useCallback(async () => {
        try {
            setLoadingTagCategory(true);
            const res = await ApiHelper().get("/tags/all");
            const {data} = res.data;
            data.sort((a, b) => b.sort_order - a.sort_order);
            dispatch(getTagsSuccess(data));
            console.log(data);
        } catch (e) {
            message.error(e.message);
        } finally {
            setLoadingTagCategory(false)
        }
    }, []);

    return (
        <ConfigProvider locale={currentAppLocale.antd} direction={customise.direction}>
            <IntlProvider locale={currentAppLocale.locale} messages={currentAppLocale.messages}>
                <Router/>
            </IntlProvider>
        </ConfigProvider>
    );
}