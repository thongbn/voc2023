import { Button, Col, Row, Select, Skeleton, Space, Tag, Typography } from "antd";
import { Add } from "iconsax-react";
import React, { useEffect, useState } from "react";
import { Plus } from "react-iconly";

const TicketTags = ({ id }) => {

    const [loading, setLoading] = useState(false);

    useEffect(() => {

    }, [id]);

    const [tags, setTags] = useState([]);

    const tagListData = [
        {
            id: 1,
            name: "Store",
            tags: [
                {
                    id: 1,
                    name: "My Kingdom"
                },
                {
                    id: 2,
                    name: "Addidas"
                },
                {
                    id: 3,
                    name: "Ngon phố"
                },
                {
                    id: 4,
                    name: "Fivimart"
                },
            ]
        },
        {
            id: 2,
            name: "Company",
            tags: [
                {
                    id: 1,
                    name: "Aeon mall Vietnam"
                },
                {
                    id: 2,
                    name: "Aeon Vietnam"
                },
                {
                    id: 3,
                    name: "Aeon Delight Vietnam"
                }
            ]
        }
    ];

    const onRemoveTag = (tagId) => {

    }

    return (
        <Skeleton loading={loading} active size="small">
            <Space direction="vertical" size={"middle"} style={{ width: "100%" }}>
                <Space size={"small"} wrap>
                    <Tag color="magenta" closable onClose={() => onRemoveTag()}>Aeon</Tag>
                    <Tag color="magenta" closable onClose={() => onRemoveTag()}>Aeon</Tag>
                    <Tag color="magenta" closable onClose={() => onRemoveTag()}>Aeon</Tag>
                    <Tag color="magenta" closable onClose={() => onRemoveTag()}>Aeon</Tag>
                    <Tag color="magenta" closable onClose={() => onRemoveTag()}>Aeon</Tag>
                </Space>
                {tagListData.map((item, idx) => (
                    <Row key={`tc_${idx}`} gutter={4}>
                        <Col xs={6}>
                            <Typography.Text>{item.name}</Typography.Text>
                        </Col>
                        <Col xs={15}>
                            <Select size="small"
                                style={{ width: "100%" }} 
                                allowClear>
                                {item.tags.map((tag, idx) => {
                                    return (
                                        <Select.Option value={tag.id} key={`tc_t${idx}`}>
                                            {tag.name}
                                        </Select.Option>
                                    )
                                })}
                            </Select>
                        </Col>
                        <Col xs={3}>
                            <Button size="small" color="primary" icon={<Add />}></Button>
                        </Col>

                    </Row>
                ))}

            </Space>
        </Skeleton>
    )
}

export default TicketTags;