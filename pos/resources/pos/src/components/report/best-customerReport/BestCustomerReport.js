import React, {useEffect} from 'react';
import MasterLayout from '../../MasterLayout';
import TabTitle from '../../../shared/tab-title/TabTitle';
import {currencySymbolHendling, getFormattedMessage, placeholderText} from '../../../shared/sharedMethod';
import ReactDataTable from '../../../shared/table/ReactDataTable';
import {connect} from 'react-redux';
import {fetchFrontSetting} from '../../../store/action/frontSettingAction';
import TopProgressBar from "../../../shared/components/loaders/TopProgressBar";
import { bestCustomerReportAction, bestCustomerPdfAction } from '../../../store/action/bestCustomerReport';

const BestCustomerReport = (props) => {
    const {
        isLoading,
        totalRecord,
        fetchFrontSetting,
        frontSetting,
        bestCustomerReportAction,
        bestCustomer,
        bestCustomerPdfAction, allConfigData
    } = props;

    useEffect(() => {
        fetchFrontSetting();
    }, []);

    const currencySymbol = frontSetting && frontSetting.value && frontSetting.value.currency_symbol

    const itemsValue = bestCustomer?.top_customers
        && bestCustomer?.top_customers?.length >= 0 && bestCustomer?.top_customers?.map(report => ({
        name: report && report.name,
        phone: report && report.phone,
        email: report && report.email,
        grand_total: report && report.grand_total,
        sales_count: report && report.sales_count,
        currency: currencySymbol
    }));

    const onChange = (filter) => {
        bestCustomerReportAction(filter, true)
    };

    // onClick pdf function
    const onReportPdfClick = () => {
        bestCustomerPdfAction()
    }

    const columns = [
        {
            name: getFormattedMessage('supplier.table.name.column.title'),
            sortField: 'name',
            sortable: false,
            cell: row => {
                return <span className='badge bg-light-danger'>
                            <span>{row.name}</span>
                        </span>
            }
        },
        {
            name: getFormattedMessage("pos-sale.detail.Phone.info"),
            selector: row => row.phone,
            sortField: 'phone',
            sortable: false,
        },
        {
            name: getFormattedMessage("user.input.email.label"),
            selector: row => row.email,
            sortField: 'email',
            sortable: false,
        },
        {
            name: getFormattedMessage("total.sales.title"),
            sortField: 'sales',
            sortable: false,
            selector: row => row.sales_count,
        },
        {
            name: getFormattedMessage('pos-total-amount.title'),
            selector: row => currencySymbolHendling(allConfigData, row.currency, row.grand_total),
            sortField: 'grand_total',
            sortable: false,
        }
    ];

    return (
        <MasterLayout>
            <TopProgressBar />
            <TabTitle title={placeholderText('best-customer.report.title')}/>
            <div className='pt-md-7'>
                <ReactDataTable subHeader={true} isShowSearch={true} items={itemsValue} columns={columns}  onChange={onChange} isLoading={isLoading}
                                totalRows={totalRecord} isReportPdf onReportPdfClick={onReportPdfClick} />
            </div>
        </MasterLayout>
    )
};
const mapStateToProps = (state) => {
    const {isLoading, totalRecord, frontSetting, bestCustomer, allConfigData} = state;
    return {isLoading, totalRecord, frontSetting, bestCustomer, allConfigData}
};

export default connect(mapStateToProps, {
    fetchFrontSetting,
    bestCustomerReportAction,
    bestCustomerPdfAction
})(BestCustomerReport);
