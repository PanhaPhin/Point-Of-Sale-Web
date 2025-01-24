import {saleActionType} from '../../constants';

export default (state = {}, action) => {
    switch (action.type) {
        case saleActionType.SALE_DETAILS:
            return action.payload;
        default:
            return state;
    }
};
