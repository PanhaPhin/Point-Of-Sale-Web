import {supplierReportActionType} from '../../constants';

export default (state = {}, action) => {
    switch (action.type) {
        case supplierReportActionType.FETCH_SUPPLIER_WIDGET_DATA:
            return action.payload;
        default:
            return state;
    }
};
