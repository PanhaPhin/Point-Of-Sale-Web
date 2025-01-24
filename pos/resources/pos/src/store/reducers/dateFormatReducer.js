import {constants} from '../../constants';

export default (state = "", action) => {
    switch (action.type) {
        case constants.SET_DATE_FORMAT:
            return action.payload;
        default:
            return state;
    }
}
