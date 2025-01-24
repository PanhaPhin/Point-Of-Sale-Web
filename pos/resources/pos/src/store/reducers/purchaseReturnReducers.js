import {purchaseReturnActionType} from '../../constants';

export default (state = {}, action) => {
    switch (action.type) {
        case purchaseReturnActionType.FETCH_PURCHASES_RETURN:
            return action.payload;
        case purchaseReturnActionType.FETCH_PURCHASE_RETURN:
            return action.payload;
        case purchaseReturnActionType.ADD_PURCHASE_RETURN:
            return action.payload;
        case purchaseReturnActionType.EDIT_PURCHASE_RETURN:
            return state.map(item => item.id === +action.payload.id ? action.payload : item);
        case purchaseReturnActionType.DELETE_PURCHASE_RETURN:
            return state.filter(item => item.id !== action.payload);
        default:
            return state;
    }
};
