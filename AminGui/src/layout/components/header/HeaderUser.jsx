import {Link} from "react-router-dom";

import {Dropdown, Col, Divider, Row} from "antd";
import {UserOctagon, Flag, Calendar, Calculator} from 'iconsax-react';

import {useDispatch} from "react-redux";
import {logout} from "../../../redux/auth";
import React from "react";

export default function HeaderUser() {

    const dispatch = useDispatch();
    const avatarLink = "https://i.pravatar.cc/150?u=a042581f4e29026704d";

    const onClickLogout = () => {
        dispatch(logout());
    };

    const menu = (
        <div
            className="hp-user-dropdown hp-border-radius hp-bg-black-0 hp-bg-dark-100 hp-border-color-dark-80 hp-py-24 hp-px-18 hp-mt-16">
            <span className="hp-d-block h5 hp-font-weight-500 hp-text-color-black-100 hp-text-color-dark-0 hp-mb-16">Profile Settings</span>

            <Link
                to="/user"
                className="hp-p1-body hp-font-weight-500 hp-hover-text-color-primary-2"
            >
                View Profile
            </Link>

            <Divider className="hp-mt-18 hp-mb-12"/>

            {/*<Row>*/}
            {/*  <Col span={24}>*/}
            {/*    <Link to="#" className="hp-d-flex-center hp-p1-body hp-font-weight-500 hp-my-4 hp-py-8 hp-px-10 hp-d-block hp-transition hp-hover-bg-primary-4 hp-hover-bg-dark-80 hp-border-radius" style={{ marginLeft: -10, marginRight: -10 }}>*/}
            {/*      <UserOctagon size="20" />*/}
            {/*      <span className="hp-ml-8">Explore Creators</span>*/}
            {/*    </Link>*/}
            {/*  </Col>*/}

            {/*  <Col span={24}>*/}
            {/*    <Link to="#" className="hp-d-flex-center hp-p1-body hp-font-weight-500 hp-my-4 hp-py-8 hp-px-10 hp-d-block hp-transition hp-hover-bg-primary-4 hp-hover-bg-dark-80 hp-border-radius" style={{ marginTop: -7, marginLeft: -10, marginRight: -10 }}>*/}
            {/*      <Flag size="20" />*/}
            {/*      <span className="hp-ml-8">Calendar Application</span>*/}
            {/*    </Link>*/}
            {/*  </Col>*/}

            {/*  <Col span={24}>*/}
            {/*    <Link to="#" className="hp-d-flex-center hp-p1-body hp-font-weight-500 hp-my-4 hp-py-8 hp-px-10 hp-d-block hp-transition hp-hover-bg-primary-4 hp-hover-bg-dark-80 hp-border-radius" style={{ marginTop: -7, marginLeft: -10, marginRight: -10 }}>*/}
            {/*      <Calendar size="20" />*/}
            {/*      <span className="hp-ml-8">Help Desk</span>*/}
            {/*    </Link>*/}
            {/*  </Col>*/}
            {/*</Row>*/}

            {/*<Divider className="hp-mb-18 hp-mt-12" />*/}

            {/*<Row>*/}
            {/*  <Col span={24}>*/}
            {/*    <Link*/}
            {/*      to="#"*/}
            {/*      className="hp-p1-body hp-d-inline-flex hp-align-items-center hp-font-weight-500 hp-text-color-primary-1 hp-text-color-dark-primary-2 hp-hover-text-color-primary-2 hp-hover-text-color-dark-primary-1"*/}
            {/*    >*/}
            {/*      <Calculator size="20" />*/}
            {/*      <span className="hp-ml-8" style={{ lineHeight: 1 }}>Pricing List</span>*/}
            {/*    </Link>*/}
            {/*  </Col>*/}
            {/*</Row>*/}

            {/*<Divider className="hp-my-18" />*/}

            <Row gutter={[0, 24]}>
                {/*<Col span={24}>*/}
                {/*  <Link*/}
                {/*    to="#"*/}
                {/*    className="hp-p1-body hp-font-weight-500 hp-hover-text-color-primary-2"*/}
                {/*  >*/}
                {/*    Account Settings*/}
                {/*  </Link>*/}
                {/*</Col>*/}

                <Col span={24}>
                    <Link
                        to="#"
                        onClick={onClickLogout}
                        className="hp-p1-body hp-font-weight-500 hp-hover-text-color-primary-2"
                    >
                        Log out
                    </Link>
                </Col>
            </Row>
        </div>
    );

    return (
        <Col className="hp-ml-8">
            <Dropdown overlay={menu} placement="bottomLeft">
                <div className="hp-border-radius-xl hp-cursor-pointer hp-border-1 hp-border-color-dark-80">
                    <div className="hp-border-radius-lg hp-overflow-hidden hp-bg-info-4 hp-m-4 hp-d-flex"
                         style={{minWidth: 32, width: 32, height: 32}}>
                        <img src={avatarLink} alt="User" height="100%"/>
                    </div>
                </div>
            </Dropdown>
        </Col>
    );
};
