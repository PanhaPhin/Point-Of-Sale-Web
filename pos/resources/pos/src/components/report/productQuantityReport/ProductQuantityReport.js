import React, {useEffect, useState} from 'react';
import MasterLayout from '../../MasterLayout';
import TabTitle from '../../../shared/tab-title/TabTitle';
import {getFormattedMessage, placeholderText} from '../../../shared/sharedMethod';
import ReactDataTable from '../../../shared/table/ReactDataTable';
import {connect} from 'react-redux';
import ReactSelect from '../../../shared/select/reactSelect';
import {fetchAllWarehouses} from '../../../store/action/warehouseAction';
import {fetchFrontSetting} from '../../../store/action/frontSettingAction';
import {productQuantityReportAction} from '../../../store/action/paymentQuantityReport';
import TopProgressBar from "../../../shared/components/loaders/TopProgressBar";

const StockReport = (props) => {
    const {
        isLoading,
        totalRecord,
        fetchFrontSetting,
        fetchAllWarehouses,
        warehouses,
        productQuantityReportAction,
        productQuantityReport
    } = props;
    const [warehouseValue, setWarehouseValue] = useState({label: 'All', value: null});
    const array = warehouses && warehouses
    const newFirstElement = {attributes: {name: getFormattedMessage("report-all.warehouse.label")}, id: null}
    const newArray = [newFirstElement].concat(array)

    useEffect(() => {
        productQuantityReportAction(warehouseValue.value)
    }, [warehouseValue])

    useEffect(() => {
        fetchFrontSetting();
        fetchAllWarehouses();
    }, []);


    const itemsValue = productQuantityReport && productQuantityReport.length >= 0 && productQuantityReport.map(quantityReport => ({
        code: quantityReport && quantityReport.code,
        name: quantityReport && quantityReport.name,
        warehouse: quantityReport && quantityReport.stock.warehouse.name,
        quantity: quantityReport && quantityReport.stock.quantity,
        stockAlert: quantityReport && quantityReport.stock_alert,
        product_unit: quantityReport && quantityReport.stock.product_unit_name,
    }));

    const onChange = (filter) => {
        productQuantityReportAction(warehouseValue.value, filter)
    };

    const onWarehouseChange = (obj) => {
        setWarehouseValue(obj);
    };

    const columns = [
        {
            name: getFormattedMessage('globally.react-table.column.code.label'),
            sortField: 'code',
            sortable: false,
            cell: row => {
                return <span className='badge bg-light-danger'>
                            <span>{row.code}</span>
                        </span>
            }
        },
        {
            name: getFormattedMessage("dashboard.stockAlert.product.label"),
            selector: row => row.name,
            sortField: 'name',
            sortable: false,
        },
        {
            name: getFormattedMessage("dashboard.stockAlert.warehouse.label"),
            selector: row => row.warehouse,
            sortField: 'product_category_name',
            sortable: false,
        },
        {
            name: getFormattedMessage("dashboard.stockAlert.quantity.label"),
            sortField: 'product_cost',
            sortable: false,
            cell: row => {
                return <div>
                <div className='badge bg-light-info me-2'><span>{row.quantity}</span></div>
                <span className='badge bg-light-success me-2'><span>{row.product_unit}</span></span>

            </div>
            }
        },
        {
            name: getFormattedMessage("dashboard.stockAlert.alertQuantity.label"),
            sortField: 'product_price',
            sortable: false,
            cell: row => {
                return <div>
                <div className="badge bg-light-danger me-2">{row.stockAlert}</div>
                <span className='badge bg-light-success me-2'><span>{row.product_unit}</span></span>
            </div>
            }
        }
    ];

    return (
        <MasterLayout>
            <TopProgressBar />
            <TabTitle title={placeholderText('stock.reports.title')}/>
                <div className='mx-auto mb-md-5 col-12 col-md-4'>
                {newArray &&
                    <ReactSelect data={newArray} onChange={onWarehouseChange} defaultValue={newArray[0] ? {
                        label: newArray[0].attributes.name,
                        value: newArray[0].id
                    } : ''}
                                 title={getFormattedMessage('warehouse.title')} errors={''} isRequired
                                 placeholder={placeholderText('purchase.select.warehouse.placeholder.label')}/>}
                </div>
            <div className='pt-md-7'>
                <ReactDataTable subHeader={false} items={itemsValue} columns={columns}  onChange={onChange} isLoading={isLoading}
                                totalRows={totalRecord} warehouseValue={warehouseValue} />
            </div>
        </MasterLayout>
    )
};
const mapStateToProps = (state) => {
    const {isLoading, totalRecord, warehouses, frontSetting, productQuantityReport} = state;
    return {isLoading, totalRecord, warehouses, frontSetting, productQuantityReport}
};

export default connect(mapStateToProps, {
    fetchAllWarehouses,
    fetchFrontSetting,
    productQuantityReportAction
})(StockReport);
