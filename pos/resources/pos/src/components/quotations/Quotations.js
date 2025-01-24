import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import MasterLayout from '../MasterLayout';
import TabTitle from '../../shared/tab-title/TabTitle';
import ReactDataTable from '../../shared/table/ReactDataTable';
import { fetchSales } from '../../store/action/salesAction';
import DeleteQuotation from './DeleteQuotation';
import { currencySymbolHendling, getFormattedDate, getFormattedMessage, placeholderText } from '../../shared/sharedMethod';
import ActionDropDownButton from '../../shared/action-buttons/ActionDropDownButton';
import { fetchFrontSetting } from '../../store/action/frontSettingAction';
import TopProgressBar from "../../shared/components/loaders/TopProgressBar";
import { fetchQuotations } from '../../store/action/quotationAction';
import { quotationPdfAction } from '../../store/action/quotationPdfAction';

const Quotations = ( props ) => {
    const { totalRecord, isLoading, quotationPdfAction, fetchFrontSetting, frontSetting, isCallSaleApi, fetchQuotations, quotations, allConfigData } = props;
    const [ deleteModel, setDeleteModel ] = useState( false );
    const [ isDelete, setIsDelete ] = useState( null );

    useEffect( () => {
        fetchFrontSetting();
    }, [] );

    const currencySymbol = frontSetting && frontSetting.value && frontSetting.value.currency_symbol

    const onChange = ( filter ) => {
        fetchQuotations( filter, true );
    };

    //quotation edit function
    const goToEdit = ( item ) => {
        const id = item.id;
        window.location.href = '#/app/quotations/edit/' + id;
    };

    // delete quotation function
    const onClickDeleteModel = ( isDelete = null ) => {
        setDeleteModel( !deleteModel );
        setIsDelete( isDelete );
    };

    //quotation sale create function
    const onCreateSaleClick = ( item ) => {
        const id = item.id;
        window.location.href = '#/app/quotations/Create_sale/' + id;
    };

    //quotation details function
    const goToDetailScreen = ( ProductId ) => {
        window.location.href = '#/app/quotations/detail/' + ProductId;
    };

    //onClick pdf function
    const onPdfClick = ( id ) => {
        quotationPdfAction( id );
    };

    const itemsValue = currencySymbol && quotations.length >= 0 && quotations.map( quotation => ( {
        date: getFormattedDate( quotation.attributes.date, allConfigData && allConfigData ),
        // date_for_payment: sale.attributes.date,
        is_sale_created: quotation.attributes.is_sale_created,
        time: moment( quotation.attributes.created_at ).format( 'LT' ),
        reference_code: quotation.attributes.reference_code,
        customer_name: quotation.attributes.customer_name,
        warehouse_name: quotation.attributes.warehouse_name,
        status: quotation.attributes.status,
        grand_total: quotation.attributes.grand_total,
        paid_amount: quotation.attributes.paid_amount ? sale.attributes.paid_amount : 0.00.toFixed( 2 ),
        id: quotation.id,
        currency: currencySymbol
    } ) );

    const columns = [
        {
            name: getFormattedMessage( 'dashboard.recentSales.reference.label' ),
            sortField: 'reference_code',
            sortable: false,
            cell: row => {
                return <span className='badge bg-light-danger'>
                    <span>{row.reference_code}</span>
                </span>
            }
        },
        {
            name: getFormattedMessage( 'customer.title' ),
            selector: row => row.customer_name,
            sortField: 'customer_name',
            sortable: false,
        },
        {
            name: getFormattedMessage( 'warehouse.title' ),
            selector: row => row.warehouse_name,
            sortField: 'warehouse_name',
            sortable: false,
        },
        {
            name: getFormattedMessage( 'purchase.select.status.label' ),
            sortField: 'status',
            sortable: false,
            cell: row => {
                return (
                    row.status === 1 &&
                    <span className='badge bg-light-warning'>
                        <span>{getFormattedMessage( "status.filter.sent.label" )}</span>
                    </span> ||
                    row.status === 2 &&
                    <span className='badge bg-light-danger'>
                        <span>{getFormattedMessage( "status.filter.pending.label" )}</span>
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
            cell: row => <ActionDropDownButton item={row} goToEditProduct={goToEdit} isEditMode={true} isPdfIcon={true}
                onClickDeleteModel={onClickDeleteModel} onPdfClick={onPdfClick}
                title={getFormattedMessage( "quotation.title" )} isCreatesSales={true} onCreateSaleClick={onCreateSaleClick}
                isViewIcon={true} goToDetailScreen={goToDetailScreen}
            />
        }
    ];

    return (
        <MasterLayout>
            <TopProgressBar />
            <TabTitle title={placeholderText( 'quotations.title' )} />
            <ReactDataTable columns={columns} items={itemsValue} to='#/app/quotations/create'
                ButtonValue={getFormattedMessage( 'create-quotation.title' )} isCallSaleApi={isCallSaleApi}
                isShowDateRangeField onChange={onChange} totalRows={totalRecord} goToEdit={goToEdit}
                isLoading={isLoading} isShowFilterField isStatus />
            <DeleteQuotation onClickDeleteModel={onClickDeleteModel} deleteModel={deleteModel} onDelete={isDelete} />
        </MasterLayout>
    )
};

const mapStateToProps = ( state ) => {
    const { sales, totalRecord, isLoading, frontSetting, isCallSaleApi, quotations, allConfigData } = state;
    return { sales, totalRecord, isLoading, frontSetting, isCallSaleApi, quotations, allConfigData };
};

export default connect( mapStateToProps, { fetchSales, fetchFrontSetting, fetchQuotations, quotationPdfAction } )( Quotations );
