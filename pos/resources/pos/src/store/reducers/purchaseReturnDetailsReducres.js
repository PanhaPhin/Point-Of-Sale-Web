import {purchaseReturnActionType} from '../../constants';

export default (state = {}, action) => {
    switch (action.type) {
        case purchaseReturnActionType.PURCHASES_RETURN_DETAILS:
            return action.payload;
        default:
            return state;
    }
};
