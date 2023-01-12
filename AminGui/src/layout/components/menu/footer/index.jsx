import React from "react";
import {Link} from "react-router-dom";

import {Divider, Avatar, Row, Col} from "antd";
import {RiSettings3Line} from "react-icons/ri";

import IntlMessages from "../../lang/IntlMessages";
import {useSelector} from "react-redux";

export default function MenuFooter(props) {
    const auth = useSelector(state => state.auth);

    const avatarLink = "https://i.pravatar.cc/150?u=a042581f4e29026704d";

    return (
        props.collapsed === false ? (
            <Row
                className="hp-sidebar-footer hp-bg-color-dark-90"
                align="middle"
                justify="space-between"
            >
                <Divider className="hp-border-color-black-40 hp-border-color-dark-70 hp-mt-0"/>

                <Col>
                    <Row align="middle">
                        <Avatar size={48} src={avatarLink} className="hp-bg-info-4 hp-mr-8"/>

                        <div className="hp-mt-6">
              <span className="hp-d-block hp-text-color-black-100 hp-text-color-dark-0 hp-p1-body"
                    style={{lineHeight: 1}}>
                  {auth && auth.user && `${auth.user.name}`}
             </span>

                            <Link
                                to="#"
                                className="hp-badge-text hp-text-color-dark-30 hp-font-weight-400"
                                onClick={props.onClose}
                            >
                                <IntlMessages id="sidebar-view-profile"/>
                            </Link>
                        </div>
                    </Row>
                </Col>

                <Col>
                    <Link
                        to="#"
                        onClick={props.onClose}
                    >
                        <RiSettings3Line
                            className="remix-icon hp-text-color-black-100 hp-text-color-dark-0"
                            size={24}
                        />
                    </Link>
                </Col>
            </Row>
        ) : (
            <Row
                className="hp-sidebar-footer hp-bg-color-dark-90"
                align="middle"
                justify="center"
            >
                <Col>
                    <Link
                        to="#"
                        onClick={props.onClose}
                    >
                        <Avatar size={48} src={avatarLink} className="hp-bg-info-4"/>
                    </Link>
                </Col>
            </Row>
        )
    );
};