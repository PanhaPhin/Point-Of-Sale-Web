import React, {createRef, useState} from 'react';
import {connect} from 'react-redux';
import {Form, Modal} from 'react-bootstrap-v5';
import {getFormattedMessage, placeholderText} from '../../shared/sharedMethod';
import {editExpenseCategory} from '../../store/action/expenseCategoryAction';
import ModelFooter from '../../shared/components/modelFooter';

const ExpenseCategoryForm = (props) => {
    const {handleClose, show, title, addExpenseData, editExpenseCategory, singleExpenseCategory} = props;
    const innerRef = createRef();
    const [expenseCategoryValue, setExpenseCategoryValue] = useState({
        name: singleExpenseCategory ? singleExpenseCategory.name : '',
    });
    const [errors, setErrors] = useState({
        name: '',
    });

    const disabled = singleExpenseCategory && singleExpenseCategory.name === expenseCategoryValue.name.trim();

    const handleValidation = () => {
        let errorss = {};
        let isValid = false;
        if (!expenseCategoryValue['name'].trim()) {
            errorss['name'] = getFormattedMessage('globally.input.name.validate.label');
        } else if ((expenseCategoryValue['name'] && expenseCategoryValue['name'].length > 50)) {
            errorss['name'] = getFormattedMessage('brand.input.name.valid.validate.label');
        } else {
            isValid = true;
        }
        setErrors(errorss);
        return isValid;
    };

    const onChangeInput = (e) => {
        e.preventDefault();
        setExpenseCategoryValue(inputs => ({...inputs, [e.target.name]: e.target.value}))
        setErrors('');
    };

    const onSubmit = (event) => {
        event.preventDefault();
        const valid = handleValidation();
        if (singleExpenseCategory && valid) {
            if (!disabled) {
                editExpenseCategory(singleExpenseCategory.id, expenseCategoryValue);
                clearField(false);
            }
        } else {
            if (valid) {
                setExpenseCategoryValue(expenseCategoryValue);
                addExpenseData(expenseCategoryValue);
                clearField(false);
            }
        }
    };

    const clearField = () => {
        setExpenseCategoryValue({
            name: '',
        });
        setErrors('');
        handleClose(false);
    };

    return (
        <Modal show={show}
               onHide={() => clearField(false)}
               keyboard={true}
               onShow={() => setTimeout(() => {
                   innerRef.current.focus();
               }, 1)}>
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
                        <div className='col-md-12'>
                                <label
                                    className='form-label'>{getFormattedMessage('globally.input.name.label')}: </label>
                                <span className='required'/>
                                <input type='text' name='name' value={expenseCategoryValue.name}
                                              placeholder={placeholderText('globally.input.name.placeholder.label')}
                                              className='form-control' ref={innerRef} autoComplete='off'
                                              onChange={(e) => onChangeInput(e)}/>
                                <span className='text-danger d-block fw-400 fs-small mt-2'>{errors['name'] ? errors['name'] : null}</span>
                        </div>
                    </div>
                </Modal.Body>
            </Form>
            <ModelFooter onEditRecord={singleExpenseCategory} onSubmit={onSubmit} editDisabled={disabled}
                         clearField={clearField} addDisabled={!expenseCategoryValue.name.trim()}/>
        </Modal>)
};

export default connect(null, {editExpenseCategory})(ExpenseCategoryForm);
