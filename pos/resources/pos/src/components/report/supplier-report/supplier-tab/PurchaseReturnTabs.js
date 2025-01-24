import React, {useEffect, useState} from 'react';
import {connect, useDispatch} from 'react-redux';
import ReactDataTable from '../../../../shared/table/ReactDataTable';
import {currencySymbolHendling, getFormattedMessage} from '../../../../shared/sharedMethod';
import {stockDetailsPurchaseReturnAction} from '../../../../store/action/stockDetailsPurchaseRetrunAction';
import {fetchFrontSetting} from '../../../../store/action/frontSettingAction';
import {stockDetailsPurchaseReturnExcel} from '../../../../store/action/stockDetailsPurchaseReturnExcel';
import {fetchSupplierPurchaseReturnReport} from "../../../../store/action/supplierPurchaseReportAction";
import apiConfig from "../../../../config/apiConfig";
import {apiBaseURL, toastType} from "../../../../constants";
import {addToast} from "../../../../store/action/toastAction";

const PurchaseReturnTab = (props) => {
    const {
        isLoading,
        totalRecord,
        frontSetting,
        fetchFrontSetting,
        warehouseValue, allConfigData,
        stockDetailsPurchaseReturnExcel, id, fetchSupplierPurchaseReturnReport, supplierPurchaseReport
    } = props;
    const currencySymbol = frontSetting && frontSetting.value && frontSetting.value.currency_symbol
    const [isWarehouseValue, setIsWarehouseValue] = useState(false);
    const dispatch = useDispatch()

    useEffect(() => {
        if (isWarehouseValue === true) {
            stockDetailsPurchaseReturnExcel(id, setIsWarehouseValue);
        }
    }, [isWarehouseValue])

    useEffect(() => {
        fetchFrontSetting();
    }, [warehouseValue]);

    const itemsValue = currencySymbol && supplierPurchaseReport.length >= 0 && supplierPurchaseReport.map(purchase => ({
        reference_code: purchase.reference_code,
        supplier_name: purchase.supplier.name,
        warehouse_name:  purchase.warehouse.name,
        grand_total: purchase.grand_total,
        status: purchase.status,
        // warehouse_name: sale.attributes.warehouse_name,
        // id: sale.id,
        // purchase_items: sale.attributes.purchase_items.map((item) => ({
        //     name: item.product && item.product.name,
        //     sub_total: item.sub_total,
        //     quantity: item.quantity,
        //     product_id: item.product_id,
        // })),
        currency: currencySymbol
    }));

    const columns = [
        {
            name: getFormattedMessage('dashboard.recentSales.reference.label'),
            selector: row => row.reference_code,
            sortField: 'reference_code',
            sortable: true,
        },
        {
            name: getFormattedMessage('supplier.table.name.column.title'),
            selector: row => row.supplier_name,
            sortField: 'supplier_name',
            sortable: false,
        },
        {
            name: getFormattedMessage('globally.detail.warehouse'),
            sortField: 'warehouse_name',
            sortable: false,
            selector: row => row.warehouse_name
        },
        {
            name: getFormattedMessage('globally.detail.grand.total'),
            selector: row => currencySymbolHendling(allConfigData, row.currency, row.grand_total),
            sortField: 'grand_total',
            sortable: false,
        },
        {
            name: getFormattedMessage('purchase.select.status.label'),
            sortField: 'status',
            sortable: false,
            cell: row => {
                return (
                    row.status === 1 &&
                    <span className='badge bg-light-primary'>
                        <span>{getFormattedMessage('status.filter.received.label')}</span>
                    </span> ||
                    row.status === 2 &&
                    <span className='badge bg-light-primary'>
                        <span>{getFormattedMessage("status.filter.pending.label")}</span>
                    </span> ||
                    row.status === 3 &&
                    <span className='badge bg-light-primary'>
                        <span>{getFormattedMessage("status.filter.ordered.label")}</span>
                    </span>
                )
            }
        },
    ];

    const onChange = (filter) => {
        fetchSupplierPurchaseReturnReport(id, filter, true);
    };

    const onExcelClick = () => {
        apiConfig.get(apiBaseURL.SUPPLIER_PURCHASE_RETURN_EXCEL + "?supplier_id=" + id)
            .then((response) => {
                window.open(response.data.data.purchase_return_excel_url, '_blank');
            })
            .catch(({response}) => {
                dispatch(addToast(
                    {text: response.data.message, type: toastType.ERROR}));
            });
    };

    return (
        <ReactDataTable columns={columns} items={itemsValue} onChange={onChange} warehouseValue={warehouseValue}
                        isLoading={isLoading} totalRows={totalRecord} isEXCEL onExcelClick={onExcelClick}
        />
    )
};

const mapStateToProps = (state) => {
    const {isLoading, totalRecord, stockDetailPurchaseReturn, frontSetting, supplierPurchaseReport} = state;
    return {isLoading, totalRecord, stockDetailPurchaseReturn, frontSetting, supplierPurchaseReport}
};

export default connect(mapStateToProps, {
    fetchFrontSetting,
    stockDetailsPurchaseReturnAction,
    stockDetailsPurchaseReturnExcel,
    fetchSupplierPurchaseReturnReport
})(PurchaseReturnTab);
