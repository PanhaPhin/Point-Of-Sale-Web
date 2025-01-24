import {productQuantityReportActionType} from '../../constants';

export default (state = [], action) => {
    switch (action.type) {
        case productQuantityReportActionType.QUANTITY_REPORT:
            return action.payload;
        default:
            return state;
    }
};
