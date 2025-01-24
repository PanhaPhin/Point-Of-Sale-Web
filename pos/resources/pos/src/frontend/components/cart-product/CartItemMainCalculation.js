import React from 'react';
import {Form, InputGroup, FormControl} from 'react-bootstrap-v5';
import {Row} from "react-bootstrap";
import {currencySymbolHendling, decimalValidate, getFormattedMessage, numValidate, placeholderText} from '../../../shared/sharedMethod';

const CartItemMainCalculation = (props) => {
    const {totalQty, subTotal, cartItemValue, onChangeCart, grandTotal, frontSetting, allConfigData, onChangeTaxCart} = props;

    return (
        <div className='calculation mt-5'>
            <Row className='total-price'>
                <div className='col-6 mb-2'>
                    <Form.Group className='calculation__filed-grp mb-2'>
                        <InputGroup>
                            <FormControl type='text' id='tax' name='tax' min='0' step='.01' placeholder={placeholderText('globally.detail.tax')}
                                         onChange={(e) => onChangeTaxCart(e)}
                                         onKeyPress={(event) => numValidate(event)}
                                         value={cartItemValue.tax === 0 ? '' : cartItemValue.tax}
                                         className='rounded-1 pe-8'
                            />
                            <InputGroup.Text className='position-absolute top-0 bottom-0 end-0 bg-transparent border-0'>
                                %
                            </InputGroup.Text>
                        </InputGroup>
                    </Form.Group>
                    <Form.Group className='calculation__filed-grp mb-2'>
                        <InputGroup>
                            <FormControl type='text' id='discount' className='rounded-1 pe-8'
                                         onChange={(e) => onChangeCart(e)}
                                         value={cartItemValue.discount === 0 ? '' : cartItemValue.discount}
                                         onKeyPress={(event) => decimalValidate(event)}
                                         name='discount' min='0' step='.01' placeholder={placeholderText('purchase.order-item.table.discount.column.label')}
                            />
                            <InputGroup.Text className='position-absolute top-0 bottom-0 end-0 bg-transparent border-0'>
                                {frontSetting.value && frontSetting.value.currency_symbol}</InputGroup.Text>
                        </InputGroup>
                    </Form.Group>
                    <Form.Group className='calculation__filed-grp mb-2'>
                        <InputGroup>
                            <FormControl type='text' id='shipping' name='shipping' min='0' step='.01' placeholder={placeholderText('purchase.input.shipping.label')}
                                         onChange={(e) => onChangeCart(e)}
                                         onKeyPress={(event) => decimalValidate(event)}
                                         value={cartItemValue.shipping === 0 ? '' : cartItemValue.shipping}
                                         className='rounded-1 pe-8'
                            />
                            <InputGroup.Text className='position-absolute top-0 bottom-0 end-0 bg-transparent border-0'>
                                {frontSetting.value && frontSetting.value.currency_symbol}</InputGroup.Text>
                        </InputGroup>
                    </Form.Group>
                </div>
                <div className='col-6 d-flex flex-column justify-content-center text-end align-items-end mb-2'>
                    <h4 className='fs-3 mb-2 custom-big-content text-gray-600'>
                        {getFormattedMessage('pos-total-qty.title')} : {totalQty ? totalQty : '0'}
                    </h4>
                    <h4 className='fs-3 mb-2 text-gray-600'>{getFormattedMessage('pos.subtotal.small.title')} : {currencySymbolHendling(allConfigData, frontSetting.value && frontSetting.value.currency_symbol, subTotal ? subTotal: '0.00')}</h4>
                    <h2 className='fs-1 mb-2 text-gray-800'>{getFormattedMessage('pos-total.title')} : {currencySymbolHendling(allConfigData, frontSetting.value && frontSetting.value.currency_symbol, grandTotal ? grandTotal : '0.00')}</h2>
                </div>
            </Row>
        </div>
    )
}
export default CartItemMainCalculation;
