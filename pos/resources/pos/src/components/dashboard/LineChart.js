import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import {Line} from 'react-chartjs-2';
import {connect} from 'react-redux';
import {weekSalePurchases} from '../../store/action/weeksalePurchaseAction';
import {yearlyTopProduct} from '../../store/action/yearlyTopProductAction';
import {placeholderText} from "../../shared/sharedMethod";

const LineChart = (props) => {
    const {weekSalePurchase, frontSetting} = props

    ChartJS.register(
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        Title,
        Tooltip,
        Legend
    );

    const currency = frontSetting ? frontSetting.value && frontSetting.value.currency_symbol : ' $';
    const valueFormatter = (tooltipItems) => {
        const value = (tooltipItems.dataset.data[tooltipItems.dataIndex])
        const label = tooltipItems.dataset.label
        return label + ' : ' + `${currency ? currency : ''} ` + value.toFixed(2)
    };

    const yFormatter = (yValue) => {
        const value = yValue
        return `${currency ? currency : ''} ` + value.toFixed(2)
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                callbacks: {
                    label: (tooltipItems, data) => valueFormatter(tooltipItems)
                }
            },
        },
        scales: {
            y: {
                ticks: {
                    callback: (value, index, values) => yFormatter(value)
                },
                title: {
                    display: true,
                    text: placeholderText("expense.input.amount.label"),
                    align: 'center'
                }
            }
        },
    };

    const labels = weekSalePurchase ? weekSalePurchase.dates : '';

    const data = {
        labels,
        datasets: [
            {
                label: placeholderText("sales.title"),
                data: weekSalePurchase ? weekSalePurchase.sales : '',
                borderColor: '#6571FF',
                backgroundColor: '#A3AAFF',
            },
            {
                label: placeholderText("purchases.title"),
                data: weekSalePurchase ? weekSalePurchase.purchases : '',
                borderColor: '#38c074',
                backgroundColor: '#6CD9AC',
            },
        ],
    };
    return <Line options={options} data={data} height={100}/>
}

const mapStateToProps = (state) => {
    const {weekSalePurchase, yearTopProduct} = state;
    return {weekSalePurchase, yearTopProduct}
};

export default connect(mapStateToProps, {weekSalePurchases, yearlyTopProduct})(LineChart);

