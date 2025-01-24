import React, { useEffect, useState } from 'react';
import MasterLayout from '../../MasterLayout';
import TabTitle from '../../../shared/tab-title/TabTitle';
import { currencySymbolHendling, getFormattedMessage, placeholderText } from '../../../shared/sharedMethod';
import ReactDataTable from '../../../shared/table/ReactDataTable';
import { connect } from 'react-redux';
import ReactSelect from '../../../shared/select/reactSelect';
import { fetchAllWarehouses } from '../../../store/action/warehouseAction';
import { fetchFrontSetting } from '../../../store/action/frontSettingAction';
import { stockReportAction } from '../../../store/action/stockReportAction';
import { totalStockReportExcel } from '../../../store/action/totalStockReportExcel';
import TopProgressBar from "../../../shared/components/loaders/TopProgressBar";

const StockReport = ( props ) => {
    const {
        isLoading,
        totalRecord,
        fetchFrontSetting,
        stockReports,
        fetchAllWarehouses,
        totalStockReportExcel,
        frontSetting,
        warehouses,
        stockReportAction, allConfigData
    } = props;
    const [ warehouseValue, setWarehouseValue ] = useState( { label: 'All', value: frontSetting?.value?.default_warehouse } );
    const [ isWarehouseValue, setIsWarehouseValue ] = useState( false );
    const currencySymbol = frontSetting && frontSetting.value && frontSetting.value.currency_symbol
    const array = warehouses && warehouses
    const selectWarehouseArray = frontSetting && array.filter( ( item ) => item.id === Number( frontSetting?.value?.default_warehouse ) )

    useEffect( () => {
        stockReportAction( warehouseValue.value ? warehouseValue.value : frontSetting?.value?.default_warehouse )
    }, [ frontSetting, warehouseValue ] )

    useEffect( () => {
        fetchAllWarehouses();
    }, [] );

    useEffect( () => {
        fetchFrontSetting();
    }, [] );

    useEffect( () => {
        if ( isWarehouseValue === true ) {
            totalStockReportExcel( warehouseValue.value ? warehouseValue.value : frontSetting?.value?.default_warehouse, setIsWarehouseValue );
            setIsWarehouseValue( false );
        }
    }, [ isWarehouseValue ] )

    const itemsValue = currencySymbol && stockReports.length >= 0 && stockReports.map( stockReport => ( {
        code: stockReport.attributes.product.code,
        name: stockReport.attributes.product.name,
        product_category_name: stockReport.attributes.product_category_name,
        product_cost: stockReport.attributes.product.product_cost,
        product_price: stockReport.attributes.product.product_price,
        product_unit: stockReport.attributes.product_unit_name,
        current_stock: stockReport.attributes.quantity,
        id: stockReport.attributes.product_id,
        currency: currencySymbol
    } ) );

    const onChange = ( filter ) => {
        stockReportAction( warehouseValue.value ? warehouseValue.value : frontSetting?.value?.default_warehouse, filter )
    };

    const onWarehouseChange = ( obj ) => {
        setWarehouseValue( obj );
    };

    const onExcelClick = () => {
        setIsWarehouseValue( true );
    };

    const onReportsClick = ( item ) => {
        const id = item.id;
        window.location.href = '#/app/report/report-detail-stock/' + id;
    };

    const columns = [
        {
            name: getFormattedMessage( 'globally.react-table.column.code.label' ),
            sortField: 'code',
            sortable: false,
            cell: row => {
                return <span className='badge bg-light-danger'>
                    <span>{row.code}</span>
                </span>
            }
        },
        {
            name: getFormattedMessage( 'supplier.table.name.column.title' ),
            selector: row => row.name,
            sortField: 'name',
            sortable: false,
        },
        {
            name: getFormattedMessage( 'product.product-details.category.label' ),
            selector: row => row.product_category_name,
            sortField: 'product_category_name',
            sortable: false,
        },
        {
            name: getFormattedMessage( 'product.product-details.cost.label' ),
            selector: row => currencySymbolHendling( allConfigData, row.currency, row.product_cost ),
            sortField: 'product_cost',
            sortable: false,
        },
        {
            name: getFormattedMessage( 'product.table.price.column.label' ),
            selector: row => currencySymbolHendling( allConfigData, row.currency, row.product_price ),
            sortField: 'product_price',
            sortable: false,
        },
        {
            name: getFormattedMessage( 'current.stock.label' ),
            sortField: 'current_stock',
            sortable: false,
            cell: row => {
                return <div>
                    <div className='badge bg-light-info me-2'>
                        <span>{row.current_stock}</span>
                    </div>

                    <span className='badge bg-light-success me-2'>
                        <span>{row.product_unit}</span>
                    </span>
                </div>
            }
        },
        {
            name: getFormattedMessage( 'react-data-table.action.column.label' ),
            right: true,
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            width: '115px',
            cell: row => <button className="btn btn-sm btn-primary" variant="primary" onClick={() => onReportsClick( row )}>
                {getFormattedMessage( "reports.title" )}
            </button>
        }
    ];

    return (
        <MasterLayout>
            <TopProgressBar />
            <TabTitle title={placeholderText( 'stock.reports.title' )} />
            <div className='mx-auto mb-md-5 col-12 col-md-4'>
                {selectWarehouseArray[ 0 ] ? <ReactSelect data={array} onChange={onWarehouseChange}
                    defaultValue={selectWarehouseArray[ 0 ] ? {
                        label: selectWarehouseArray[ 0 ].attributes.name,
                        value: selectWarehouseArray[ 0 ].id
                    } : ''}
                    title={getFormattedMessage( 'warehouse.title' )} errors={''}
                    isRequired
                    placeholder={placeholderText( 'purchase.select.warehouse.placeholder.label' )} /> : null}
            </div>
            <div className='pt-md-7'>
                <ReactDataTable columns={columns} items={itemsValue} onChange={onChange} isLoading={isLoading}
                    totalRows={totalRecord} isEXCEL onExcelClick={onExcelClick} />
            </div>
        </MasterLayout>
    )
};
const mapStateToProps = ( state ) => {
    const { isLoading, totalRecord, warehouses, frontSetting, stockReports, allConfigData } = state;
    return { isLoading, totalRecord, warehouses, frontSetting, stockReports, allConfigData }
};

export default connect( mapStateToProps, {
    fetchAllWarehouses,
    totalStockReportExcel,
    fetchFrontSetting,
    stockReportAction
} )( StockReport );
