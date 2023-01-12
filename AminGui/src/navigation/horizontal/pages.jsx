import { Award } from 'iconsax-react';

import IntlMessages from "../../layout/components/lang/IntlMessages";

const pages = [
    {
        id: "pages",
        header: <IntlMessages id="sidebar-pages" />,
        subMenu: [
            {
                id: "blank-page",
                title: <IntlMessages id="sidebar-pages-blank-page" />,
                icon: <Award size={18} />,
                navLink: "/pages/blank-page",
            },
            {
                id: "errors",
                title: <IntlMessages id="sidebar-pages-error" />,
                icon: <Award size={18} />,
                children: [
                    {
                        id: "error-404",
                        title: "404",
                        navLink: "/pages/error-404",
                    },
                ],
            },
        ]
    },
];

export default pages