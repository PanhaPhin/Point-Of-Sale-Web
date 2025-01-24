import {productActionType} from '../../constants';

export default (state = [], action) => {
    switch (action.type) {
        case productActionType.FETCH_PRODUCTS:
            return [...action.payload];
        case productActionType.FETCH_PRODUCT:
            return [action.payload];
        case productActionType.ADD_PRODUCT:
            return action.payload;
        case productActionType.EDIT_PRODUCT:
            return state.map(item => item.id === +action.payload.id ? action.payload : item);
        case productActionType.DELETE_PRODUCT:
            return state.filter(item => item.id !== action.payload);
        case productActionType.FETCH_ALL_PRODUCTS:
            return action.payload;
        case productActionType.REMOVE_ALL_PRODUCTS:
            return state.filter(item => item.id === action.payload);
        case productActionType.FETCH_PRODUCTS_BY_WAREHOUSE:
            return action.payload;
        case productActionType.ADD_IMPORT_PRODUCT:
            return action.payload;
        default:
            return state;
    }
};
