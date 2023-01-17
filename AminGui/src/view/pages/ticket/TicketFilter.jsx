import React from "react";
import {Button, Form, Input, Select, DatePicker} from "antd";
import moment from "moment";
import {Search} from "react-iconly";

const TicketFilter = ({form, onSubmit}) => {
    return (
        <Form form={form} onFinish={onSubmit} layout={"inline"} size={"small"}>
            <Form.Item name="type">
                <Select placeholder={"Chọn loại"} allowClear>
                    <Select.Option value="inbox">Inbox</Select.Option>
                    <Select.Option value="rating">Rating</Select.Option>
                    <Select.Option value="feedback">Custom</Select.Option>
                    <Select.Option value="feedback">Feedback</Select.Option>
                    <Select.Option value="comment">Comment</Select.Option>
                </Select>
            </Form.Item>
            <Form.Item name="id">
                <Input string={""} placeholder={"#Id"}/>
            </Form.Item>
            <Form.Item name="status">
                <Select placeholder={"Trạng thái"} allowClear>
                    <Select.Option value="1_new">New</Select.Option>
                    <Select.Option value="2_inProgress">In progress</Select.Option>
                    <Select.Option value="3_completed">Completed</Select.Option>
                </Select>
            </Form.Item>
            <Form.Item name="createdAt">
                <DatePicker
                    defaultValue={moment()}
                    format={"DD/MM/YYYY"}
                />
            </Form.Item>
            <Form.Item name="tags">
                <Select
                    placeholder={"Chọn tag"}
                    style={{minWidth: "200px"}}
                    showSearch
                    allowClear
                    mode="multiple"
                    optionFilterProp="children"
                    filterOption={(input, option) => (option?.label.toLowerCase() ?? '').includes(input.toLowerCase())}
                    filterSort={(optionA, optionB) =>
                        (optionA?.label ?? '')
                            .toLowerCase()
                            .localeCompare(
                                (optionB?.label ?? '')
                                .toLowerCase()
                            )
                    }
                    options={[
                        {
                            label: 'Manager',
                            options: [
                                {label: 'Jack', value: 'jack'},
                                {label: 'Lucy', value: 'lucy'},
                            ],
                        },
                        {
                            label: 'Engineer',
                            options: [{label: 'yiminghe', value: 'Yiminghe'}],
                        },
                    ]}
                />
            </Form.Item>
            <Form.Item>
                <Button htmlType={"submit"} type={"primary"} icon={<Search style={{width: "20px"}}/>}>Tìm kiếm</Button>
            </Form.Item>
        </Form>
    )
};

export default TicketFilter;