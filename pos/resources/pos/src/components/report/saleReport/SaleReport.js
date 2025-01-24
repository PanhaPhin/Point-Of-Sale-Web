import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import MasterLayout from '../../MasterLayout';
import TabTitle from '../../../shared/tab-title/TabTitle';
import { currencySymbolHendling, getFormattedMessage, placeholderText } from '../../../shared/sharedMethod';
import ReactDataTable from '../../../shared/table/ReactDataTable';
import { fetchFrontSetting } from '../../../store/action/frontSettingAction';
import { fetchSales } from '../../../store/action/salesAction';
import { totalSaleReportExcel } from '../../../store/action/totalSaleReportExcel';
import TopProgressBar from "../../../shared/components/loaders/TopProgressBar";

const SaleReport = ( props ) => {
    const {
        isLoading,
        totalRecord,
        fetchFrontSetting,
        fetchSales,
        sales,
        frontSetting,
        dates,
        totalSaleReportExcel, allConfigData
    } = props;
    const [ isWarehouseValue, setIsWarehouseValue ] = useState( false );
    const currencySymbol = frontSetting && frontSetting.value && frontSetting.value.currency_symbol

    useEffect( () => {
        fetchFrontSetting();
    }, [] );

    useEffect( () => {
        if ( isWarehouseValue === true ) {
            totalSaleReportExcel( dates, setIsWarehouseValue );
        }
    }, [ isWarehouseValue ] )

    const itemsValue = currencySymbol && sales.length >= 0 && sales.map( sale => ( {
        reference_code: sale.attributes.reference_code,
        customer_name: sale.attributes.customer_name,
        warehouse_name: sale.attributes.warehouse_name,
        status: sale.attributes.status,
        payment_status: sale.attributes.payment_status,
        grand_total: sale.attributes.grand_total,
        paid_amount: sale.attributes.paid_amount ? sale.attributes.paid_amount : 0.00.toFixed( 2 ),
        currency: currencySymbol,
        id: sale.id
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
                        <span>{getFormattedMessage( "payment-status.filter.partial.label" )}</span>
                    </span>
                )
            }
        },
    ];

    const onChange = ( filter ) => {
        fetchSales( filter, true );
    };

    const onExcelClick = () => {
        setIsWarehouseValue( true );
    };

    return (
        <MasterLayout>
            <TopProgressBar />
            <TabTitle title={placeholderText( 'sale.reports.title' )} />
            <ReactDataTable columns={columns} items={itemsValue} onChange={onChange} isLoading={isLoading}
                totalRows={totalRecord} isShowDateRangeField isEXCEL isShowFilterField
                isStatus isPaymentStatus onExcelClick={onExcelClick} />
        </MasterLayout>
    )
};
const mapStateToProps = ( state ) => {
    const { sales, frontSetting, isLoading, totalRecord, dates, allConfigData } = state;
    return { sales, frontSetting, isLoading, totalRecord, dates, allConfigData }
};

export default connect( mapStateToProps, { fetchFrontSetting, fetchSales, totalSaleReportExcel } )( SaleReport );
