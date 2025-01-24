import { posRegisterReportDetailsAction } from '../../../constants'

export default ( state = [], action ) => {
    switch ( action.type ) {
        case posRegisterReportDetailsAction.GET_REGISTER_REPORT_DETAILS:
            return action.payload;
        default:
            return state;
    }
};