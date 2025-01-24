import React, {useEffect, useState} from 'react';
import moment from 'moment';
import {connect} from 'react-redux';
import ReactDataTable from '../../../shared/table/ReactDataTable';
import {currencySymbolHendling, getFormattedMessage} from '../../../shared/sharedMethod';
import {fetchSales} from '../../../store/action/salesAction';
import {fetchFrontSetting} from '../../../store/action/frontSettingAction';
import {saleExcelAction} from '../../../store/action/salesExcelAction';

const SalesTab = (props) => {
    const {
        isLoading,
        totalRecord,
        fetchSales,
        sales,
        frontSetting,
        fetchFrontSetting,
        warehouseValue,
        saleExcelAction, allConfigData
    } = props;
    const currencySymbol = frontSetting && frontSetting.value && frontSetting.value.currency_symbol
    const [isWarehouseValue, setIsWarehouseValue] = useState(false);

    useEffect(() => {
        fetchFrontSetting();
    }, [warehouseValue]);

    const itemsValue = currencySymbol && sales.length >= 0 && sales.map(sale => ({
        time: moment(sale.attributes.created_at).format('LT'),
        reference_code: sale.attributes.reference_code,
        customer_name: sale.attributes.customer_name,
        warehouse_name: sale.attributes.warehouse_name,
        status: sale.attributes.status,
        payment_status: sale.attributes.payment_status,
        grand_total: sale.attributes.grand_total,
        paid_amount: sale.attributes.paid_amount ? sale.attributes.paid_amount : 0.00.toFixed(2),
        id: sale.id,
        currency: currencySymbol
    }));

    useEffect(() => {
        if(isWarehouseValue === true) {
            saleExcelAction(warehouseValue.value, setIsWarehouseValue);
        }
    }, [isWarehouseValue])

    const columns = [
        {
            name: getFormattedMessage('dashboard.recentSales.reference.label'),
            sortField: 'reference_code',
            sortable: false,
            cell: row => {
                return <span className='badge bg-light-danger'>
                            <span>{row.reference_code}</span>
                        </span>
            }
        },
        {
            name: getFormattedMessage('customer.title'),
            selector: row => row.customer_name,
            sortField: 'customer_name',
            sortable: false,
        },
        {
            name: getFormattedMessage('warehouse.title'),
            selector: row => row.warehouse_name,
            sortField: 'warehouse_name',
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
            selector: row =>  currencySymbolHendling(allConfigData, row.currency, row.grand_total),
            sortField: 'grand_total',
            sortable: true,
        },
        {
            name: getFormattedMessage('dashboard.recentSales.paid.label'),
            selector: row => currencySymbolHendling(allConfigData, row.currency, row.paid_amount),
            sortField: 'paid_amount',
            sortable: true,
        },
        {
            name: getFormattedMessage('dashboard.recentSales.due.label'),
            selector: row => currencySymbolHendling(allConfigData, row.currency, '0.00'),
            sortField: 'due',
            // sortable: true,
        },
        {
            name: getFormattedMessage('dashboard.recentSales.paymentStatus.label'),
            sortField: 'payment_status',
            sortable: false,
            cell: row => {
                return (
                    row.payment_status === 1 &&
                    <span className='badge bg-light-success'>
                        <span>{getFormattedMessage("payment-status.filter.paid.label")}</span>
                    </span> ||
                    row.payment_status === 2 &&
                    <span className='badge bg-light-danger'>
                        <span>{getFormattedMessage("payment-status.filter.unpaid.label")}</span>
                    </span> ||
                    row.payment_status === 3 &&
                    <span className='badge bg-light-warning'>
                        <span>{getFormattedMessage("payment-status.filter.partial.label")}</span>
                    </span>
                )
            }
        }
    ];

    const onChange = (filter) => {
        fetchSales(filter, true);
    };

    const onExcelClick = () => {
        setIsWarehouseValue(true);
    };

    return (
        <div className='warehouse_sale_report_table'>
        <ReactDataTable columns={columns} items={itemsValue} onChange={onChange} warehouseValue={warehouseValue}
                        isLoading={isLoading} totalRows={totalRecord} isEXCEL onExcelClick={onExcelClick}
                        isPaymentStatus isStatus isShowFilterField/>
        </div>
    )
};

const mapStateToProps = (state) => {
    const {isLoading, totalRecord, sales, frontSetting} = state;
    return {isLoading, totalRecord, sales, frontSetting}
};

export default connect(mapStateToProps, {fetchFrontSetting, fetchSales, saleExcelAction})(SalesTab);
