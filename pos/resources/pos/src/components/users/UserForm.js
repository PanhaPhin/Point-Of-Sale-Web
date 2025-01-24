import React, {useEffect, useState} from 'react';
import Form from 'react-bootstrap/Form';
import {connect, useDispatch} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import * as EmailValidator from 'email-validator';
import {editUser} from '../../store/action/userAction';
import ImagePicker from '../../shared/image-picker/ImagePicker';
import {getAvatarName, getFormattedMessage, placeholderText, numValidate} from '../../shared/sharedMethod';
import user from '../../assets/images/avatar.png';
import ModelFooter from '../../shared/components/modelFooter';
import ReactSelect from "../../shared/select/reactSelect";
import {fetchAllRoles} from "../../store/action/roleAction";


const UserForm = (props) => {
    const {addUserData, id, singleUser, isEdit, isCreate, fetchAllRoles, roles} = props;
    const Dispatch = useDispatch()
    const navigate = useNavigate();

    const [userValue, setUserValue] = useState({
        first_name: singleUser ? singleUser[0].first_name : '',
        last_name: singleUser ? singleUser[0].last_name : '',
        email: singleUser ? singleUser[0].email : '',
        phone: singleUser ? singleUser[0].phone : '',
        password: '',
        confirm_password: '',
        role_id: singleUser ? singleUser[0].role_id : '',
        image: singleUser ? singleUser[0].image : '',
    });
    const [errors, setErrors] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        password: '',
        confirm_password: '',
        role_id: '',
    });

    const avatarName = getAvatarName(singleUser && singleUser[0].image === '' && singleUser[0].first_name && singleUser[0].last_name && singleUser[0].first_name + ' ' + singleUser[0].last_name)
    const newImg = singleUser && singleUser[0].image && singleUser[0].image === null && avatarName;
    const [imagePreviewUrl, setImagePreviewUrl] = useState(newImg && newImg);
    const [selectImg, setSelectImg] = useState(null);
    const disabled = selectImg ? false : singleUser && singleUser[0].first_name === userValue.first_name && singleUser[0].last_name === userValue.last_name
        && singleUser[0].email === userValue.email
        && singleUser[0].phone === userValue.phone
        && singleUser[0].image === userValue.image
    && singleUser[0].role_id.label[0] === userValue.role_id.label[0]

    const [selectedRole] = useState(singleUser && singleUser[0] ? ([{
        label: singleUser[0].role_id.label[0], value: singleUser[0].role_id.value[0]
    }]) : null);

    useEffect(() => {
        fetchAllRoles()
        setImagePreviewUrl(singleUser ? singleUser[0].image && singleUser[0].image : user);
    }, []);

    const onRolesChange = (obj) => {
        setUserValue(productValue => ({...productValue, role_id: obj}))
        setErrors('');
    };

    const handleValidation = () => {
        let errorss = {};
        let isValid = false;
        if (!userValue['first_name']) {
            errorss['first_name'] = getFormattedMessage("user.input.first-name.validate.label");
        } else if (!userValue['last_name']) {
            errorss['last_name'] = getFormattedMessage("user.input.last-name.validate.label");
        } else if (!EmailValidator.validate(userValue['email'])) {
            if (!userValue['email']) {
                errorss['email'] = getFormattedMessage("user.input.email.validate.label");
            } else {
                errorss['email'] = getFormattedMessage("user.input.email.valid.validate.label");
            }
        } else if (!userValue['phone']) {
            errorss['phone'] = getFormattedMessage("user.input.phone-number.validate.label");
            } else if (!userValue['role_id']) {
                errorss['role_id'] = getFormattedMessage("user.input.role.validate.label");
        } else {
            isValid = true;
        }
        setErrors(errorss);
        return isValid;
    };

    const onChangeInput = (e) => {
        e.preventDefault();
        setUserValue(inputs => ({...inputs, [e.target.name]: e.target.value}))
        setErrors('');
    };

    const handleImageChanges = (e) => {
        e.preventDefault();
        if (e.target.files.length > 0) {
            const file = e.target.files[0];
            if (file.type === 'image/jpeg' || file.type === 'image/png') {
                setSelectImg(file);
                const fileReader = new FileReader();
                fileReader.onloadend = () => {
                    setImagePreviewUrl(fileReader.result);
                };
                fileReader.readAsDataURL(file);
                setErrors('');
            }
        }
    };

    const prepareFormData = (data) => {
        const formData = new FormData();
        formData.append('first_name', data.first_name);
        formData.append('last_name', data.last_name);
        formData.append('email', data.email);
        formData.append('phone', data.phone);
        if (!isEdit) {
            formData.append('password', data.password);
            formData.append('confirm_password', data.confirm_password);
        }
        if (data.role_id.value) {
            formData.append('role_id', data.role_id.value);
        } else {
            formData.append('role_id', data.role_id);
        }
        if (selectImg) {
            formData.append('image', data.image);
        }
        return formData;
    };

    const onSubmit = (event) => {
        event.preventDefault();
        userValue.image = selectImg;
        const valid = handleValidation();
        if (singleUser && valid) {
            if (!disabled) {
                userValue.image = selectImg;
                Dispatch(editUser(id, prepareFormData(userValue), navigate));
            }
        } else {
            if (valid) {
                setUserValue(userValue);
                addUserData(prepareFormData(userValue));
                setImagePreviewUrl(imagePreviewUrl ? imagePreviewUrl : user);
            }
        }
    };

    return (
        <div className='card'>
            <div className='card-body'>
                <Form>
                    <div className='row'>
                        <div className='mb-4'>
                            <ImagePicker user={user} isCreate={isCreate} avtarName={avatarName}
                                         imageTitle={placeholderText("globally.input.change-image.tooltip")}
                                         imagePreviewUrl={imagePreviewUrl} handleImageChange={handleImageChanges}/>
                        </div>
                        <div className='col-md-6 mb-3'>
                            <label htmlFor="exampleInputEmail1" className="form-label">
                                {getFormattedMessage("user.input.first-name.label")} :<span className="required"/>
                            </label>
                            <input type='text' name='first_name' value={userValue.first_name}
                                   placeholder={placeholderText("user.input.first-name.placeholder.label")}
                                   className='form-control' autoFocus={true}
                                   onChange={(e) => onChangeInput(e)}/>
                            <span
                                className='text-danger d-block fw-400 fs-small mt-2'>{errors['first_name'] ? errors['first_name'] : null}</span>
                        </div>
                        <div className='col-md-6 mb-3'>
                            <label className='form-label'>
                                {getFormattedMessage("user.input.last-name.label")}:
                            </label>
                            <span className='required'/>
                            <input type='text' name='last_name' className='form-control'
                                   placeholder={placeholderText("user.input.last-name.placeholder.label")}
                                   onChange={(e) => onChangeInput(e)}
                                   value={userValue.last_name}/>
                            <span
                                className='text-danger d-block fw-400 fs-small mt-2'>{errors['last_name'] ? errors['last_name'] : null}</span>
                        </div>
                        <div className='col-md-6 mb-3'>
                            <label className='form-label'>
                                {getFormattedMessage("user.input.email.label")}:
                            </label>
                            <span className='required'/>
                            <input type='text' name='email' className='form-control'
                                   placeholder={placeholderText("user.input.email.placeholder.label")}
                                   onChange={(e) => onChangeInput(e)}
                                   value={userValue.email}/>
                            <span
                                className='text-danger d-block fw-400 fs-small mt-2'>{errors['email'] ? errors['email'] : null}</span>
                        </div>
                        <div className='col-md-6 mb-3'>
                            <label
                                className='form-label'>
                                {getFormattedMessage("user.input.phone-number.label")}:
                            </label>
                            <span className='required'/>
                            <input type='text' name='phone' value={userValue.phone}
                                   placeholder={placeholderText("user.input.phone-number.placeholder.label")}
                                   className='form-control' pattern='[0-9]*' min={0}
                                   onKeyPress={(event) => numValidate(event)}
                                   onChange={(e) => onChangeInput(e)}/>
                            <span
                                className='text-danger d-block fw-400 fs-small mt-2'>{errors['phone'] ? errors['phone'] : null}</span>
                        </div>
                        {isEdit ? '' :
                            <div className='col-md-6 mb-3'>
                                    <label className='form-label'>
                                        {getFormattedMessage("user.input.password.label")}:
                                    </label>
                                    <span className='required'/>
                                    <input type='password' name='password'
                                                  placeholder={placeholderText("user.input.password.placeholder.label")}
                                                  className='form-control' value={userValue.password}
                                                  onChange={(e) => onChangeInput(e)}/>
                                    <span
                                        className='text-danger d-block fw-400 fs-small mt-2'>{errors['password'] ? errors['password'] : null}</span>
                            </div>}
                        {isEdit ? '' :
                            <div className='col-md-6 mb-3'>
                                    <label
                                        className='form-label'>
                                        {getFormattedMessage("user.input.confirm-password.label")}:
                                    </label>
                                    <span className='required'/>
                                    <input type='password' name='confirm_password' className='form-control'
                                                  placeholder={placeholderText("user.input.confirm-password.placeholder.label")}
                                                  onChange={(e) => onChangeInput(e)}
                                                  value={userValue.confirm_password}/>
                                    <span
                                        className='text-danger d-block fw-400 fs-small mt-2'>{errors['confirm_password'] ? errors['confirm_password'] : null}</span>
                            </div>}
                        <div className='col-md-6'>
                            <ReactSelect title={getFormattedMessage("user.input.role.label")} placeholder={placeholderText("user.input.role.placeholder.label")} defaultValue={selectedRole}
                                         data={roles} onChange={onRolesChange} errors={errors['role_id']}/>
                        </div>
                        <ModelFooter onEditRecord={singleUser} onSubmit={onSubmit} editDisabled={disabled}
                                     link='/app/users' addDisabled={!userValue.first_name}/>
                    </div>
                </Form>
            </div>
        </div>
    )
};

const mapStateToProps = (state) => {
    const {roles} = state;
    return {roles}
};

export default connect(mapStateToProps, {fetchAllRoles})(UserForm);

