import React, {useEffect, useState} from 'react';
import {Button, Form, InputGroup, Modal, Row} from 'react-bootstrap-v5';
import {subTotalCount, discountAmountMultiply, taxAmountMultiply, amountBeforeTax} from '../../calculation/calculation';
import {decimalValidate, getFormattedMessage, placeholderText, getFormattedOptions} from '../../sharedMethod';
import ReactSelect from '../../select/reactSelect';
import { taxMethodOptions, discountMethodOptions } from '../../../constants';

const ProductModal = (props) => {
    const {
        product,
        setIsShowModal,
        isShowModal,
        onProductUpdateInCart,
        updateCost,
        updateDiscount,
        updateTax,
        updateSubTotal,
        productSales,
        updateSaleUnit,
        frontSetting
    } = props;

    const [productModalData, setProductModalData] = useState(product);
    const [netUnit, setNetUnit] = useState(product.fix_net_unit);
    const [taxValue, setTaxValue] = useState(product.tax_value);
    const [taxType, setTaxType] = useState(product.tax_type);
    const [discountValue, setDiscountValue] = useState(product.discount_value);
    const [productUnit, setProductUnit] = useState('0');
    const [selectedSaleUnit, setSelectedSaleUnit] = useState(null);
    const [errors, setErrors] = useState({
        taxValue: '',
        discountValue: '',
        netUnit: ''
    });

    // tax type dropdown functionality
    const taxTypeFilterOptions = getFormattedOptions(taxMethodOptions)
    // discount type dropdown functionality
    const discountTypeFilterOptions = getFormattedOptions(discountMethodOptions)
    const [discountType, setDiscountType] = useState(product.discount_type);
    const onDiscountTypeChange = (obj) => {
        setDiscountType(obj);
    };

    useEffect(() => {
        setSelectedSaleUnit(productSales.length && productSales.filter((item) =>
            Number(item.id) === Number(product.sale_unit && product.sale_unit.value ? product.sale_unit.value : product.sale_unit)).map((item) => {
            return ({label: item.attributes.name, value: item.id})
        }))
        setProductUnit(product.sale_unit);
    }, [productSales]);

    const defaultTaxType = product.tax_type === '1' || product.tax_type === 1 ? {value: taxTypeFilterOptions[0].id, label: taxTypeFilterOptions[0].name} : {
        value: taxTypeFilterOptions[1].id, label: taxTypeFilterOptions[1].name
    }

    const defaultDiscountType = product.discount_type === '1' || product.discount_type === 1 ? {
        value: discountTypeFilterOptions[0].id,
        label: discountTypeFilterOptions[0].name
    } : {value: discountTypeFilterOptions[1].id, label: discountTypeFilterOptions[1].name}

    useEffect(() => {
        setProductModalData(product);
        setNetUnit(netUnit ? (netUnit).toFixed(2) : parseFloat(product.fix_net_unit.toFixed(2)));
        setTaxValue(product.tax_value ? parseFloat(product.tax_value).toFixed(2) : '0.00')
        setTaxType(product.tax_type === '1' || product.tax_type === 1 ? {value: taxTypeFilterOptions[0].id, label: taxTypeFilterOptions[0].name} : {
            value: taxTypeFilterOptions[1].id, label: taxTypeFilterOptions[1].name
        });
        setDiscountValue(product.discount_value ? parseFloat(product.discount_value).toFixed(2) : '0.00')
        setDiscountType(product.discount_type === '1' || product.discount_type === 1 ? {
            value: 1,
            label: getFormattedMessage('discount-type.filter.percentage.label')
        } : {value: 2, label: getFormattedMessage('discount-type.filter.fixed.label')});
        product.sub_total = Number(subTotalCount(product))
    }, [productModalData]);

    const handleValidation = () => {
        let errorss = {};
        let isValid = false;
        if (taxValue > 100) {
            errorss['taxValue'] = getFormattedMessage('globally.tax-length.validate.label');
        } else if (discountType.value === 1 && Number(discountValue) > 100) {
            errorss['discountValue'] = getFormattedMessage('globally.discount-length.validate.label');
        } else if (discountType.value === 2 && Number(discountValue) >= netUnit) {
            errorss['discountValue'] = getFormattedMessage('globally.discount-price-length.validate.label');
        } else if (netUnit === null) {
            errorss['netUnit'] = getFormattedMessage('globally.require-input.validate.label');
        } else {
            isValid = true;
        }
        setErrors(errorss);
        return isValid;
    };

    const onChangePrice = (e) => {
        const {value} = e.target;
        // check if value includes a decimal point
        if (value.match(/\./g)) {
            const [, decimal] = value.split('.');
            // restrict value to only 2 decimal places
            if (decimal?.length > 2) {
                // do nothing
                return;
            }
        }
        setNetUnit(value);
    };

    const onTaxTypeChange = (obj) => {
        setTaxType(obj);
    };

    const onChangeTax = (e) => {
        const {value} = e.target ? e.target : '0.00';
        // check if value includes a decimal point
        if (value.match(/\./g)) {
            const [, decimal] = value.split('.');
            // restrict value to only 2 decimal places
            if (decimal?.length > 2) {
                // do nothing
                return;
            }
        }
        setTaxValue(value);
        setErrors('')
    };



    const onChangeDiscount = (e) => {
        const {value} = e.target ? e.target : '0.00';
        // check if value includes a decimal point
        if (value.match(/\./g)) {
            const [, decimal] = value.split('.');
            // restrict value to only 2 decimal places
            if (decimal?.length > 2) {
                // do nothing
                return;
            }
        }
        setDiscountValue(value);
        setErrors('')
    };

    const onSaleUnitChange = (newlySelectedUnit) => {
        setProductUnit(newlySelectedUnit)
        setSelectedSaleUnit(newlySelectedUnit)
    };

    const onSaveDetailModal = (e) => {
        e.preventDefault();
        const valid = handleValidation();
        if (valid) {
            const newProduct = product;
            newProduct.product_price = Number(netUnit);
            newProduct.fix_net_unit = Number(netUnit);
            newProduct.net_unit_price = amountBeforeTax(product);
            newProduct.tax_type = taxType.value.toString();
            newProduct.tax_value = Number(taxValue);
            newProduct.tax_amount = taxAmountMultiply(product);
            newProduct.discount_type = discountType.value.toString();
            newProduct.discount_value = Number(discountValue);
            newProduct.discount_amount = discountAmountMultiply(product);
            newProduct.sub_total = subTotalCount(product);
            if (productUnit) {
                newProduct.sale_unit = productUnit.value ? productUnit.value : productUnit;
            }
            onProductUpdateInCart(newProduct);
            setIsShowModal(false);
            setErrors('')
            updateCost(newProduct.net_unit_price = amountBeforeTax(product))
            updateTax(newProduct.tax_value = taxValue)
            updateDiscount(newProduct.discount_value = discountValue)
            updateSaleUnit(newProduct.sale_unit = productUnit.value ? productUnit.value : productUnit)
            updateSubTotal(subTotalCount(product))
        }
    };

    const clearField = () => {
        setIsShowModal(!isShowModal);
        setErrors('');
    };

    return (
        <Modal show={isShowModal} onHide={clearField} keyboard={true}>
            <Form onKeyPress={(e) => {
                if (e.key === 'Enter') {
                    onSaveDetailModal(e)
                }
            }}>
                <Modal.Header closeButton>
                    <Modal.Title>{product.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body className='pb-3'>
                    <Row>
                        <div className='col-md-12 mb-5'>
                            <label className='form-label'>
                                {getFormattedMessage('product.input.product-price.label')}:
                            </label>
                            <span className='required'/>
                            <InputGroup>
                                <input type='text' name='product_price' className='form-control'
                                              onKeyPress={(event) => decimalValidate(event)}
                                              onChange={onChangePrice} value={netUnit}
                                              placeholder={placeholderText('product.input.product-price.placeholder.label')}
                                />
                                <InputGroup.Text>{frontSetting.value && frontSetting.value.currency_symbol}</InputGroup.Text>
                            </InputGroup>
                            <span
                                className='text-danger d-block fw-400 fs-small mt-2'>{errors['netUnit'] ? errors['netUnit'] : null}</span>
                        </div>
                        <div className='col-md-12 mb-5'>
                            {defaultTaxType && <ReactSelect title={getFormattedMessage('product.input.tax-type.label')}
                                                            multiLanguageOption={taxTypeFilterOptions}
                                                            onChange={onTaxTypeChange} errors={''}
                                                            defaultValue={defaultTaxType}
                                                            placeholder={placeholderText("product.input.tax-type.placeholder.label")}
                            />}
                        </div>
                        <div className='col-md-12 mb-5'>
                            <label className='form-label'>
                                {getFormattedMessage('purchase.input.order-tax.label')}:
                            </label>
                            <InputGroup>
                                <input type='text' name='taxValue' className='form-control'
                                              value={taxValue} onKeyPress={(event) => decimalValidate(event)}
                                              onChange={onChangeTax}/>
                                <InputGroup.Text>%</InputGroup.Text>
                            </InputGroup>
                            <span
                                className='text-danger d-block fw-400 fs-small mt-2'>{errors['taxValue'] ? errors['taxValue'] : null}</span>
                        </div>
                        <div className='col-md-12 mb-5'>
                            <ReactSelect  title={getFormattedMessage('purchase.product-modal.select.discount-type.label')}
                                    multiLanguageOption={discountTypeFilterOptions} onChange={onDiscountTypeChange} errors={''}
                                    defaultValue={defaultDiscountType}
                                    placeholder={placeholderText("pos-sale.select.discount-type.placeholder")}
                            />
                        </div>
                        <div className='col-md-12 mb-5'>
                            <label
                                className='form-label'>{getFormattedMessage('purchase.order-item.table.discount.column.label')}:</label>
                            <span className='required'/>
                            <input type='text' name='discountValue' className='form-control'
                                          onChange={onChangeDiscount}
                                          onKeyPress={(event) => decimalValidate(event)} value={discountValue}/>
                            <span
                                className='text-danger d-block fw-400 fs-small mt-2'>{errors['discountValue'] ? errors['discountValue'] : null}</span>
                        </div>
                        {product.newItem !== '' &&
                        <div className='col-md-12 mb-5'>
                            <ReactSelect title={getFormattedMessage('product.input.sale-unit.label')}
                                         defaultValue={selectedSaleUnit} value={selectedSaleUnit}
                                         data={productSales} onChange={onSaleUnitChange} errors={''}
                                         placeholder={placeholderText("product.input.sale-unit.placeholder.label")}
                            />
                        </div>
                        }
                    </Row>
                </Modal.Body>
                <Modal.Footer children='justify-content-start' className='pt-0'>
                    <div className='d-flex'>
                        <Button className='btn btn-primary me-2' type='submit'
                                onClick={(e) => onSaveDetailModal(e)}>
                            {getFormattedMessage('globally.save-btn')}
                        </Button>
                        <Button onClick={(e) => {
                            e.stopPropagation();
                            setIsShowModal(false)
                        }}
                                type='reset' variant='light' className='btn btn-secondary'>
                            {getFormattedMessage('globally.cancel-btn')}
                        </Button>
                    </div>
                </Modal.Footer>
            </Form>
        </Modal>
    )
};

export default ProductModal;
