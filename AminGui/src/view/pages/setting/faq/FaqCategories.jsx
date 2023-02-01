import React, {useState} from "react";
import {Button, Card, Form, Modal, Space, Tag} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import {useSelector} from "react-redux";
import FaqCategoryForm from "./FaqCategoryForm";

const FaqCategories = () => {

  const categories = useState([]);

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
      id: record.id,
      name: record.name,
      active: record.active === "Active",
      sort: record.sort
    });
    setEditModalData({
      ...editModalData,
      visible: true,
      isAddNew: false,
    })
  };

  const onConfirmSubmit = () => {

  };

  return (<Card size={"small"} title={"Faq Category"}
                extra={<Space>
                  <Button size={"small"} icon={<PlusOutlined />} onClick={onClickAddNew} />
                </Space>}>
    <Space wrap={true}>
      {categories.map(item => {
        return <Tag onClick={() => onClickEdit(item)}
                    key={`gt_${item.id}`}
                    color={item.active === "Active" ? "cyan" : "default"}>
          {`${item.id} - ${item.name}(${item.sort})`}
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
      <FaqCategoryForm form={form} />
    </Modal>
  </Card>);
};

export default FaqCategories;
