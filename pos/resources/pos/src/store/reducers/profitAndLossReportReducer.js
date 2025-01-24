import {profitAndLossReportActionType} from '../../constants';

export default (state = [], action) => {
    switch (action.type) {
        case profitAndLossReportActionType.FETCH_PROFIT_AND_LOSS:
            return action.payload;
        default:
            return state;
    }
};
