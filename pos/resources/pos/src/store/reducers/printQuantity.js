
export default (state = 10, action) => {
    switch (action.type) {
        case "UPDATE_PRINT_QTY":
            return action.payload;
        default:
            return state;
    }
}
