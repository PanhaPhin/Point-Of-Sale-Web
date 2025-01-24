import {settingActionType} from '../../constants';

export default (state = {}, action) => {
    switch (action.type) {
        case settingActionType.FETCH_SETTING:
            return action.payload;
        case settingActionType.EDIT_SETTINGS:
            return action.payload;
        case settingActionType.FETCH_CACHE_CLEAR:
            return action.payload;
        default:
            return state;
    }
};
