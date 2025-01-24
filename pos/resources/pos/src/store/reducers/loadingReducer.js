import {constants} from '../../constants';

export default (state = false, action) => {
    switch (action.type) {
        case constants.IS_LOADING:
            return action.payload;
        default:
            return state;
    }
}
