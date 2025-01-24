import {posCashPaymentActionType} from '../../../constants';

export default (state = false, action) => {
    switch (action.type) {
        case posCashPaymentActionType.POS_CASH_PAYMENT:
            return action.payload;
        default:
            return state;
    }
}
