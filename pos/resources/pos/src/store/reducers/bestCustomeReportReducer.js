import {bestCustomerActionType} from '../../constants';

export default (state = [], action) => {
    switch (action.type) {
        case bestCustomerActionType.FETCH_BEST_CUSTOMER_REPORT:
            return action.payload;
        default:
            return state;
    }
};
