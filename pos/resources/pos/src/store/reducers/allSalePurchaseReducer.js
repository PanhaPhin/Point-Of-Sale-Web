import {dashboardActionType} from "../../constants";

export default (state = {}, action) => {
    switch (action.type) {
        case dashboardActionType.FETCH_ALL_SALE_PURCHASE:
            return action.payload;
        default:
            return state;
    }
};
