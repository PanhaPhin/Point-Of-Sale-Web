import {constants} from '../../constants';

export default (state = 'en', action) => {
    switch (action.type) {
        case constants.SET_LANGUAGE:
            return action.payload;
        default:
            return state;
    }
}
