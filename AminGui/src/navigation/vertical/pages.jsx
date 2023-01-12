import {Award, Calendar, Chart, Setting, Money3, Monitor, People, Document} from 'iconsax-react';

import IntlMessages from "../../layout/components/lang/IntlMessages";
import React from "react";

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
        id: "appointments",
        title: <IntlMessages id="sidebar-pages-appointments"/>,
        icon: <Calendar size={18}/>,
        navLink: "/appointments",
    },
    {
        id: "promotions",
        title: <IntlMessages id="sidebar-pages-promotions"/>,
        icon: <Award size={18}/>,
        navLink: "/promotions",
    },
    {
        id: "member",
        title: <IntlMessages id="sidebar-pages-members"/>,
        icon: <People size={18}/>,
        navLink: "/members",
    },
    {
        id: "orders",
        title: <IntlMessages id="sidebar-pages-order"/>,
        icon: <Document size={18}/>,
        navLink: "/orders",
    },
    {
        id: "transactions",
        title: <IntlMessages id="sidebar-pages-transaction"/>,
        icon: <Money3 size={18}/>,
        navLink: "/transactions",
    },
    {
        id: "report",
        title: <IntlMessages id="sidebar-pages-report"/>,
        icon: <Monitor size={18}/>,
        navLink: "/report",
    },
    {
        id: "settings",
        title: <IntlMessages id="sidebar-pages-settings"/>,
        icon: <Setting size={18}/>,
        navLink: "/settings",
    },
];

export default pages