import React, {useState} from "react";
import ApiHelper, {errorCatch} from "../../utils/ApiHelper";
import {Select, Typography} from "antd";

const SearchTemplateInput = ({onChange}) => {
    const [searchLoading, setSearchLoading] = useState(false);
    const [dataList, setData] = useState([]);

    const onSearch = async (value) => {
        try {
            setSearchLoading(true);
            const res = await ApiHelper().get("/templates", {
                params: {
                    s: value,
                    limit: 5
                }
            });
            const {data} = res.data;
            console.log(data);
            setData(data);
        } catch (e) {
            errorCatch(e);
        } finally {
            setSearchLoading(false);
        }
    };

    return <Select
        placeholder="Nhập id hoặc nội dung template"
        showSearch
        loading={searchLoading}
        allowClear
        size="small"
        filterOption={false}
        onSearch={onSearch}
        onFocus={() => onSearch(null)}
        onChange={val => {
            onChange(val, dataList[val]);
        }}
    >
        {dataList.map((item, index) =>
            <Select.Option key={`opt${item.id}`}
                           value={index}>
                <Typography.Paragraph>
                    <Typography.Text type="secondary">
                        {item.title}
                    </Typography.Text>
                    <Typography.Paragraph>
                        {item.content}
                    </Typography.Paragraph>
                </Typography.Paragraph>
            </Select.Option>)}
    </Select>;
};

export default SearchTemplateInput;