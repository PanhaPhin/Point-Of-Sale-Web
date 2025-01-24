import {purchaseActionType} from '../../constants';

export default (state = {}, action) => {
    switch (action.type) {
        case purchaseActionType.PURCHASE_DETAILS:
            return action.payload;
        default:
            return state;
    }
};
