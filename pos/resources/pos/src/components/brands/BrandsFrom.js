import React, {useState, createRef} from 'react';
import {connect} from 'react-redux';
import {Form, Modal} from 'react-bootstrap-v5';
import {editBrand, fetchBrand} from '../../store/action/brandsAction';
import ImagePicker from '../../shared/image-picker/ImagePicker';
import user from '../../assets/images/brand_logo.png';
import {getFormattedMessage} from '../../shared/sharedMethod';
import {placeholderText} from '../../shared/sharedMethod';
import ModelFooter from '../../shared/components/modelFooter';

const BrandsFrom = (props) => {
    const {handleClose, show, title, addBrandData, editBrand, singleBrand} = props;
    const innerRef = createRef();
    const [formValue, setFormValue] = useState({
        name: singleBrand ? singleBrand.name : '',
        image: singleBrand ? singleBrand.image : ''
    });
    const [errors, setErrors] = useState({name: ''});

    const editImg = singleBrand ? singleBrand.image : user;
    const newImg = formValue.image === false ? user : editImg;
    const [imagePreviewUrl, setImagePreviewUrl] = useState(newImg);
    const [selectImg, setSelectImg] = useState(null);

    const disabled = selectImg ? false : singleBrand && singleBrand.name === formValue.name.trim();

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

    const handleValidation = () => {
        let errorss = {};
        let isValid = false;
        if (!formValue['name'].trim()) {
            errorss['name'] = getFormattedMessage('globally.input.name.validate.label');
        } else if ((formValue['name'] && formValue['name'].length > 50)) {
            errorss['name'] = getFormattedMessage('brand.input.name.valid.validate.label');
        } else {
            isValid = true;
        }
        setErrors(errorss);
        return isValid;
    };

    const onChangeInput = (e) => {
        e.preventDefault();
        setFormValue(inputs => ({...inputs, [e.target.name]: e.target.value}));
        setErrors('');
    };

    const prepareFormData = (data) => {
        const formData = new FormData();
        formData.append('name', data.name);
        if (selectImg) {
            formData.append('image', data.image);
        }
        return formData;
    };

    const onSubmit = (event) => {
        event.preventDefault();
        const valid = handleValidation();
        formValue.image = selectImg;
        if (singleBrand && valid) {
            if (!disabled) {
                formValue.image = selectImg;
                editBrand(singleBrand.id, prepareFormData(formValue), handleClose);
                clearField(false);
            }
        } else {
            if (valid) {
                setFormValue(formValue);
                addBrandData(prepareFormData(formValue));
                clearField(false);
            }
        }
        setSelectImg(null);
    };

    const clearField = () => {
        setFormValue({
            name: '',
            image: ''
        })
        setImagePreviewUrl(user);
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
                                className='form-label'>{getFormattedMessage('globally.input.name.label')}: </label>
                            <span className='required'/>
                            <input type='text' name='name' autoComplete='off'
                                   placeholder={placeholderText('globally.input.name.placeholder.label')}
                                   className='form-control' ref={innerRef} value={formValue.name}
                                   onChange={(e) => onChangeInput(e)}/>
                            <span className='text-danger d-block fw-400 fs-small mt-2'>
                                        {errors['name'] ? errors['name'] : null}
                                </span>
                        </div>
                        <ImagePicker imagePreviewUrl={imagePreviewUrl} handleImageChange={handleImageChanges}
                                     user={user}
                                     imageTitle={placeholderText('globally.input.change-logo.tooltip')}/>
                    </div>
                </Modal.Body>
            </Form>
            <ModelFooter onEditRecord={singleBrand} onSubmit={onSubmit} editDisabled={disabled}
                         clearField={clearField} addDisabled={!formValue.name.trim()}/>
        </Modal>
    )
};

export default connect(null, {fetchBrand, editBrand})(BrandsFrom);
