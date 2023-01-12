import React, {memo} from "react";
import SummaryItem from "../../components/widgets/cards/statistics/summaryItem";
import {formatNumber} from "../../../utils/StringHelper";

const RevenueItem = ({data = []}) => {

    let total = 0;
    const d = data.map((item)=>{
        total += item.total;
        return item.total;
    });

    const dataChart = {
        series: [
            {
                data: d,
            },
        ],
        options: {
            chart: {
                fontFamily: "Manrope, sans-serif",
                type: "line",
                toolbar: {
                    show: false,
                },
                zoom: {
                    enabled: false,
                },
            },
            colors: ["#00f7bf"],
            stroke: {
                curve: "smooth",
                lineCap: "round",
            },
            tooltip: {
                enabled: true,
            },
            dataLabels: {
                enabled: false,
            },
            grid: {
                show: false,
                padding: {
                    left: 0,
                    right: 0,
                },
            },
            xaxis: {
                lines: {
                    show: false,
                },
                axisBorder: {
                    show: false,
                },
                axisTicks: {
                    show: false,
                },
                tooltip: {
                    enabled: false,
                },
                labels: {
                    show: false,
                },
            },
            responsive: [
                {
                    breakpoint: 426,
                    options: {
                        legend: {
                            itemMargin: {
                                horizontal: 16,
                                vertical: 8,
                            },
                        },
                    },
                },
            ],
            yaxis: [
                {
                    show: false,
                    labels: {
                        formatter: function(val) {
                            return formatNumber(val);
                        }
                    },
                    offsetX: 0,
                    offsetY: 0,
                    padding: {
                        left: 0,
                        right: 0,
                    },
                },
            ],
        },
    };

    return <SummaryItem
        chartData={dataChart}
        title="Doanh thu"
        type="success"
        total={total}
    />
};

export default memo(RevenueItem);