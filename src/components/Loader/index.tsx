import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import "./loader.scss";

function Loader() {
    return (
        <div className="loader-wrap">
            <div className="loader-circleprogress">
                <CircularProgress size={100} color="inherit" />
            </div>
        </div>
    );
}

export default Loader;
