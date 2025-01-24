export default ( state = [], action ) => {
    switch ( action.type ) {
        case 'FETCH_STATE_DATA':
            return action.payload;
        default:
            return state;
    }
};
