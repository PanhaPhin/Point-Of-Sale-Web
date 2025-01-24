import {saleReturnActionType} from '../../constants';

export default (state = {}, action) => {
    switch (action.type) {
        case saleReturnActionType.FETCH_SALES_RETURN:
            return action.payload;
        case saleReturnActionType.FETCH_SALE_RETURN:
            return action.payload;
        case saleReturnActionType.ADD_SALE_RETURN:
            return action.payload;
        case saleReturnActionType.EDIT_SALE_RETURN:
            return state.map(item => item.id === +action.payload.id ? action.payload : item);
        case saleReturnActionType.DELETE_SALE_RETURN:
            return state.filter(item => item.id !== action.payload);
        default:
            return state;
    }
};
