export default (state = false, action) => {
    switch (action.type) {
        case "DISABLE_OPTION":
            return action.payload;
        default:
            return state;
    }
}
