import SabImg from "../assets/tokens/SAB.png";
import SSabImg from "../assets/tokens/SSAB.png";

function toUrl(tokenPath: string): string {
    const host = window.location.origin;
    return `${host}/${tokenPath}`;
}

export function getTokenUrl(name: string) {
    if (name === "sab") {
        return toUrl(SabImg);
    }

    if (name === "ssab") {
        return toUrl(SSabImg);
    }

    throw Error(`Token url doesn't support: ${name}`);
}
