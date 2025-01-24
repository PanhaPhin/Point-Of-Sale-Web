import {posProductActionType} from '../../../constants'

export default (state = [], action) => {
    switch (action.type) {
        case posProductActionType.FETCH_PRODUCT:
            return [...state, action.payload];
        // case posProductActionType.POS_SEARCH_NAME_PRODUCT:
        //     return [...state, action.payload];
        // case posProductActionType.POS_SEARCH_CODE_PRODUCT:
        //     return [...state, action.payload];
        default:
            return state;
    }
};
