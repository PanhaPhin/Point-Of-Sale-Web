import React, {useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {Col, Row, Table} from 'react-bootstrap-v5';
import Form from 'react-bootstrap/Form';
import {connect} from 'react-redux';
import {faUser, faEnvelope, faLocationDot, faMobileAlt} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import MasterLayout from '../MasterLayout';
import HeaderTitle from '../header/HeaderTitle';
import TabTitle from '../../shared/tab-title/TabTitle';
import {currencySymbolHendling, getFormattedMessage, placeholderText} from '../../shared/sharedMethod';
import {purchaseDetailsAction} from '../../store/action/purchaseDetailsAction';
import {fetchFrontSetting} from '../../store/action/frontSettingAction';

const PurchaseDetails = (props) => {
    const {purchaseDetailsAction, purchaseDetails, fetchFrontSetting, frontSetting, allConfigData} = props;
    const {id} = useParams();

    useEffect(() => {
        fetchFrontSetting();
    }, []);

    useEffect(() => {
        purchaseDetailsAction(id);
    }, []);

    return (
        <MasterLayout>
            <HeaderTitle title={getFormattedMessage('purchases.details.title')} to='/app/purchases'/>
            <TabTitle title={placeholderText('purchases.details.title')}/>
            <div className='card'>
                <div className='card-body'>
                    <Form>
                        <div className='row'>
                            <div className='col-12'>
                                <h4 className='font-weight-bold text-center mb-5'>
                                    {getFormattedMessage('purchases.details.title')} : {purchaseDetails && purchaseDetails.reference_code}
                                </h4>
                            </div>
                        </div>
                        <Row className='custom-line-height'>
                            <Col md={4}>
                                <h5 className='text-gray-600 bg-light p-4 mb-0 text-uppercase'>{getFormattedMessage('purchase.detail.supplier.info')}</h5>
                                <div className='p-4'>
                                    <div className='d-flex align-items-center pb-1'>
                                        <FontAwesomeIcon icon={faUser} className='text-primary me-2 fs-5'/>{purchaseDetails.supplier && purchaseDetails.supplier.name}
                                    </div>
                                    <div className='d-flex align-items-center pb-1'>
                                        <FontAwesomeIcon icon={faEnvelope} className='text-primary me-2 fs-5'/>{purchaseDetails.supplier && purchaseDetails.supplier.email}
                                    </div>
                                    <div className='d-flex align-items-center pb-1'>
                                        <FontAwesomeIcon icon={faMobileAlt} className='text-primary me-2 fs-5'/>{purchaseDetails.supplier && purchaseDetails.supplier.phone}
                                    </div>
                                    <div className='d-flex align-items-center'>
                                        <FontAwesomeIcon icon={faLocationDot} className='text-primary me-2 fs-5'/>{purchaseDetails.supplier && purchaseDetails.supplier.address}
                                    </div>
                                </div>
                            </Col>
                            <Col md={4} className='m-md-0 m-4'>
                                <h5 className='text-gray-600 bg-light p-4 mb-0 text-uppercase'>{getFormattedMessage('globally.detail.company.info')}</h5>
                                <div className='p-4'>
                                    <div className='d-flex align-items-center pb-1'>
                                        <FontAwesomeIcon icon={faUser} className='text-primary me-2 fs-5'/>
                                        {purchaseDetails.company_info && purchaseDetails.company_info.company_name}
                                    </div>
                                    <div className='d-flex align-items-center pb-1'>
                                        <FontAwesomeIcon icon={faEnvelope} className='text-primary me-2 fs-5'/>
                                        {purchaseDetails.company_info && purchaseDetails.company_info.email}
                                    </div>
                                    <div className='d-flex align-items-center pb-1'>
                                        <FontAwesomeIcon icon={faMobileAlt} className='text-primary me-2 fs-5'/>
                                        {purchaseDetails.company_info && purchaseDetails.company_info.phone}
                                    </div>
                                    <div className='d-flex align-items-center'>
                                        <FontAwesomeIcon icon={faLocationDot} className='text-primary me-2 fs-5'/>
                                        {purchaseDetails.company_info && purchaseDetails.company_info.address}
                                    </div>
                                </div>
                            </Col>
                            <Col md={4}>
                                <h5 className='text-gray-600 bg-light p-4 mb-0 text-uppercase'>{getFormattedMessage('purchase.detail.purchase.info')}</h5>
                                <div className='p-4'>
                                    <div className='pb-1'>
                                        <span
                                            className='me-2'>{getFormattedMessage('globally.detail.reference')} :</span>
                                        <span>{purchaseDetails && purchaseDetails.reference_code}</span>
                                    </div>
                                    <div className='pb-1'>
                                        <span className='me-2'>{getFormattedMessage('globally.detail.status')} :</span>
                                        {purchaseDetails && purchaseDetails.status === 1 &&
                                        <span className='badge bg-light-success'>
                                                <span>Received</span>
                                           </span> || purchaseDetails.status === 2 &&
                                        <span className='badge bg-light-primary'>
                                                <span>Pending</span>
                                        </span> || purchaseDetails.status === 3 &&
                                        <span className='badge bg-light-warning'>
                                                <span>Ordered</span>
                                        </span>
                                        }
                                    </div>
                                    <div className='pb-1'>
                                        <span
                                            className='me-2'>{getFormattedMessage('globally.detail.warehouse')} :</span>
                                        <span>{purchaseDetails.warehouse && purchaseDetails.warehouse.name}</span>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <div className='mt-5'>
                            <h5 className='text-gray-600 bg-light p-4 mb-4 text-uppercase'>{getFormattedMessage('globally.detail.order.summary')}</h5>
                            <Table responsive>
                                <thead>
                                <tr>
                                    <th className='ps-3'>{getFormattedMessage('globally.detail.product')}</th>
                                    <th className='ps-3'>{getFormattedMessage('globally.detail.net-unit-cost')}</th>
                                    <th className='ps-3'>{getFormattedMessage('globally.detail.quantity')}</th>
                                    <th className='ps-3'>{getFormattedMessage('globally.detail.unit-cost')}</th>
                                    <th className='ps-3'>{getFormattedMessage('globally.detail.discount')}</th>
                                    <th className='ps-3'>{getFormattedMessage('globally.detail.tax')}</th>
                                    <th colSpan={2}>{getFormattedMessage('globally.detail.subtotal')}</th>
                                </tr>
                                </thead>
                                <tbody>
                                {purchaseDetails.purchase_items && purchaseDetails.purchase_items.map((details, index) => {
                                    return (
                                        <tr key={index} className='align-middle'>
                                            <td className='ps-3'>{details.product && details.product.code} ({details.product && details.product.name} )</td>
                                            <td>{currencySymbolHendling(allConfigData, frontSetting.value && frontSetting.value.currency_symbol, details.net_unit_cost)}</td>
                                            <td>{details.quantity}</td>
                                            <td>{currencySymbolHendling(allConfigData, frontSetting.value && frontSetting.value.currency_symbol, details.product.product_cost)}</td>
                                            <td>{currencySymbolHendling(allConfigData, frontSetting.value && frontSetting.value.currency_symbol, details.discount_amount)}</td>
                                            <td>{currencySymbolHendling(allConfigData, frontSetting.value && frontSetting.value.currency_symbol, details.tax_amount)}</td>
                                            <td>{currencySymbolHendling(allConfigData, frontSetting.value && frontSetting.value.currency_symbol, details.sub_total)}</td>
                                        </tr>)
                                })}
                                </tbody>
                            </Table>
                        </div>
                        <div className='col-xxl-5 col-lg-6 col-md-6 col-12 float-end'>
                            <div className='card'>
                                <div className='card-body pt-7 pb-2'>
                                    <div className='table-responsive'>
                                        <table className='table border'>
                                            <tbody>
                                            <tr>
                                                <td className='py-3'>{getFormattedMessage('globally.detail.order.tax')}</td>
                                                <td className='py-3'>
                                                    {currencySymbolHendling(allConfigData, frontSetting.value && frontSetting.value.currency_symbol, purchaseDetails && purchaseDetails.tax_amount > 0 ? purchaseDetails.tax_amount : '0.00')} ({purchaseDetails && parseFloat(purchaseDetails.tax_rate).toFixed(2)}%)
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className='py-3'>{getFormattedMessage('globally.detail.discount')}</td>
                                                <td className='py-3'>{currencySymbolHendling(allConfigData, frontSetting.value && frontSetting.value.currency_symbol, purchaseDetails && purchaseDetails.discount)}</td>
                                            </tr>
                                            <tr>
                                                <td className='py-3'>{getFormattedMessage('globally.detail.shipping')}</td>
                                                <td className='py-3'>{currencySymbolHendling(allConfigData, frontSetting.value && frontSetting.value.currency_symbol, purchaseDetails && purchaseDetails.shipping)}</td>
                                            </tr>
                                            <tr>
                                                <td className='py-3 text-primary'>{getFormattedMessage('globally.detail.grand.total')}</td>
                                                <td className='py-3 text-primary'>
                                                {currencySymbolHendling(allConfigData, frontSetting.value && frontSetting.value.currency_symbol, purchaseDetails && purchaseDetails.grand_total)}
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Form>
                </div>
            </div>
        </MasterLayout>
    )
};

const mapStateToProps = (state) => {
    const {purchaseDetails, frontSetting, allConfigData} = state;
    return {purchaseDetails, frontSetting, allConfigData}
};

export default connect(mapStateToProps, {purchaseDetailsAction, fetchFrontSetting})(PurchaseDetails);
