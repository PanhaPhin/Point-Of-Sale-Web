import {constants} from '../../constants';

export default (state = false, action) => {
    switch (action.type) {
        case constants.CALL_SALE_API:
            return action.payload;
        default:
            return state;
    }
}
