import {constants} from '../../constants';

export default (state = false, action) => {
    switch (action.type) {
        case constants.SET_SAVING:
            return action.payload;
        default:
            return state;
    }
}
