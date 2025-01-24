import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, InputGroup } from 'react-bootstrap-v5';
import moment from 'moment';
import { connect, useDispatch } from 'react-redux';
import { fetchProductsByWarehouse } from '../../store/action/productAction';
import { editSale } from '../../store/action/salesAction';
import ProductSearch from '../../shared/components/product-cart/search/ProductSearch';
import ProductRowTable from '../../shared/components/sales/ProductRowTable';
import { placeholderText, getFormattedMessage, decimalValidate, onFocusInput, getFormattedOptions } from '../../shared/sharedMethod';
import ReactDatePicker from '../../shared/datepicker/ReactDatePicker';
import ProductMainCalculation from './ProductMainCalculation';
import { calculateCartTotalAmount, calculateCartTotalTaxAmount } from '../../shared/calculation/calculation';
import { prepareSaleProductArray } from '../../shared/prepareArray/prepareSaleArray';
import ModelFooter from '../../shared/components/modelFooter';
import { addToast } from '../../store/action/toastAction';
import { paymentMethodOptions, salePaymentStatusOptions, saleStatusOptions, statusOptions, toastType } from '../../constants';
import { fetchFrontSetting } from '../../store/action/frontSettingAction';
import ReactSelect from '../../shared/select/reactSelect';

const SalesForm = ( props ) => {
    const {
        addSaleData,
        editSale,
        id,
        customers,
        warehouses,
        singleSale,
        customProducts,
        products,
        fetchProductsByWarehouse,
        fetchFrontSetting,
        frontSetting,
        isQuotation, allConfigData
    } = props;

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [ updateProducts, setUpdateProducts ] = useState( [] );
    const [ quantity, setQuantity ] = useState( 0 );
    const [ newCost, setNewCost ] = useState( '' );
    const [ newDiscount, setNewDiscount ] = useState( '' );
    const [ newTax, setNewTax ] = useState( '' );
    const [ subTotal, setSubTotal ] = useState( '' );
    const [ newSaleUnit, setNewSaleUnit ] = useState( '' );
    const [ isPaymentType, setIsPaymentType ] = useState( false )

    const [ saleValue, setSaleValue ] = useState( {
        date: new Date(),
        customer_id: '',
        warehouse_id: '',
        tax_rate: "0.00",
        tax_amount: 0.00,
        discount: "0.00",
        shipping: "0.00",
        grand_total: 0.00,
        notes: singleSale ? singleSale.notes : '',
        received_amount: 0,
        paid_amount: 0,
        status_id: { label: getFormattedMessage( "status.filter.received.label" ), value: 1 },
        payment_status: { label: getFormattedMessage( "payment-status.filter.unpaid.label" ), value: 2 },
        payment_type: { label: getFormattedMessage( "payment-type.filter.cash.label" ), value: 1 }
    } );
    const [ errors, setErrors ] = useState( {
        date: '',
        customer_id: '',
        warehouse_id: '',
        status_id: '',
        payment_status: '',
        payment_type: ''
    } );

    useEffect( () => {
        setUpdateProducts( updateProducts )
    }, [ updateProducts, quantity, newCost, newDiscount, newTax, subTotal, newSaleUnit ] )

    useEffect( () => {
        updateProducts.length >= 1 ? dispatch( { type: 'DISABLE_OPTION', payload: true } ) : dispatch( { type: 'DISABLE_OPTION', payload: false } )
    }, [ updateProducts ] )

    useEffect( () => {
        fetchFrontSetting();
    }, [] );

    useEffect( () => {
        if ( singleSale && !isQuotation ) {
            setSaleValue( {
                date: singleSale ? moment( singleSale.date ).toDate() : '',
                customer_id: singleSale ? singleSale.customer_id : '',
                quotation_id: singleSale ? singleSale.quotation_id : '',
                warehouse_id: singleSale ? singleSale.warehouse_id : '',
                tax_rate: singleSale ? singleSale.tax_rate.toFixed( 2 ) : '0.00',
                tax_amount: singleSale ? singleSale.tax_amount.toFixed( 2 ) : '0.00',
                discount: singleSale ? singleSale.discount.toFixed( 2 ) : '0.00',
                shipping: singleSale ? singleSale.shipping.toFixed( 2 ) : '0.00',
                grand_total: singleSale ? singleSale.grand_total : '0.00',
                status_id: singleSale ? singleSale.status_id : '',
                payment_status: singleSale.is_Partial === 3 ? { "label": getFormattedMessage( 'payment-status.filter.partial.label' ), "value": 3 } : singleSale ? singleSale.payment_status : '',
                payment_type: singleSale ? singleSale.payment_type : ''
            } )
        }
        if ( singleSale && isQuotation ) {
            setSaleValue( {
                date: singleSale ? moment( singleSale.date ).toDate() : '',
                quotation_id: singleSale ? singleSale.quotation_id : '',
                customer_id: singleSale ? singleSale.customer_id : '',
                warehouse_id: singleSale ? singleSale.warehouse_id : '',
                tax_rate: singleSale ? singleSale.tax_rate.toFixed( 2 ) : '0.00',
                tax_amount: singleSale ? singleSale.tax_amount.toFixed( 2 ) : '0.00',
                discount: singleSale ? singleSale.discount.toFixed( 2 ) : '0.00',
                shipping: singleSale ? singleSale.shipping.toFixed( 2 ) : '0.00',
                grand_total: singleSale ? singleSale.grand_total : '0.00',
                status_id: singleSale ? singleSale.status_id : '',
                payment_status: saleValue.payment_status ? saleValue.payment_status : '',
                payment_type: { label: getFormattedMessage( "payment-type.filter.cash.label" ), value: 1 }
            } )
        }
    }, [ singleSale ] );

    useEffect( () => {
        if ( singleSale ) {
            setUpdateProducts( singleSale.sale_items );
        }
    }, [] );

    useEffect( () => {
        saleValue.warehouse_id.value && fetchProductsByWarehouse( saleValue?.warehouse_id?.value )
    }, [ saleValue.warehouse_id.value ] )

    const handleValidation = () => {
        let error = {};
        let isValid = false;
        const qtyCart = updateProducts.filter( ( a ) => a.quantity === 0 );
        if ( !saleValue.date ) {
            error[ 'date' ] = getFormattedMessage( 'globally.date.validate.label' );
        } else if ( !saleValue.warehouse_id ) {
            error[ 'warehouse_id' ] = getFormattedMessage( 'product.input.warehouse.validate.label' );
        } else if ( !saleValue.customer_id ) {
            error[ 'customer_id' ] = getFormattedMessage( 'sale.select.customer.validate.label' );
        } else if ( qtyCart.length > 0 ) {
            dispatch( addToast( { text: getFormattedMessage( 'globally.product-quantity.validate.message' ), type: toastType.ERROR } ) )
        } else if ( updateProducts.length < 1 ) {
            dispatch( addToast( { text: getFormattedMessage( 'purchase.product-list.validate.message' ), type: toastType.ERROR } ) )
        } else if ( !saleValue.status_id ) {
            error[ 'status_id' ] = getFormattedMessage( "globally.status.validate.label" )
        } else if ( !saleValue.payment_status ) {
            error[ 'payment_status' ] = getFormattedMessage( "globally.payment.status.validate.label" )
        } else if ( !saleValue.payment_type ) {
            error[ 'payment_type' ] = getFormattedMessage( "globally.payment.type.validate.label" )
        } else {
            isValid = true;
        }
        setErrors( error );
        return isValid;
    };

    const onWarehouseChange = ( obj ) => {
        setSaleValue( inputs => ( { ...inputs, warehouse_id: obj } ) );
        setErrors( '' );
    };

    const onCustomerChange = ( obj ) => {
        setSaleValue( inputs => ( { ...inputs, customer_id: obj } ) );
        setErrors( '' );
    };

    const onChangeInput = ( e ) => {
        e.preventDefault();
        const { value } = e.target;
        // check if value includes a decimal point
        if ( value.match( /\./g ) ) {
            const [ , decimal ] = value.split( '.' );
            // restrict value to only 2 decimal places
            if ( decimal?.length > 2 ) {
                // do nothing
                return;
            }
        }
        setSaleValue( inputs => ( { ...inputs, [ e.target.name ]: value && value } ) );
    };

    const onNotesChangeInput = ( e ) => {
        e.preventDefault();
        setSaleValue( inputs => ( { ...inputs, notes: e.target.value } ) );
    };

    const onStatusChange = ( obj ) => {
        setSaleValue( inputs => ( { ...inputs, status_id: obj } ) );
    };

    const onPaymentStatusChange = ( obj ) => {
        setSaleValue( inputs => ( { ...inputs, payment_status: obj } ) );
        obj.value !== 2 ? setIsPaymentType( true ) : setIsPaymentType( false )
        setSaleValue( input => ( { ...input, payment_type: { label: getFormattedMessage( "payment-type.filter.cash.label" ), value: 1 } } ) )
    };

    const onPaymentTypeChange = ( obj ) => {
        setSaleValue( inputs => ( { ...inputs, payment_type: obj } ) );
    };

    const updatedQty = ( qty ) => {
        setQuantity( qty );
    };

    const updateCost = ( cost ) => {
        setNewCost( cost );
    };

    const updateDiscount = ( discount ) => {
        setNewDiscount( discount );
    };

    const updateTax = ( tax ) => {
        setNewTax( tax );
    };

    const updateSubTotal = ( subTotal ) => {
        setSubTotal( subTotal );
    };

    const updateSaleUnit = ( saleUnit ) => {
        setNewSaleUnit( saleUnit );
    };

    const handleCallback = ( date ) => {
        setSaleValue( previousState => {
            return { ...previousState, date: date }
        } );
        setErrors( '' );
    };

    const statusFilterOptions = getFormattedOptions( saleStatusOptions )
    const statusDefaultValue = statusFilterOptions.map( ( option ) => {
        return {
            value: option.id,
            label: option.name
        }
    } )

    const paymentStatusFilterOptions = getFormattedOptions( salePaymentStatusOptions )
    const paymentStatusDefaultValue = paymentStatusFilterOptions.map( ( option ) => {
        return {
            value: option.id,
            label: option.name
        }
    } )

    const paymentMethodOption = getFormattedOptions( paymentMethodOptions )
    const paymentTypeDefaultValue = paymentMethodOption.map( ( option ) => {
        return {
            value: option.id,
            label: option.name
        }
    } )

    const prepareFormData = ( prepareData ) => {
        const formValue = {
            date: moment( prepareData.date ).toDate(),
            is_sale_created: "true",
            quotation_id: prepareData ? prepareData.quotation_id : '',
            customer_id: prepareData.customer_id.value ? prepareData.customer_id.value : prepareData.customer_id,
            warehouse_id: prepareData.warehouse_id.value ? prepareData.warehouse_id.value : prepareData.warehouse_id,
            discount: prepareData.discount,
            tax_rate: prepareData.tax_rate,
            tax_amount: calculateCartTotalTaxAmount( updateProducts, saleValue ),
            sale_items: updateProducts,
            shipping: prepareData.shipping,
            grand_total: calculateCartTotalAmount( updateProducts, saleValue ),
            received_amount: 0,
            paid_amount: 0,
            note: prepareData.notes,
            status: prepareData.status_id.value ? prepareData.status_id.value : prepareData.status_id,
            payment_status: prepareData.payment_status.value ? prepareData.payment_status.value : prepareData.payment_status,
            payment_type: prepareData.payment_status.value === 2 ? 0 : prepareData.payment_type.value ? prepareData.payment_type.value : prepareData.payment_type
        }
        return formValue
    };

    const onSubmit = ( event ) => {
        event.preventDefault();
        const valid = handleValidation();
        if ( valid ) {
            if ( singleSale && !isQuotation ) {
                editSale( id, prepareFormData( saleValue ), navigate );
            } else {
                addSaleData( prepareFormData( saleValue ) );
                setSaleValue( saleValue );
            }
        }
    };

    const onBlurInput = ( el ) => {
        if ( el.target.value === '' ) {
            if ( el.target.name === "shipping" ) {
                setSaleValue( { ...saleValue, shipping: "0.00" } );
            }
            if ( el.target.name === "discount" ) {
                setSaleValue( { ...saleValue, discount: "0.00" } );
            }
            if ( el.target.name === "tax_rate" ) {
                setSaleValue( { ...saleValue, tax_rate: "0.00" } );
            }
        }
    }

    return (
        <div className='card'>
            <div className='card-body'>
                {/*<Form>*/}
                <div className='row'>
                    <div className='col-md-4'>
                        <label className='form-label'>
                            {getFormattedMessage( 'react-data-table.date.column.label' )}:
                        </label>
                        <span className='required' />
                        <div className='position-relative'>
                            <ReactDatePicker onChangeDate={handleCallback} newStartDate={saleValue.date} />
                        </div>
                        <span className='text-danger d-block fw-400 fs-small mt-2'>{errors[ 'date' ] ? errors[ 'date' ] : null}</span>
                    </div>
                    <div className='col-md-4'>
                        <ReactSelect name='warehouse_id' data={warehouses} onChange={onWarehouseChange}
                            title={getFormattedMessage( 'warehouse.title' )} errors={errors[ 'warehouse_id' ]}
                            defaultValue={saleValue.warehouse_id} value={saleValue.warehouse_id} addSearchItems={singleSale}
                            isWarehouseDisable={true}
                            placeholder={placeholderText( 'purchase.select.warehouse.placeholder.label' )} />
                    </div>
                    <div className='col-md-4'>
                        <ReactSelect name='customer_id' data={customers} onChange={onCustomerChange}
                            title={getFormattedMessage( 'customer.title' )} errors={errors[ 'customer_id' ]}
                            defaultValue={saleValue.customer_id} value={saleValue.customer_id}
                            placeholder={placeholderText( 'sale.select.customer.placeholder.label' )} />
                    </div>
                    <div className='mb-5'>
                        <label className='form-label'>
                            {getFormattedMessage( 'product.title' )}:
                        </label>
                        <ProductSearch values={saleValue} products={products} handleValidation={handleValidation}
                            updateProducts={updateProducts}
                            setUpdateProducts={setUpdateProducts} customProducts={customProducts} />
                    </div>
                    <div>
                        <label className='form-label'>
                            {getFormattedMessage( 'purchase.order-item.table.label' )}:
                        </label>
                        <span className='required' />
                        <ProductRowTable updateProducts={updateProducts} setUpdateProducts={setUpdateProducts}
                            updatedQty={updatedQty} frontSetting={frontSetting}
                            updateCost={updateCost} updateDiscount={updateDiscount}
                            updateTax={updateTax} updateSubTotal={updateSubTotal}
                            updateSaleUnit={updateSaleUnit}
                        />
                    </div>
                    <div className='col-12'>
                        <ProductMainCalculation inputValues={saleValue} allConfigData={allConfigData} updateProducts={updateProducts} frontSetting={frontSetting} />
                    </div>
                    <div className='col-md-4 mb-3'>
                        <label
                            className='form-label'>{getFormattedMessage( 'purchase.input.order-tax.label' )}: </label>
                        <InputGroup>
                            <input aria-label='Dollar amount (with dot and two decimal places)'
                                className='form-control'
                                type='text' name='tax_rate' value={saleValue.tax_rate}
                                onBlur={( event ) => onBlurInput( event )} onFocus={( event ) => onFocusInput( event )}
                                onKeyPress={( event ) => decimalValidate( event )}
                                onChange={( e ) => {
                                    onChangeInput( e )
                                }} />
                            <InputGroup.Text>%</InputGroup.Text>
                        </InputGroup>
                    </div>
                    <div className='col-md-4 mb-3'>
                        <Form.Label
                            className='form-label'>{getFormattedMessage( 'purchase.order-item.table.discount.column.label' )}: </Form.Label>
                        <InputGroup>
                            <input aria-label='Dollar amount (with dot and two decimal places)'
                                className='form-control'
                                type='text' name='discount' value={saleValue.discount}
                                onBlur={( event ) => onBlurInput( event )} onFocus={( event ) => onFocusInput( event )}
                                onKeyPress={( event ) => decimalValidate( event )}
                                onChange={( e ) => onChangeInput( e )}
                            />
                            <InputGroup.Text>{frontSetting.value && frontSetting.value.currency_symbol}</InputGroup.Text>
                        </InputGroup>
                    </div>
                    <div className='col-md-4 mb-3'>
                        <label
                            className='form-label'>{getFormattedMessage( 'purchase.input.shipping.label' )}: </label>
                        <InputGroup>
                            <input aria-label='Dollar amount (with dot and two decimal places)' type='text'
                                className='form-control'
                                name='shipping' value={saleValue.shipping}
                                onBlur={( event ) => onBlurInput( event )} onFocus={( event ) => onFocusInput( event )}
                                onKeyPress={( event ) => decimalValidate( event )}
                                onChange={( e ) => onChangeInput( e )}
                            />
                            <InputGroup.Text>{frontSetting.value && frontSetting.value.currency_symbol}</InputGroup.Text>
                        </InputGroup>
                    </div>
                    <div className='col-md-4'>
                        <ReactSelect multiLanguageOption={statusFilterOptions} onChange={onStatusChange} name='status_id'
                            title={getFormattedMessage( 'purchase.select.status.label' )}
                            value={saleValue.status_id} errors={errors[ 'status_id' ]}
                            defaultValue={statusDefaultValue[ 0 ]}
                            placeholder={getFormattedMessage( 'purchase.select.status.label' )} />
                    </div>
                    {!singleSale && <div className='col-md-4'>
                        <ReactSelect multiLanguageOption={paymentStatusFilterOptions} onChange={onPaymentStatusChange} name='payment_status'
                            title={getFormattedMessage( 'dashboard.recentSales.paymentStatus.label' )}
                            value={saleValue.payment_status} errors={errors[ 'payment_status' ]}
                            defaultValue={paymentStatusDefaultValue[ 0 ]}
                            placeholder={placeholderText( 'sale.select.payment-status.placeholder' )} />
                    </div>}
                    {!singleSale && saleValue.payment_status.value !== 2 && <div className='col-md-4'>
                        <ReactSelect title={getFormattedMessage( 'select.payment-type.label' )}
                            name='payment_type'
                            value={saleValue.payment_type} errors={errors[ 'payment_type' ]}
                            placeholder={placeholderText( 'sale.select.payment-type.placeholder' )}
                            defaultValue={paymentTypeDefaultValue[ 0 ]}
                            multiLanguageOption={paymentMethodOption}
                            onChange={onPaymentTypeChange}
                        />
                    </div>}
                    {isQuotation && <div className='col-md-4'>
                        <ReactSelect multiLanguageOption={paymentStatusFilterOptions} onChange={onPaymentStatusChange} name='payment_status'
                            title={getFormattedMessage( 'dashboard.recentSales.paymentStatus.label' )}
                            value={saleValue.payment_status} errors={errors[ 'payment_status' ]}
                            defaultValue={paymentStatusDefaultValue[ 0 ]}
                            placeholder={placeholderText( 'sale.select.payment-status.placeholder' )} />
                    </div>}
                    {isQuotation && isPaymentType && <div className='col-md-4'>
                        <ReactSelect title={getFormattedMessage( 'select.payment-type.label' )}
                            name='payment_type'
                            value={saleValue.payment_type} errors={errors[ 'payment_type' ]}
                            placeholder={placeholderText( 'sale.select.payment-type.placeholder' )}
                            defaultValue={paymentTypeDefaultValue[ 0 ]}
                            multiLanguageOption={paymentMethodOption}
                            onChange={onPaymentTypeChange}
                        />
                    </div>}
                    <div className='mb-3'>
                        <label className='form-label'>
                            {getFormattedMessage( 'globally.input.notes.label' )}: </label>
                        <textarea name='notes' className='form-control' value={saleValue.notes}
                            placeholder={placeholderText( 'globally.input.notes.placeholder.label' )}
                            onChange={( e ) => onNotesChangeInput( e )}
                        />
                    </div>
                    <ModelFooter onEditRecord={singleSale} onSubmit={onSubmit} link='/app/sales' />
                </div>
                {/*</Form>*/}
            </div>
        </div>
    )
}

const mapStateToProps = ( state ) => {
    const { purchaseProducts, products, frontSetting, allConfigData } = state;
    return { customProducts: prepareSaleProductArray( products ), purchaseProducts, products, frontSetting, allConfigData }
}

export default connect( mapStateToProps, { editSale, fetchProductsByWarehouse, fetchFrontSetting } )( SalesForm )

