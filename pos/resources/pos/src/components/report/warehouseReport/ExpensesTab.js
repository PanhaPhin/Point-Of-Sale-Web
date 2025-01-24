import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import moment from 'moment';
import ReactDataTable from '../../../shared/table/ReactDataTable';
import {currencySymbolHendling, getFormattedMessage} from '../../../shared/sharedMethod';
import {fetchFrontSetting} from '../../../store/action/frontSettingAction';
import {fetchExpenses} from '../../../store/action/expenseAction';
import {expenseExcelAction} from '../../../store/action/expenseExcelAction';

const ExpensesTab = (props) => {
    const {
        isLoading,
        totalRecord,
        fetchExpenses,
        expenses,
        expenseExcelAction,
        frontSetting,
        fetchFrontSetting,
        warehouseValue, allConfigData
    } = props;
    const currencySymbol = frontSetting && frontSetting.value && frontSetting.value.currency_symbol
    const [isWarehouseValue, setIsWarehouseValue] = useState(false);

    useEffect(() => {
        fetchFrontSetting();
    }, []);

    useEffect(() => {
        if (isWarehouseValue === true) {
            expenseExcelAction(warehouseValue.value, setIsWarehouseValue);
        }
    }, [isWarehouseValue])

    const itemsValue = currencySymbol && expenses.length >= 0 && expenses.map(expense => ({
        date: moment(expense.attributes.date).format('YYYY-MM-DD'),
        time: moment(expense.attributes.created_at).format('LT'),
        reference_code: expense.attributes.reference_code,
        title: expense.attributes.title,
        warehouse_name: expense.attributes.warehouse_name,
        expense_category_name: expense.attributes.expense_category_name,
        amount: expense.attributes.amount,
        details: expense.attributes.details,
        currency: currencySymbol,
        id: expense.id
    }));

    const columns = [
        {
            name: getFormattedMessage('globally.react-table.column.created-date.label'),
            selector: row => row.date,
            sortField: 'created_at',
            sortable: true,
            cell: row => {
                return (
                    <span className='badge bg-light-primary'>
                        <div className='mb-1'>{row.time}</div>
                        <div>{row.date}</div>
                    </span>
                )
            }
        },
        {
            name: getFormattedMessage('dashboard.recentSales.reference.label'),
            sortField: 'reference_code',
            sortable: true,
            cell: row => {
                return <span className='badge bg-light-danger'>
                            <span>{row.reference_code}</span>
                        </span>
            }
        },
        {
            name: getFormattedMessage('expense.input.title.label'),
            selector: row => row.title,
            sortField: 'title',
            sortable: false,
        },
        {
            name: getFormattedMessage('warehouse.title'),
            selector: row => row.warehouse_name,
            sortField: 'warehouse_name',
            sortable: false,
        },
        {
            name: getFormattedMessage('expense-category.title'),
            selector: row => row.expense_category_name,
            sortField: 'expense_category_name',
            sortable: false,
        },
        {
            name: getFormattedMessage('expense.input.amount.label'),
            selector: row => currencySymbolHendling(allConfigData, row.currency, row.amount),
            sortField: 'amount',
            sortable: true,
        },
    ];

    const onChange = (filter) => {
        fetchExpenses(filter, true);
    };

    const onExcelClick = () => {
        setIsWarehouseValue(true);
    };

    return (
        <ReactDataTable columns={columns} items={itemsValue} isEXCEL onChange={onChange}
                        isLoading={isLoading} warehouseValue={warehouseValue} totalRows={totalRecord}
                        onExcelClick={onExcelClick}/>
    )
};
const mapStateToProps = (state) => {
    const {isLoading, totalRecord, expenses, frontSetting} = state;
    return {isLoading, totalRecord, expenses, frontSetting}
};

export default connect(mapStateToProps, {fetchFrontSetting, fetchExpenses, expenseExcelAction})(ExpensesTab);
