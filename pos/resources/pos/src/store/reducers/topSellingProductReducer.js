import {topSellingActionType} from '../../constants';

export default (state = [], action) => {
    switch (action.type) {
        case topSellingActionType.TOP_SELLING:
            return action.payload;
        default:
            return state;
    }
};
