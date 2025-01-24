import React from 'react';
import {connect} from 'react-redux';
import ExpenseCategoryForm from './ExpenseCategoryForm';
import {getFormattedMessage} from '../../shared/sharedMethod';

const EditExpenseCategory = (props) => {
    const {handleClose, show, expenseCategory} = props;

    return (
        <>
            {expenseCategory &&
            <ExpenseCategoryForm handleClose={handleClose} show={show} singleExpenseCategory={expenseCategory}
                                 title={getFormattedMessage('expense-category.edit.title')}/>
            }
        </>
    )
};

export default connect(null)(EditExpenseCategory);

