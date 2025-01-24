import React from 'react';
import {Image} from 'react-bootstrap-v5';
import {currencySymbolHendling, getFormattedMessage} from "../../shared/sharedMethod";

class PrintButton extends React.PureComponent {
    render() {
        const print = this.props.updateProducts;
        const paperSize = print.paperSize
        const frontSetting = this.props.frontSetting
        const allConfigData = this.props.allConfigData
        const barcodeOptions = this.props.barcodeOptions

        const companyName = frontSetting?.value?.company_name
        const currencySymbol = frontSetting && frontSetting.value && frontSetting.value.currency_symbol

        function printFunction(product, index) {
            let indents = [];
            for (let i = 0; i < product.quantity; i++) {
                indents.push(<div key={i}
                                  className={`${paperSize.value === 1 ? 'print-main__print1' : '' || paperSize.value === 2 ? 'print-main__print2' : '' || paperSize.value === 3 ? 'print-main__print3' : '' || paperSize.value === 4 || paperSize.value === 6 ? 'print-main__print4' : '' || paperSize.value === 5 ? 'print-main__print5' : '' || paperSize.value === 7 ? 'print-main__print7' : '' || paperSize.value === 8 ? 'print-main__print8' : ''} barcode-main__barcode-item barcode-main__barcode-style`}
                >
                    <div className='fw-bolder lh-1'>{barcodeOptions.companyName && companyName}</div>
                    <div className='text-capitalize'>{barcodeOptions.productName && product.name}</div>
                    {barcodeOptions?.price && <div className='text-capitalize'>
                        <span className="fw-bolder">{getFormattedMessage("product.table.price.column.label")}:</span> {currencySymbolHendling(allConfigData, currencySymbol, product.product_price)}
                    </div>
                    }
                    <Image
                        src={product && product.barcode_url}
                        alt={product && product.name}
                        className='w-100'/>
                    <div
                        className='fw-bolder'>{product && product.code}</div>
                </div>);
            }
            return indents;
        }

        return (
            <div className="p-4">
                {print.products && print.products.map((product, index) => {
                    return printFunction(product, index)
                })}
            </div>
        );
    }
}

export default PrintButton
