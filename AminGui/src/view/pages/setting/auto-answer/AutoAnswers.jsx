import React, {useEffect, useState} from "react";
import {Button, Card, Form, Modal, Popconfirm, Space, Table, Tag} from "antd";
import {DeleteOutlined, EditOutlined, PlusOutlined} from "@ant-design/icons";
import AutoAnswerForm from "./AutoAnswerForm";

const AutoAnswers = () => {
  const [data, setData] = useState({
    list: [
      {
        id: 1,
        content: "AEON MALL Long Biên xin kính chào quý khách. Cảm ơn quý khách đã quan tâm đến dịch vụ của chúng tôi! Hiện tại, các gian hàng vui chơi, giải trí đã mở cửa hoạt động trở lại, kính mời quý khách đến trải nghiệm những dịch vụ khác tại AEON MALL Long Biên. Rất mong được đón tiếp quý khách.",
        maxWords: 15,
        keywords: [
          {
            name: "covid"
          }
        ],
        active: "Active",
        sortOrder: 50
      }
    ],
    pagination: {
      page: 1,
      limit: 20
    }
  });

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
      content: record.content,
      maxWords: record.maxWords,
      keywords: record.keywords.map(item => item.name),
      sortOrder: record.sortOrder,
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
      title: "Content",
      dataIndex: "content",
      key: "aa_content",
    },
    {
      title: "Max Words",
      dataIndex: "maxWords",
      key: "aa_mw"
    },
    {
      title: "Keyword",
      dataIndex: "keywords",
      key: "tag_kw",
      render: (cell, record) => {
        return <Space wrap={true}>
          {cell.map(item => (
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
      key: "aa_active",
    },
    {
      title: "Action",
      dataIndex: "",
      key: "aa_action",
      render: (text, record) => {
        return (<Space>
          <a onClick={() => onClickEdit(record)}><span className="gx-btn-link"><EditOutlined /> Edit</span></a>
          <Popconfirm title="Are you sure delete this task?" onConfirm={() => onConfirmDelete(1)}
                      okText="Yes"
                      cancelText="No">
            <a><span className="gx-btn-link gx-text-danger"><DeleteOutlined /> Delete</span></a>
          </Popconfirm>
        </Space>)
      }
    }
  ];

  return (<>
    <Card title={"Auto answers"}
          size={"small"}
          extra={<Button type="dashed" size={"small"} icon={<PlusOutlined />}
                         onClick={() => onClickAddNew()} />
          }>
      <Table className="gx-table-responsive"
             columns={columns}
             dataSource={data.list}
             pagination={{
               onChange: onChangePage,
               size: "small",
               simple: true,
               current: data.pagination.page,
               pageSize: data.pagination.limit
             }}
      />
      <Modal title={"Edit"}
             maskClosable={false}
             visible={editModalData.visible}
             confirmLoading={editModalData.isLoading}
             onOk={() => onConfirmSubmit()}
             onCancel={() => handleCloseModal()}
      >
        <AutoAnswerForm form={form} />
      </Modal>
    </Card>
  </>);
};

export default AutoAnswers;
