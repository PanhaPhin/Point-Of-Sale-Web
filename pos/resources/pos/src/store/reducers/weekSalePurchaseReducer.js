import {weekSalePurchasesActionType} from '../../constants';

export default (state = [], action) => {
    switch (action.type) {
        case weekSalePurchasesActionType.WEEK_SALE_PURCHASES:
            return action.payload;
        default:
            return state;
    }
};
