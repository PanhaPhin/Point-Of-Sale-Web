import {topCustomersActionType} from '../../constants';

export default (state = [], action) => {
    switch (action.type) {
        case topCustomersActionType.FETCH_STOCK_ALERT:
            return action.payload;
        default:
            return state;
    }
};
