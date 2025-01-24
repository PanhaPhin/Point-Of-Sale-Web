import {saleActionType} from '../../constants';

export default (state = [], action) => {
    switch (action.type) {
        case saleActionType.FETCH_SALE_PAYMENT:
            return action.payload;
        case saleActionType.EDIT_SALE_PAYMENT:
            state.map(item => item.id === action.payload.id ? action.payload : item)
        case saleActionType.DELETE_SALE_PAYMENT:
            return state.filter(item => item.id !== action.payload);
        default:
            return state;
    }
};
