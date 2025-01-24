import {constants} from '../../constants';

export default (state = {}, action) => {
    switch (action.type) {
        case constants.DATE_ACTION:
            return action.payload;
        default:
            return state;
    }
}
