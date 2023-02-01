import React, {useState} from "react";
import {Button, Card, Form, Modal, Space, Tag} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import TemplateCategoryForm from "./TemplateCategoryForm";
import {useSelector} from "react-redux";

const TemplateCategories = () => {

  const [form] = Form.useForm();
  const [templateCategories] = useState([]);

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
      id: record.id,
      name: record.name,
    });
    setEditModalData({
      ...editModalData,
      visible: true,
      isAddNew: false,
    })
  };

  const onConfirmSubmit = () => {

  };

  return (<Card size={"small"} title={"Template Categories"}
                extra={<Space>
                  <Button size={"small"} icon={<PlusOutlined />} onClick={onClickAddNew} />
                </Space>}>
    <Space wrap={true}>
      {templateCategories.map(item => {
        return <Tag onClick={() => onClickEdit(item)}
                    key={`gt_${item.id}`}
                    color={item.status === "Active" ? "cyan" : "default"}>
          {item.name}
        </Tag>;
      })}
    </Space>
    <Modal title={"Edit"}
           maskClosable={false}
           visible={editModalData.visible}
           confirmLoading={editModalData.isLoading}
           onOk={() => onConfirmSubmit()}
           onCancel={() => handleCloseModal()}
    >
      <TemplateCategoryForm form={form} />
    </Modal>
  </Card>);
};

export default TemplateCategories;
