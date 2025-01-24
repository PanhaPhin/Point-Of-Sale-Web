import React, { useEffect, useState } from 'react';
import { Form, InputGroup, Modal, Row } from 'react-bootstrap-v5';
import { subTotalCount, discountAmountMultiply, taxAmountMultiply, amountBeforeTax } from '../../calculation/calculation';
import { decimalValidate, getFormattedMessage, placeholderText, getFormattedOptions } from '../../sharedMethod';
import ReactSelect from '../../select/reactSelect';
import { taxMethodOptions, discountMethodOptions } from '../../../constants';

const ProductModal = ( props ) => {
    const {
        title,
        product,
        id,
        modalId,
        isOpen,
        handleClose,
        onProductUpdateInCart,
        updateCost,
        updateDiscount,
        updateTax,
        updateSubTotal,
        productUnits,
        updatePurchaseUnit,
        setIsOpen, frontSetting
    } = props;
    const [ netUnitCost, setNetUnitCost ] = useState( product.net_unit_cost );
    const [ productModalData, setProductModalData ] = useState( product );
    const [ taxValue, setTaxValue ] = useState( product.tax_value );
    const [ discountValue, setDiscountValue ] = useState( product.discount_value );
    const [ purchaseUnit, setPurchaseUnit ] = useState( '0' );
    const [ selectedPurchaseUnit, setSelectedPurchaseUnit ] = useState( null );
    const [ errors, setErrors ] = useState( {
        taxValue: '',
        discountValue: '',
        netUnitCost: ''
    } );

    useEffect( () => {
        setSelectedPurchaseUnit( productUnits.length && productUnits.filter( ( item ) =>
            Number( item.id ) === Number( product.purchase_unit.value ? product.purchase_unit.value : product.purchase_unit ) ).map( ( item ) => {
                return ( { label: item.attributes.name, value: item.id } )
            } ) )
        setPurchaseUnit( product.purchase_unit )
    }, [ productUnits ] );

    useEffect( () => {
        setProductModalData( product );
        setNetUnitCost( netUnitCost ? ( netUnitCost ).toFixed( 2 ) : parseFloat( product.net_unit_cost ).toFixed( 2 ) );
        setTaxType( product.tax_type === '1' || product.tax_type === 1 ? { value: 1, label: getFormattedMessage( 'tax-type.filter.exclusive.label' ) } : {
            value: 2, label: getFormattedMessage( 'tax-type.filter.inclusive.label' )
        } );
        setDiscountType( product.discount_type === '1' || product.discount_type === 1 ? {
            value: 1, label: getFormattedMessage( 'discount-type.filter.percentage.label' )
        } : { value: 2, label: getFormattedMessage( 'discount-type.filter.fixed.label' ) } );
        product.sub_total = Number( subTotalCount( product ) )
    }, [ productModalData ] );

    useEffect( () => {
        setDiscountValue( product.discount_value ? parseFloat( product.discount_value ).toFixed( 2 ) : '0.00' );
    }, [ productModalData, product.discount_value ] )

    useEffect( () => {
        setTaxValue( product.tax_value ? parseFloat( product.tax_value ).toFixed( 2 ) : '0.00' );
    }, [ productModalData, product.tax_value ] )

    const handleValidation = () => {
        let errorss = {};
        let isValid = false;
        if ( taxValue > 100 ) {
            errorss[ 'taxValue' ] = getFormattedMessage( "globally.tax-length.validate.label" );
        } else if ( discountType.value === 1 && Number( discountValue ) > 100 ) {
            errorss[ 'discountValue' ] = getFormattedMessage( "globally.discount-length.validate.label" );
        } else if ( discountType.value === 2 && Number( discountValue ) > netUnitCost ) {
            errorss[ 'discountValue' ] = getFormattedMessage( 'globally.discount-cost-length.validate.label' );
        } else {
            isValid = true;
        }
        setErrors( errorss );
        return isValid;
    };

    const onChangePrice = ( e ) => {
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
        setNetUnitCost( value );
    };

    // tax type dropdown functionality
    const taxTypeFilterOptions = getFormattedOptions( taxMethodOptions )
    const [ taxType, setTaxType ] = useState( product.tax_type );
    const onTaxTypeChange = ( obj ) => {
        setTaxType( obj );
    };

    const onChangeTax = ( e ) => {
        const { value } = e.target ? e.target : '0.00';
        // check if value includes a decimal point
        if ( value.match( /\./g ) ) {
            const [ , decimal ] = value.split( '.' );
            // restrict value to only 2 decimal places
            if ( decimal?.length > 2 ) {
                // do nothing
                return;
            }
        }
        setTaxValue( value );
    };

    // discount type dropdown functionality
    const discountTypeFilterOptions = getFormattedOptions( discountMethodOptions )
    const [ discountType, setDiscountType ] = useState( product.discount_type );
    const onDiscountTypeChange = ( obj ) => {
        setDiscountType( obj );
    };

    const onChangeDiscount = ( e ) => {
        const { value } = e.target ? e.target : '0.00';
        // check if value includes a decimal point
        if ( value.match( /\./g ) ) {
            const [ , decimal ] = value.split( '.' );
            // restrict value to only 2 decimal places
            if ( decimal?.length > 2 ) {
                // do nothing
                return;
            }
        }
        setDiscountValue( value );
    };

    const onPurchaseUnitChange = ( newlySelectedUnit ) => {
        setPurchaseUnit( newlySelectedUnit );
        setSelectedPurchaseUnit( newlySelectedUnit );
    };

    const onSaveDetailModal = ( e ) => {
        e.preventDefault()
        const valid = handleValidation();
        if ( valid ) {
            if ( id === modalId ) {
                const newProduct = product;
                newProduct.product_cost = Number( netUnitCost );
                newProduct.fix_net_unit = Number( netUnitCost );
                newProduct.net_unit_cost = amountBeforeTax( product );
                newProduct.tax_type = taxType.value.toString();
                newProduct.tax_value = Number( taxValue );
                newProduct.tax_amount = taxAmountMultiply( product );
                newProduct.discount_type = discountType.value.toString();
                newProduct.discount_value = Number( discountValue );
                newProduct.discount_amount = discountAmountMultiply( product );
                newProduct.sub_total = subTotalCount( product );
                newProduct.purchase_unit = purchaseUnit.value ? purchaseUnit.value : purchaseUnit;
                onProductUpdateInCart( newProduct );
                handleClose( e );
                setErrors( '' )
                updateCost( newProduct.net_unit_cost = amountBeforeTax( product ) )
                updateTax( newProduct.tax_value = taxValue )
                updateDiscount( newProduct.discount_value = discountValue )
                updatePurchaseUnit( newProduct.purchase_unit = purchaseUnit.value ? purchaseUnit.value : purchaseUnit )
                updateSubTotal( subTotalCount( product ) )
            }
        }
    };

    const clearField = () => {
        setIsOpen( !isOpen );
        setErrors( '' )
    };

    return (
        <Modal show={isOpen}
            onHide={clearField}
            keyboard={true}
        >
            <Form onKeyPress={( e ) => {
                if ( e.key === 'Enter' ) { onSaveDetailModal( e ) }
            }}>
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body className='pb-2'>
                    <Row>
                        <div className='col-md-12 mb-5'>
                            <label className='form-label'>
                                {getFormattedMessage( 'product.input.product-cost.label' )}:
                            </label>
                            <span className='required' />
                            <InputGroup>
                                <input type='text' name='product_cost' className='form-control'
                                    onKeyPress={( event ) => decimalValidate( event )}
                                    value={netUnitCost} onChange={onChangePrice} />
                                <InputGroup.Text>{frontSetting.value && frontSetting.value.currency_symbol}</InputGroup.Text>
                            </InputGroup>
                            <span className='text-danger d-block fw-400 fs-small mt-2'>{errors[ 'netUnitCost' ] ? errors[ 'netUnitCost' ] : null}</span>
                        </div>
                        <div className='col-md-12 mb-5'>
                            <ReactSelect title={getFormattedMessage( 'product.input.tax-type.label' )}
                                multiLanguageOption={taxTypeFilterOptions} onChange={onTaxTypeChange} errors={''}
                                defaultValue={taxType}
                                placeholder={placeholderText( "product.input.tax-type.placeholder.label" )}
                            />
                        </div>
                        <div className='col-md-12 mb-5'>
                            <label
                                className='form-label'>
                                {getFormattedMessage( 'purchase.input.order-tax.label' )}:
                            </label>
                            <InputGroup>
                                <input name='taxValue' type='text' value={taxValue} className='form-control'
                                    onKeyPress={( event ) => decimalValidate( event )} onChange={onChangeTax} />
                                <InputGroup.Text>%</InputGroup.Text>
                            </InputGroup>
                            <span className='text-danger d-block fw-400 fs-small mt-2'>{errors[ 'taxValue' ] ? errors[ 'taxValue' ] : null}</span>
                        </div>
                        <div className='col-md-12 mb-5'>
                            <ReactSelect title={getFormattedMessage( 'purchase.product-modal.select.discount-type.label' )}
                                multiLanguageOption={discountTypeFilterOptions} onChange={onDiscountTypeChange} errors={''}
                                defaultValue={discountType}
                                placeholder={placeholderText( "pos-sale.select.discount-type.placeholder" )}
                            />
                        </div>
                        <div className='col-md-12 mb-5'>
                            <label className='form-label'>
                                {getFormattedMessage( 'purchase.order-item.table.discount.column.label' )}:
                            </label>
                            <span className='required' />
                            <input type='text' name='discountValue' className='form-control'
                                onChange={onChangeDiscount} value={discountValue}
                                onKeyPress={( event ) => decimalValidate( event )} />
                            <span
                                className='text-danger d-block fw-400 fs-small mt-2'>{errors[ 'discountValue' ] ? errors[ 'discountValue' ] : null}</span>
                        </div>
                        {product.newItem !== '' &&
                            <div className='col-md-12'>
                                <ReactSelect title={getFormattedMessage( 'product.input.purchase-unit.label' )}
                                    defaultValue={selectedPurchaseUnit} value={selectedPurchaseUnit}
                                    data={productUnits} onChange={onPurchaseUnitChange} errors={''}
                                    placeholder={placeholderText( "product.input.purchase-unit.placeholder.label" )}
                                />
                            </div>
                        }
                    </Row>
                </Modal.Body>
                <Modal.Footer children='justify-content-start' className='pt-0'>
                    <div className='d-flex'>
                        <input className='btn btn-primary me-5' type='submit'
                            value={placeholderText( 'globally.save-btn' )}
                            onClick={( e ) => onSaveDetailModal( e )} />
                        <button type='reset' onClick={( e ) => {
                            e.stopPropagation();
                            handleClose( e );
                            setErrors( '' )
                        }}
                            className='btn btn-secondary'>
                            {getFormattedMessage( 'globally.cancel-btn' )}
                        </button>
                    </div>
                </Modal.Footer>
            </Form>
        </Modal>
    )
};

export default ProductModal;
