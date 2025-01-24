import React, {useEffect} from 'react';
import Form from 'react-bootstrap/Form';
import {connect} from 'react-redux';
import {Col, Row, Table} from 'react-bootstrap-v5';
import {useParams} from 'react-router-dom';
import MasterLayout from '../MasterLayout';
import HeaderTitle from '../header/HeaderTitle';
import TabTitle from '../../shared/tab-title/TabTitle';
import {currencySymbolHendling, getFormattedMessage, placeholderText} from '../../shared/sharedMethod';
import {saleDetailsAction} from '../../store/action/saleDetailsAction';
import {fetchFrontSetting} from '../../store/action/frontSettingAction';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEnvelope, faLocationDot, faMobileAlt, faUser} from "@fortawesome/free-solid-svg-icons";
import TopProgressBar from "../../shared/components/loaders/TopProgressBar";

const SaleDetails = (props) => {
    const {saleDetailsAction, saleDetails, fetchFrontSetting, frontSetting, allConfigData} = props;
    const {id} = useParams();

    useEffect(() => {
        fetchFrontSetting();
    }, []);

    useEffect(() => {
        saleDetailsAction(id);
    }, []);

    return (
        <MasterLayout>
            <TopProgressBar/>
            <HeaderTitle title={getFormattedMessage('sale.details.title')} to='/app/sales'/>
            <TabTitle title={placeholderText('sale.details.title')}/>
            <div className='card'>
                <div className='card-body'>
                    <Form>
                        <div className='row'>
                            <div className='col-12'>
                                <h4 className='font-weight-bold text-center mb-5'>
                                    {getFormattedMessage('sale.details.title')} : {saleDetails && saleDetails.reference_code}
                                </h4>
                            </div>
                        </div>
                        <Row className='custom-line-height'>
                            <Col md={4}>
                                <h5 className='text-gray-600 bg-light p-4 mb-0 text-uppercase'>{getFormattedMessage('sale.detail.customer.info')}</h5>
                                <div className='p-4'>
                                    <div className='d-flex align-items-center pb-1'>
                                        <FontAwesomeIcon icon={faUser}
                                                         className='text-primary me-2 fs-5'/>{saleDetails.customer && saleDetails.customer.name}
                                    </div>
                                    <div className='d-flex align-items-center pb-1'>
                                        <FontAwesomeIcon icon={faEnvelope}
                                                         className='text-primary me-2 fs-5'/>{saleDetails.customer && saleDetails.customer.email}
                                    </div>
                                    <div className='d-flex align-items-center pb-1'>
                                        <FontAwesomeIcon icon={faMobileAlt}
                                                         className='text-primary me-2 fs-5'/>{saleDetails.customer && saleDetails.customer.phone}
                                    </div>
                                    <div className='d-flex align-items-center'>
                                        <FontAwesomeIcon icon={faLocationDot}
                                                         className='text-primary me-2 fs-5'/>{saleDetails.customer && saleDetails.customer.address}
                                    </div>
                                </div>
                            </Col>
                            <Col md={4}>
                                <h5 className='text-gray-600 bg-light p-4 mb-0 text-uppercase'>{getFormattedMessage('globally.detail.company.info')}</h5>
                                <div className='p-4'>
                                    <div className='d-flex align-items-center pb-1'>
                                        <FontAwesomeIcon icon={faUser}
                                                         className='text-primary me-2 fs-5'/>{saleDetails.company_info && saleDetails.company_info.company_name}
                                    </div>
                                    <div className='d-flex align-items-center pb-1'>
                                        <FontAwesomeIcon icon={faEnvelope}
                                                         className='text-primary me-2 fs-5'/>{saleDetails.company_info && saleDetails.company_info.email}
                                    </div>
                                    <div className='d-flex align-items-center pb-1'>
                                        <FontAwesomeIcon icon={faMobileAlt}
                                                         className='text-primary me-2 fs-5'/>{saleDetails.company_info && saleDetails.company_info.phone}
                                    </div>
                                    <div className='d-flex align-items-center'>
                                        <FontAwesomeIcon icon={faLocationDot}
                                                         className='text-primary me-2 fs-5'/>{saleDetails.company_info && saleDetails.company_info.address}
                                    </div>
                                </div>
                            </Col>
                            <Col md={4}>
                                <h5 className='text-gray-600 bg-light p-4 mb-0 text-uppercase'>{getFormattedMessage('sale.detail.invoice.info')}</h5>
                                <div className='p-4'>
                                    <div className='pb-1'>
                                        <span
                                            className='me-2'>{getFormattedMessage('globally.detail.reference')} :</span>
                                        <span>{saleDetails && saleDetails.reference_code}</span>
                                    </div>
                                    <div className='pb-1'>
                                        <span className='me-2'>{getFormattedMessage('globally.detail.status')} :</span>
                                        {saleDetails && saleDetails.status === 1 &&
                                        <span className='badge bg-light-success'>
                                        <span>Received</span>
                                    </span> || saleDetails.status === 2 &&
                                        <span className='badge bg-light-primary'>
                                        <span>Pending</span>
                                    </span> || saleDetails.status === 3 &&
                                        <span className='badge bg-light-warning'>
                                        <span>Ordered</span>
                                    </span>
                                        }
                                    </div>
                                    <div className='pb-1'>
                                        <span
                                            className='me-2'>{getFormattedMessage('globally.detail.warehouse')} :</span>
                                        <span>{saleDetails.warehouse && saleDetails.warehouse.name}</span>
                                    </div>
                                    <div>
                                        <span
                                            className='me-2'>{getFormattedMessage('globally.detail.payment.status')} :</span>
                                        {saleDetails && saleDetails.payment_status === 1 &&
                                        <span className='badge bg-light-success'>
                                        <span>Paid</span>
                                    </span> || saleDetails.payment_status === 2 &&
                                        <span className='badge bg-light-warning'>
                                        <span>Unpaid</span>
                                    </span>
                                        }
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <div className='mt-5'>
                            <h5 className='text-gray-600 bg-light p-4 mb-5 text-uppercase'>{getFormattedMessage('globally.detail.order.summary')}</h5>
                            <Table responsive>
                                <thead>
                                <tr>
                                    <th className='ps-3'>{getFormattedMessage('globally.detail.product')}</th>
                                    <th className='ps-3'>{getFormattedMessage('globally.detail.net-unit-price')}</th>
                                    <th className='ps-3'>{getFormattedMessage('globally.detail.quantity')}</th>
                                    <th className='ps-3'>{getFormattedMessage('globally.detail.unit-price')}</th>
                                    <th className='ps-3'>{getFormattedMessage('globally.detail.discount')}</th>
                                    <th className='ps-3'>{getFormattedMessage('globally.detail.tax')}</th>
                                    <th colSpan={2}>{getFormattedMessage('globally.detail.subtotal')}</th>
                                </tr>
                                </thead>
                                <tbody>
                                {saleDetails.sale_items && saleDetails.sale_items.map((details, index) => {
                                    return (
                                        <tr key={index} className='align-middle'>
                                            <td className='ps-3'>{details.product && details.product.code} ({details.product && details.product.name})</td>
                                            <td>{currencySymbolHendling(allConfigData, frontSetting.value && frontSetting.value.currency_symbol, details.net_unit_price)}</td>
                                            <td>{details.quantity}</td>
                                            <td>{currencySymbolHendling(allConfigData, frontSetting.value && frontSetting.value.currency_symbol, details.product_price)}</td>
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
                                                    {currencySymbolHendling(allConfigData, frontSetting.value && frontSetting.value.currency_symbol, saleDetails && saleDetails.tax_amount > 0 ? saleDetails.tax_amount : '0.00')} ({saleDetails && parseFloat(saleDetails.tax_rate).toFixed(2)}%)
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className='py-3'>{getFormattedMessage('globally.detail.discount')}</td>
                                                <td className='py-3'>{currencySymbolHendling(allConfigData, frontSetting.value && frontSetting.value.currency_symbol, saleDetails && saleDetails.discount)}</td>
                                            </tr>
                                            <tr>
                                                <td className='py-3'>{getFormattedMessage('globally.detail.shipping')}</td>
                                                <td className='py-3'>{currencySymbolHendling(allConfigData, frontSetting.value && frontSetting.value.currency_symbol, saleDetails && saleDetails.shipping)}</td>
                                            </tr>
                                            <tr>
                                                <td className='py-3 text-primary'>{getFormattedMessage('globally.detail.grand.total')}</td>
                                                <td className='py-3 text-primary'>
                                                    {currencySymbolHendling(allConfigData, frontSetting.value && frontSetting.value.currency_symbol, saleDetails && saleDetails.grand_total)}
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
    const {saleDetails, frontSetting, allConfigData} = state;
    return {saleDetails, frontSetting, allConfigData}
};

export default connect(mapStateToProps, {saleDetailsAction, fetchFrontSetting})(SaleDetails);
