import React, { useEffect } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import ReactDataTable from '../../../../shared/table/ReactDataTable';
import { currencySymbolHendling, getFormattedDate, getFormattedMessage } from '../../../../shared/sharedMethod';
import { fetchFrontSetting } from '../../../../store/action/frontSettingAction';
import { fetchCustomerSalePayment, customerSalePaymentReportPDF } from '../../../../store/action/customerReportAction';
import { useParams } from 'react-router';

const SalePayment = ( props ) => {
    const { totalRecord, isLoading, fetchFrontSetting, frontSetting, isCallSaleApi, allConfigData, customerId, customerPayment, fetchCustomerSalePayment, customerSalePaymentReportPDF } = props;
    const { id } = useParams();

    useEffect( () => {
        fetchFrontSetting();
    }, [] );

    const currencySymbol = frontSetting && frontSetting.value && frontSetting.value.currency_symbol

    // fetch all sale payment
    const onChange = ( filter ) => {
        fetchCustomerSalePayment( filter, true, id )
    };

    //onClick pdf function
    const onReportPdfClick = ( id ) => {
        customerSalePaymentReportPDF( id )
    }

    const itemsValue = currencySymbol && customerPayment.length >= 0 && customerPayment.map( sale => ( {
        date: getFormattedDate( sale.sale.date, allConfigData && allConfigData ),
        time: moment( sale.sale.created_at ).format( 'LT' ),
        reference_code: sale.sale.reference_code,
        payment_type: sale.sale.payment_type,
        amount: sale.sale.paid_amount,
        id: sale.sale.id,
        currency: currencySymbol
    } ) );

    const columns = [
        {
            name: getFormattedMessage( 'sale-reference.title' ),
            sortField: 'reference_code',
            sortable: false,
            cell: row => {
                return <span className='badge bg-light-danger'>
                    <span>{row.reference_code}</span>
                </span>
            }
        },
        {
            name: getFormattedMessage( 'select.payment-type.label' ),
            sortField: 'payment_type',
            sortable: false,
            cell: row => {
                return (
                    row.payment_type === 1 &&
                    <span className='badge bg-light-primary'>
                        <span>{getFormattedMessage( 'cash.label' )}</span>
                    </span> ||
                    row.payment_type === 2 &&
                    <span className='badge bg-light-primary'>
                        <span>{getFormattedMessage( 'payment-type.filter.cheque.label' )}</span>
                    </span> ||
                    row.payment_type === 3 &&
                    <span className='badge bg-light-primary'>
                        <span>{getFormattedMessage( 'payment-type.filter.bank-transfer.label' )}</span>
                    </span> ||
                    row.payment_type === 4 &&
                    <span className='badge bg-light-primary'>
                        <span>{getFormattedMessage( 'payment-type.filter.other.label' )}</span>
                    </span>
                )
            }
        },
        {
            name: getFormattedMessage( 'dashboard.recentSales.paid.label' ),
            selector: row => currencySymbolHendling( allConfigData, row.currency, row.amount ),
            sortField: 'grand_total',
            sortable: false,
        },
        {
            name: getFormattedMessage( 'react-data-table.date.column.label' ),
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
    const { totalRecord, isLoading, frontSetting, isCallSaleApi, allConfigData, customerPayment } = state;
    return { totalRecord, isLoading, frontSetting, isCallSaleApi, allConfigData, customerPayment };
};

export default connect( mapStateToProps, { fetchFrontSetting, fetchCustomerSalePayment, customerSalePaymentReportPDF } )( SalePayment );
