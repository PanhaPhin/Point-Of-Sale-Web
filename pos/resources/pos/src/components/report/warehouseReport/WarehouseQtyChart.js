import React from 'react';
import {AgChartsReact} from 'ag-charts-react';

const WarehouseQtyChart = () => {
    const options = {
        data: [
            {label: 'Warehouse 1', value: 56.9},
            {label: 'Warehouse 2', value: 22.5},
        ],
        series: [
            {
                type: 'pie',
                angleKey: 'value',
                labelKey: 'label',
                label: {enabled: false},
                fills: [
                    '#4199ff',
                    '#51e7a6',
                ],
                strokes: [
                    '#4199ff',
                    '#51e7a6',
                ],
            },
        ],
    };

    return (
        <AgChartsReact options={options}/>
    )
};
export default WarehouseQtyChart;
