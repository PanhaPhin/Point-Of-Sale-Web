import {constants} from '../../constants';

export default (state = 0, action) => {
    switch (action.type) {
        case constants.SET_TOTAL_RECORD:
            return action.payload;
        case constants.UPDATE_TOTAL_RECORD_AFTER_DELETE:
            return state - action.payload;
        case constants.UPDATE_TOTAL_RECORD_AFTER_ADD:
            return state + action.payload;
        default:
            return state;
    }
}
