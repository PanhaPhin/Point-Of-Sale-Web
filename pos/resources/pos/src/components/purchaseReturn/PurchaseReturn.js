import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import MasterLayout from '../MasterLayout';
import ReactDataTable from '../../shared/table/ReactDataTable';
import TabTitle from '../../shared/tab-title/TabTitle';
import { fetchPurchasesReturn } from '../../store/action/purchaseReturnAction';
import DeletePurchaseReturn from './DeletePurchaseReturn';
import { fetchAllSuppliers } from '../../store/action/supplierAction';
import { fetchAllWarehouses } from '../../store/action/warehouseAction';
import { currencySymbolHendling, placeholderText } from '../../shared/sharedMethod';
import { getFormattedMessage } from '../../shared/sharedMethod';
import ActionDropDownButton from '../../shared/action-buttons/ActionDropDownButton';
import { purchaseReturnPdfAction } from '../../store/action/purchaseReturnPdfAction';
import { fetchFrontSetting } from '../../store/action/frontSettingAction';
import ShowPayment from '../../shared/showPayment/ShowPayment';
import TopProgressBar from "../../shared/components/loaders/TopProgressBar";

const PurchaseReturn = ( props ) => {
    const {
        fetchPurchasesReturn,
        fetchAllWarehouses,
        fetchAllSuppliers,
        purchaseReturn,
        totalRecord,
        isLoading,
        suppliers,
        purchaseReturnPdfAction,
        fetchFrontSetting,
        frontSetting,
        allConfigData
    } = props;
    const [ deleteModel, setDeleteModel ] = useState( false );
    const [ isDelete, setIsDelete ] = useState( null );
    const [ isShowPaymentModel, setIsShowPaymentModel ] = useState( false );

    useEffect( () => {
        fetchFrontSetting();
    }, [] );

    const onClickDeleteModel = ( isDelete = null ) => {
        setDeleteModel( !deleteModel );
        setIsDelete( isDelete );
    };

    const onChange = ( filter ) => {
        fetchAllSuppliers();
        fetchAllWarehouses();
        fetchPurchasesReturn( filter, true );
    };

    const goToEditProduct = ( item ) => {
        const id = item.id;
        window.location.href = '#/app/purchase-return/edit/' + id;
    };

    const goToPurchaseReturn = ( ProductId ) => {
        window.location.href = '#/app/purchase-return/detail/' + ProductId;
    };

    //onClick pdf function
    const onPurchaseReturnPdf = ( id ) => {
        purchaseReturnPdfAction( id );
    };

    const onShowPaymentClick = () => {
        setIsShowPaymentModel( !isShowPaymentModel );
    };

    const currencySymbol = frontSetting && frontSetting.value && frontSetting.value.currency_symbol

    const itemsValue = currencySymbol && purchaseReturn.length >= 0 && purchaseReturn.map( ( purchase ) => {
        const supplier = suppliers.filter( ( supplier ) => supplier.id === purchase.attributes.supplier_id );
        const supplierName = supplier[ 0 ] && supplier[ 0 ].attributes && supplier[ 0 ].attributes.name
        return ( {
            reference_code: purchase.attributes.reference_code,
            supplier: supplierName,
            warehouse: purchase.attributes.warehouse_name,
            status: purchase.attributes.status,
            paid: 0,
            due: 0,
            payment_type: purchase.attributes.payment_type,
            date: moment( purchase.attributes.date ).format( 'YYYY-MM-DD' ),
            time: moment( purchase.attributes.created_at ).format( 'LT' ),
            grand_total: purchase.attributes.grand_total,
            id: purchase.id,
            currency: currencySymbol
        } )
    } );

    const columns = [
        {
            name: getFormattedMessage( 'dashboard.recentSales.reference.label' ),
            sortField: 'reference_code',
            sortable: true,
            cell: row => {
                return <span className='badge bg-light-danger'>
                    <span>{row.reference_code}</span>
                </span>
            }
        },
        {
            name: getFormattedMessage( 'supplier.title' ),
            selector: row => row.supplier,
            sortField: 'supplier',
            sortable: false,
        },
        {
            name: getFormattedMessage( 'warehouse.title' ),
            selector: row => row.warehouse,
            sortField: 'warehouse',
            sortable: false,
        },
        {
            name: getFormattedMessage( 'purchase.select.status.label' ),
            sortField: 'status',
            sortable: false,
            cell: row => {
                return (
                    row.status === 1 &&
                    <span className='badge bg-light-success'>
                        <span>{getFormattedMessage( "status.filter.received.label" )}</span>
                    </span> ||
                    row.status === 2 &&
                    <span className='badge bg-light-primary'>
                        <span>{getFormattedMessage( "status.filter.pending.label" )}</span>
                    </span> ||
                    row.status === 3 &&
                    <span className='badge bg-light-warning'>
                        <span>{getFormattedMessage( "status.filter.ordered.label" )}</span>
                    </span>
                )
            }
        },
        {
            name: getFormattedMessage( 'purchase.grant-total.label' ),
            selector: row => currencySymbolHendling( allConfigData, row.currency, row.grand_total ),
            sortField: 'grand_total',
            sortable: true,
        },
        {
            name: getFormattedMessage( 'dashboard.recentSales.paid.label' ),
            selector: row => currencySymbolHendling( allConfigData, row.currency, row.paid ),
            sortField: 'paid',
            sortable: false,
        },
        {
            name: getFormattedMessage( 'dashboard.recentSales.due.label' ),
            selector: row => currencySymbolHendling( allConfigData, row.currency, row.due ),
            sortField: 'due',
            sortable: false,
        },
        {
            name: getFormattedMessage( 'globally.react-table.column.payment-type.label' ),
            selector: row => row.payment_type,
            sortField: 'payment_type',
            sortable: false,
            cell: row => {
                return (
                    <span className='badge bg-light-success'>
                        <span>Cash</span>
                    </span>
                )
            }
        },
        {
            name: getFormattedMessage( 'globally.react-table.column.created-date.label' ),
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
        {
            name: getFormattedMessage( 'react-data-table.action.column.label' ),
            right: true,
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            cell: row => <ActionDropDownButton isViewIcon={true} goToDetailScreen={goToPurchaseReturn} item={row}
                onClickDeleteModel={onClickDeleteModel} isPdfIcon={true}
                goToEditProduct={goToEditProduct} isEditMode={true}
                title={getFormattedMessage( 'purchases.return.title' )}
                onPdfClick={onPurchaseReturnPdf} onShowPaymentClick={onShowPaymentClick}
            // isPaymentShow={true}
            />
        }
    ];

    return (
        <MasterLayout>
            <TopProgressBar />
            <TabTitle title={placeholderText( 'purchases.return.title' )} />
            <div className='purchases_return_table'>
                <ReactDataTable columns={columns} items={itemsValue} onChange={onChange} isLoading={isLoading}
                    ButtonValue={getFormattedMessage( 'purchase.return.create.title' )}
                    totalRows={totalRecord} to='#/app/purchase-return/create' isShowDateRangeField
                    isShowFilterField isStatus />
            </div>
            <DeletePurchaseReturn onClickDeleteModel={onClickDeleteModel} deleteModel={deleteModel}
                onDelete={isDelete} />
            <ShowPayment onShowPaymentClick={onShowPaymentClick} isShowPaymentModel={isShowPaymentModel} />
        </MasterLayout>
    )
};

const mapStateToProps = ( state ) => {
    const { purchaseReturn, totalRecord, isLoading, warehouses, suppliers, frontSetting, allConfigData } = state;
    return { purchaseReturn, totalRecord, isLoading, warehouses, suppliers, frontSetting, allConfigData }
};

export default connect( mapStateToProps, {
    fetchPurchasesReturn,
    fetchAllWarehouses,
    purchaseReturnPdfAction,
    fetchAllSuppliers,
    fetchFrontSetting
} )( PurchaseReturn );

