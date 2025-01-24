import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import MasterLayout from '../MasterLayout';
import HeaderTitle from '../header/HeaderTitle';
import {useNavigate} from 'react-router-dom';
import ExpenseForm from './ExpenseForm';
import {addExpense} from '../../store/action/expenseAction';
import {fetchAllWarehouses} from '../../store/action/warehouseAction';
import {fetchAllExpenseCategories} from '../../store/action/expenseCategoryAction';
import {getFormattedMessage} from '../../shared/sharedMethod';
import TopProgressBar from "../../shared/components/loaders/TopProgressBar";

const CreateExpense = (props) => {
    const {addExpense, warehouses, fetchAllWarehouses, fetchAllExpenseCategories, expenseCategories} = props;
    const navigate = useNavigate();

    useEffect(() => {
        fetchAllWarehouses();
        fetchAllExpenseCategories();
    }, []);

    const addExpenseData = (formValue) => {
        addExpense(formValue, navigate);
    };

    return (
        <MasterLayout>
            <TopProgressBar />
            <HeaderTitle title={getFormattedMessage('expense.create.title')} to='/app/expenses'/>
            <ExpenseForm addExpenseData={addExpenseData} warehouses={warehouses}
                         expenseCategories={expenseCategories}/>
        </MasterLayout>
    );
};

const mapStateToProps = (state) => {
    const {warehouses, expenseCategories, totalRecord} = state;
    return {warehouses, expenseCategories, totalRecord}
};

export default connect(mapStateToProps, {addExpense, fetchAllWarehouses, fetchAllExpenseCategories})(CreateExpense);
