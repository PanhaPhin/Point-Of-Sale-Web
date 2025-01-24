import React from 'react';
import { Image } from 'react-bootstrap-v5';
import { currencySymbolHendling } from "../../shared/sharedMethod";
import { getFormattedMessage } from "../../shared/sharedMethod";

const BarcodeShow = ( props ) => {
    const { updateProducts, paperSize, updated, frontSetting, allConfigData, barcodeOptions } = props;

    const companyName = frontSetting?.value?.company_name
    const currencySymbol = frontSetting && frontSetting.value && frontSetting.value.currency_symbol

    const loopBarcode = ( product ) => {
        let indents = [];
        for ( let i = 0; i < product.quantity; i++ ) {
            indents.push( <div key={i}
                className={`${paperSize.value === 1 ? 'col-md-3' : '' || paperSize.value === 2 ? 'col-md-4 barcode-main__box-height2' : '' || paperSize.value === 3 ? 'col-md-4 barcode-main__box-height3' : '' || paperSize.value === 4 || paperSize.value === 6 ? 'col-md-6 barcode-main__box-height2 px-20' : '' || paperSize.value === 5 ? 'col-md-4 barcode-main__box-height3 px-13' : '' || paperSize.value === 7 ? 'col-md-4 barcode-main__box-height7 px-20' : '' || paperSize.value === 8 ? 'col-md-6 barcode-main__box-height7 px-20' : ''} barcode-main__barcode-item barcode-main__barcode-style`}>
                <div className='fw-bolder lh-1'>{barcodeOptions.companyName && companyName}</div>
                <div className='text-capitalize'>{barcodeOptions.productName && product.name}</div>
                {barcodeOptions?.price && <div className='text-capitalize'>
                    <span className="fw-bolder">{getFormattedMessage( "product.table.price.column.label" )}:</span> {currencySymbolHendling( allConfigData, currencySymbol, product.product_price )}
                </div>
                }                <Image
                    src={product && product.barcode_url}
                    alt={product && product.name}
                    className='w-100' />
                <div
                    className='fw-bolder'>{product && product.code}</div>
            </div> );
        }
        return indents;
    };

    return (
        <>
            {<div className='col-md-12 d-flex d-wrap justify-content-between flex-column overflow-auto'>
                {updated ?
                    updateProducts ? updateProducts.map( ( product, index ) => {
                        return (
                            <div className='barcode-main' id='demo' key={index}>
                                {loopBarcode( product )}
                            </div>
                        )
                    } ) : ''
                    : ''}
            </div>}
        </>
    )
}
export default BarcodeShow;

