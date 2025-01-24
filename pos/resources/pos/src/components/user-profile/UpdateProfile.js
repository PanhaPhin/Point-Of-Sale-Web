import React, {useEffect, useState} from 'react';
import Form from 'react-bootstrap/Form';
import {useDispatch, useSelector} from 'react-redux';
import {Link, useNavigate} from 'react-router-dom';
import * as EmailValidator from 'email-validator';
import ImagePicker from '../../shared/image-picker/ImagePicker';
import {updateProfile, fetchProfile} from '../../store/action/updateProfileAction';
import MasterLayout from '../MasterLayout';
import TabTitle from '../../shared/tab-title/TabTitle';
import {getAvatarName, getFormattedMessage, numValidate, placeholderText} from '../../shared/sharedMethod';
import user from '../../assets/images/avatar.png';
import TopProgressBar from "../../shared/components/loaders/TopProgressBar";

const UpdateProfile = () => {
    const { userProfile } = useSelector(state => state)
    const Dispatch = useDispatch()
    const navigate = useNavigate();
    const imageTitle = placeholderText('update-profile.input.change-image.label');
    const [profileValue, setProfileValue] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        image: '',
    });

    const [errors, setErrors] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
    });

    const avtarName = getAvatarName(userProfile && userProfile.attributes && userProfile.attributes.image === '' && userProfile.attributes.last_name && userProfile.attributes.first_name + ' ' + userProfile.attributes.last_name);
    const newImg = userProfile && userProfile.attributes && userProfile.attributes.image === null && avtarName;
    const [imagePreviewUrl, setImagePreviewUrl] = useState(newImg && newImg);
    const [selectImg, setSelectImg] = useState(null);
    const disabled = selectImg ? false : userProfile.attributes && userProfile.attributes.first_name === profileValue.first_name
        && userProfile.attributes.last_name === profileValue.last_name
        && userProfile.attributes.email === profileValue.email
        && userProfile.attributes.phone === profileValue.phone
        && userProfile.attributes.image === profileValue.image

    useEffect(() => {
        if (userProfile) {
            setProfileValue({
                first_name: userProfile ? userProfile.attributes && userProfile.attributes.first_name : '',
                last_name: userProfile ? userProfile.attributes && userProfile.attributes.last_name : '',
                email: userProfile ? userProfile.attributes && userProfile.attributes.email : '',
                phone: userProfile ? userProfile.attributes && userProfile.attributes.phone : '',
                image: userProfile ? userProfile.attributes && userProfile.attributes.image : '',
            })
            setImagePreviewUrl(userProfile ? userProfile.attributes && userProfile.attributes.image : user);
        }
    }, [userProfile]);

    useEffect(() => {
        Dispatch(fetchProfile());
    }, []);

    const handleValidation = () => {
        let errorss = {};
        let isValid = false;
        if (!profileValue['first_name']) {
            errorss['first_name'] = 'Please enter first name';
        } else if (!profileValue['last_name']) {
            errorss['last_name'] = 'Please enter last name';
        } else if (!EmailValidator.validate(profileValue['email'])) {
            if (!profileValue['email']) {
                errorss['email'] = 'Enter email address';
            } else {
                errorss['email'] = 'Please enter valid email address';
            }
        } else if (!profileValue['phone']) {
            errorss['phone'] = 'Please enter phone number';
        } else {
            isValid = true;
        }
        setErrors(errorss);
        return isValid;
    };

    const onChangeInput = (e) => {
        e.preventDefault();
        setProfileValue(inputs => ({...inputs, [e.target.name]: e.target.value}))
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
        if (selectImg) {
            formData.append('image', data.image);
        }
        return formData;
    };

    const onEdit = (event) => {
        event.preventDefault();
        const Valid = handleValidation();
        if (!disabled && Valid) {
            profileValue.image = selectImg;
            setProfileValue(profileValue)
            Dispatch(updateProfile(prepareFormData(profileValue), navigate));
        }
    };

    return (
        <MasterLayout>
            <TopProgressBar />
            <TabTitle title={placeholderText('update-profile.title')}/>
            <div className='card'>
                <div className='card-body'>
                    <Form>
                        <div className='row'>
                            <div className='col-12'>
                                <div className='mb-4'>
                                    <ImagePicker imageTitle={imageTitle} imagePreviewUrl={imagePreviewUrl}
                                                 user={user}
                                                 avtarName={avtarName} handleImageChange={handleImageChanges}/>
                                </div>
                            </div>
                            <div className='col-md-6 mb-3'>
                                <label htmlFor="exampleInputEmail1" className="form-label">
                                    {getFormattedMessage("user.input.first-name.label")} :<span className="required"/>
                                </label>
                                <input type='text' name='first_name' value={profileValue.first_name || ''}
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
                                       value={profileValue.last_name || ''}/>
                                <span
                                    className='text-danger d-block fw-400 fs-small mt-2'>{errors['last_name'] ? errors['last_name'] : null}</span>
                            </div>
                            <div className='col-md-6 mb-3'>
                                <label className='form-label'>
                                    {getFormattedMessage('user.input.email.label')}:
                                </label>
                                <span className='required'/>
                                <input type='text' name='email'
                                       placeholder={placeholderText('user.input.email.placeholder.label')}
                                       className='form-control' value={profileValue.email || ''}
                                       onChange={(e) => onChangeInput(e)}/>
                                <span
                                    className='text-danger d-block fw-400 fs-small mt-2'>{errors['email'] ? errors['email'] : null}</span>
                            </div>
                            <div className='col-md-6 mb-3'>
                                <label
                                    className='form-label'>
                                    {getFormattedMessage('user.input.phone-number.label')}:
                                </label>
                                <span className='required'/>
                                <input type='number' name='phone'
                                       placeholder={placeholderText('user.input.phone-number.placeholder.label')}
                                       className='form-control' pattern='[0-9]*' min={0}
                                       onKeyPress={(event) => numValidate(event)}
                                       onChange={(e) => onChangeInput(e)}
                                       value={profileValue.phone || ''}/>
                                <span className='text-danger d-block fs-small mt-2 fw-400'>{errors['phone'] ? errors['phone'] : null}</span>
                            </div>
                            <div className='d-flex mt-5'>
                                {userProfile ?
                                    <div onClick={(event) => onEdit(event)}>
                                        <input className='btn btn-primary me-3' type='submit'
                                               value={placeholderText('globally.save-btn')}
                                               disabled={disabled}
                                        />
                                    </div> : null
                                }
                                <Link to='/dashboard' className='btn btn-secondary me-3'>
                                    {getFormattedMessage('globally.cancel-btn')}
                                </Link>
                            </div>
                        </div>
                    </Form>
                </div>
            </div>
        </MasterLayout>
    )
};

export default UpdateProfile;
