import {authActionType} from '../../constants';

export default (state = {}, action) => {
    switch (action.type) {
        case authActionType.CHANGE_PASSWORD:
            return action.payload;
        default:
            return state;
    }
};
