import React, {useEffect, useState} from 'react';
import {Row, Tab, Tabs} from 'react-bootstrap';
import MasterLayout from '../../MasterLayout';
import TabTitle from '../../../shared/tab-title/TabTitle';
import {getFormattedMessage, placeholderText} from '../../../shared/sharedMethod';
import {useParams} from 'react-router-dom';
import HeaderTitle from '../../header/HeaderTitle';
import {useDispatch, useSelector} from 'react-redux';
import TopProgressBar from "../../../shared/components/loaders/TopProgressBar";
import Widget from "../../../shared/Widget/Widget";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft, faArrowRight, faCartPlus} from "@fortawesome/free-solid-svg-icons";
import {fetchFrontSetting} from "../../../store/action/frontSettingAction";
import SalesTab from './customer-tab/SalesTab';
import QuotationsTeb from './customer-tab/QuotationsTeb';
import SaleReturnTabs from './customer-tab/SaleReturnTabs';
import SalePayment from './customer-tab/SalePayment';
import { fetchCustomerReportWidget } from '../../../store/action/customerReportWidgetAction';

const CustomerReportDetails = (props) => {
    const [key, setKey] = useState('sale');
    const {id} = useParams();
    const dispatch = useDispatch()
    const {frontSetting, customerReportWidgetData, allConfigData} = useSelector(state => state)
    const currencySymbol = frontSetting && frontSetting.value && frontSetting.value.currency_symbol

    useEffect(() => {
        id && dispatch(fetchCustomerReportWidget(id))
        dispatch(fetchFrontSetting())
    }, [])

    return (
        <MasterLayout>
            <TopProgressBar/>
            <HeaderTitle title={getFormattedMessage('customer.report.details.title')} to='/app/report/customers'/>
            <TabTitle title={placeholderText('customer.report.details.title')}/>
            <Row className='g-4 justify-content-center'>
                <Widget title={getFormattedMessage('sale.title')}
                        className='bg-success' iconClass='bg-green-300'
                        icon={<FontAwesomeIcon icon={faCartPlus} className='fs-1-xl text-white'/>}   currency={''}
                        value={customerReportWidgetData?.totalSale ? parseFloat(customerReportWidgetData?.totalSale).toFixed(2) : '0.00'}/>
                <Widget title={getFormattedMessage('pos-total-amount.title')}
                        className='bg-info' iconClass='bg-blue-300' allConfigData={allConfigData}
                        icon={<FontAwesomeIcon icon={faArrowRight} className='fs-1-xl text-white'/>}
                        currency={currencySymbol}
                        value={customerReportWidgetData?.totalAmount ? parseFloat(customerReportWidgetData?.totalAmount).toFixed(2) : '0.00'}/>
                <Widget title={getFormattedMessage('sale-paid.total.amount.title')}
                        className='bg-warning' iconClass='bg-yellow-300' allConfigData={allConfigData}
                        icon={<FontAwesomeIcon icon={faArrowLeft} className='fs-1-xl text-white'/>}
                        currency={currencySymbol}
                        value={customerReportWidgetData?.totalPaid ? parseFloat(customerReportWidgetData?.totalPaid).toFixed(2) : '0.00'}/>
                <Widget title={getFormattedMessage('sale-Due.total.amount.title')}
                        className='bg-info' iconClass='bg-blue-300' allConfigData={allConfigData}
                        icon={<FontAwesomeIcon icon={faArrowRight} className='fs-1-xl text-white'/>}
                        currency={currencySymbol}
                        value={customerReportWidgetData?.totalSalesDue ? parseFloat(customerReportWidgetData?.totalSalesDue).toFixed(2) : '0.00'}/>
            </Row>
            <Tabs defaultActiveKey='sale' id='uncontrolled-tab-example' onSelect={(k) => setKey(k)}
                  className='mt-7 mb-5'>
                <Tab eventKey='sale' title={getFormattedMessage('sale.title')}
                     tabClassName='position-relative mb-3 me-7'>
                    <div className='w-100 mx-auto'>
                        {key === 'sale' && <SalesTab allConfigData={allConfigData} customerId={id}/>}
                    </div>
                </Tab>
                <Tab eventKey='Sale-return' title={getFormattedMessage('dashboard.salesReturn.title')}
                     tabClassName='position-relative mb-3 me-7'>
                    <div className='w-100 mx-auto'>
                        {key === 'Sale-return' && <SaleReturnTabs allConfigData={allConfigData} customerId={id}/>}
                    </div>
                </Tab>
                <Tab eventKey='Quotations' title={getFormattedMessage('quotations.title')}
                     tabClassName='position-relative mb-3 me-7'>
                    <div className='w-100 mx-auto'>
                        {key === 'Quotations' && <QuotationsTeb allConfigData={allConfigData} customerId={id}/>}
                    </div>
                </Tab>
                <Tab eventKey='Sale-payment' title={getFormattedMessage("sale.payment.report.title")}
                     tabClassName='position-relative mb-3 me-7'>
                    <div className='w-100 mx-auto'>
                        {key === 'Sale-payment' && <SalePayment allConfigData={allConfigData} customerId={id}/>}
                    </div>
                </Tab>
            </Tabs>
        </MasterLayout>
    )
}

export default CustomerReportDetails;
