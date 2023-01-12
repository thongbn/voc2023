import React from "react";

import {Card, Row, Col} from "antd";

const FeatureCard = (props) => {
    const {icon, bgColorClass, textColorClass, numberPrimary, numberSecondary, title} = props;

    return (
        <Card className="hp-border-color-black-40">
            <Row>
                {icon && <Col
                    className={`hp-statistic-icon-bg hp-mr-16 hp-mb-xs-16 ${bgColorClass ? bgColorClass : "hp-bg-color-primary-4"}  hp-bg-color-dark-primary`}>
                    {icon}
                </Col>}

                <Col className="hp-mt-8">
                    <h4 className="hp-mb-4">
                        {numberPrimary}
                        {numberSecondary && <span
                            className={`hp-badge-text hp-ml-8 ${textColorClass ? textColorClass : "hp-text-color-primary-1"} hp-text-color-dark-primary-2`}>
                            {numberSecondary}
                        </span>}
                    </h4>

                    <p className="hp-p1-body hp-mb-0 hp-text-color-black-80 hp-text-color-dark-30">
                        {title}
                    </p>
                </Col>
            </Row>
        </Card>
    );
};

export default FeatureCard;