import React, {} from "react";
import {Button, Form, Input, Select, DatePicker, message} from "antd";
import moment from "moment";
import {
    CASE_STATUS, CASE_TYPE_COMMENT,
    CASE_TYPE_CUSTOM, CASE_TYPE_FEEDBACK,
    CASE_TYPE_MESSAGE,
    CASE_TYPE_RATING,
    PLATFORMS
} from "../../../configs/appConfig";
import {useSelector} from "react-redux";
import {RiSearch2Line} from "react-icons/ri";

const TicketFilter = ({form, onSubmit}) => {
    const {tagCategories} = useSelector(({tag}) => tag);

    return (
        <Form form={form} onFinish={onSubmit} layout={"inline"} size={"small"}>
            <Form.Item name="type">
                <Select placeholder={"Chọn loại"} allowClear>
                    <Select.Option value={CASE_TYPE_MESSAGE}>Inbox</Select.Option>
                    <Select.Option value={CASE_TYPE_RATING}>Rating</Select.Option>
                    <Select.Option value={CASE_TYPE_CUSTOM}>Custom</Select.Option>
                    <Select.Option value={CASE_TYPE_FEEDBACK}>Feedback</Select.Option>
                    <Select.Option value={CASE_TYPE_COMMENT}>Comment</Select.Option>
                </Select>
            </Form.Item>
            <Form.Item name="platform">
                <Select placeholder={"Chọn hệ thống"} allowClear>
                    {Object.keys(PLATFORMS).map(key => {
                        return <Select.Option value={key} key={`p_s${key}`}>
                            {PLATFORMS[key].name}
                        </Select.Option>
                    })}
                </Select>
            </Form.Item>
            <Form.Item name="id">
                <Input string={""} placeholder={"#Id"}/>
            </Form.Item>
            <Form.Item name="caseStatus">
                <Select placeholder={"Trạng thái"} allowClear>
                    {Object.keys(CASE_STATUS).map(key => {
                        return <Select.Option value={key} key={`p_cs${key}`}>
                            {CASE_STATUS[key].name}
                        </Select.Option>
                    })}
                </Select>
            </Form.Item>
            <Form.Item name="createdAt">
                <DatePicker
                    defaultValue={moment()}
                    format={"DD/MM/YYYY"}
                    picker="date"/>
            </Form.Item>
            <Form.Item name="tags">
                <Select
                    placeholder={"Chọn tag"}
                    style={{minWidth: "200px"}}
                    showSearch
                    allowClear
                    mode="multiple"
                    optionFilterProp="children"
                    filterOption={(input, option) => {
                        console.log(option);
                        return (
                            (option?.children?.toLowerCase() ?? '').includes(input.toLowerCase())
                        )
                    }}
                    filterSort={(optionA, optionB) =>
                        (optionA?.label ?? '')
                            .toLowerCase()
                            .localeCompare(
                                (optionB?.label ?? '')
                                    .toLowerCase()
                            )
                    }
                >
                    {tagCategories?.map((tagCategory, idx) => {
                        return <Select.OptGroup label={tagCategory.name} key={`t_sog${idx}`}>
                            {tagCategory.tags.map((tag, idx2) => {
                                return <Select.Option value={tag.id} key={`t_t_${idx}${idx2}`}>
                                    {tag.tag_name}
                                </Select.Option>
                            })}
                        </Select.OptGroup>
                    })}
                </Select>
            </Form.Item>
            <Form.Item>
                <Button htmlType={"submit"} type={"primary"}
                        icon={<RiSearch2Line className="remix-icon"/>}>
                    Tìm kiếm
                </Button>
            </Form.Item>
        </Form>
    )
};

export default TicketFilter;