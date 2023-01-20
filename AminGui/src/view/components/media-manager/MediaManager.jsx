import React, {memo, useEffect, useState} from "react";
import {Col, Row, Image, message, Button, Pagination, Upload, Skeleton, Popconfirm, Typography, Space} from "antd";
import qs from "qs";
import ApiHelper from "../../../utils/ApiHelper";
import {
    RiUpload2Line,
    RiDeleteBin2Line,
    RiCheckLine,
    RiFilePdfLine,
    RiMovieLine,
    RiFileUnknowLine
} from "react-icons/ri";

const validMime = [
    'image/jpeg',
    'image/png',
    'application/pdf',
    "video/mp4",
    "audio/mp4",
    "application/mp4",
    "application/x-mpegURL",
    "video/quicktime"
];

const MediaManager = ({showSelect = false, onSelectImage}) => {
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [file, setFile] = useState(null);
    const [dataList, setDataList] = useState({
        data: [],
        pagination: {
            page: 1,
            limit: 20
        }
    });

    useEffect(() => {
        searchModels(1);
    }, []);

    const searchModels = async (page = 1) => {
        try {
            console.log("Get Media");
            setLoading(true);
            // //Preload query
            const formatQuery = {
                // name: ,
                page,
                sort: "-id"
            };

            const q = qs.stringify(formatQuery, {
                    encodeValuesOnly: true,
                    skipNulls: true
                }
            );

            const res = await ApiHelper().get(`/media?${q}`);
            console.log(res.data);
            setDataList(res.data);
        } catch (e) {
            await message.error(e.message);
        } finally {
            setLoading(false);
        }
    };

    const onChangePage = async (page) => {
        await searchModels(page);
    };

    const onBeforeUpload = (file) => {
        setFile(file);
        return Upload.LIST_IGNORE;
    };

    const validateUploadFile = () => {
        const isValid = (validMime.findIndex(item => item === file.type)) >= 0;
        if (!isValid) {
            const m = `${file.name} | ${file.type} is not supported`;
            message.error(m);
            throw new Error(m);
        }

        const isLt10M = file.size / 1024 / 1024 < 10;
        if (!isLt10M) {
            const m = `File must smaller than 10MB!`;
            message.error('Image must smaller than 2MB!');
            throw new Error(m);
        }
    };

    const onChangeUpload = async () => {
        try {
            setUploading(true);
            validateUploadFile();
            const formData = new FormData();
            formData.append("mediaFile", file);
            await ApiHelper().post(`/media/upload`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
            message.success("Upload successfully");
            setFile(null);
            await searchModels();
        } catch (e) {
            message.error(e.message);
        } finally {
            setUploading(false);
        }
    };

    const onRemoveItem = async (id) => {
        try {
            setUploading(true);
            await ApiHelper().delete(`/media/${id}`);
            message.success("Delete file successfully");
            await searchModels(dataList.pagination.page);
        } catch (e) {
            message.error(e.message);
        } finally {
            setUploading(false);
        }
    };

    const renderItem = (item) => {
        switch (item.mime) {
            case "image/png":
            case "image/jpeg": {
                return <Image width={"100%"}
                              height={150}
                              src={process.env.REACT_APP_RESOURCE_URL + item.path}/>;
            }
            case "application/pdf": {
                return <div className="hp-d-flex hp-d-flex-column hp-align-items-center"
                            style={{height: "150px"}}
                >
                    <RiFilePdfLine size={80}/>
                    <Typography.Text ellipsis>
                        {item.name}
                    </Typography.Text>
                    {item.mime}
                </div>
            }
            case "video/mp4":
            case "audio/mp4":
            case "application/mp4":
            case "application/x-mpegURL":
            case "video/quicktime":
                return <div className="hp-d-flex hp-d-flex-column hp-align-items-center"
                            style={{height: "150px"}}
                >
                    <RiMovieLine size={80}/>
                    <Typography.Text ellipsis>
                        {item.name}
                    </Typography.Text>
                    {item.mime}
                </div>
            default:
                return <div className="hp-d-flex hp-d-flex-column hp-align-items-center"
                            style={{height: "150px"}}
                >
                    <RiFileUnknowLine size={80}/>
                    <Typography.Text ellipsis>
                        {item.name}
                    </Typography.Text>
                    {item.mime}
                </div>;
        }
    };

    return (
        <Row gutter={[8]}>
            <Col md={18}>
                <Skeleton loading={loading} active>
                    <Row gutter={[8, 8]}>
                        {dataList.data.map((item, idx) => {
                            return (
                                <Col xs={12} md={8} lg={6} xxl={4} key={`media_${idx}`}>
                                    <div className="media-item">
                                        {renderItem(item)}
                                        <div style={{
                                            marginTop: "8px",
                                            display: "flex",
                                            justifyContent: "space-around"
                                        }}>
                                            {showSelect &&
                                            <Button size="small"
                                                    type="primary"
                                                    icon={<RiCheckLine className="remix-icon"/>}
                                                    onClick={onSelectImage}
                                                    style={{width: "120px"}}
                                            >
                                                Select
                                            </Button>}
                                            <Popconfirm
                                                title={"Remove this item"}
                                                description={"Are you sure to remove this media?"}
                                                onConfirm={() => onRemoveItem(item.id)}
                                                onText={"Yes"}
                                                cancelText={"No"}
                                            >
                                                <Button size="small"
                                                        type="dashed"
                                                        danger
                                                        shape={showSelect ? "circle" : "round"}
                                                        icon={<RiDeleteBin2Line className="remix-icon"/>}
                                                >
                                                    {showSelect ? "" : "Remove"}
                                                </Button>
                                            </Popconfirm>
                                        </div>
                                    </div>
                                </Col>
                            )
                        })}
                        <Col xs={24}>
                            <Pagination
                                pageSize={dataList.pagination.limit}
                                current={dataList.pagination.page}
                                onChange={onChangePage}
                            />
                        </Col>
                    </Row>
                </Skeleton>
            </Col>
            <Col md={6}>
                <div className="hp-d-flex hp-d-flex-column hp-d-flex-justify-center hp-d-flex-center">
                    <Upload beforeUpload={onBeforeUpload}
                            accept={validMime.join(",")}
                            name={"mediaFile"}
                            className="upload-media"
                            maxCount={1}
                            fileList={file ? [file] : []}
                    >
                        <Button disabled={uploading}
                                icon={<RiUpload2Line className="remix-icon"/>}
                        >
                            Click to Upload
                        </Button>
                    </Upload>
                    <Button
                        type={"primary"}
                        icon={<RiUpload2Line className="remix-icon"/>}
                        onClick={onChangeUpload}
                        disabled={uploading || file === null}
                        loading={uploading}
                        style={{
                            width: "100%"
                        }}
                    >
                        {uploading ? 'Uploading' : "Start Upload"}
                    </Button>
                </div>
            </Col>
        </Row>
    )
};

export default memo(MediaManager);