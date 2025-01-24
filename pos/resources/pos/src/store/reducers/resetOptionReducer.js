
export default (state = false, action) => {
    switch (action.type) {
        case "RESET_OPTION":
            return action.payload;
        default:
            return state;
    }
};
