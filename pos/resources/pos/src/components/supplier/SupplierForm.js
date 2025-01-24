import React, {useState} from 'react';
import Form from 'react-bootstrap/Form';
import {connect} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import * as EmailValidator from 'email-validator';
import {editSupplier} from '../../store/action/supplierAction';
import {getFormattedMessage, placeholderText, numValidate} from '../../shared/sharedMethod';
import ModelFooter from '../../shared/components/modelFooter';

const SupplierForm = (props) => {
    const {addSupplierData, id, editSupplier, singleSupplier} = props;
    const navigate = useNavigate();

    const [supplierValue, setSupplierValue] = useState({
        name: singleSupplier ? singleSupplier[0].name : '',
        email: singleSupplier ? singleSupplier[0].email : '',
        phone: singleSupplier ? singleSupplier[0].phone : '',
        country: singleSupplier ? singleSupplier[0].country : '',
        city: singleSupplier ? singleSupplier[0].city : '',
        address: singleSupplier ? singleSupplier[0].address : ''
    });

    const [errors, setErrors] = useState({
        name: '',
        email: '',
        phone: '',
        country: '',
        city: '',
        address: ''
    });

    const disabled = singleSupplier && singleSupplier[0].name === supplierValue.name && singleSupplier[0].country === supplierValue.country && singleSupplier[0].city === supplierValue.city && singleSupplier[0].email === supplierValue.email && singleSupplier[0].address === supplierValue.address && singleSupplier[0].phone === supplierValue.phone

    const handleValidation = () => {
        let errorss = {};
        let isValid = false;
        if (!supplierValue['name']) {
            errorss['name'] = getFormattedMessage("globally.input.name.validate.label");
        } else if (!EmailValidator.validate(supplierValue['email'])) {
            if (!supplierValue['email']) {
                errorss['email'] = getFormattedMessage("globally.input.email.validate.label");
            } else {
                errorss['email'] = getFormattedMessage("globally.input.email.valid.validate.label");
            }
        } else if (!supplierValue['country']) {
            errorss['country'] = getFormattedMessage("globally.input.country.validate.label");
        } else if (!supplierValue['city']) {
            errorss['city'] = getFormattedMessage("globally.input.city.validate.label");
        } else if (!supplierValue['phone']) {
            errorss['phone'] = getFormattedMessage("globally.input.phone-number.validate.label");
        } else if (!supplierValue['address']) {
            errorss['address'] = getFormattedMessage("globally.input.address.validate.label");
        } else {
            isValid = true;
        }
        setErrors(errorss);
        return isValid;
    };

    const onChangeInput = (e) => {
        e.preventDefault();
        setSupplierValue(inputs => ({...inputs, [e.target.name]: e.target.value}))
        setErrors('');
    };

    const onSubmit = (event) => {
        event.preventDefault();
        const valid = handleValidation();
        if (singleSupplier && valid) {
            if (!disabled) {
                editSupplier(id, supplierValue, navigate);
            }
        } else {
            if (valid) {
                setSupplierValue(supplierValue);
                addSupplierData(supplierValue);
            }
        }
    };

    return (
        <div className='card'>
            <div className='card-body'>
                <Form>
                    <div className='row'>
                        <div className='col-md-6 mb-3'>
                            <label className='form-label'>
                                {getFormattedMessage("globally.input.name.label")}:
                            </label>
                            <span className='required'/>
                            <input type='text' name='name'
                                   placeholder={placeholderText("globally.input.name.placeholder.label")}
                                   className='form-control'
                                   autoFocus={true}
                                   onChange={(e) => onChangeInput(e)}
                                   value={supplierValue.name}/>
                            <span
                                className='text-danger d-block fw-400 fs-small mt-2'>{errors['name'] ? errors['name'] : null}</span>
                        </div>
                        <div className='col-md-6 mb-3'>
                                <label
                                    className='form-label'>
                                    {getFormattedMessage("globally.input.email.label")}:
                                </label>
                                <span className='required'/>
                                <input type='text' name='email'
                                       placeholder={placeholderText("globally.input.email.placeholder.label")}
                                       className='form-control'
                                       onChange={(e) => onChangeInput(e)}
                                       value={supplierValue.email}/>
                                <span
                                    className='text-danger d-block fw-400 fs-small mt-2'>{errors['email'] ? errors['email'] : null}</span>
                        </div>
                        <div className='col-md-6 mb-3'>
                            <label
                                className='form-label'>
                                {getFormattedMessage("globally.input.phone-number.label")}:
                            </label>
                            <span className='required'/>
                            <input type='text' name='phone'
                                   placeholder={placeholderText("globally.input.phone-number.label")}
                                   className='form-control'
                                   pattern='[0-9]*' min={0}
                                   onKeyPress={(event) => numValidate(event)}
                                   onChange={(e) => onChangeInput(e)}
                                   value={supplierValue.phone}/>
                            <span
                                className='text-danger d-block fw-400 fs-small mt-2'>{errors['phone'] ? errors['phone'] : null}</span>
                        </div>
                        <div className='col-md-6 mb-3'>
                            <label className='form-label'>
                                {getFormattedMessage("globally.input.country.label")}:
                            </label>
                            <span className='required'/>
                            <input type='text' name='country'
                                   placeholder={placeholderText("globally.input.country.placeholder.label")}
                                   className='form-control'
                                   onChange={(e) => onChangeInput(e)}
                                   value={supplierValue.country}/>
                            <span
                                className='text-danger d-block fw-400 fs-small mt-2'>{errors['country'] ? errors['country'] : null}</span>
                        </div>
                        <div className='col-md-6 mb-3'>
                                <label
                                    className='form-label'>
                                    {getFormattedMessage("globally.input.city.label")}:
                                </label>
                                <span className='required'/>
                                <input type='text' name='city'
                                              placeholder={placeholderText("globally.input.city.placeholder.label")}
                                              className='form-control'
                                              onChange={(e) => onChangeInput(e)}
                                              value={supplierValue.city}/>
                                <span className='text-danger d-block fw-400 fs-small mt-2'>{errors['city'] ? errors['city'] : null}</span>
                        </div>
                        <div className='col-md-6 mb-3'>
                                <label
                                    className='form-label'>
                                    {getFormattedMessage("globally.input.address.label")}:
                                </label>
                                <span className='required'/>
                                <input type='text' name='address'
                                              placeholder={placeholderText("globally.input.address.placeholder.label")}
                                              className='form-control'
                                              onChange={(e) => onChangeInput(e)}
                                              value={supplierValue.address}
                                />
                                <span className='text-danger d-block fw-400 fs-small mt-2'>{errors['address'] ? errors['address'] : null}</span>
                        </div>
                        <ModelFooter onEditRecord={singleSupplier} onSubmit={onSubmit} editDisabled={disabled}
                                     link='/app/suppliers' addDisabled={!supplierValue.name}/>
                    </div>
                </Form>
            </div>
        </div>
    )
};

export default connect(null, {editSupplier})(SupplierForm);
