import {productUnitActionType} from '../../constants';

export default (state = {}, action) => {
    switch (action.type) {
        case productUnitActionType.PRODUCT_UNITS:
            return action.payload;
        default:
            return state;
    }
};
