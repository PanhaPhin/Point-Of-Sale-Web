import {topCustomersActionType} from '../../constants';

export default (state = [], action) => {
    switch (action.type) {
        case topCustomersActionType.TOP_CUSTOMERS:
            return action.payload;
        default:
            return state;
    }
};
