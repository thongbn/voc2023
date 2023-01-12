import {Col, Input, Button, Tooltip} from "antd";

import image from "../../../assets/images/memoji/newspaper.svg";
import {RiFileCopy2Fill} from 'react-icons/ri'
import {useSelector} from "react-redux";

export default function HeaderText() {
    const {auth} = useSelector(state => state);

    let referenceLink = 0;
    if (auth) {
        referenceLink = `https://affiliate.smileup.com?reference=${auth?.user?.id}`;
    }

    return (
        <Col
            xl={16}
            lg={14}
            className="hp-header-left-text hp-d-flex-center"
        >
            <div className="hp-border-radius-xl hp-overflow-hidden hp-bg-black-0 hp-bg-dark-100 hp-d-flex hp-mr-12"
                 style={{minWidth: 45, width: 45, height: 45}}>
                <img src={image} alt="Newspaper" height="80%" style={{marginTop: 'auto', marginLeft: 'auto'}}/>
            </div>

            <Input.Group compact size={"small"}>
                <Input
                    readOnly
                    addonBefore={"Link giới thiệu"}
                    style={{width: 'calc(100% - 200px)'}}
                    defaultValue={referenceLink}
                />
                <Tooltip title="Sao chép">
                    <Button
                        onClick={() => {
                            navigator.clipboard.writeText(referenceLink)
                        }}
                        size={"small"} icon={<RiFileCopy2Fill/>}/>
                </Tooltip>
            </Input.Group>
        </Col>
    );
};