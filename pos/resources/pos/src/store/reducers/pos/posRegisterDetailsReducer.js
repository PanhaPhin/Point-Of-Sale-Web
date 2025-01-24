import {posProductActionType} from '../../../constants'

export default (state = {}, action) => {
    switch (action.type) {
        case posProductActionType.FETCH_TODAY_SALE_OVERALL_REPORT:
            return action.payload;
        default:
            return state;
    }
};
