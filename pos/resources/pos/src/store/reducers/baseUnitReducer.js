import {baseUnitsActionType} from '../../constants';

export default (state = [], action) => {
    switch (action.type) {
        case baseUnitsActionType.FETCH_ALL_BASE_UNITS:
            return action.payload;
        default:
            return state;
    }
};
