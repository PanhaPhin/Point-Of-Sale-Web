import {supplierActionType} from '../../constants';

export default (state = [], action) => {
    switch (action.type) {
        case supplierActionType.FETCH_SUPPLIERS:
            return action.payload;
        case supplierActionType.FETCH_SUPPLIER:
            return [action.payload];
        case supplierActionType.ADD_SUPPLIER:
            return action.payload;
        case supplierActionType.EDIT_SUPPLIER:
            return state.map(item => item.id === +action.payload.id ? action.payload : item);
        case supplierActionType.DELETE_SUPPLIER:
            return state.filter(item => item.id !== action.payload);
        case supplierActionType.FETCH_ALL_SUPPLIERS:
            return action.payload;
        default:
            return state;
    }
};
