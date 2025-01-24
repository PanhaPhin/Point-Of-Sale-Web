import {saleReturnActionType} from '../../constants';

export default (state = {}, action) => {
    switch (action.type) {
        case saleReturnActionType.FETCH_SALE_RETURN_DETAILS:
            return action.payload;
        default:
            return state;
    }
};
