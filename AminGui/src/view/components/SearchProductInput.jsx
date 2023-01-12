import {Select} from "antd";
import React, {useEffect, useState} from "react";
import ApiHelper, {errorCatch} from "../../utils/ApiHelper";
import {formatNumber} from "../../utils/StringHelper";

const SearchProductInput = ({onChange}) => {
    const [searchLoading, setSearchLoading] = useState(false);
    const [dataList, setData] = useState([]);

    const onSearch = async (value) => {
        try {
            setSearchLoading(true);
            const res = await ApiHelper().get("/appointments/product-search", {
                params: {
                    s: value
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
        placeholder="Nhập tên hoặc id sản phẩm"
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
                {item.name} | Com: {item.commission}% | Giá: {formatNumber(item.price)}
            </Select.Option>)}
    </Select>;
};

export default SearchProductInput;