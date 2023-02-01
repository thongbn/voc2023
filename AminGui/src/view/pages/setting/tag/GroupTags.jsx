import React, {useState} from "react";
import {Button, Card, Form, Modal, Space, Tag} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import GroupTagForm from "./GroupTagForm";
import {useSelector} from "react-redux";

const GroupTags = () => {

  const {tagCategories} = useSelector(({tag}) => tag);

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
      type: record.type,
      status: record.status === "Active",
      color: record.color,
      sortOrder: record.sortOrder
    });
    setEditModalData({
      ...editModalData,
      visible: true,
      isAddNew: false,
    })
  };

  const onConfirmSubmit = () => {

  };

  return (<Card size={"small"} title={"Group tags"}
                extra={<Space>
                  <Button size={"small"} icon={<PlusOutlined />} onClick={onClickAddNew} />
                </Space>}>
    <Space wrap={true}>
      {tagCategories.map(item => {
        return <Tag onClick={() => onClickEdit(item)}
                    key={`gt_${item.id}`}
                    color={item.status === "Active" ? item.color : "default"}>
          {`${item.id} - ${item.type}(${item.sortOrder})`}
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
      <GroupTagForm form={form} />
    </Modal>
  </Card>);
};

export default GroupTags;
