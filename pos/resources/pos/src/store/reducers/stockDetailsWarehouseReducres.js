import {stockReportActionType} from '../../constants';

export default (state = [], action) => {
    switch (action.type) {
        case stockReportActionType.STOCK_DETAILS_WAREHOUSE:
            return action.payload;
        default:
            return state;
    }
};
