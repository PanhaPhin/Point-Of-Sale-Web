import {adjustMentActionType} from '../../constants';

export default (state = {}, action) => {
    switch (action.type) {
        case adjustMentActionType.ADJUSTMENT_DETAILS:
            return action.payload;
        default:
            return state;
    }
};