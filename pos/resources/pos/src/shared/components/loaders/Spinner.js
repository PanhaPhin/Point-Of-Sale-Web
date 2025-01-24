import React from "react";

const Spinner = () => {
    return (
        <div className="d-flex justify-content-center custom-loading">
            <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    )
}

export default Spinner;
