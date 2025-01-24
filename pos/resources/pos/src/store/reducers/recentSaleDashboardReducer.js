import {recentSaleActionType} from "../../constants";

export default (state = [], action) => {
    switch (action.type) {
        case recentSaleActionType.RECENT_SALES:
            return action.payload;
        default:
            return state;
    }
};
