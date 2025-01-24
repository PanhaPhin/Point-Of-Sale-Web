import {baseUnitsActionType, unitsActionType} from '../../constants';

export default (state = [], action) => {
    switch (action.type) {
        case baseUnitsActionType.FETCH_UNITS:
            return action.payload;
        case baseUnitsActionType.FETCH_UNIT:
            return [action.payload];
        case baseUnitsActionType.ADD_UNIT:
            return [...state, action.payload];
        case baseUnitsActionType.EDIT_UNIT:
            return state.map(item => item.id === +action.payload.id ? action.payload : item);
        case baseUnitsActionType.DELETE_UNIT:
            return state.filter(item => item.id !== action.payload);
        default:
            return state;
    }
};
