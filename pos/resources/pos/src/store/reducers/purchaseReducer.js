import {purchaseActionType} from '../../constants';

export default (state = {}, action) => {
    switch (action.type) {
        case purchaseActionType.FETCH_PURCHASES:
            return action.payload;
        case purchaseActionType.FETCH_PURCHASE:
            return action.payload;
        case purchaseActionType.ADD_PURCHASE:
            return action.payload;
        case purchaseActionType.EDIT_PURCHASE:
            return state.map(item => item.id === +action.payload.id ? action.payload : item);
        case purchaseActionType.DELETE_PURCHASE:
            return state.filter(item => item.id !== action.payload);
        default:
            return state;
    }
};
