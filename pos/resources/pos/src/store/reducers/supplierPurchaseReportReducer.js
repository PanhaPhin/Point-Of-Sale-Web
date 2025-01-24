import {supplierReportActionType} from '../../constants';

export default (state = [], action) => {
    switch (action.type) {
        case supplierReportActionType.FETCH_SUPPLIER_PURCHASE_REPORT:
            return action.payload;
            case supplierReportActionType.FETCH_SUPPLIER_PURCHASE_RETURN:
            return action.payload;
        default:
            return state;
    }
};
