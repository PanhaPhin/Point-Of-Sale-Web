import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import ReactDataTable from '../../../shared/table/ReactDataTable';
import {currencySymbolHendling, getFormattedMessage} from '../../../shared/sharedMethod';
import {fetchSalesReturn} from '../../../store/action/salesReturnAction';
import {fetchFrontSetting} from '../../../store/action/frontSettingAction';
import {saleReturnExcelAction} from '../../../store/action/salesReturnExcelAction';

const SaleReturnTab = (props) => {
    const {
        isLoading,
        totalRecord,
        fetchSalesReturn,
        salesReturn,
        frontSetting,
        fetchFrontSetting,
        warehouseValue, saleReturnExcelAction, allConfigData
    } = props;
    const currencySymbol = frontSetting && frontSetting.value && frontSetting.value.currency_symbol
    const [isWarehouseValue, setIsWarehouseValue] = useState(false);

    useEffect(() => {
        if(isWarehouseValue === true) {
            saleReturnExcelAction(warehouseValue.value, setIsWarehouseValue);
        }
    }, [isWarehouseValue])

    useEffect(() => {
        fetchFrontSetting();
    }, [warehouseValue]);

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
            name: getFormattedMessage('purchase.grant-total.label'),
            selector: row => currencySymbolHendling(allConfigData, row.currency, row.grand_total),
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
    ];

    const itemsValue = currencySymbol && salesReturn.length >= 0 && salesReturn.map(sale => ({
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

    const onChange = (filter) => {
        fetchSalesReturn(filter, true);
    };

    const onExcelClick = () => {
        setIsWarehouseValue(true);
    };

    return (
        <ReactDataTable columns={columns} isEXCEL items={itemsValue} onChange={onChange}
                        isLoading={isLoading} warehouseValue={warehouseValue} totalRows={totalRecord}
                        onExcelClick={onExcelClick} isStatus isShowFilterField/>
    )
};

const mapStateToProps = (state) => {
    const {isLoading, totalRecord, salesReturn, frontSetting} = state;
    return {isLoading, totalRecord, salesReturn, frontSetting}
};

export default connect(mapStateToProps, {fetchFrontSetting, fetchSalesReturn, saleReturnExcelAction})(SaleReturnTab);
