import {profileActionType} from '../../constants';

export default (state = {}, action) => {
    switch (action.type) {
        case profileActionType.FETCH_PROFILE:
        case profileActionType.UPDATE_PROFILE:
            return action.payload;
        default:
            return state;
    }
}
