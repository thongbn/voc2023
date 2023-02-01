import React, {useEffect, useState} from "react";
import {Button, Card, Form, Modal, Popconfirm, Space, Table, Tag} from "antd";
import {DeleteOutlined, EditOutlined, PlusOutlined} from "@ant-design/icons";
import {useSelector} from "react-redux";
import TagForm from "./TagForm";

const Tags = () => {
    const tags = useState([]);

    const [editModalData, setEditModalData] = useState({
        visible: false,
        isLoading: false,
        isAddNew: false,
    });

    const [form] = Form.useForm();

    useEffect(() => {

    }, []);

    const onClickEdit = (record) => {
        form.setFieldsValue({
            id: record.id,
            name: record.name,
            color: record.color,
            groupTagId: record.groupTag.id,
            keywords: record.keywords.map(item => item.name),
            active: record.active === "Active"
        });
        setEditModalData({
            ...editModalData,
            visible: true,
            isAddNew: false,
        })
    };

    const onConfirmDelete = (id) => {

    };

    const onConfirmSubmit = () => {

    };

    const onChangePage = (page, pageSize) => {

    };

    const onClickAddNew = () => {
        form.resetFields();
        setEditModalData({
            ...editModalData,
            visible: true,
            isAddNew: true
        })
    };

    const handleCloseModal = () => {
        setEditModalData({
            ...editModalData,
            visible: false
        })
    };


    const columns = [
        {
            title: "#ID",
            dataIndex: "id",
            key: "tag_id",
            // render: (text , record) => {}
        },
        {
            title: "Name",
            dataIndex: "name",
            key: "tag_name",
        },
        {
            title: "Group Tag",
            dataIndex: "groupTag",
            key: "tag_gtag",
            render: (cell, record) => {
                return (<Tag color={cell?.color}>{cell?.type}</Tag>)
            }
        },
        {
            title: "Keyword",
            dataIndex: "keywords",
            key: "tag_kw",
            render: (cell, record) => {
                return <Space wrap={true}>
                    {cell?.map(item => (
                        <Tag color={"default"}>
                            {item.name}
                        </Tag>
                    ))}
                </Space>
            }
        },
        {
            title: "Active",
            dataIndex: "active",
            key: "tag_active",
        },
        {
            title: "Action",
            dataIndex: "",
            key: "tag_action",
            render: (text, record) => {
                return (<Space>
                    <a onClick={() => onClickEdit(record)}><span className="gx-btn-link"><EditOutlined/> Edit</span></a>
                    <Popconfirm title="Are you sure delete this task?" onConfirm={() => onConfirmDelete(1)}
                                okText="Yes"
                                cancelText="No">
                        <a><span className="gx-btn-link gx-text-danger"><DeleteOutlined/> Delete</span></a>
                    </Popconfirm>
                </Space>)
            }
        }
    ];

    return (<>
        <Card title={"Tag"}
              size={"small"}
              extra={<Button type="dashed" size={"small"} icon={<PlusOutlined/>}
                             onClick={() => onClickAddNew()}/>
              }>
            <Table className="gx-table-responsive"
                   columns={columns}
                   dataSource={tags}
                   pagination={{
                       onChange: onChangePage,
                       size: "small",
                       simple: true,
                       current: 1
                   }}
            />
            <Modal title={"Edit"}
                   maskClosable={false}
                   visible={editModalData.visible}
                   confirmLoading={editModalData.isLoading}
                   onOk={() => onConfirmSubmit()}
                   onCancel={() => handleCloseModal()}
            >
                <TagForm form={form}/>
            </Modal>
        </Card>
    </>);
};

export default Tags;
