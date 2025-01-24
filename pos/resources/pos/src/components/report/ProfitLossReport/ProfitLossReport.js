import React, {useEffect, useState} from 'react';
import MasterLayout from '../../MasterLayout';
import TabTitle from '../../../shared/tab-title/TabTitle';
import {currencySymbolHendling, getFormattedMessage, placeholderText} from '../../../shared/sharedMethod';
import {connect} from 'react-redux';
import TopProgressBar from "../../../shared/components/loaders/TopProgressBar";
import {Col, Row} from "react-bootstrap";
import ProfitLossWidget from "../../../shared/Widget/ProfitLossWidget";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faArrowLeft,faArrowRight,
    faCartPlus, faSquarePlus,
    faShoppingCart, faSquareMinus,
    faMoneyBillTrendUp, faMoneyBillTransfer
} from "@fortawesome/free-solid-svg-icons";
import DateRangePicker from "../../../shared/datepicker/DateRangePicker";
import {Filters} from "../../../constants";
import {dateFormat} from '../../../constants';
import moment from 'moment';
import { fetchProfitAndLossReports } from '../../../store/action/profitAndLossReportAction';
import { fetchFrontSetting } from '../../../store/action/frontSettingAction';


const ProfitLossReport = (props) => {
    const {fetchFrontSetting,frontSetting, fetchProfitAndLossReports, profitAndLossReport, allConfigData} = props
    const [selectDate, setSelectDate] = useState();
    const [created_at] = useState(Filters.OBJ.created_at);
    const startMonth = moment().startOf('month').format(dateFormat.NATIVE);
    const today = moment().format(dateFormat.NATIVE);

    useEffect(() => {
        fetchFrontSetting();
    }, []);

    useEffect(() => {
        onChangeDidMount();
    }, [selectDate]);

    const onChange = (filter) => {
        fetchProfitAndLossReports(filter, true)
    };

    const onDateSelector = (date) => {
        setSelectDate(date.params);
    };

    const onChangeDidMount = () => {
        const filters = {
            created_at: created_at,
            search: '',
            start_date: selectDate ? selectDate.start_date : startMonth,
            end_date: selectDate ? selectDate.end_date : today,
        };
        onChange(filters);
    };

    return (
        <MasterLayout>
            <TopProgressBar/>
            <TabTitle title={placeholderText('profit-loss.reports.title')}/>
               <div className={"d-flex justify-content-center"}>
                   <DateRangePicker onDateSelector={onDateSelector} isProfitReport={true} selectDate={selectDate}/>
               </div>
            <Row className='g-4'>
                <Col className='col-12 mb-4'>
                    <Row className={"align-items-start"}>
                        <ProfitLossWidget className={'bg-primary'} iconClass='bg-cyan-300' currency={frontSetting.value && frontSetting.value.currency_symbol}
                                          icon={<FontAwesomeIcon icon={faShoppingCart} className='fs-1-xl text-white'/>}
                                          title={getFormattedMessage('sales.title')} allConfigData={allConfigData}
                                          value={profitAndLossReport.sales ? parseFloat(profitAndLossReport.sales).toFixed(2) : '0.00'}/>

                        <ProfitLossWidget className={'bg-success'} iconClass='bg-green-300' currency={frontSetting.value && frontSetting.value.currency_symbol}
                                          icon={<FontAwesomeIcon icon={faCartPlus} className='fs-1-xl text-white'/>}
                                          title={getFormattedMessage('purchases.title')} allConfigData={allConfigData}
                                          value={profitAndLossReport.purchases ? parseFloat(profitAndLossReport.purchases).toFixed(2) : '0.00'}/>

                        <ProfitLossWidget className={'bg-info'} iconClass='bg-blue-300' currency={frontSetting.value && frontSetting.value.currency_symbol}
                                          icon={<FontAwesomeIcon icon={faArrowRight} className='fs-1-xl text-white'/>}
                                          title={getFormattedMessage("sales-return.title")} allConfigData={allConfigData}
                                          value={profitAndLossReport.sale_returns ? parseFloat(profitAndLossReport.sale_returns).toFixed(2) : '0.00'}/>

                        <ProfitLossWidget className={'bg-warning'} iconClass='bg-yellow-300' currency={frontSetting.value && frontSetting.value.currency_symbol}
                                          icon={<FontAwesomeIcon icon={faArrowLeft} className='fs-1-xl text-white'/>}
                                          title={getFormattedMessage("purchases.return.title")} allConfigData={allConfigData}
                                          value={profitAndLossReport.purchase_returns ? parseFloat(profitAndLossReport.purchase_returns).toFixed(2) : '0.00'}/>

                        <ProfitLossWidget className={'widget-bg-purple'} iconClass='widget-bg-blue-700 ' currency={frontSetting.value && frontSetting.value.currency_symbol}
                                          icon={<FontAwesomeIcon icon={faSquareMinus} className='fs-1-xl text-white'/>}
                                          title={getFormattedMessage('expenses.title')} allConfigData={allConfigData}
                                            value={profitAndLossReport.expenses ? parseFloat(profitAndLossReport.expenses).toFixed(2) : '0.00'}/>

                        <ProfitLossWidget className={'widget-bg-pink'} currency={frontSetting.value && frontSetting.value.currency_symbol}
                                          icon={<FontAwesomeIcon icon={faSquarePlus} className='fs-1-xl text-white'/>}
                                          title={getFormattedMessage('global.revenue.title')} allConfigData={allConfigData}
                                          moreText={`(
                                        ${currencySymbolHendling(allConfigData, frontSetting.value && frontSetting.value.currency_symbol, profitAndLossReport.sales ? profitAndLossReport.sales : '0.00')}
                                        ${placeholderText('sales.title')}) - (
                                        ${currencySymbolHendling(allConfigData, frontSetting.value && frontSetting.value.currency_symbol, profitAndLossReport.sale_returns ? profitAndLossReport.sale_returns : '0.00')}
                                        ${placeholderText('sales-return.title')})`}
                                        value={profitAndLossReport.Revenue ? parseFloat(profitAndLossReport.Revenue).toFixed(2) : '0.00'}/>

                        <ProfitLossWidget className={'widget-bg-blue'} currency={frontSetting.value && frontSetting.value.currency_symbol}
                                          icon={<FontAwesomeIcon icon={faMoneyBillTrendUp} className='fs-1-xl text-white'/>}
                                          title={getFormattedMessage('global.gross-profit.title')} allConfigData={allConfigData}
                                          moreText={`(
                                            ${currencySymbolHendling(allConfigData, frontSetting.value && frontSetting.value.currency_symbol, profitAndLossReport.sales ? profitAndLossReport.sales : '0.00')}
                                            ${placeholderText('sales.title')}) - (
                                            ${currencySymbolHendling(allConfigData, frontSetting.value && frontSetting.value.currency_symbol, profitAndLossReport.product_cost ? profitAndLossReport.product_cost : '0.00')}
                                            ${placeholderText('product.input.product-cost.label')})`}
                                          value={profitAndLossReport.gross_profit ? parseFloat(profitAndLossReport.gross_profit).toFixed(2) : '0.00'}/>

                        <ProfitLossWidget className={'widget-bg-red'} currency={frontSetting.value && frontSetting.value.currency_symbol}
                                          icon={<FontAwesomeIcon icon={faMoneyBillTransfer} className='fs-1-xl text-white'/>}
                                          title={getFormattedMessage('global.payment-received.title')} allConfigData={allConfigData}
                                          moreText={`(
                                            ${currencySymbolHendling(allConfigData, frontSetting.value && frontSetting.value.currency_symbol, profitAndLossReport.sales_payment_amount ? profitAndLossReport.sales_payment_amount : '0.00')}
                                            ${placeholderText('global.payment-received.title')}) + (
                                            ${currencySymbolHendling(allConfigData, frontSetting.value && frontSetting.value.currency_symbol, profitAndLossReport.purchase_returns ? profitAndLossReport.purchase_returns : '0.00')}
                                            ${placeholderText('purchases.return.title')})`}
                                          value={profitAndLossReport.payments_received ? parseFloat(profitAndLossReport.payments_received).toFixed(2) : '0.00'}/>
                        {/* <ProfitLossWidget className={'bg-dark'} currency={frontSetting.value && frontSetting.value.currency_symbol}
                                          icon={<FontAwesomeIcon icon={faShoppingCart} className='fs-1-xl text-white'/>}
                                          title={getFormattedMessage('global.payment-sent.title')} moreText={'( $ 13474.00 Payments Purchases + $ 0.00 Sales Return) + $ 350.00 Expenses)'} value={"500"}/>

                        <ProfitLossWidget className={'bg-danger'} currency={frontSetting.value && frontSetting.value.currency_symbol}
                                          icon={<FontAwesomeIcon icon={faShoppingCart} className='fs-1-xl text-white'/>}
                                          title={getFormattedMessage('global.net-payment.title')} moreText={'( $ 12053.80 Recieved - $ 13824.00 Sent)'} value={"500"}/> */}

                    </Row>
                </Col>
            </Row>
        </MasterLayout>
    )
};
const mapStateToProps = (state) => {
    const {frontSetting, profitAndLossReport, allConfigData} = state;
    return {frontSetting, profitAndLossReport, allConfigData}
};

export default connect(mapStateToProps, {
    fetchProfitAndLossReports,
    fetchFrontSetting
})(ProfitLossReport);

