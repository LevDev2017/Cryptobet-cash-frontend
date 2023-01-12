import React, { useEffect, useState } from "react";
import App from "./App";
import Landing from "./Landing";
import { HashRouter } from "react-router-dom";
import { loadTokenPrices } from "../helpers";
import Loading from "../components/Loader";

function Root() {
    const isApp = (): boolean => {
        if (
            window.location.href.includes("dashboard") ||
            window.location.href.includes("stake") ||
            window.location.href.includes("mint") ||
            window.location.href.includes("calculator")
        ) {
            return true;
        } else {
            return false; //window.location.host.includes("app");
        }
    };

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTokenPrices().then(() => setLoading(false));
    }, []);

    if (loading) return <Loading />;

    const app = () => (
        <HashRouter>
            <App />
        </HashRouter>
    );

    return isApp() ? app() : <Landing />;
}

export default Root;
