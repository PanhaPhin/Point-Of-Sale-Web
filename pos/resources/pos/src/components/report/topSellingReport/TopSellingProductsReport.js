import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {currencySymbolHendling, getFormattedMessage, placeholderText} from '../../../shared/sharedMethod';
import {fetchFrontSetting} from '../../../store/action/frontSettingAction';
import {fetchTopSellingReport} from '../../../store/action/topSellingReportAction';
import ReactDataTable from '../../../shared/table/ReactDataTable';
import TabTitle from '../../../shared/tab-title/TabTitle';
import MasterLayout from '../../MasterLayout';
import {fetchTopSellingExcel} from '../../../store/action/topSellingExcelAction';
import TopProgressBar from "../../../shared/components/loaders/TopProgressBar";

const TopSellingProductsReport = (props) => {
    const {
        isLoading,
        totalRecord,
        fetchTopSellingReport,
        frontSetting,
        fetchFrontSetting,
        topSellingReport,
        fetchTopSellingExcel,
        dates, allConfigData
    } = props;
    const currencySymbol = frontSetting && frontSetting.value && frontSetting.value.currency_symbol
    const [isWarehouseValue, setIsWarehouseValue] = useState(false);

    useEffect(() => {
        fetchFrontSetting();
    }, []);

    const itemsValue = currencySymbol && topSellingReport.length >= 0 && topSellingReport.map(top => ({
        code: top.code,
        product: top.name,
        price: top.price,
        quantity: top.total_quantity,
        grand_total: top.grand_total,
        sale_unit: top.sale_unit,
        currency: currencySymbol
    }));

useEffect(() => {
    if(isWarehouseValue === true) {
        fetchTopSellingExcel(dates, setIsWarehouseValue);
    }
}, [isWarehouseValue])

    const columns = [
        {
            name: getFormattedMessage('dashboard.stockAlert.code.label'),
            sortField: 'code',
            sortable: false,
            cell: row => {
                return <span className='badge bg-light-danger'>
                            <span>{row.code}</span>
                        </span>
            }
        },
        {
            name: getFormattedMessage('dashboard.stockAlert.product.label'),
            selector: row => row.product,
            sortField: 'product',
            sortable: false,
        },
        {
            name: getFormattedMessage('product.table.price.column.label'),
            selector: row => currencySymbolHendling(allConfigData, row.currency, row.price),
            sortField: 'price',
            sortable: false,
        },
        {
            name: getFormattedMessage('dashboard.stockAlert.quantity.label'),
            selector: row => row.quantity + ' ' + row.sale_unit,
            sortField: 'quantity',
            sortable: false,
            cell: row => {
                return <div>
                    <span className='badge bg-light-danger me-2'>
                            <span>{row.quantity}</span>
                    </span>
                    <span className='badge bg-light-primary me-2'>
                        <span>{row.sale_unit}</span>
                    </span>
                </div>
            }
        },
        {
            name: getFormattedMessage('purchase.grant-total.label'),
            selector: row => currencySymbolHendling(allConfigData, row.currency, row.grand_total),
            sortField: 'grand_total',
            sortable: false,
        },

    ];

    const onChange = (dates) => {
        fetchTopSellingReport(dates);
    };

    const onExcelClick = () => {
        setIsWarehouseValue(true);
    };

    return (
        <MasterLayout>
            <TopProgressBar />
            <TabTitle title={placeholderText('top-selling-product.reports.title')}/>
            <ReactDataTable columns={columns} items={itemsValue} isShowDateRangeField onChange={onChange}
                        isShowSearch
                        isLoading={isLoading} totalRows={totalRecord} isEXCEL onExcelClick={onExcelClick}/>
        </MasterLayout>
    )
};

const mapStateToProps = (state) => {
    const {isLoading, totalRecord, frontSetting, dates, topSellingReport, allConfigData} = state;
    return {isLoading, totalRecord, frontSetting, dates, topSellingReport, allConfigData}
};

export default connect(mapStateToProps, {fetchFrontSetting, fetchTopSellingReport, fetchTopSellingExcel})(TopSellingProductsReport);
