import {quotationActionType} from '../../constants';

export default (state = {}, action) => {
    switch (action.type) {
        case quotationActionType.QUOTATION_DETAILS:
            return action.payload;
        default:
            return state;
    }
};
