import React, {useEffect, useState} from "react";
import {Button, Card, Form, Modal, Popconfirm, Space, Table} from "antd";
import {DeleteOutlined, EditOutlined, PlusOutlined} from "@ant-design/icons";
import FaqForm from "./FaqForm";

const FaqList = () => {
  const [data, setData] = useState({
    list: [
      {
        id: 1,
        title: "Giải trí (Rạp chiếu phim, Khu vui chơi,...)",
        title_en: "Entertainment (Theater, Playing Ground,..)",
        content: "<p>M</p>",
        content_en: "<p>M</p>",
        category: {
          id: 1,
          name: "KV Công cộng tại TTTM"
        },
        buttons: [],
        active: "Active",
        sort: 50
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
      ...record,
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
      key: "faq_id",
      // render: (text , record) => {}
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "faq_title",
      render: (text, record) => {
        return <Space direction="vertical">
          <div>{text}</div>
          <i>{record.title_en}</i>
        </Space>
      }
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "faq_category",
      render: (text, record) => {
        return <div>{text.name}</div>
      }
    },
    {
      title: "Active",
      dataIndex: "active",
      key: "faq_active",
    },
    {
      title: "Sort",
      dataIndex: "sort",
      key: "faq_sort",
    },
    {
      title: "Action",
      dataIndex: "",
      key: "faq_action",
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
    <Card title={"Faq List"}
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
             width={"80%"}
             maskClosable={false}
             visible={editModalData.visible}
             confirmLoading={editModalData.isLoading}
             onOk={() => onConfirmSubmit()}
             onCancel={() => handleCloseModal()}
      >
        <FaqForm form={form} />
      </Modal>
    </Card>
  </>);
};

export default FaqList;
