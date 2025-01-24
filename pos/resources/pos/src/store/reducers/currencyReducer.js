import {currencyActionType} from '../../constants';

export default (state = [], action) => {
    switch (action.type) {
        case currencyActionType.FETCH_CURRENCIES:
            return action.payload;
        case currencyActionType.FETCH_CURRENCY:
            return [action.payload];
        case currencyActionType.ADD_CURRENCY:
            return [...state, action.payload];
        case currencyActionType.EDIT_CURRENCY:
            return state.map(item => item.id === +action.payload.id ? action.payload : item);
        case currencyActionType.DELETE_CURRENCY:
            return state.filter(item => item.id !== action.payload);
        default:
            return state;
    }
};
