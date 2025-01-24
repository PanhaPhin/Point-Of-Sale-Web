import {constants} from '../../constants';

export default (state = false, action) => {
    switch (action.type) {
        case constants.CALL_UPDATE_BRAND_API:
            return action.payload;
        default:
            return state;
    }
}
