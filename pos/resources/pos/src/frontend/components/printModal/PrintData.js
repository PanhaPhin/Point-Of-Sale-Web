import React from "react";
import { Table, Image } from "react-bootstrap-v5";
import { calculateProductCost } from "../../shared/SharedMethod";
import "../../../assets/scss/frontend/pdf.scss";
import {
    currencySymbolHendling,
    getFormattedDate,
    getFormattedMessage,
} from "../../../shared/sharedMethod";
class PrintData extends React.PureComponent {
    render() {
        const paymentPrint = this.props.updateProducts;
        const allConfigData = this.props.allConfigData;
        const paymentType = this.props.paymentType;
        const currency =
            paymentPrint.settings &&
            paymentPrint.settings.attributes &&
            paymentPrint.settings.attributes.currency_symbol;

        return (
            <div
                className="print-data"
                style={{
                    width: "100%",
                    maxWidth: "600px",
                    marginLeft: "auto",
                    marginRight: "auto",
                    fontFamily: "Arial, sans-serif",
                }}
            >
                <Table
                    className="information"
                    style={{
                        width: "100%",
                        border: "none",
                        fontFamily: "Arial, sans-serif",
                    }}
                >
                    <tbody
                        style={{
                            width: "100%",
                            fontFamily: "Arial, sans-serif",
                        }}
                    >
                        <tr
                            style={{
                                width: "100%",
                                fontFamily: "Arial, sans-serif",
                            }}
                        >
                            <td
                                style={{
                                    width: "100%",
                                    textAlign: "center",
                                    fontFamily: "Arial, sans-serif",
                                }}
                            >
                                <h1
                                    style={{
                                        fontWeight: "bold",
                                        color: "#212529",
                                        fontFamily: "Arial, sans-serif",
                                    }}
                                >
                                    {paymentPrint.frontSetting &&
                                        paymentPrint.frontSetting.value
                                            .company_name}
                                </h1>
                            </td>
                        </tr>
                    </tbody>
                </Table>
                {/*address section*/}
                <Table
                    style={{
                        width: "75%",
                        border: "none",
                        fontFamily: "Arial, sans-serif",
                    }}
                >
                    <tbody
                        style={{
                            width: "100%",
                            fontFamily: "Arial, sans-serif",
                        }}
                    >
                        <tr
                            style={{
                                border: "0",
                                width: "100%",
                                fontFamily: "Arial, sans-serif",
                            }}
                        >
                            <td>
                                <span
                                    className="fw-bold"
                                    style={{
                                        marginRight: "10px",
                                        fontFamily: "Arial, sans-serif",
                                    }}
                                >
                                    {getFormattedMessage(
                                        "react-data-table.date.column.label"
                                    )}
                                    :
                                </span>
                            </td>
                            <td>
                                <span
                                    style={{ fontFamily: "Arial, sans-serif" }}
                                >
                                    {getFormattedDate(
                                        new Date(),
                                        allConfigData && allConfigData
                                    )}
                                </span>
                            </td>
                        </tr>
                        <tr
                            style={{
                                border: "0",
                                width: "100%",
                                fontFamily: "Arial, sans-serif",
                            }}
                        >
                            <td scope="row">
                                <span
                                    className="fw-bold"
                                    style={{
                                        marginRight: "10px",
                                        fontFamily: "Arial, sans-serif",
                                    }}
                                >
                                    {getFormattedMessage(
                                        "supplier.table.address.column.title"
                                    )}
                                    :
                                </span>
                            </td>
                            <td>
                                <p
                                    className="mb-0"
                                    style={{ fontFamily: "Arial, sans-serif" }}
                                >
                                    {paymentPrint.frontSetting &&
                                        paymentPrint.frontSetting.value.address}
                                </p>
                            </td>
                        </tr>
                        <tr
                            style={{
                                border: "0",
                                width: "100%",
                                fontFamily: "Arial, sans-serif",
                            }}
                        >
                            <td scope="row">
                                <span
                                    className="fw-bold"
                                    style={{
                                        marginRight: "10px",
                                        fontFamily: "Arial, sans-serif",
                                    }}
                                >
                                    {getFormattedMessage(
                                        "globally.input.email.label"
                                    )}
                                    :
                                </span>
                            </td>
                            <td>
                                <span
                                    style={{ fontFamily: "Arial, sans-serif" }}
                                >
                                    {paymentPrint.frontSetting &&
                                        paymentPrint.frontSetting.value.email}
                                </span>
                            </td>
                        </tr>
                        <tr
                            style={{
                                border: "0",
                                width: "100%",
                                fontFamily: "Arial, sans-serif",
                            }}
                        >
                            <td scope="row">
                                <span
                                    className="fw-bold"
                                    style={{
                                        marginRight: "10px",
                                        fontFamily: "Arial, sans-serif",
                                    }}
                                >
                                    {getFormattedMessage(
                                        "pos-sale.detail.Phone.info"
                                    )}
                                    :
                                </span>
                            </td>
                            <td>
                                <span
                                    style={{ fontFamily: "Arial, sans-serif" }}
                                >
                                    {paymentPrint.frontSetting &&
                                        paymentPrint.frontSetting.value.phone}
                                </span>
                            </td>
                        </tr>
                        <tr
                            style={{
                                border: "0",
                                width: "100%",
                                fontFamily: "Arial, sans-serif",
                            }}
                        >
                            <td scope="row">
                                <span
                                    className="fw-bold"
                                    style={{
                                        marginRight: "10px",
                                        fontFamily: "Arial, sans-serif",
                                    }}
                                >
                                    {getFormattedMessage(
                                        "dashboard.recentSales.customer.label"
                                    )}
                                    :
                                </span>
                            </td>
                            <td>
                                <span
                                    style={{ fontFamily: "Arial, sans-serif" }}
                                >
                                    {paymentPrint.customer_name &&
                                    paymentPrint.customer_name[0]
                                        ? paymentPrint.customer_name[0].label
                                        : paymentPrint.customer_name &&
                                          paymentPrint.customer_name.label}
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </Table>

                {/*product item section*/}
                {/*{paymentPrint.products && paymentPrint.products.map((productName, index) => {*/}
                {/*    return (*/}
                {/*        <Table style={{"width": "100%"}} key={index}>*/}
                {/*            <tbody style={{"width": "100%"}}>*/}
                {/*                <tr style={{"width": "100%"}}>*/}
                {/*                    <td className='text-capitalize' style={{"fontSize": '18px', "padding": "0", fontWeight: "600"}}>*/}
                {/*                        {productName.name}*/}
                {/*                    </td>*/}
                {/*                </tr>*/}
                {/*            </tbody>*/}
                {/*            <tbody style={{"width": "100%"}}>*/}
                {/*                <tr style={{"width": "100%", "borderBottom": '1px dashed #181C32'}}>*/}
                {/*                    <td style={{"fontSize": '15px', "border": "none", paddingBottom: '2px'}}>*/}
                {/*                        {(productName.quantity).toFixed(2)} {productName.product_unit === '3' && 'Kg' || productName.product_unit === '1' && 'Pc' || productName.product_unit === '2' && 'M'} X {(calculateProductCost(productName).toFixed(2))}*/}
                {/*                    </td>*/}
                {/*                    <td style={{*/}
                {/*                        "fontSize": '14px',*/}
                {/*                        "width": "100%",*/}
                {/*                        "textAlign": 'right',*/}
                {/*                        'display': 'inline-block',*/}
                {/*                        "border": "none",*/}
                {/*                        paddingBottom: '2px'*/}
                {/*                    }}>*/}
                {/*                        <span>{currency}</span>*/}
                {/*                        <span>{(productName.quantity * (calculateProductCost(productName))).toFixed(2)}</span>*/}
                {/*                    </td>*/}
                {/*                </tr>*/}
                {/*            </tbody>*/}
                {/*        </Table>*/}
                {/*    )*/}
                {/*})}*/}

                <Table
                    style={{
                        width: "100%",
                        marginTop: "30px",
                        fontFamily: "Arial, sans-serif",
                    }}
                >
                    <thead>
                        <tr
                            style={{
                                width: "100%",
                                background: "#F8F9FA",
                                fontFamily: "Arial, sans-serif",
                            }}
                        >
                            <th
                                style={{
                                    textAlign: "start",
                                    padding: "8px 15px",
                                    fontSize: "14px",
                                    fontFamily: "Arial, sans-serif",
                                }}
                            >
                                {getFormattedMessage(
                                    "pos-item.print.invoice.title"
                                )}
                            </th>
                            <th
                                style={{
                                    textAlign: "start",
                                    padding: "8px 15px",
                                    fontSize: "14px",
                                    fontFamily: "Arial, sans-serif",
                                }}
                            >
                                {getFormattedMessage("pos-qty.title")}
                            </th>
                            <th
                                style={{
                                    textAlign: "start",
                                    padding: "8px 15px",
                                    fontSize: "14px",
                                    fontFamily: "Arial, sans-serif",
                                }}
                            >
                                {getFormattedMessage(
                                    "product.table.price.column.label"
                                )}
                            </th>
                            <th
                                style={{
                                    textAlign: "end",
                                    padding: "8px 15px",
                                    fontSize: "14px",
                                    fontFamily: "Arial, sans-serif",
                                }}
                            >
                                {getFormattedMessage("pos-total.title")}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {paymentPrint.products &&
                            paymentPrint.products.map((productName, index) => {
                                return (
                                    <tr
                                        key={index}
                                        style={{
                                            width: "100%",
                                            borderBottom: "1px solid #DEE2E6",
                                            fontFamily: "Arial, sans-serif",
                                        }}
                                    >
                                        <td
                                            className="text-capitalize"
                                            style={{
                                                fontSize: "14px",
                                                padding: "8px 15px",
                                                fontFamily: "Arial, sans-serif",
                                            }}
                                        >
                                            {productName.name}
                                        </td>
                                        <td
                                            style={{
                                                fontSize: "14px",
                                                border: "none",
                                                padding: "8px 15px",
                                                fontFamily: "Arial, sans-serif",
                                            }}
                                        >
                                            {productName.quantity.toFixed(2)}{" "}
                                            {(productName.product_unit ===
                                                "3" &&
                                                "Kg") ||
                                                (productName.product_unit ===
                                                    "1" &&
                                                    "Pc") ||
                                                (productName.product_unit ===
                                                    "2" &&
                                                    "M")}
                                        </td>
                                        <td
                                            style={{
                                                fontSize: "14px",
                                                border: "none",
                                                padding: "8px 15px",
                                                fontFamily: "Arial, sans-serif",
                                            }}
                                        >
                                            {calculateProductCost(
                                                productName
                                            ).toFixed(2)}
                                        </td>
                                        <td
                                            style={{
                                                fontSize: "14px",
                                                textAlign: "right",
                                                border: "none",
                                                padding: "8px 15px",
                                                fontFamily: "Arial, sans-serif",
                                            }}
                                        >
                                            <span>
                                                {currencySymbolHendling(
                                                    allConfigData,
                                                    currency,
                                                    productName.quantity *
                                                        calculateProductCost(
                                                            productName
                                                        )
                                                )}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                    </tbody>
                </Table>

                {/*total amount section*/}
                <Table
                    style={{
                        width: "68%",
                        marginTop: "30px",
                        marginLeft: "auto",
                        fontFamily: "Arial, sans-serif",
                    }}
                >
                    <tbody
                        style={{
                            width: "100%",
                            fontFamily: "Arial, sans-serif",
                        }}
                    >
                        <tr
                            style={{
                                width: "100%",
                                fontFamily: "Arial, sans-serif",
                            }}
                        >
                            <td
                                style={{
                                    textAlign: "left",
                                    width: "60%",
                                    padding: "0 0 5px",
                                    fontWeight: "500",
                                    fontFamily: "Arial, sans-serif",
                                }}
                            >
                                {getFormattedMessage("pos-total-amount.title")}:
                            </td>
                            <td
                                style={{
                                    textAlign: "right",
                                    width: "40%",
                                    padding: "0 0 5px",
                                    fontFamily: "Arial, sans-serif",
                                }}
                            >
                                {currencySymbolHendling(
                                    allConfigData,
                                    currency,
                                    paymentPrint.subTotal
                                        ? paymentPrint.subTotal
                                        : "0.00"
                                )}
                            </td>
                        </tr>
                        <tr style={{ width: "100%" }}>
                            <td
                                style={{
                                    textAlign: "left",
                                    padding: "0 0 5px",
                                    fontWeight: "500",
                                    fontFamily: "Arial, sans-serif",
                                }}
                            >
                                {getFormattedMessage(
                                    "globally.detail.order.tax"
                                )}
                                :
                            </td>
                            <td
                                style={{
                                    textAlign: "right",
                                    width: "40%",
                                    padding: "0 0 5px",
                                    fontFamily: "Arial, sans-serif",
                                }}
                            >
                                {currencySymbolHendling(
                                    allConfigData,
                                    currency,
                                    paymentPrint.taxTotal
                                        ? paymentPrint.taxTotal
                                        : "0.00"
                                )}{" "}
                                (
                                {paymentPrint
                                    ? parseFloat(paymentPrint.tax).toFixed(2)
                                    : "0.00"}{" "}
                                %)
                            </td>
                        </tr>
                        <tr style={{ width: "100%" }}>
                            <td
                                style={{
                                    textAlign: "left",
                                    width: "60%",
                                    padding: "0 0 5px",
                                    fontWeight: "500",
                                    fontFamily: "Arial, sans-serif",
                                }}
                            >
                                {getFormattedMessage(
                                    "globally.detail.discount"
                                )}
                                :
                            </td>
                            <td
                                style={{
                                    textAlign: "right",
                                    width: "40%",
                                    padding: "0 0 5px",
                                    fontFamily: "Arial, sans-serif",
                                }}
                            >
                                {currencySymbolHendling(
                                    allConfigData,
                                    currency,
                                    paymentPrint
                                        ? paymentPrint.discount
                                        : "0.00"
                                )}
                            </td>
                        </tr>
                        <tr style={{ width: "100%" }}>
                            <td
                                style={{
                                    textAlign: "left",
                                    width: "60%",
                                    padding: "0 0 5px",
                                    fontWeight: "500",
                                    fontFamily: "Arial, sans-serif",
                                }}
                            >
                                {getFormattedMessage(
                                    "globally.detail.shipping"
                                )}
                                :
                            </td>
                            <td
                                style={{
                                    textAlign: "right",
                                    width: "40%",
                                    padding: "0 0 5px",
                                    fontFamily: "Arial, sans-serif",
                                }}
                            >
                                {currencySymbolHendling(
                                    allConfigData,
                                    currency,
                                    paymentPrint
                                        ? paymentPrint.shipping
                                        : "0.00"
                                )}
                            </td>
                        </tr>
                        <tr style={{ width: "100%" }}>
                            <td
                                style={{
                                    textAlign: "left",
                                    width: "60%",
                                    padding: "0 0 5px",
                                    fontWeight: "500",
                                    fontFamily: "Arial, sans-serif",
                                }}
                            >
                                {getFormattedMessage(
                                    "globally.detail.grand.total"
                                )}
                                :
                            </td>
                            <td
                                style={{
                                    textAlign: "right",
                                    width: "40%",
                                    padding: "0 0 5px",
                                }}
                            >
                                {currencySymbolHendling(
                                    allConfigData,
                                    currency,
                                    paymentPrint.grandTotal
                                )}
                            </td>
                        </tr>
                    </tbody>
                </Table>
                <Table
                    style={{
                        width: "100%",
                        marginTop: "30px",
                        fontFamily: "Arial, sans-serif",
                    }}
                >
                    <thead>
                        <tr
                            style={{
                                width: "100%",
                                background: "#F8F9FA",
                                fontFamily: "Arial, sans-serif",
                            }}
                        >
                            <th
                                style={{
                                    textAlign: "start",
                                    padding: "8px 15px",
                                    fontSize: "14px",
                                    fontFamily: "Arial, sans-serif",
                                }}
                            >
                                {getFormattedMessage(
                                    "pos-sale.detail.Paid-bt.title"
                                )}
                            </th>
                            <th
                                style={{
                                    textAlign: "center",
                                    padding: "8px 15px",
                                    fontSize: "14px",
                                    fontFamily: "Arial, sans-serif",
                                }}
                            >
                                {getFormattedMessage(
                                    "expense.input.amount.label"
                                )}
                            </th>
                            <th
                                style={{
                                    textAlign: "end",
                                    padding: "8px 15px",
                                    fontSize: "14px",
                                    fontFamily: "Arial, sans-serif",
                                }}
                            >
                                {getFormattedMessage("pos.change-return.label")}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            style={{
                                width: "100%",
                                fontFamily: "Arial, sans-serif",
                            }}
                        >
                            <td
                                style={{
                                    fontSize: "14px",
                                    padding: "8px 15px",
                                    fontFamily: "Arial, sans-serif",
                                }}
                            >
                                {paymentType}
                            </td>
                            <td
                                style={{
                                    fontSize: "14px",
                                    textAlign: "center",
                                    padding: "8px 15px",
                                    fontFamily: "Arial, sans-serif",
                                }}
                            >
                                {currencySymbolHendling(
                                    allConfigData,
                                    currency,
                                    paymentPrint.grandTotal
                                )}
                            </td>
                            <td
                                style={{
                                    fontSize: "14px",
                                    textAlign: "end",
                                    padding: "8px 15px",
                                    fontFamily: "Arial, sans-serif",
                                }}
                            >
                                {currencySymbolHendling(
                                    allConfigData,
                                    currency,
                                    paymentPrint.changeReturn
                                )}
                            </td>
                        </tr>
                    </tbody>
                </Table>

                {/*note section*/}
                {paymentPrint && paymentPrint.note ? (
                    <Table>
                        <tbody
                            style={{
                                width: "100%",
                                paddingTop: "20px",
                                fontFamily: "Arial, sans-serif",
                            }}
                        >
                            <tr
                                style={{
                                    border: "0",
                                    width: "100%",
                                    fontFamily: "Arial, sans-serif",
                                }}
                            >
                                <td
                                    scope="row"
                                    style={{
                                        padding: "0",
                                        width: "100%",
                                        fontSize: "15px",
                                        fontFamily: "Arial, sans-serif",
                                    }}
                                >
                                    <span
                                        style={{
                                            width: "55px",
                                            fontSize: "15px",
                                            verticalAlign: "top",
                                            display: "inline-block",
                                            fontFamily: "Arial, sans-serif",
                                        }}
                                    >
                                        {getFormattedMessage(
                                            "globally.input.notes.label"
                                        )}{" "}
                                        :
                                    </span>
                                    <p
                                        style={{
                                            fontSize: "15px",
                                            width: "612px",
                                            verticalAlign: "top",
                                            display: "inline-block",
                                            fontFamily: "Arial, sans-serif",
                                        }}
                                    >
                                        {paymentPrint && paymentPrint.note}
                                    </p>
                                </td>
                            </tr>
                        </tbody>
                    </Table>
                ) : (
                    ""
                )}
                <h3
                    style={{
                        textAlign: "center",
                        marginTop: "40px",
                        fontFamily: "Arial, sans-serif",
                    }}
                >
                    {getFormattedMessage("pos-thank.you-slip.invoice")}.
                </h3>
                <div className="text-center d-block">
                    <Image
                        src={paymentPrint && paymentPrint.barcode_url}
                        alt={paymentPrint && paymentPrint.reference_code}
                        height={25}
                        width={100}
                    />
                    <span
                        className="d-block"
                        style={{ fontFamily: "Arial, sans-serif" }}
                    >
                        {paymentPrint && paymentPrint.reference_code}
                    </span>
                </div>
            </div>
        );
    }
}

export default PrintData;
