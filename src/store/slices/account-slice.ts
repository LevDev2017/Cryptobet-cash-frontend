import { ethers } from "ethers";
import { getAddresses } from "../../constants";
import { SabTokenContract, SSabTokenContract, MimTokenContract, wMemoTokenContract } from "../../abi";
import { setAll } from "../../helpers";

import { createSlice, createSelector, createAsyncThunk } from "@reduxjs/toolkit";
import { JsonRpcProvider, StaticJsonRpcProvider } from "@ethersproject/providers";
import { Bond } from "../../helpers/bond/bond";
import { Networks } from "../../constants/blockchain";
import React from "react";
import { RootState } from "../store";
import { IToken } from "../../helpers/tokens";

interface IGetBalances {
    address: string;
    networkID: Networks;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
}

interface IAccountBalances {
    balances: {
        ssab: string;
        sab: string;
        wmemo: string;
    };
}

export const getBalances = createAsyncThunk("account/getBalances", async ({ address, networkID, provider }: IGetBalances): Promise<IAccountBalances> => {
    const addresses = getAddresses(networkID);

    const ssabContract = new ethers.Contract(addresses.SSAB_ADDRESS, SSabTokenContract, provider);
    const ssabBalance = await ssabContract.balanceOf(address);
    const sabContract = new ethers.Contract(addresses.SAB_ADDRESS, SabTokenContract, provider);
    const sabBalance = await sabContract.balanceOf(address);
    const wmemoContract = new ethers.Contract(addresses.WMEMO_ADDRESS, wMemoTokenContract, provider);
    const wmemoBalance = await wmemoContract.balanceOf(address);

    return {
        balances: {
            ssab: ethers.utils.formatUnits(ssabBalance, "gwei"),
            sab: ethers.utils.formatUnits(sabBalance, "gwei"),
            wmemo: ethers.utils.formatEther(wmemoBalance),
        },
    };
});

interface ILoadAccountDetails {
    address: string;
    networkID: Networks;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
}

interface IUserAccountDetails {
    balances: {
        sab: string;
        ssab: string;
        wmemo: string;
    };
    staking: {
        sab: number;
        ssab: number;
    };
    wrapping: {
        ssab: number;
    };
}

export const loadAccountDetails = createAsyncThunk("account/loadAccountDetails", async ({ networkID, provider, address }: ILoadAccountDetails): Promise<IUserAccountDetails> => {
    let sabBalance = 0;
    let ssabBalance = 0;

    let wmemoBalance = 0;
    let memoWmemoAllowance = 0;

    let stakeAllowance = 0;
    let unstakeAllowance = 0;

    const addresses = getAddresses(networkID);

    if (addresses.SAB_ADDRESS) {
        const sabContract = new ethers.Contract(addresses.SAB_ADDRESS, SabTokenContract, provider);
        sabBalance = await sabContract.balanceOf(address);
        stakeAllowance = await sabContract.allowance(address, addresses.STAKING_HELPER_ADDRESS);
    }

    if (addresses.SSAB_ADDRESS) {
        const ssabContract = new ethers.Contract(addresses.SSAB_ADDRESS, SSabTokenContract, provider);
        ssabBalance = await ssabContract.balanceOf(address);
        unstakeAllowance = await ssabContract.allowance(address, addresses.STAKING_ADDRESS);

        if (addresses.WMEMO_ADDRESS) {
            memoWmemoAllowance = await ssabContract.allowance(address, addresses.WMEMO_ADDRESS);
        }
    }

    if (addresses.WMEMO_ADDRESS) {
        const wmemoContract = new ethers.Contract(addresses.WMEMO_ADDRESS, wMemoTokenContract, provider);
        wmemoBalance = await wmemoContract.balanceOf(address);
    }

    return {
        balances: {
            ssab: ethers.utils.formatUnits(ssabBalance, "gwei"),
            sab: ethers.utils.formatUnits(sabBalance, "gwei"),
            wmemo: ethers.utils.formatEther(wmemoBalance),
        },
        staking: {
            sab: Number(stakeAllowance),
            ssab: Number(unstakeAllowance),
        },
        wrapping: {
            ssab: Number(memoWmemoAllowance),
        },
    };
});

interface ICalcUserBondDetails {
    address: string;
    bond: Bond;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
    networkID: Networks;
}

export interface IUserBondDetails {
    allowance: number;
    balance: number;
    allowanceSab: number;
    balanceSab: number;
    avaxBalance: number;
    interestDue: number;
    bondMaturationBlock: number;
    pendingPayout: number; //Payout formatted in gwei.
}

export const calculateUserBondDetails = createAsyncThunk("account/calculateUserBondDetails", async ({ address, bond, networkID, provider }: ICalcUserBondDetails) => {
    if (!address) {
        return new Promise<any>(resevle => {
            resevle({
                bond: "",
                displayName: "",
                bondIconSvg: "",
                isLP: false,
                allowance: 0,
                balance: 0,
                allowanceSab: 0,
                balanceSab: 0,
                interestDue: 0,
                bondMaturationBlock: 0,
                pendingPayout: "",
                avaxBalance: 0,
            });
        });
    }

    const bondContract = bond.getContractForBond(networkID, provider);
    const reserveContract = bond.getContractForReserve(networkID, provider);

    let interestDue, pendingPayout, bondMaturationBlock;

    const bondDetails = await bondContract.bondInfo(address);
    interestDue = bondDetails.payout / Math.pow(10, 9);
    bondMaturationBlock = Number(bondDetails.vesting) + Number(bondDetails.lastTime);
    pendingPayout = await bondContract.pendingPayoutFor(address);

    let allowance,
        allowanceSab,
        balanceSab = "0",
        balance = "0";

    allowance = await reserveContract.allowance(address, bond.getAddressForBond(networkID));
    balance = await reserveContract.balanceOf(address);
    const balanceVal = Number(balance) / Math.pow(10, bond.reserveDecimal);

    const addresses = getAddresses(networkID);

    if (addresses.SAB_ADDRESS) {
        const sabContract = new ethers.Contract(addresses.SAB_ADDRESS, SabTokenContract, provider);
        balanceSab = await sabContract.balanceOf(address);
        allowanceSab = await sabContract.allowance(address, bond.getAddressForBond(networkID));
    }

    const balanceSabVal = ethers.utils.formatUnits(balanceSab, "gwei");

    const avaxBalance = await provider.getSigner().getBalance();
    const avaxVal = ethers.utils.formatEther(avaxBalance);

    const pendingPayoutVal = ethers.utils.formatUnits(pendingPayout, "gwei");

    return {
        bond: bond.name,
        displayName: bond.displayName,
        bondIconSvg: bond.bondIconSvg,
        isLP: bond.isLP,
        allowance: Number(allowance),
        balance: Number(balanceVal),
        allowanceSab: Number(allowanceSab),
        balanceSab: Number(balanceSabVal),
        avaxBalance: Number(avaxVal),
        interestDue,
        bondMaturationBlock,
        pendingPayout: Number(pendingPayoutVal),
    };
});

interface ICalcUserTokenDetails {
    address: string;
    token: IToken;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
    networkID: Networks;
}

export interface IUserTokenDetails {
    allowance: number;
    balance: number;
    isAvax?: boolean;
}

export const calculateUserTokenDetails = createAsyncThunk("account/calculateUserTokenDetails", async ({ address, token, networkID, provider }: ICalcUserTokenDetails) => {
    if (!address) {
        return new Promise<any>(resevle => {
            resevle({
                token: "",
                address: "",
                img: "",
                allowance: 0,
                balance: 0,
            });
        });
    }

    if (token.isAvax) {
        const avaxBalance = await provider.getSigner().getBalance();
        const avaxVal = ethers.utils.formatEther(avaxBalance);

        return {
            token: token.name,
            tokenIcon: token.img,
            balance: Number(avaxVal),
            isAvax: true,
        };
    }

    const addresses = getAddresses(networkID);

    const tokenContract = new ethers.Contract(token.address, MimTokenContract, provider);

    let allowance,
        balance = "0";

    allowance = await tokenContract.allowance(address, addresses.ZAPIN_ADDRESS);
    balance = await tokenContract.balanceOf(address);

    const balanceVal = Number(balance) / Math.pow(10, token.decimals);

    return {
        token: token.name,
        address: token.address,
        img: token.img,
        allowance: Number(allowance),
        balance: Number(balanceVal),
    };
});

export interface IAccountSlice {
    bonds: { [key: string]: IUserBondDetails };
    balances: {
        ssab: string;
        sab: string;
        wmemo: string;
    };
    loading: boolean;
    staking: {
        sab: number;
        ssab: number;
    };
    wrapping: {
        ssab: number;
    };
    tokens: { [key: string]: IUserTokenDetails };
}

const initialState: IAccountSlice = {
    loading: true,
    bonds: {},
    balances: { ssab: "", sab: "", wmemo: "" },
    staking: { sab: 0, ssab: 0 },
    wrapping: { ssab: 0 },
    tokens: {},
};

const accountSlice = createSlice({
    name: "account",
    initialState,
    reducers: {
        fetchAccountSuccess(state, action) {
            setAll(state, action.payload);
        },
    },
    extraReducers: builder => {
        builder
            .addCase(loadAccountDetails.pending, state => {
                state.loading = true;
            })
            .addCase(loadAccountDetails.fulfilled, (state, action) => {
                setAll(state, action.payload);
                state.loading = false;
            })
            .addCase(loadAccountDetails.rejected, (state, { error }) => {
                state.loading = false;
                console.log(error);
            })
            .addCase(getBalances.pending, state => {
                state.loading = true;
            })
            .addCase(getBalances.fulfilled, (state, action) => {
                setAll(state, action.payload);
                state.loading = false;
            })
            .addCase(getBalances.rejected, (state, { error }) => {
                state.loading = false;
                console.log(error);
            })
            .addCase(calculateUserBondDetails.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(calculateUserBondDetails.fulfilled, (state, action) => {
                if (!action.payload) return;
                const bond = action.payload.bond;
                state.bonds[bond] = action.payload;
                state.loading = false;
            })
            .addCase(calculateUserBondDetails.rejected, (state, { error }) => {
                state.loading = false;
                console.log(error);
            })
            .addCase(calculateUserTokenDetails.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(calculateUserTokenDetails.fulfilled, (state, action) => {
                if (!action.payload) return;
                const token = action.payload.token;
                state.tokens[token] = action.payload;
                state.loading = false;
            })
            .addCase(calculateUserTokenDetails.rejected, (state, { error }) => {
                state.loading = false;
                console.log(error);
            });
    },
});

export default accountSlice.reducer;

export const { fetchAccountSuccess } = accountSlice.actions;

const baseInfo = (state: RootState) => state.account;

export const getAccountState = createSelector(baseInfo, account => account);
