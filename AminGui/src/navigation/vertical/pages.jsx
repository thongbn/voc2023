import {Award, Calendar, Chart, Setting, Money3, Monitor, People, Document} from 'iconsax-react';

import IntlMessages from "../../layout/components/lang/IntlMessages";
import React from "react";
import {Upload} from "react-iconly";

const pages = [
    {
        header: <IntlMessages id="sidebar-pages"/>,
    },
    {
        id: "dashboard",
        title: <IntlMessages id="sidebar-pages-dashboard"/>,
        icon: <Chart size={18}/>,
        navLink: "/dashboard",
    },
    {
        id: "case",
        title: <IntlMessages id="sidebar-pages-case"/>,
        icon: <Calendar size={18}/>,
        navLink: "/case",
        // children: [
        //     {
        //         id: "case-all",
        //         title: <IntlMessages id="all"/>,
        //         navLink: "/case",
        //     },
        //     {
        //         id: "case-inbox",
        //         title: <IntlMessages id="inbox"/>,
        //         navLink: "/case/inbox",
        //     },
        //     {
        //         id: "case-rating",
        //         title: <IntlMessages id="rating"/>,
        //         navLink: "/case/rating",
        //     },
        //     {
        //         id: "case-feedback",
        //         title: <IntlMessages id="feedback"/>,
        //         navLink: "/case/feedback",
        //     },
        //     {
        //         id: "case-custom",
        //         title: <IntlMessages id="custom"/>,
        //         navLink: "/case/custom",
        //     },
        //     {
        //         id: "case-miss",
        //         title: <IntlMessages id="miss-case"/>,
        //         navLink: "/case/miss-case",
        //     },
        //     {
        //         id: "case-post-comment",
        //         title: <IntlMessages id="post-comment"/>,
        //         navLink: "/case/post-comment",
        //     },
        // ]
    },
    {
        id: "customer",
        title: <IntlMessages id="sidebar-pages-customer"/>,
        icon: <Award size={18}/>,
        navLink: "/customer",
    },
    {
        id: "log",
        title: <IntlMessages id="sidebar-pages-log"/>,
        icon: <People size={18}/>,
        navLink: "/log",
    },
    {
        id: "report",
        title: <IntlMessages id="sidebar-pages-report"/>,
        icon: <Monitor size={18}/>,
        navLink: "/report",
    },
    {
        id: "media-manager",
        title: <IntlMessages id="sidebar-pages-media-manager"/>,
        icon: <Upload size={18}/>,
        navLink: "/media-manager",
    },
    {
        id: "settings",
        title: <IntlMessages id="sidebar-pages-settings"/>,
        icon: <Setting size={18}/>,
        navLink: "/settings",
        children: [
            {
                id: "faq",
                title: <IntlMessages id="faq"/>,
                navLink: "/settings/faq",
            },
            {
                id: "tag-keyword",
                title: <IntlMessages id="tag"/>,
                navLink: "/settings/tag",
            },
            {
                id: "auto-answer",
                title: <IntlMessages id="auto-answer"/>,
                navLink: "/settings/auto-answer",
            },
            {
                id: "bot",
                title: <IntlMessages id="bot"/>,
                navLink: "/settings/auto-bot",
            },
            {
                id: "template",
                title: <IntlMessages id="template"/>,
                navLink: "/settings/template",
            },
            {
                id: "other-settings",
                title: <IntlMessages id="other"/>,
                navLink: "/settings/other",
            },
        ]
    },
    {
        id: "user",
        title: <IntlMessages id="sidebar-pages-user"/>,
        icon: <People size={18}/>,
        navLink: "/user",
    },
];

export default pages