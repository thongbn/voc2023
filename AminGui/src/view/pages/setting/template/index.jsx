import React from "react";

import {Row, Col, Button} from "antd";

import Line from "../../errors/line";
import Header from "../../errors/header";
import {Link} from "react-router-dom";
import Footer from "../../errors/footer";

export default function Blank() {
    return (
        <Row className="hp-text-center hp-overflow-hidden">
            <Line/>
            <Header/>
            <Col className="hp-error-content hp-py-32" span={24}>
                <Row className="hp-h-100" align="middle" justify="center">
                    <Col>
                        <h1 className="">
                            Coming Soon
                        </h1>
                        <Link to="/">
                            <Button type="primary">Back to Home</Button>
                        </Link>
                    </Col>
                </Row>
            </Col>
            <Footer/>
        </Row>
    );
}
