import React from "react";
import "./background.scss";
// import BlobsTop from "../../../../assets/icons/landing-blobs-top.png";
// import BlobsCenter from "../../../../assets/icons/landing-blobs-center.png";
import SabongCenter from "../../../../assets/icons/landing-cb-center.jpg";

function Background() {
    return (
        <div className="landing-background">
            <div className="landing-background-blobs-top">
                <img alt="" src={SabongCenter} width="100%" height="100%" />
            </div>
        </div>
    );
}

export default Background;
