import {frontSettingActionType} from '../../constants';

export default (state = {}, action) => {
    switch (action.type) {
        case frontSettingActionType.FETCH_FRONT_SETTING:
            return action.payload;
        default:
            return state;
    }
};
