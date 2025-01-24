import {smsApiActionType} from '../../constants';

export default (state = [], action) => {
    switch (action.type) {
        case smsApiActionType.FETCH_SMS_SETTINGS:
            return action.payload;
        case smsApiActionType.EDIT_SMS_SETTING:
            return [action.payload];
        default:
            return state;
    }
};
