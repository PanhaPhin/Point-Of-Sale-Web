import React, { useEffect, useState } from "react";
import moment from "moment/moment";
import { connect } from "react-redux";
import ReactDataTable from "../../../../shared/table/ReactDataTable";
import {
    currencySymbolHendling,
    getFormattedMessage,
} from "../../../../shared/sharedMethod";
import { stockDetailsPurchaseAction } from "../../../../store/action/stockDetilsPurchaseAction";
import { fetchFrontSetting } from "../../../../store/action/frontSettingAction";
import { stockDetailsPurchaseExcel } from "../../../../store/action/stockDetailsPurchaseExcel";

const PurchaseTab = (props) => {
    const {
        totalRecord,
        isLoading,
        stockDetailsPurchaseAction,
        frontSetting,
        fetchFrontSetting,
        warehouseValue,
        stockDetailsPurchaseExcel,
        stockDetailsPurchase,
        id,
        allConfigData,
    } = props;
    const currencySymbol =
        frontSetting &&
        frontSetting.value &&
        frontSetting.value.currency_symbol;
    const [isWarehouseValue, setIsWarehouseValue] = useState(false);

    useEffect(() => {
        if (isWarehouseValue === true) {
            stockDetailsPurchaseExcel(id, setIsWarehouseValue);
        }
    }, [isWarehouseValue]);

    useEffect(() => {
        fetchFrontSetting();
    }, [warehouseValue]);

    const itemsValue =
        currencySymbol &&
        stockDetailsPurchase.length >= 0 &&
        stockDetailsPurchase.map((sale) => ({
            time: moment(sale.attributes.created_at).format("LT"),
            date: moment(sale.attributes.date).format("YYYY-MM-DD"),
            reference_code: sale.attributes.reference_code,
            supplier_name: sale.attributes.supplier_name,
            warehouse_name: sale.attributes.warehouse_name,
            id: sale.id,
            purchase_items: sale.attributes.purchase_items.map((item) => ({
                name: item.product && item.product.name,
                sub_total: item.sub_total,
                quantity: item.quantity,
                product_id: item.product_id,
            })),
            currency: currencySymbol,
        }));

    const columns = [
        {
            name: getFormattedMessage(
                "globally.react-table.column.created-date.label"
            ),
            selector: (row) => row.date,
            sortField: "date",
            sortable: true,
            cell: (row) => {
                return (
                    <span className="badge bg-light-primary">
                        <div className="mb-1">{row.time}</div>
                        <div>{row.date}</div>
                    </span>
                );
            },
        },
        {
            name: getFormattedMessage("dashboard.recentSales.reference.label"),
            sortField: "reference_code",
            sortable: false,
            cell: (row) => {
                return (
                    <span className="badge bg-light-danger">
                        <span>{row.reference_code}</span>
                    </span>
                );
            },
        },
        {
            name: getFormattedMessage("supplier.table.name.column.title"),
            sortField: "name",
            sortable: false,
            cell: (row) => {
                return row.purchase_items.map((item) =>
                    item.product_id === Number(id) ? item.name : ""
                );
            },
        },
        {
            name: getFormattedMessage("purchase.select.supplier.label"),
            selector: (row) => row.supplier_name,
            sortField: "supplier_name",
            sortable: false,
        },
        {
            name: getFormattedMessage("warehouse.title"),
            selector: (row) => row.warehouse_name,
            sortField: "warehouse_name",
            sortable: false,
        },
        {
            name: getFormattedMessage("globally.detail.quantity"),
            sortField: "quantity",
            sortable: false,
            cell: (row) => {
                return row.purchase_items.map((item) =>
                    item.product_id === Number(id) ? (
                        <span className="badge bg-light-danger">
                            <span>{item.quantity}</span>
                        </span>
                    ) : (
                        ""
                    )
                );
            },
        },
        {
            name: getFormattedMessage("globally.detail.subtotal"),
            sortField: "sub_total",
            sortable: false,
            cell: (row) => {
                return row.purchase_items.map((item) =>
                    item.product_id === Number(id)
                        ? currencySymbolHendling(
                              allConfigData,
                              row.currency,
                              item.sub_total
                          )
                        : ""
                );
            },
        },
    ];

    const onChange = (filter) => {
        stockDetailsPurchaseAction(id, filter, true);
    };

    const onExcelClick = () => {
        setIsWarehouseValue(true);
    };

    return (
        <ReactDataTable
            columns={columns}
            items={itemsValue}
            onChange={onChange}
            warehouseValue={warehouseValue}
            isLoading={isLoading}
            totalRows={totalRecord}
            isEXCEL
            onExcelClick={onExcelClick}
        />
    );
};

const mapStateToProps = (state) => {
    const { isLoading, totalRecord, stockDetailsPurchase, frontSetting } =
        state;
    return { isLoading, totalRecord, stockDetailsPurchase, frontSetting };
};

export default connect(mapStateToProps, {
    fetchFrontSetting,
    stockDetailsPurchaseAction,
    stockDetailsPurchaseExcel,
})(PurchaseTab);
