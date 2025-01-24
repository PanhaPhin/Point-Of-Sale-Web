import {saleActionType} from '../../constants';

export default (state = {}, action) => {
    switch (action.type) {
        case saleActionType.PRODUCT_SALES_UNIT:
            return action.payload;
        default:
            return state;
    }
};
