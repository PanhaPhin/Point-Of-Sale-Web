import {productCategoriesActionType} from '../../constants';

export default (state = [], action) => {
    switch (action.type) {
        case productCategoriesActionType.FETCH_PRODUCTS_CATEGORIES:
            return action.payload;
        case productCategoriesActionType.FETCH_PRODUCT_CATEGORIES:
            return [action.payload];
        case productCategoriesActionType.ADD_PRODUCT_CATEGORIES:
            return action.payload;
        case productCategoriesActionType.EDIT_PRODUCT_CATEGORIES:
            return state.map(item => item.id === +action.payload.id ? action.payload : item);
        case productCategoriesActionType.DELETE_PRODUCT_CATEGORIES:
            return state.filter(item => item.id !== action.payload);
        case productCategoriesActionType.FETCH_ALL_PRODUCTS_CATEGORIES:
            return action.payload;
        default:
            return state;
    }
};
