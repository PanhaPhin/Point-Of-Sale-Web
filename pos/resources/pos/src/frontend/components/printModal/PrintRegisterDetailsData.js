import React from 'react';
import { Table } from 'react-bootstrap-v5';
import moment from 'moment';
import { calculateProductCost } from '../../shared/SharedMethod';
import '../../../assets/scss/frontend/pdf.scss';
import { currencySymbolHendling, getFormattedMessage } from '../../../shared/sharedMethod';

class PrintRegisterDetailsData extends React.PureComponent {
    render () {
        const posAllTodaySaleOverAllReport = this.props.posAllTodaySaleOverAllReport;
        const frontSetting = this.props.frontSetting
        const allConfigData = this.props.allConfigData
        const closeRegisterDetails = this.props.closeRegisterDetails
        const currencySymbol = frontSetting && frontSetting.value && frontSetting.value.currency_symbol

        const sumOfProductQuantity = posAllTodaySaleOverAllReport?.today_total_products_sold?.reduce( ( acc, o ) => acc + parseInt( o.total_quantity ), 0 )
        const sumOfBrandQuantity = posAllTodaySaleOverAllReport?.today_brand_report?.reduce( ( acc, o ) => acc + parseInt( o.total_quantity ), 0 )

        return (
            <div className="print-data" style={{ "width": "100%", maxWidth: "600px", marginLeft: "auto", marginRight: "auto" }}>
                <div style={{ marginBottom: "20px" }}>
                    <h1 style={{ fontWeight: "bold", color: "#212529", textAlign: "center", marginBottom: "10px" }}>
                        {getFormattedMessage( "register.details.title" )} ({moment( Date() ).format( 'MMMM Do YYYY' )})
                    </h1>
                </div>
                <Table style={{ "width": "100%", "marginTop": "30px" }}>
                    <thead>
                        <tr style={{ "width": "100%", 'background': '#F8F9FA' }}>
                            <th style={{
                                "textAlign": "start",
                                "padding": "8px 15px",
                                "fontSize": '12px',
                            }}>{getFormattedMessage( "select.payment-type.label" )}
                            </th>
                            <th style={{
                                "textAlign": "start",
                                "padding": "8px 15px",
                                "fontSize": '12px',
                            }}>{getFormattedMessage( "expense.input.amount.label" )}
                            </th>
                        </tr>
                    </thead>
                    <tbody>

                        <tr style={{ "width": "100%", "borderBottom": '1px solid #DEE2E6' }}>
                            <td style={{ "fontSize": '12px', "border": "none", "padding": "8px 15px" }}>
                                {getFormattedMessage( "globally.input.cash-in-hand.label" )}
                            </td>
                            <td style={{
                                "fontSize": '12px',
                                "border": "none",
                                "padding": "8px 15px"
                            }}>
                                <span>{currencySymbolHendling( allConfigData, currencySymbol, closeRegisterDetails?.cash_in_hand )}</span>
                            </td>
                        </tr>
                        <tr style={{ "width": "100%", "borderBottom": '1px solid #DEE2E6' }}>
                            <td style={{ "fontSize": '12px', "border": "none", "padding": "8px 15px" }}>
                                {getFormattedMessage( "payment-type.filter.cash.label" )}
                            </td>
                            <td style={{
                                "fontSize": '12px',
                                "border": "none",
                                "padding": "8px 15px"
                            }}>
                                <span>{currencySymbolHendling( allConfigData, currencySymbol, closeRegisterDetails?.today_sales_cash_payment )}</span>
                                {/*<span>{(productName.quantity * (calculateProductCost(productName))).toFixed(2)}</span>*/}
                            </td>
                        </tr>

                        <tr style={{ "width": "100%", "borderBottom": '1px solid #DEE2E6' }}>
                            <td style={{ "fontSize": '12px', "border": "none", "padding": "8px 15px" }}>
                                {getFormattedMessage( "payment-type.filter.cheque.label" )}
                            </td>
                            <td style={{
                                "fontSize": '12px',
                                "border": "none",
                                "padding": "8px 15px"
                            }}>
                                <span>{currencySymbolHendling( allConfigData, currencySymbol, closeRegisterDetails?.today_sales_cheque_payment )}</span>
                            </td>
                        </tr>
                        <tr style={{ "width": "100%", "borderBottom": '1px solid #DEE2E6' }}>
                            <td style={{ "fontSize": '12px', "border": "none", "padding": "8px 15px" }}>
                                {getFormattedMessage( "payment-type.filter.bank-transfer.label" )}
                            </td>
                            <td style={{
                                "fontSize": '12px',
                                "border": "none",
                                "padding": "8px 15px"
                            }}>
                                <span>{currencySymbolHendling( allConfigData, currencySymbol, closeRegisterDetails?.today_sales_bank_transfer_payment )}</span>
                            </td>
                        </tr>
                        <tr style={{ "width": "100%", "borderBottom": '1px solid #DEE2E6' }}>
                            <td style={{ "fontSize": '12px', "border": "none", "padding": "8px 15px" }}>
                                {getFormattedMessage( "payment-type.filter.other.label" )}
                            </td>
                            <td style={{
                                "fontSize": '12px',
                                "border": "none",
                                "padding": "8px 15px"
                            }}>
                                <span>{currencySymbolHendling( allConfigData, currencySymbol, closeRegisterDetails?.today_sales_other_payment )}</span>
                                {/*<span>{(productName.quantity * (calculateProductCost(productName))).toFixed(2)}</span>*/}
                            </td>
                        </tr>
                    </tbody>
                </Table>

                <Table style={{ "width": "100%", "marginTop": "30px", border: "1px solid #DEE2E6" }}>
                    <tbody >
                        <tr style={{ "width": "100%", "borderBottom": '1px solid #DEE2E6' }}>
                            <td style={{ "fontSize": '12px', "border": "none", "padding": "8px 15px" }}>
                                {getFormattedMessage( "register.total-sales.label" )}
                            </td>
                            <td style={{
                                "fontSize": '12px',
                                "border": "none",
                                "padding": "8px 15px"
                            }}>
                                <span>{currencySymbolHendling( allConfigData, currencySymbol, closeRegisterDetails?.today_sales_amount )}</span>
                                {/*<span>{(productName.quantity * (calculateProductCost(productName))).toFixed(2)}</span>*/}
                            </td>
                        </tr>

                        <tr style={{ "width": "100%", "borderBottom": '1px solid #DEE2E6' }}>
                            <td style={{ "fontSize": '12px', "border": "none", "padding": "8px 15px" }}>
                                {getFormattedMessage( "register.total-refund.title" )}
                            </td>
                            <td style={{
                                "fontSize": '12px',
                                "border": "none",
                                "padding": "8px 15px"
                            }}>
                                <span>{currencySymbolHendling( allConfigData, currencySymbol, closeRegisterDetails?.today_sales_return_amount )}</span>
                            </td>
                        </tr>
                        <tr style={{ "width": "100%", "borderBottom": '1px solid #DEE2E6' }}>
                            <td style={{ "fontSize": '12px', "border": "none", "padding": "8px 15px" }}>
                                {getFormattedMessage( "register.total-payment.title" )}
                            </td>
                            <td style={{
                                "fontSize": '12px',
                                "border": "none",
                                "padding": "8px 15px"
                            }}>
                                <span>{currencySymbolHendling( allConfigData, currencySymbol, closeRegisterDetails?.today_sales_payment_amount )}</span>
                            </td>
                        </tr>
                    </tbody>
                </Table>

                {/* <Table style={{ "width": "100%", "marginTop": "30px" }}>
                    <thead>
                        <tr style={{ "width": "100%", 'background': '#F8F9FA' }}>
                            <th style={{
                                "textAlign": "start",
                                "padding": "8px 15px",
                                "fontSize": '12px',
                            }}>#
                            </th>
                            <th style={{
                                "textAlign": "start",
                                "padding": "8px 15px",
                                "fontSize": '12px',
                            }}>SKU
                            </th>
                            <th style={{
                                "textAlign": "start",
                                "padding": "8px 15px",
                                "fontSize": '12px'
                            }}>{getFormattedMessage( "product.title" )}
                            </th>
                            <th style={{
                                "textAlign": "start",
                                "padding": "8px 15px",
                                "fontSize": '12px'
                            }}>{getFormattedMessage( "dashboard.stockAlert.quantity.label" )}
                            </th>
                            <th style={{
                                "textAlign": "start",
                                "padding": "8px 15px",
                                "fontSize": '12px'
                            }}>{getFormattedMessage( "pos-total-amount.title" )}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {posAllTodaySaleOverAllReport?.today_total_products_sold?.map( ( pro, index ) => {
                            return (
                                <tr key={index} style={{ "width": "100%", "borderBottom": '1px solid #DEE2E6' }}>
                                    <td className='text-capitalize' style={{ fontSize: '12px', padding: "8px 15px" }}>
                                        {index + 1}
                                    </td>
                                    <td style={{ fontSize: '12px', border: "none", padding: "8px 15px" }}>
                                        {( pro.reference_code )}
                                    </td>
                                    <td style={{ fontSize: '12px', border: "none", padding: "8px 15px" }}>
                                        {pro.name}
                                    </td>
                                    <td className="fs-12" style={{ fontSize: '12px', border: "none", padding: "8px 15px" }}>
                                        <span>{pro.total_quantity}</span>
                                        <span> {pro.product_unit === "3" && "Kg" || pro.product_unit === "2" && "Meter" || pro.product_unit === "1" && "Piece"}</span>
                                    </td>
                                    <td style={{ fontSize: '12px', border: "none", padding: "8px 15px" }} className="fs-12">
                                        {currencySymbolHendling( allConfigData, currencySymbol, pro.grand_total )}
                                    </td>
                                </tr>
                            )
                        } )}
                    </tbody>
                    <tfoot style={{ border: "0", backgroundColor: "#DEE2E6" }}>
                        <tr style={{ "width": "100%", "borderBottom": '1px solid #DEE2E6' }}>
                            <td className='text-capitalize' style={{ "fontSize": '14px', "padding": "8px 15px" }}>
                            </td>
                            <td style={{ "fontSize": '12px', "border": "none", "padding": "8px 15px" }}>
                            </td>
                            <td style={{ "fontSize": '12px', "border": "none", "padding": "8px 15px" }}>
                            </td>
                            <td style={{ "fontSize": '12px', "border": "none", "padding": "8px 15px" }}>
                                {sumOfProductQuantity}
                            </td>
                            <td style={{ "fontSize": '12px', "border": "none", "padding": "8px 15px" }}>
                                <span style={{ "fontSize": '12px', marginBottom: "0px" }}>{getFormattedMessage( "globally.detail.discount" )}: (-)</span>
                                <br />
                                <span style={{ "fontSize": '12px' }}>{currencySymbolHendling( allConfigData, currencySymbol, posAllTodaySaleOverAllReport?.all_discount_amount )}</span>
                                <br />
                                <span style={{ "fontSize": '12px', marginBottom: "0px" }}>{getFormattedMessage( "globally.detail.tax" )}: (+)</span>
                                <br />
                                <span style={{ "fontSize": '12px' }}>{currencySymbolHendling( allConfigData, currencySymbol, posAllTodaySaleOverAllReport?.all_tax_amount )}</span>
                                <br />
                                <span style={{ "fontSize": '12px', marginBottom: "0px" }}>{getFormattedMessage( "globally.detail.shipping" )}: (+)</span>
                                <br />
                                <span style={{ "fontSize": '12px' }}>{currencySymbolHendling( allConfigData, currencySymbol, posAllTodaySaleOverAllReport?.all_shipping_amount )}</span>
                                <br />
                                <span style={{ "fontSize": '12px', marginBottom: "0px" }}>{getFormattedMessage( "globally.detail.grand.total" )}:</span><br />
                                <span style={{ "fontSize": '12px' }}>{currencySymbolHendling( allConfigData, currencySymbol, posAllTodaySaleOverAllReport?.all_grand_total_amount )}</span>
                            </td>
                        </tr>
                    </tfoot>
                </Table>
                <Table style={{ "width": "100%", "marginTop": "30px" }}>
                    <thead>
                        <tr style={{ "width": "100%", 'background': '#F8F9FA' }}>
                            <th style={{
                                "textAlign": "start",
                                "padding": "8px 15px",
                                "fontSize": '12px',
                            }}>#
                            </th>
                            <th style={{
                                "textAlign": "start",
                                "padding": "8px 15px",
                                "fontSize": '12px'
                            }}>{getFormattedMessage( "brand.title" )}
                            </th>
                            <th style={{
                                "textAlign": "start",
                                "padding": "8px 15px",
                                "fontSize": '12px'
                            }}>{getFormattedMessage( "dashboard.stockAlert.quantity.label" )}
                            </th>
                            <th style={{
                                "textAlign": "start",
                                "padding": "8px 15px",
                                "fontSize": '12px'
                            }}>{getFormattedMessage( "pos-total-amount.title" )}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {posAllTodaySaleOverAllReport?.today_brand_report?.map( ( bran, index ) => {
                            return (
                                <tr key={index} style={{ "width": "100%", "borderBottom": '1px solid #DEE2E6' }}>
                                    <td className='text-capitalize' style={{ fontSize: '12px', padding: "8px 15px" }}>
                                        {index + 1}
                                    </td>
                                    <td style={{ fontSize: '12px', border: "none", padding: "8px 15px" }}>
                                        {( bran.name )}
                                    </td>
                                    <td className="fs-12" style={{ fontSize: '12px', border: "none", padding: "8px 15px" }}>
                                        <span>{bran.total_quantity}</span>
                                        <span> {bran.product_unit === "3" && "Kg" || bran.product_unit === "2" && "Meter" || bran.product_unit === "1" && "Piece"}</span>
                                    </td>
                                    <td style={{ fontSize: '12px', border: "none", padding: "8px 15px" }} className="fs-12">
                                        {currencySymbolHendling( allConfigData, currencySymbol, bran.grand_total )}
                                    </td>
                                </tr>
                            )
                        } )}
                    </tbody>
                    <tfoot style={{ border: "0", backgroundColor: "#DEE2E6" }}>
                        <tr style={{ "width": "100%", "borderBottom": '1px solid #DEE2E6' }}>
                            <td className='text-capitalize' style={{ "fontSize": '14px', "padding": "8px 15px" }}>
                            </td>
                            <td style={{ "fontSize": '12px', "border": "none", "padding": "8px 15px" }}>
                            </td>
                            <td style={{ "fontSize": '12px', "border": "none", "padding": "8px 15px" }}>
                                {sumOfBrandQuantity}
                            </td>
                            <td style={{ "fontSize": '12px', "border": "none", "padding": "8px 15px" }}>
                                <span style={{ "fontSize": '12px', marginBottom: "0px" }}>{getFormattedMessage( "globally.detail.discount" )}: (-)</span>
                                <br />
                                <span style={{ "fontSize": '12px' }}>{currencySymbolHendling( allConfigData, currencySymbol, posAllTodaySaleOverAllReport?.all_discount_amount )}</span>
                                <br />
                                <span style={{ "fontSize": '12px', marginBottom: "0px" }}>{getFormattedMessage( "globally.detail.tax" )}: (+)</span>
                                <br />
                                <span style={{ "fontSize": '12px' }}>{currencySymbolHendling( allConfigData, currencySymbol, posAllTodaySaleOverAllReport?.all_tax_amount )}</span>
                                <br />
                                <span style={{ "fontSize": '12px', marginBottom: "0px" }}>{getFormattedMessage( "globally.detail.shipping" )}: (+)</span>
                                <br />
                                <span style={{ "fontSize": '12px' }}>{currencySymbolHendling( allConfigData, currencySymbol, posAllTodaySaleOverAllReport?.all_shipping_amount )}</span>
                                <br />
                                <span style={{ "fontSize": '12px', marginBottom: "0px" }}>Grand Total:</span><br />
                                <span style={{ "fontSize": '12px' }}>{currencySymbolHendling( allConfigData, currencySymbol, posAllTodaySaleOverAllReport?.all_grand_total_amount )}</span>
                            </td>
                        </tr>
                    </tfoot>
                </Table> */}
            </div>
        );
    }
}

export default PrintRegisterDetailsData;
