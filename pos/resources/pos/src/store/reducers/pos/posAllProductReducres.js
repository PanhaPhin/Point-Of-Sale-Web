import {posProductActionType, productActionType} from '../../../constants'

export default (state = [], action) => {
    switch (action.type) {
        case posProductActionType.POS_ALL_PRODUCT:
            return action.payload;
        case posProductActionType.POS_ALL_PRODUCTS:
            return action.payload;
        case productActionType.FETCH_BRAND_CLICKABLE:
            return action.payload;
        default:
            return state;
    }
};
