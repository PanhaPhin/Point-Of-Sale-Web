import {customerReportActionType} from '../../constants';

export default (state = {}, action) => {
    switch (action.type) {
        case customerReportActionType.FETCH_CUSTOMER_WIDGET_DATA:
            return action.payload;
        default:
            return state;
    }
};
