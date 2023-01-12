import {Select} from "antd";
import React, {useEffect, useState} from "react";
import ApiHelper, {errorCatch} from "../../utils/ApiHelper";

const SearchSaleInput = ({onChange}) => {
    const [searchSaleLoading, setSearchSaleLoading] = useState(false);
    const [saleList, setSaleList] = useState({
        latest: [],
        searchList: []
    });

    const onSearchSale = async (value) => {
        let searchList = {
            latest: [],
            searchList: [],
        };
        try {
            searchList.latest = JSON.parse(localStorage.getItem("saleSelected"));
        } catch (e) {
            localStorage.setItem("saleSelected", JSON.stringify([]));
        }

        try {
            setSearchSaleLoading(true);
            console.log(value);
            const res = await ApiHelper().get("/appointments/sale-search", {
                params: {
                    s: value
                }
            });
            const {data} = res.data;
            searchList.searchList = data;
        } catch (e) {
            errorCatch(e);
        } finally {
            setSearchSaleLoading(false);
        }
        setSaleList(searchList);
    };

    const onChangeSale = (value) => {
        console.log(value);
        const [saleId, saleName] = value.split("|");
        onChange(saleId, saleName);
    };

    return <Select
        placeholder="Nhập tên sale hoặc Id sale"
        showSearch
        loading={searchSaleLoading}
        allowClear
        size="small"
        filterOption={false}
        onFocus={() => onSearchSale(null)}
        onSearch={onSearchSale}
        onChange={onChangeSale}
    >
        {saleList.latest && saleList.latest.length > 0 && (
            <Select.OptGroup key={"opt_latest"} label={"Gần đây"}>
                {saleList.latest.map(item => <Select.Option key={`opt${item.id}`}
                                                            value={`${item.id}|${item.name}-${item.phone}`}>
                    {item.name} - {item.phone}
                </Select.Option>)}
            </Select.OptGroup>
        )}
        {saleList.searchList && saleList.searchList.length > 0 && (
            <Select.OptGroup key={"opt_search"} label={"Gợi ý"}>
                {saleList.searchList.map(item => <Select.Option key={`s${item.id}`}
                                                                value={`${item.id}|${item.name}-${item.phone}`}>
                    {item.name} - {item.phone}
                </Select.Option>)}
            </Select.OptGroup>
        )}
    </Select>;
};

export default SearchSaleInput;