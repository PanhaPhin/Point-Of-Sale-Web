import {permissionActionType} from '../../constants';

export default (state = [], action) => {
    switch (action.type) {
        case permissionActionType.FETCH_PERMISSIONS:
            return [...action.payload];
        default:
            return state;
    }
}
