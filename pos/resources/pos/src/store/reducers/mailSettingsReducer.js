import {settingActionType} from '../../constants';

export default (state = {}, action) => {
    switch (action.type) {
        case settingActionType.FETCH_MAIL_SETTINGS:
            return action.payload;
        case settingActionType.EDIT_MAIL_SETTINGS:
            return action.payload;
        default:
            return state;
    }
};
