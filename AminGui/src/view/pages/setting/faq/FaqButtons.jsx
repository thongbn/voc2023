import React, {useState} from "react";
import {useSelector} from "react-redux";
import {Button, Card, Form, Modal, Popconfirm, Space, Table} from "antd";
import {DeleteOutlined, EditOutlined, PlusOutlined} from "@ant-design/icons";
import FaqButtonForm from "./FaqButtonForm";

const FaqButtons = () => {
  const faqButtons = useState([]);

  const [form] = Form.useForm();
  const [editModalData, setEditModalData] = useState({
    visible: false,
    isLoading: false,
    isAddNew: false,
  });

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

  const onClickEdit = (record) => {
    console.log(record);
    form.setFieldsValue({
     ...record,
      active: record.active === "Active",
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

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "fBtn_title",
      render: (text, record) => {
        return (<Space size={"small"} direction="vertical">
          <div>{record.id} - {text}</div>
          <Space>
            <span>Type: {record.buttonType}</span>
            <span>|</span>
            <span>Sort: {record.sort}</span>
          </Space>
          <Space>
            <a onClick={() => onClickEdit(record)}><span className="gx-btn-link"><EditOutlined /> Edit</span></a>
            <Popconfirm title="Are you sure delete this task?" onConfirm={() => onConfirmDelete(1)}
                        okText="Yes"
                        cancelText="No">
              <a><span className="gx-btn-link gx-text-danger"><DeleteOutlined /> Delete</span></a>
            </Popconfirm>
          </Space>
        </Space>)
      }
    }
  ];


  return (<Card size={"small"} title={"Faq Category"}
                extra={<Space>
                  <Button size={"small"} icon={<PlusOutlined />} onClick={onClickAddNew} />
                </Space>}>
    <Table className="gx-table-responsive"
           columns={columns}
           dataSource={faqButtons}
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
      <FaqButtonForm form={form} />
    </Modal>
  </Card>);
};

export default FaqButtons;
