import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import moment from 'moment';
import MasterLayout from '../../MasterLayout';
import TabTitle from '../../../shared/tab-title/TabTitle';
import {currencySymbolHendling, getFormattedMessage, placeholderText} from '../../../shared/sharedMethod';
import ReactDataTable from '../../../shared/table/ReactDataTable';
import {fetchPurchases} from '../../../store/action/purchaseAction';
import {fetchAllWarehouses} from '../../../store/action/warehouseAction';
import {fetchAllSuppliers} from '../../../store/action/supplierAction';
import {fetchFrontSetting} from '../../../store/action/frontSettingAction';
import {totalPurchaseReportExcel} from '../../../store/action/totalPurchaseReportExcel';
import TopProgressBar from "../../../shared/components/loaders/TopProgressBar";

const PurchaseReport = (props) => {
    const {
        fetchPurchases,
        fetchAllWarehouses,
        fetchAllSuppliers,
        purchases,
        totalRecord,
        isLoading,
        suppliers,
        frontSetting,
        fetchFrontSetting, totalPurchaseReportExcel, dates, allConfigData
    } = props;

    const [isWarehouseValue, setIsWarehouseValue] = useState(false);
    const currencySymbol = frontSetting && frontSetting.value && frontSetting.value.currency_symbol

    useEffect(() => {
        if (isWarehouseValue === true) {
            totalPurchaseReportExcel(dates, setIsWarehouseValue);
            setIsWarehouseValue(false);
        }
    }, [isWarehouseValue])

    useEffect(() => {
        fetchFrontSetting();
    }, []);

    const itemsValue = currencySymbol && purchases.length >= 0 && purchases.map((purchase) => {
        const supplier = suppliers.filter((supplier) => supplier.id === purchase.attributes.supplier_id);
        const supplierName = supplier[0] && supplier[0].attributes && supplier[0].attributes.name
        return ({
            reference_code: purchase.attributes.reference_code,
            supplier: supplierName,
            warehouse: purchase.attributes.warehouse_name,
            status: purchase.attributes.status,
            paid: 0,
            due: 0,
            payment: purchase.attributes.payment_type,
            date: moment(purchase.attributes.date).format('YYYY-MM-DD'),
            time: moment(purchase.attributes.created_at).format('LT'),
            grand_total: purchase.attributes.grand_total,
            id: purchase.id,
            currency: currencySymbol
        })
    });

    const columns = [
        {
            name: getFormattedMessage('dashboard.recentSales.reference.label'),
            sortField: 'reference_code',
            sortable: true,
            cell: row => {
                return <span className='badge bg-light-danger'>
                            <span>{row.reference_code}</span>
                        </span>
            }
        },
        {
            name: getFormattedMessage('supplier.title'),
            selector: row => row.supplier,
            sortField: 'supplier',
            sortable: false,
        },
        {
            name: getFormattedMessage('purchase.select.status.label'),
            sortField: 'status',
            sortable: false,
            cell: row => {
                return (
                    row.status === 1 &&
                    <span className='badge bg-light-success'>
                        <span>{getFormattedMessage("status.filter.received.label")}</span>
                    </span> ||
                    row.status === 2 &&
                    <span className='badge bg-light-primary'>
                        <span>{getFormattedMessage("status.filter.pending.label")}</span>
                    </span> ||
                    row.status === 3 &&
                    <span className='badge bg-light-warning'>
                        <span>{getFormattedMessage("status.filter.ordered.label")}</span>
                    </span>
                )
            }
        },
        {
            name: getFormattedMessage('purchase.grant-total.label'),
            selector: row => currencySymbolHendling(allConfigData, row.currency, row.grand_total),
            sortField: 'grand_total',
            sortable: true,
        },
        {
            name: getFormattedMessage('dashboard.recentSales.paid.label'),
            selector: row => currencySymbolHendling(allConfigData, row.currency, row.paid),
            sortField: 'paid',
            sortable: false,
        },
        {
            name: getFormattedMessage('dashboard.recentSales.due.label'),
            selector: row => currencySymbolHendling(allConfigData, row.currency, row.due),
            sortField: 'due',
            sortable: false,
        },
        {
            name: getFormattedMessage('globally.react-table.column.payment-type.label'),
            selector: row => row.payment,
            sortField: 'payment',
            sortable: false,
            cell: row => {
                return (
                    <span className='badge bg-light-success'>
                        <span>{getFormattedMessage("cash.label")}</span>
                    </span>
                )
            }
        },
        {
            name: getFormattedMessage('globally.react-table.column.created-date.label'),
            selector: row => row.date,
            sortField: 'date',
            sortable: true,
            cell: row => {
                return (
                    <span className='badge bg-light-info'>
                        <div className='mb-1'>{row.time}</div>
                        <div>{row.date}</div>
                    </span>
                )
            }
        },
    ];

    const onChange = (filter) => {
        fetchAllSuppliers();
        fetchAllWarehouses();
        fetchPurchases(filter, true);
    };

    const onExcelClick = () => {
        setIsWarehouseValue(true);
    };

    return (
        <MasterLayout>
            <TopProgressBar />
            <TabTitle title={placeholderText('purchase.reports.title')}/>
            <ReactDataTable columns={columns} items={itemsValue} onChange={onChange} isLoading={isLoading}
                            totalRows={totalRecord} isShowDateRangeField isEXCEL isShowFilterField isStatus
                            onExcelClick={onExcelClick}/>
        </MasterLayout>
    )
};
const mapStateToProps = (state) => {
    const {purchases, dates, totalRecord, isLoading, warehouses, suppliers, frontSetting, fetchFrontSetting, allConfigData} = state;
    return {purchases, dates, totalRecord, isLoading, warehouses, suppliers, frontSetting, fetchFrontSetting, allConfigData}
};

export default connect(mapStateToProps, {
    fetchPurchases,
    fetchAllWarehouses,
    fetchAllSuppliers,
    fetchFrontSetting, totalPurchaseReportExcel
})(PurchaseReport);
