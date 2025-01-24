import {smsTemplatesActionType} from '../../constants';

export default (state = [], action) => {
    switch (action.type) {
        case smsTemplatesActionType.FETCH_SMS_TEMPLATES:
            return action.payload;
        case smsTemplatesActionType.FETCH_SMS_TEMPLATE:
            return [action.payload];
        case smsTemplatesActionType.SET_ACTIVE_DE_ACTIVE:
            return state.map(item => item.id === +action.payload.id ? action.payload : item);
        default:
            return state;
    }
};
