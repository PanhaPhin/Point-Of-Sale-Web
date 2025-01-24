import { emailTemplatesActionType } from '../../constants';

export default ( state = [], action ) => {
    switch ( action.type ) {
        case emailTemplatesActionType.FETCH_EMAIL_TEMPLATES:
            return action.payload;
        case emailTemplatesActionType.FETCH_EMAIL_TEMPLATE:
            return [ action.payload ];
        case emailTemplatesActionType.SET_ACTIVE_DE_ACTIVE:
            return state.map( item => item.id === +action.payload.id ? action.payload : item );
        default:
            return state;
    }
};
