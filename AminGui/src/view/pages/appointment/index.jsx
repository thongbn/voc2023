import React, {useCallback, useEffect, useState} from "react";

import {Button, Card, Space, Spin, Table, Tag, Divider, Form, Modal, message, Tooltip} from "antd";
import AppointmentSummary from "./AppointmentSummary";
import {Link} from "react-router-dom";
import AppointmentFilter from "./AppointmentFilter";
import AppointmentForm from "./AppointmentForm";
import {InfoCircle, Plus} from "react-iconly";
import ApiHelper, {errorCatch} from "../../../utils/ApiHelper";
import {formatNumber} from "../../../utils/StringHelper";

const Appointment = () => {

    const columns = [
        {
            key: "id",
            title: "Mã",
            dataIndex: "id",
            render: (text) => <Button type="link" onClick={() => onOpenDetail(text)}>#{text}</Button>,
        },
        {
            key: "customer",
            title: "Khách hàng",
            dataIndex: "customer",
            render: (customer, row) => {
                return <Space direction={"vertical"} size={"small"}>
                    <strong>{row.name}</strong>
                    <a className="hp-text-color-black-80 hp-text-color-dark-30"
                       href={`tel:${row.phone}`}>{row.phone}</a>
                    <a className="hp-text-color-black-80 hp-text-color-dark-30"
                       href={`mailto:${row.email}`}>{row.email}</a>
                </Space>
            }
        },
        {
            key: "note",
            title: "Ghi chú",
            dataIndex: "note",
            render: (val, row) => {
                return <Tooltip title={row.note}>
                    <InfoCircle/>
                </Tooltip>
            }
        },
        {
            key: "customerFinance",
            title: "Tài chính | Chiết khấu",
            dataIndex: "customerFinance",
            render: (val, row) => {
                return <Space size={"small"} split={<Divider type="vertical"/>}>
                    <span key={"cf_1"}>{val ? formatNumber(val) : 0}</span>
                    <span key={"cf_2"}>{row.selfCommission ? row.selfCommission : 0} %</span>
                </Space>
            }
        },
        {
            key: "status",
            title: "Trạng thái",
            dataIndex: "status",
            render: (val) => {
                return <Tag color={"blue"}>{val}</Tag>
            }
        },
        {
            key: "saleUser",
            title: "Phụ trách",
            dataIndex: "saleUser",
            render: (val, row) => {
                return <Space size={"small"} split={<Divider type="vertical"/>}>
                    <Tag key={"su_1"} color={"geekblue"}>{row.saleName}</Tag>
                    {row.order ? <Link key={"su_2"} to={`/transaction/${row.orderId}`}>
                        <a>#{row.orderId}</a>
                    </Link> : <small key={"su_3"}>Chưa lên đơn</small>}
                </Space>
            }
        },
    ];

    const [filterForm] = Form.useForm();
    const [editForm] = Form.useForm();

    const [editModalVisible, setEditModalVisible] = useState(false);
    const [currentSelected, setCurrentSelected] = useState(null);
    const [loading, setLoading] = useState(false);
    const [dataList, setDataList] = useState({
        data: [],
        pagination: {
            page: 1,
            limit: 20
        }
    });

    const [currentQuery, setCurrentQuery] = useState({
        name: undefined,
        phone: undefined,
        saleId: undefined,
        productId: undefined
    });

    const onClickAddAppointment = () => {
        setCurrentSelected(null);
        setEditModalVisible(true);
    };

    const onSubmitEditModal = async (values) => {
        console.log(values);
        try {
            setLoading(true);
            if (currentSelected && currentSelected.id) {
                if (currentSelected.status !== "1_new") {
                    message.warn("Không thể cập nhập lịch hẹn đã xử lý");
                    return;
                }
                await ApiHelper().put(`/appointments/${currentSelected.id}`, values);
                message.success("Cập nhập thành công");
                await searchAppointment(dataList.pagination.page, currentQuery);
            } else {
                await ApiHelper().post("/appointments", values);
                await searchAppointment(1, {});
                onCloseEditModal();
            }
        } catch (e) {
            errorCatch(e, editForm);
        } finally {
            setLoading(false);
        }
    };

    const onCloseEditModal = () => {
        editForm.resetFields();
        setEditModalVisible(false)
    };

    const onSearchAppointment = async (values) => {
        await searchAppointment(1, values);
    };

    //DETAIL
    const onOpenDetail = async (id) => {
        try {
            setLoading(true);
            const res = await ApiHelper().get(`/appointments/${id}`);
            console.log(res.data);
            const {data} = res.data;
            let editFormData = [];

            const fieldAllowed = [
                'id', 'name', 'email', 'phone'
                , 'address', 'district', 'city'
                , 'note', 'saleId', 'customerFinance'
                , 'selfCommission'
            ];

            for (let objKey in data) {
                if (!data.hasOwnProperty(objKey) || !fieldAllowed.includes(objKey)) {
                    continue;
                }
                editFormData.push({
                    name: objKey,
                    value: data[objKey]
                });
            }

            //FIXME HARD CODE PRODUCT
            if (data.products && data.products.length > 0) {
                editFormData.push({
                    name: "product",
                    value: data.products[0]
                });
                data['product'] = data.products[0];
            }

            console.log(editFormData);
            editForm.setFields(editFormData);
            setEditModalVisible(true);
            setCurrentSelected(data);
        } catch (e) {
            errorCatch(e);
        } finally {
            setLoading(false);
        }
    };

    const searchAppointment = async (page, query) => {
        try {
            setLoading(true);
            console.log(query);
            //Preload query
            const formatQuery = {
                name: query.name && query.name.length > 0 ? `substring:${query.name}%` : undefined,
                phone: query.phone && query.phone.length > 0 ? `substring:${query.phone}%` : undefined,
                status: query.status,
                saleId: query.saleId,
                page
            };

            const res = await ApiHelper().get("/appointments", {
                params: formatQuery
            });
            console.log(res.data);
            setDataList(res.data);
            setCurrentQuery(query);
        } catch (e) {
            await message.error(e.message);
        } finally {
            setLoading(false);
        }
    };

    const onChangePage = async (page) => {
        await searchAppointment(page, currentQuery);
    };

    useEffect(async () => {
        await searchAppointment(1, currentQuery);
    }, []);

    return <Spin spinning={loading}>
        <Space direction={"vertical"} style={{width: "100%"}}>
            {/*<AppointmentSummary key={"ss"}/>*/}
            <Card title="Lịch hẹn" extra={[
                <Button key="ap_cb1" type={"link"} size={"small"}
                        onClick={() => onClickAddAppointment()}
                        icon={<Plus className="remix-icon"/>}>
                    Tạo mới
                </Button>
            ]}>
                <AppointmentFilter key="af" form={filterForm} onSubmit={onSearchAppointment}/>
                <Table columns={columns}
                       dataSource={dataList.data}
                       size="small"
                       scroll={{x: 500}}
                       key={"tbl"}
                       pagination={
                           {
                               pageSize: dataList.pagination.limit,
                               current: dataList.pagination.page,
                               onChange: onChangePage,
                           }
                       }
                />
            </Card>

            <Modal title={currentSelected ? `Lịch hẹn: ${currentSelected.name} | ${currentSelected.phone} `
                : "Lịch hẹn"}
                   centered
                   onCancel={onCloseEditModal}
                   open={editModalVisible}
                   width={1000}
                   key={"md"}
                   footer={[
                       <Button key="back" onClick={onCloseEditModal}>
                           Hủy
                       </Button>,
                       <Button key="submit" type="primary" loading={loading} onClick={editForm.submit}>
                           Gửi
                       </Button>,
                   ]}
            >
                <AppointmentForm appointment={currentSelected}
                                 form={editForm}
                                 loading={loading}
                                 onSubmit={onSubmitEditModal}/>
            </Modal>
        </Space>
    </Spin>;
};

export default Appointment;
