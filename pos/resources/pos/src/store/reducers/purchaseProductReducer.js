import {purchaseProductActionType} from '../../constants';

const initialState = {
    purchase: [],
}

export default (state = initialState.purchase, action) => {
    switch (action.type) {
        case purchaseProductActionType.SEARCH_PURCHASE_PRODUCTS:
            let tempCart = state.filter((item) => item.id === action.payload.id);
            if (tempCart.length === 0) {
                return [...state, action.payload];
            } else {
                return state;
            }
        default:
            return state;
    }
};
