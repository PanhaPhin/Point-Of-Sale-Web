import {expenseActionType} from '../../constants';

export default (state = [], action) => {
    switch (action.type) {
        case expenseActionType.FETCH_EXPENSES:
            return action.payload;
        case expenseActionType.FETCH_EXPENSE:
            return [action.payload];
        case expenseActionType.ADD_EXPENSE:
            return [...state, action.payload];
        case expenseActionType.EDIT_EXPENSE:
            return state.map(item => item.id === +action.payload.id ? action.payload : item);
        case expenseActionType.DELETE_EXPENSE:
            return state.filter(item => item.id !== action.payload);
        default:
            return state;
    }
};
