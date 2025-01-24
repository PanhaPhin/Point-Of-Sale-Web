import React, {useState} from 'react';
import {connect} from 'react-redux';
import {Button} from 'react-bootstrap-v5';
import {Filters} from '../../constants';
import {getFormattedMessage} from '../../shared/sharedMethod';
import {addExpenseCategory} from '../../store/action/expenseCategoryAction';
import ExpenseCategoryForm from './ExpenseCategoryForm';

const CreateExpenseCategory = (props) => {
    const {addExpenseCategory} = props;
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(!show);

    const addExpenseData = (expenseValue) => {
        addExpenseCategory(expenseValue, Filters.OBJ);
    };

    return (
        <div className='text-end w-sm-auto w-100'>
            <Button variant='primary mb-lg-0 mb-md-0 mb-4' onClick={() => handleClose(true)}>
                {getFormattedMessage('expense-category.create.title')}
            </Button>
            <ExpenseCategoryForm addExpenseData={addExpenseData} handleClose={handleClose} show={show}
                                 title={getFormattedMessage('expense-category.create.title')}/>
        </div>

    )
};

export default connect(null, {addExpenseCategory})(CreateExpenseCategory);
