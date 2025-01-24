import {transferActionType} from '../../constants';

export default (state = {}, action) => {
    switch (action.type) {
        case transferActionType.TRANSFER_DETAILS:
            return action.payload;
        default:
            return state;
    }
};
