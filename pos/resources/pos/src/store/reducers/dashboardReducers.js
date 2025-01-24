import {todaySalePurchaseCountActionType} from "../../constants";

export default (state = {}, action) => {
    switch (action.type) {
        case todaySalePurchaseCountActionType.TODAY_SALE_COUNT:
            return action.payload;
        case todaySalePurchaseCountActionType.RECENT_SALES:
            return action.payload;
        default:
            return state;
    }
};
