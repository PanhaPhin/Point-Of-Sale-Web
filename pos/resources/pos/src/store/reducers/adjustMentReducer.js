import {adjustMentActionType} from '../../constants';

export default (state = {}, action) => {
    switch (action.type) {
        case adjustMentActionType.FETCH_ADJUSTMENTS:
            return action.payload;
        case adjustMentActionType.FETCH_ADJUSTMENT:
            return action.payload;
        case adjustMentActionType.ADD_ADJUSTMENTS:
            return action.payload;
        case adjustMentActionType.EDIT_ADJUSTMENTS:
            return state.map(item => item.id === +action.payload.id ? action.payload : item);
        case adjustMentActionType.DELETE_SALE:
            return state.filter(item => item.id !== action.payload);
        default:
            return state;
    }
};