import { Networks } from "../../constants/blockchain";
import { LPBond, CustomLPBond } from "./lp-bond";
import { StableBond, CustomBond } from "./stable-bond";

import MimIcon from "../../assets/tokens/MIM.svg";
import UsdtIcon from "../../assets/tokens/USDT.e.png";
import UsdcIcon from "../../assets/tokens/USDC.e.png";
import AvaxIcon from "../../assets/tokens/WAVAX.png";
import EthIcon from "../../assets/tokens/WETH.e.png";

import {
    MimBondContract,
    UsdtBondContract,
    UsdcBondContract,
    WavaxBondContract,
    EthBondContract,
    MimTokenContract,
    UsdtTokenContract,
    UsdcTokenContract,
    WavaxTokenContract,
    EthTokenContract,
} from "../../abi";

export const mim = new StableBond({
    name: "mim",
    displayName: "MIM",
    bondToken: "MIM",
    bondIconSvg: MimIcon,
    bondContractABI: MimBondContract,
    reserveContractAbi: MimTokenContract,
    networkAddrs: {
        [Networks.AVAX_MAIN]: {
            bondAddress: "0x901A9D9226B17A55fc4cD8547acF51D315a9D1Dd",
            reserveAddress: "0x130966628846BFd36ff31a822705796e8cb8C18D",
        },
        [Networks.AVAX_TEST]: {
            bondAddress: "0xbd6B0A66A640b3Da9a0323a8Fbe3185795EedBE6",
            reserveAddress: "0x08a978a0399465621e667C49CD54CC874DC064Eb",
        },
    },
    reserveDecimal: 18,
    // tokensInStrategy: "60500000000000000000000000",
});

export const usdt = new StableBond({
    name: "usdt",
    displayName: "USDT.e",
    bondToken: "USDT",
    bondIconSvg: UsdtIcon,
    bondContractABI: UsdtBondContract,
    reserveContractAbi: UsdtTokenContract,
    networkAddrs: {
        [Networks.AVAX_MAIN]: {
            bondAddress: "0x30f09E40Fca168436b965e988E164Ec1Ad81301f",
            reserveAddress: "0xc7198437980c041c805A1EDcbA50c1Ce5db95118",
        },
        [Networks.AVAX_TEST]: {
            bondAddress: "0x4C12DEb091b50fFA566f40b9a39B79038899652F",
            reserveAddress: "0x08a978a0399465621e667C49CD54CC874DC064Eb",
        },
    },
    reserveDecimal: 6,
    // tokensInStrategy: "60500000000000000000000000",
});

export const usdc = new StableBond({
    name: "usdc",
    displayName: "USDC.e",
    bondToken: "USDC",
    bondIconSvg: UsdcIcon,
    bondContractABI: UsdcBondContract,
    reserveContractAbi: UsdcTokenContract,
    networkAddrs: {
        [Networks.AVAX_MAIN]: {
            bondAddress: "0x68D55D957C8c6d51fFD4274e93164D9fE11007F6",
            reserveAddress: "0xa7d7079b0fead91f3e65f86e8915cb59c1a4c664",
        },
        [Networks.AVAX_TEST]: {
            bondAddress: "0xd3B99D108f0F7a42bD30c94385c4ED370Af0e814",
            reserveAddress: "0x08a978a0399465621e667C49CD54CC874DC064Eb",
        },
    },
    reserveDecimal: 6,
    // tokensInStrategy: "60500000000000000000000000",
});

export const wavax = new CustomBond({
    name: "wavax",
    displayName: "WAVAX",
    bondToken: "AVAX",
    bondIconSvg: AvaxIcon,
    bondContractABI: WavaxBondContract,
    reserveContractAbi: WavaxTokenContract,
    networkAddrs: {
        [Networks.AVAX_MAIN]: {
            bondAddress: "0xDF636983103717Aa90bb5a65859C95F0CB8862ae",
            reserveAddress: "0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7",
        },
        [Networks.AVAX_TEST]: {
            bondAddress: "0xc625b5e667bd5f34c25d7Ed00707a65217DE028a",
            reserveAddress: "0xd00ae08403B9bbb9124bB305C09058E32C39A48c",
        },
    },
    reserveDecimal: 18,
    // tokensInStrategy: "756916000000000000000000",
});

export const weth = new CustomBond({
    name: "weth",
    displayName: "WETH.e",
    bondToken: "ETH",
    bondIconSvg: EthIcon,
    bondContractABI: EthBondContract,
    reserveContractAbi: EthTokenContract,
    networkAddrs: {
        [Networks.AVAX_MAIN]: {
            bondAddress: "0x729035e1b936056CE1f2FC97B23ABb404e6A870A",
            reserveAddress: "0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB",
        },
        [Networks.AVAX_TEST]: {
            bondAddress: "0xA19a3dCAb97c4feE43FA986eb7De2bfBca2a2875",
            reserveAddress: "0xeFf581Ca1f9B49F49A183cD4f25F69776FA0EbF4",
        },
    },
    reserveDecimal: 18,
    // tokensInStrategy: "756916000000000000000000",
});

export default [mim, usdt, usdc, wavax, weth];
