import React, {useEffect, useState} from 'react';
import moment from 'moment';
import {connect} from 'react-redux';
import ReactDataTable from '../../../shared/table/ReactDataTable';
import {currencySymbolHendling, getFormattedMessage} from '../../../shared/sharedMethod';
import {fetchPurchasesReturn} from '../../../store/action/purchaseReturnAction';
import {fetchFrontSetting} from '../../../store/action/frontSettingAction';
import {fetchAllSuppliers} from '../../../store/action/supplierAction';
import {purchaseReturnExcelAction} from '../../../store/action/purchaseReturnExcelAction';

const PurchaseReturnTab = (props) => {
    const {
        isLoading,
        totalRecord,
        fetchPurchasesReturn,
        purchaseReturn,
        suppliers,
        frontSetting,
        fetchFrontSetting,
        fetchAllSuppliers,
        warehouseValue, purchaseReturnExcelAction, allConfigData
    } = props;
    const currencySymbol = frontSetting && frontSetting.value && frontSetting.value.currency_symbol
    const [isWarehouseValue, setIsWarehouseValue] = useState(false);

    useEffect(() => {
        fetchFrontSetting();
    }, []);

    useEffect(() => {
        if(isWarehouseValue === true) {
            purchaseReturnExcelAction(warehouseValue.value, setIsWarehouseValue);
        }
    }, [isWarehouseValue])

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
            name: getFormattedMessage('warehouse.title'),
            selector: row => row.warehouse,
            sortField: 'warehouse',
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
            selector: row => currencySymbolHendling(allConfigData, row.currency, row.paid),
            sortField: 'paid',
            sortable: false,
        },
        {
            name: getFormattedMessage('dashboard.recentSales.due.label'),
            selector: row =>  currencySymbolHendling(allConfigData, row.currency, row.due),
            sortField: 'due',
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
    ];

    const onChange = (filter) => {
        fetchAllSuppliers();
        fetchPurchasesReturn(filter, true);
    };

    const onExcelClick = () => {
        setIsWarehouseValue(true);
    };

    const itemsValue = currencySymbol && purchaseReturn.length >= 0 && purchaseReturn.map((purchase) => {
        const supplier = suppliers.filter((supplier) => supplier.id === purchase.attributes.supplier_id);
        const supplierName = supplier[0] && supplier[0].attributes && supplier[0].attributes.name
        return ({
            reference_code: purchase.attributes.reference_code,
            supplier: supplierName,
            warehouse: purchase.attributes.warehouse_name,
            status: purchase.attributes.status,
            paid: 0,
            due: 0,
            payment_type: purchase.attributes.payment_type,
            time: moment(purchase.attributes.created_at).format('LT'),
            grand_total: purchase.attributes.grand_total,
            id: purchase.id,
            currency: currencySymbol
        })
    });

    return (
        <ReactDataTable columns={columns} isEXCEL items={itemsValue} totalRows={totalRecord}
                        onChange={onChange} isLoading={isLoading} warehouseValue={warehouseValue}
                        onExcelClick={onExcelClick} isStatus isShowFilterField/>
    )
};

const mapStateToProps = (state) => {
    const {isLoading, totalRecord, purchaseReturn, suppliers, frontSetting} = state;
    return {isLoading, totalRecord, purchaseReturn, suppliers, frontSetting}
};

export default connect(mapStateToProps, {
    fetchFrontSetting,
    fetchPurchasesReturn,
    fetchAllSuppliers, purchaseReturnExcelAction
})(PurchaseReturnTab);
