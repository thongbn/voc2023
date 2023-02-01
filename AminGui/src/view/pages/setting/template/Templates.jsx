import React, {useEffect, useState} from "react";
import {Button, Card, Form, Modal, Popconfirm, Space, Table, Tag} from "antd";
import {DeleteOutlined, EditOutlined, PlusOutlined} from "@ant-design/icons";
import TemplateForm from "./TemplateForm";

const Templates = () => {
  const [data, setData] = useState({
    list: [
      {
        id: 1,
        title: "Tra cứu AEON Vietnam",
        content: "Chào bạn, về sản phẩm/dịch vụ này bạn có thể liên hệ hotline và fanpage của Siêu thị AEON để được hỗ trợ bạn nhé! - Hotline: 02462507711 - Fanpage: https://www.facebook.com/AeonVietnamPage/ - Website AEONshop: https://aeoneshop.com Cảm ơn bạn!",
        categoryId: 1,
        category: {
          id: 1,
          name: "Aeon Delight"
        },
        status: "Active",
        sortOrder: 50
      }
    ],
    pagination: {
      page: 1,
      limit: 10
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
      title: record.title,
      content: record.content,
      categoryId: record.categoryId,
      status: record.status === "Active",
      sortOrder: record.sortOrder
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
      title: "Title",
      dataIndex: "title",
      key: "t_title",
    },
    {
      title: "Content",
      dataIndex: "content",
      key: "t_content"
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "t_category",
      render: (cell, record) => {
        return cell.name;
      }
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "t_status",
    },
    {
      title: "Action",
      dataIndex: "",
      key: "t_action",
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
    <Card title={"Answer templates"}
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
               current: data.pagination.page
             }}
      />
      <Modal title={"Edit"}
             maskClosable={false}
             visible={editModalData.visible}
             confirmLoading={editModalData.isLoading}
             onOk={() => onConfirmSubmit()}
             onCancel={() => handleCloseModal()}
      >
        <TemplateForm form={form} />
      </Modal>
    </Card>
  </>);
};

export default Templates;
