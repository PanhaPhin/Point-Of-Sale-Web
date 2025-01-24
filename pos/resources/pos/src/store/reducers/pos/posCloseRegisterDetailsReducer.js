import { posRegisterDetailsAction } from '../../../constants'


export default ( state = {}, action ) => {
    switch ( action.type ) {
        case posRegisterDetailsAction.GET_REGISTER_DETAILS:
            return action.payload;
        default:
            return state;
    }
};