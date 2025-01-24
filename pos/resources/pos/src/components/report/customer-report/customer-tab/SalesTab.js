import React, { useEffect } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import ReactDataTable from '../../../../shared/table/ReactDataTable';
import { fetchSales } from '../../../../store/action/salesAction';
import { currencySymbolHendling, getFormattedDate, getFormattedMessage } from '../../../../shared/sharedMethod';
import { fetchFrontSetting } from '../../../../store/action/frontSettingAction';
import { customerSaleReportPDF } from '../../../../store/action/customerReportAction';

const SalesTab = ( props ) => {
    const { sales, fetchSales, totalRecord, isLoading, fetchFrontSetting, frontSetting, isCallSaleApi, allConfigData, customerId, customerSaleReportPDF } = props;

    useEffect( () => {
        fetchFrontSetting();
    }, [] );

    const currencySymbol = frontSetting && frontSetting.value && frontSetting.value.currency_symbol

    // fetch all sale
    const onChange = ( filter ) => {
        fetchSales( filter, true );
    };

    // onClick pdf function
    const onReportPdfClick = ( id ) => {
        customerSaleReportPDF( id )
    }

    const itemsValue = currencySymbol && sales.length >= 0 && sales.map( sale => ( {
        date: getFormattedDate( sale.attributes.date, allConfigData && allConfigData ),
        // date_for_payment: sale.attributes.date,
        time: moment( sale.attributes.created_at ).format( 'LT' ),
        reference_code: sale.attributes.reference_code,
        customer_name: sale.attributes.customer_name,
        warehouse_name: sale.attributes.warehouse_name,
        status: sale.attributes.status,
        payment_status: sale.attributes.payment_status,
        payment_type: sale.attributes.payment_type,
        grand_total: sale.attributes.grand_total,
        paid_amount: sale.attributes.paid_amount ? sale.attributes.paid_amount : 0.00.toFixed( 2 ),
        id: sale.id,
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
            selector: row => currencySymbolHendling( allConfigData, row.currency, row.paid_amount ),
            sortField: 'paid_amount',
            sortable: true,
        },
        {
            name: getFormattedMessage( 'dashboard.recentSales.paymentStatus.label' ),
            sortField: 'payment_status',
            sortable: false,
            cell: row => {
                return (
                    row.payment_status === 1 &&
                    <span className='badge bg-light-success'>
                        <span>{getFormattedMessage( "payment-status.filter.paid.label" )}</span>
                    </span> ||
                    row.payment_status === 2 &&
                    <span className='badge bg-light-danger'>
                        <span>{getFormattedMessage( "payment-status.filter.unpaid.label" )}</span>
                    </span> ||
                    row.payment_status === 3 &&
                    <span className='badge bg-light-warning'>
                        {/*<span>{getFormattedMessage("payment-status.filter.unpaid.label")}</span>*/}
                        <span>{getFormattedMessage( "payment-status.filter.partial.label" )}</span>
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

    ];


    return (
        <ReactDataTable columns={columns} items={itemsValue}
            isCallSaleApi={isCallSaleApi}
            onChange={onChange} totalRows={totalRecord}
            isLoading={isLoading} isReportPdf customerId={customerId}
            onReportPdfClick={() => onReportPdfClick( customerId )} />
    )
};

const mapStateToProps = ( state ) => {
    const { sales, totalRecord, isLoading, frontSetting, isCallSaleApi, allConfigData } = state;
    return { sales, totalRecord, isLoading, frontSetting, isCallSaleApi, allConfigData };
};

export default connect( mapStateToProps, { fetchSales, fetchFrontSetting, customerSaleReportPDF } )( SalesTab );
