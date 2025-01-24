import {configActionType} from '../../constants';

export default (state = {}, action) => {
    switch (action.type) {
        case configActionType.FETCH_ALL_CONFIG:
            return action.payload;
        default:
            return state;
    }
};
