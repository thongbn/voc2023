import {Button, Col, message, Row, Select, Skeleton, Space, Tag, Typography, Popconfirm, Form} from "antd";
import {Add} from "iconsax-react";
import React, {useEffect, useState, useCallback, useMemo} from "react";
import {useDispatch, useSelector} from "react-redux";
import ApiHelper, {errorCatch} from "../../../utils/ApiHelper";
import {getTagsSuccess} from "../../../redux/tags";
import {renderTicketTag} from "../../../utils/AppRenderHelper";

const TicketTags = ({id}) => {

    const tagReducer = useSelector(({tag}) => tag);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadTags(id);
    }, [id]);

    const [tags, setTags] = useState([]);

    const loadTags = async (id) => {
        if (!id) {
            return;
        }
        try {
            const res = await ApiHelper().get(`/tickets/${id}/tags`);
            const {data} = res.data;
            setTags(data);
        } catch (e) {
            message.error(e.message);
        }
    };

    const renderAllTags = useCallback(() => {
        return <Skeleton loading={tagReducer.loadingTagCategories} active>
            {tagReducer?.tagCategories?.map((item, idx) => (
                <Form onFinish={onSubmitTag}
                    // layout="inline"
                      className="form-tags-all"
                    // labelCol={{span: 8}}
                    // wrapperCol={{span: 14}}
                    key={`f_tag_${idx}`}
                >
                    <Row gutter={[8]}>
                        <Col xs={20}>
                            <Form.Item
                                label={item.name}
                                name={"tagId"}
                                rules={[{required: true, message: 'Please choose 1 tag!'}]}
                            >
                                <Select size="small"
                                        style={{width: "100%"}}
                                        showSearch
                                        optionFilterProp="children"
                                        filterOption={(input, option) => {
                                            return (option?.children ?? '').includes(input)
                                        }}
                                        allowClear>
                                    {item.tags.map((tag, idx) => {
                                        return (
                                            <Select.Option value={tag.id} key={`tc_t${idx}`}>
                                                {tag.tag_name}
                                            </Select.Option>
                                        )
                                    })}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={4}>
                            <Form.Item>
                                <Button loading={loading}
                                        type="primary"
                                        size="small"
                                        htmlType="submit"
                                        icon={<Add/>}/>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            ))}
        </Skeleton>
    }, [tagReducer]);

    const onSubmitTag = async (values) => {
        console.log(values);
        try {
            setLoading(true);
            const res = await ApiHelper().post(`/tickets/${id}/tags`, {
                ...values
            });
            message.success(`Tag add successfully`);
            await loadTags(id);
        } catch (e) {
            errorCatch(e);
        } finally {
            setLoading(false);
        }
    };

    const onRemoveTag = async (tagId) => {
        try {
            setLoading(true);
            await ApiHelper().delete(`/tickets/${id}/tags/${tagId}`);
            message.success(`Tag remove successfully`);
            await loadTags(id);
        } catch (e) {
            errorCatch(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Skeleton loading={loading} active size="small">
            <Space direction="vertical" size={"middle"} style={{width: "100%"}}>
                <Skeleton loading={loading} active>
                    <Space size={"small"} wrap>
                        {tags.map((item, idx) => {
                            return <Popconfirm title={"Are you sure to remove this tag?"}
                                               onConfirm={() => onRemoveTag(item.tag.id)}
                                               key={`it_${idx}`}
                            >
                                {renderTicketTag(item.tag)}
                            </Popconfirm>
                        })}
                    </Space>
                </Skeleton>
                {renderAllTags()}
            </Space>
        </Skeleton>
    )
};

export default TicketTags;