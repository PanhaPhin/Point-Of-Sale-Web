import React, {useEffect} from 'react';
import moment from 'moment';
import {connect} from 'react-redux';
import ReactDataTable from '../../../../shared/table/ReactDataTable';
import {currencySymbolHendling, getFormattedDate, getFormattedMessage} from '../../../../shared/sharedMethod';
import {fetchFrontSetting} from '../../../../store/action/frontSettingAction';
import { fetchQuotations } from '../../../../store/action/quotationAction';
import { customerQutationReportPDF } from '../../../../store/action/customerReportAction';

const QuotationsTeb = (props) => {
    const {totalRecord, isLoading, fetchFrontSetting, frontSetting, isCallSaleApi, fetchQuotations, quotations, allConfigData, customerId, customerQutationReportPDF} = props;

    useEffect(() => {
        fetchFrontSetting();
    }, []);

    const currencySymbol = frontSetting && frontSetting.value && frontSetting.value.currency_symbol

    // fetch all quotations
    const onChange = (filter) => {
        fetchQuotations(filter, true);
    };

    //onClick pdf function
    const onReportPdfClick = (id) => {
        customerQutationReportPDF(id)
    }

    const itemsValue = currencySymbol && quotations.length >= 0 && quotations.map(quotation => ({
        date: getFormattedDate(quotation.attributes.date, allConfigData && allConfigData),
        // date_for_payment: sale.attributes.date,
        is_sale_created: quotation.attributes.is_sale_created,
        time: moment(quotation.attributes.created_at).format('LT'),
        reference_code: quotation.attributes.reference_code,
        customer_name: quotation.attributes.customer_name,
        warehouse_name: quotation.attributes.warehouse_name,
        status: quotation.attributes.status,
        grand_total: quotation.attributes.grand_total,
        paid_amount: quotation.attributes.paid_amount ? sale.attributes.paid_amount : 0.00.toFixed(2),
        id: quotation.id,
        currency: currencySymbol
    }));

    const columns = [
        {
            name: getFormattedMessage('dashboard.recentSales.reference.label'),
            sortField: 'reference_code',
            sortable: false,
            cell: row => {
                return <span className='badge bg-light-danger'>
                            <span>{row.reference_code}</span>
                        </span>
            }
        },
        {
            name: getFormattedMessage('customer.title'),
            selector: row => row.customer_name,
            sortField: 'customer_name',
            sortable: false,
        },
        {
            name: getFormattedMessage('warehouse.title'),
            selector: row => row.warehouse_name,
            sortField: 'warehouse_name',
            sortable: false,
        },
        {
            name: getFormattedMessage('purchase.select.status.label'),
            sortField: 'status',
            sortable: false,
            cell: row => {
                return (
                    row.status === 1 &&
                    <span className='badge bg-light-warning'>
                        <span>{getFormattedMessage("status.filter.sent.label")}</span>
                    </span> ||
                    row.status === 2 &&
                    <span className='badge bg-light-danger'>
                        <span>{getFormattedMessage("status.filter.pending.label")}</span>
                    </span>
                )
            }
        },
        {
            name: getFormattedMessage('purchase.grant-total.label'),
            selector: row => currencySymbolHendling(allConfigData, row.currency, row.grand_total),
            sortField: 'grand_total',
            sortable: true,
        },
        {
            name: getFormattedMessage('globally.react-table.column.created-date.label'),
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
            <>
            <ReactDataTable columns={columns} items={itemsValue}
                            isCallSaleApi={isCallSaleApi}
                            onChange={onChange} totalRows={totalRecord}
                            isLoading={isLoading} onReportPdfClick={() => onReportPdfClick(customerId)}
                            isReportPdf  customerId={customerId}/>
            </>
    )
};

const mapStateToProps = (state) => {
    const {sales, totalRecord, isLoading, frontSetting, isCallSaleApi, quotations, allConfigData} = state;
    return {sales, totalRecord, isLoading, frontSetting, isCallSaleApi, quotations, allConfigData};
};

export default connect(mapStateToProps, {fetchFrontSetting, fetchQuotations, customerQutationReportPDF})(QuotationsTeb);
