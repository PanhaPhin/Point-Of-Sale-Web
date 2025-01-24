import {constants} from '../../constants';

export default (state = "", action) => {
    switch (action.type) {
        case constants.SET_PRODUCT_UNIT_ID:
            return action.payload;
        default:
            return state;
    }
}
