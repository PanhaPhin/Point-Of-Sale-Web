import React, {useEffect, useState} from 'react'
import {connect} from 'react-redux';
import {useNavigate, useParams} from 'react-router-dom';
import TabTitle from '../../shared/tab-title/TabTitle';
import {resetPassword} from '../../store/action/authAction';
import {fetchFrontSetting} from '../../store/action/frontSettingAction';
import {getFormattedMessage, placeholderText} from '../../shared/sharedMethod';
import {Image} from 'react-bootstrap-v5';

const ResetPassword = (props) => {
    const {resetPassword, fetchFrontSetting, frontSetting} = props
    const navigate = useNavigate();
    const {token, email} = useParams();
    const [resetValue, setResetValue] = useState({
        password: '',
        password_confirmation: '',
        email: email,
        token: token
    });

    const [errors, setErrors] = useState({
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        fetchFrontSetting();
    }, []);

    const handleValidation = () => {
        let errorss = {};
        let isValid = false;
        if (!resetValue['password']) {
            errorss['password'] = getFormattedMessage('user.input.password.validate.label');
        } else if (!resetValue['password_confirmation']) {
            errorss['password_confirmation'] = getFormattedMessage('user.input.confirm-password.validate.label');
        } else if (resetValue['password'] !== resetValue['password_confirmation']) {
            errorss['password_confirmation'] = 'The confirm password and password must match';
        } else {
            isValid = true;
        }
        setErrors(errorss);
        return isValid;
    };

    const prepareFormData = (data) => {
        const formData = new FormData();
        formData.append('password', data.password);
        formData.append('password_confirmation', data.password_confirmation);
        formData.append('email', data.email);
        formData.append('token', data.token);
        return formData;
    };

    const handleChange = (e) => {
        e.persist();
        setResetValue(inputs => ({...inputs, [e.target.name]: e.target.value}));
        setErrors('');
    };

    const onSubmit = (e) => {
        e.preventDefault();
        const Valid = handleValidation();
        if (Valid) {
            resetPassword(prepareFormData(resetValue), navigate);
        }
    };

    return (
        <div className='d-flex flex-center flex-column flex-column-fluid p-10 pb-lg-20 vh-100'>
            <TabTitle title='Reset Password'/>
            <div className='mb-12 col-12 text-center'>
                <Image className='logo-height' src={frontSetting && frontSetting.value && frontSetting.value.logo}/>
            </div>
            <div className='bg-white rounded-15 shadow-md width-540 px-5 px-sm-7 py-10 mx-auto'>
                <form className='form w-100'>
                    <div className='text-center mb-10'>
                        <h1 className='text-dark mb-3'>{getFormattedMessage('reset-password.title')}</h1>
                    </div>
                    <div className='mb-5'>
                        <label className='form-label'>{getFormattedMessage('user.input.password.label')} :</label>
                        <span className='required'/>
                        <input type='password' className='form-control'
                               placeholder={placeholderText('user.input.password.placeholder.label')}
                               name='password' value={resetValue.password} required
                               onChange={(e) => handleChange(e)}
                        />
                            <span className='text-danger d-block fw-400 fs-small mt-2'>{errors['password'] ? errors['password'] : null}</span>
                    </div>

                    <div className='mb-10'>
                        <label className='form-label'>{getFormattedMessage('change-password.input.confirm.label')}</label>
                        <span className='required'/>
                        <input type='password' className='form-control'
                               placeholder={placeholderText('change-password.input.confirm.placeholder.label')}
                               name='password_confirmation' value={resetValue.password_confirmation} required
                               onChange={(e) => handleChange(e)}
                        />
                            <span
                                className='text-danger d-block fw-400 fs-small mt-2'>{errors['password_confirmation'] ? errors['password_confirmation'] : null}</span>
                    </div>

                    <div className='d-flex justify-content-center pb-lg-0'>
                        <button
                            type='submit' className='btn btn-primary me-4'
                            onClick={(e) => onSubmit(e)}
                        >
                            {
                                <span>{getFormattedMessage('reset-password.title')}</span>
                            }
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
};

const mapStateToProps = (state) => {
    const {frontSetting} = state;
    return {frontSetting}
};

export default connect(mapStateToProps, {resetPassword, fetchFrontSetting})(ResetPassword);
