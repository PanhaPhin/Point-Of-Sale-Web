import React, {useState, createRef} from 'react';
import Form from 'react-bootstrap/Form';
import {connect} from 'react-redux';
import {Modal} from 'react-bootstrap-v5';
import {getFormattedMessage, placeholderText} from "../../shared/sharedMethod";
import {editCurrency} from '../../store/action/currencyAction';
import ModelFooter from '../../shared/components/modelFooter';

const CurrencyForm = (props) => {
    const {addCurrencyData, editCurrency, singleCurrency, handleClose, show, title} = props;
    const innerRef = createRef();
    const [formValue, setFormValue] = useState({
        name: singleCurrency ? singleCurrency.name : '',
        code: singleCurrency ? singleCurrency.code : '',
        symbol: singleCurrency ? singleCurrency.symbol : ''
    });

    const [errors, setErrors] = useState({
        name: '',
        code: '',
        symbol: ''
    });

    const disabled = singleCurrency && singleCurrency.name === formValue.name.trim() && singleCurrency.code === formValue.code.trim() && singleCurrency.symbol === formValue.symbol.trim();

    const handleValidation = () => {
        let errorss = {};
        let isValid = false;
        if (!formValue['name'].trim()) {
            errorss['name'] = getFormattedMessage("currency.modal.input.name.validate.label");
        } else if ((formValue['name'] && formValue['name'].length > 50)) {
            errorss['name'] = getFormattedMessage("globally.input.name.validate.label");
        } else if (!formValue['code'].trim()) {
            errorss['code'] = getFormattedMessage("currency.modal.input.code.validate.label");
        } else if ((formValue['code'] && formValue['code'].length > 20)) {
            errorss['code'] = getFormattedMessage("currency.modal.input.code.valid.validate.label");
        } else if (!formValue['symbol'].trim()) {
            errorss['symbol'] = getFormattedMessage("currency.modal.input.symbol.validate.label");
        } else {
            isValid = true;
        }
        setErrors(errorss);
        return isValid;
    };

    const onChangeInput = (e) => {
        e.preventDefault();
        setFormValue(inputs => ({...inputs, [e.target.name]: e.target.value}))
        setErrors('');
    };

    const onSubmit = (event) => {
        event.preventDefault();
        const valid = handleValidation();
        if (singleCurrency && valid) {
            if (!disabled) {
                editCurrency(singleCurrency.id, formValue, handleClose);
                clearField(false);
            }
        } else {
            if (valid) {
                setFormValue(formValue);
                addCurrencyData(formValue);
                clearField(false);
            }
        }

    };

    const clearField = () => {
        setFormValue({
            name: '',
            code: '',
            symbol: ''
        });
        setErrors('');
        handleClose(false);
    };

    return (
        <Modal show={show}
               onHide={clearField}
               keyboard={true}
               onShow={() => setTimeout(() => {
                   innerRef.current.focus();
               }, 1)}
        >
            <Form onKeyPress={(e) => {
                if (e.key === 'Enter') {
                    onSubmit(e)
                }
            }}>
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='row'>
                        <div className='col-md-12 mb-5'>
                            <label
                                className='form-label'>{getFormattedMessage("globally.input.name.label")}: </label>
                            <span className='required'/>
                            <input type='text' name='name' value={formValue.name}
                                   placeholder={placeholderText("currency.modal.input.name.placeholder.label")}
                                   className='form-control' ref={innerRef} autoComplete='off'
                                   onChange={(e) => onChangeInput(e)}/>
                            <span
                                className='text-danger d-block fw-400 fs-small mt-2'>{errors['name'] ? errors['name'] : null}</span>
                        </div>
                        <div className='col-md-12 mb-5'>
                                <label
                                    className='form-label'>{getFormattedMessage("currency.modal.input.code.label")} : </label>
                                <span className='required'/>
                                <input type='text' name='code'
                                              placeholder={placeholderText("currency.modal.input.code.placeholder.label")}
                                              className='form-control' value={formValue.code}
                                              onChange={(e) => onChangeInput(e)}
                                />
                                <span className='text-danger d-block fw-400 fs-small mt-2'>{errors['code'] ? errors['code'] : null}</span>
                        </div>
                        <div className='col-md-12'>
                            <label
                                className='form-label'>{getFormattedMessage("currency.modal.input.symbol.label")} : </label>
                            <span className='required'/>
                            <input type='text' name='symbol'
                                          placeholder={placeholderText("currency.modal.input.symbol.placeholder.label")}
                                          className='form-control' value={formValue.symbol}
                                          onChange={(e) => onChangeInput(e)}/>
                            <span className='text-danger d-block fw-400 fs-small mt-2'>{errors['symbol'] ? errors['symbol'] : null}</span>
                        </div>
                    </div>
                </Modal.Body>
            </Form>
            <ModelFooter onEditRecord={singleCurrency} onSubmit={onSubmit} editDisabled={disabled}
                         clearField={clearField} addDisabled={!formValue.name.trim()}/>
        </Modal>
    )
};

export default connect(null, {editCurrency})(CurrencyForm);
