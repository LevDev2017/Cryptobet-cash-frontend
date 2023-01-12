import { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Box, OutlinedInput, InputAdornment, Slide, FormControl } from "@material-ui/core";
import { shorten, trim, prettifySeconds } from "../../helpers";
import { changeSabApproval, bondWithdraw, calcBondDetails, calcBondWithDrawDetails } from "../../store/slices/bond-slice";
import { useWeb3Context } from "../../hooks";
import { IPendingTxn, isPendingTxn, txnButtonText } from "../../store/slices/pending-txns-slice";
import { Skeleton } from "@material-ui/lab";
import { IReduxState } from "../../store/slices/state.interface";
import { IAllBondData } from "../../hooks/bonds";
import useDebounce from "../../hooks/debounce";
import { messages } from "../../constants/messages";
import { warning } from "../../store/slices/messages-slice";
import Zapin from "./Zapin";

interface IBondWithdrawProps {
    bond: IAllBondData;
}

function BondWithdraw({ bond }: IBondWithdrawProps) {
    const dispatch = useDispatch();
    const { provider, address, chainID, checkWrongNetwork } = useWeb3Context();

    const [quantity, setQuantity] = useState("");
    const [useAvax, setUseAvax] = useState(false);

    const isBondLoading = useSelector<IReduxState, boolean>(state => state.bonding.loading ?? true);
    const [zapinOpen, setZapinOpen] = useState(false);

    const pendingTransactions = useSelector<IReduxState, IPendingTxn[]>(state => {
        return state.pendingTransactions;
    });

    const vestingPeriod = () => {
        return prettifySeconds(bond.vestingTerm, "day");
    };

    async function onWithdraw() {
        if (await checkWrongNetwork()) return;

        if (quantity === "") {
            dispatch(warning({ text: messages.before_minting }));
            //@ts-ignore
        } else if (isNaN(quantity)) {
            dispatch(warning({ text: messages.before_minting }));
        } else if (bond.interestDue > 0 || bond.pendingPayout > 0) {
            dispatch(warning({ text: messages.existing_withdraw }));
        } else {
            const trimBalance = trim(Number(quantity), 10);
            await dispatch(
                //@ts-ignore
                bondWithdraw({
                    value: trimBalance,
                    bond,
                    networkID: chainID,
                    provider,
                    address,
                    useAvax,
                }),
            );
            clearInput();
        }
    }

    const clearInput = () => {
        setQuantity("");
    };

    const hasAllowance = useCallback(() => {
        return bond.allowanceSab > 0;
    }, [bond.allowanceSab]);

    const setMax = () => {
        let amount: any = bond.balanceSab;

        if (amount) {
            amount = trim(amount);
        }

        setQuantity((amount || "").toString());
    };

    const bondDetailsDebounce = useDebounce(quantity, 1000);

    useEffect(() => {
        dispatch(calcBondWithDrawDetails({ bond, value: quantity, provider, networkID: chainID }));
    }, [bondDetailsDebounce]);

    const onSeekApproval = async () => {
        if (await checkWrongNetwork()) return;

        dispatch(changeSabApproval({ address, bond, provider, networkID: chainID }));
    };

    const handleZapinOpen = () => {
        dispatch(calcBondDetails({ bond, value: "0", provider, networkID: chainID }));
        setZapinOpen(true);
    };

    const handleZapinClose = () => {
        dispatch(calcBondDetails({ bond, value: quantity, provider, networkID: chainID }));
        setZapinOpen(false);
    };

    const displayUnits = useAvax ? "AVAX" : bond.displayUnits;

    return (
        <Box display="flex" flexDirection="column">
            <Box display="flex" justifyContent="space-around" flexWrap="wrap">
                <FormControl className="bond-input-wrap" variant="outlined" color="primary" fullWidth>
                    <OutlinedInput
                        placeholder="Amount"
                        type="number"
                        value={quantity}
                        onChange={e => setQuantity(e.target.value)}
                        labelWidth={0}
                        className="bond-input"
                        endAdornment={
                            <InputAdornment position="end">
                                <div className="stake-input-btn" onClick={setMax}>
                                    <p>Max</p>
                                </div>
                            </InputAdornment>
                        }
                    />
                </FormControl>
                {hasAllowance() || useAvax ? (
                    <div
                        className="transaction-button bond-approve-btn"
                        onClick={async () => {
                            if (isPendingTxn(pendingTransactions, "withdraw_bond_" + bond.name)) return;
                            await onWithdraw();
                        }}
                    >
                        <p>{txnButtonText(pendingTransactions, "withdraw_bond_" + bond.name, "Withdraw")}</p>
                    </div>
                ) : (
                    <div
                        className="transaction-button bond-approve-btn"
                        onClick={async () => {
                            if (isPendingTxn(pendingTransactions, "approve_sab")) return;
                            await onSeekApproval();
                        }}
                    >
                        <p>{txnButtonText(pendingTransactions, "approve_" + bond.name, "Approve")}</p>
                    </div>
                )}

                {/* <div className="transaction-button bond-approve-btn" onClick={handleZapinOpen}>
                    <p>Zap</p>
                </div> */}

                <div className="help-text">
                    <p className="help-text-desc">
                        Note: SAB Holders can sell maximum 10% of their balance to withdraw reserve tokens. Can sell SAB only for the 365 days after minting, on 3, 6, 9 months
                        anniversary day. Withdraw fee is 10% of transaction amounts.
                    </p>
                </div>
            </Box>

            <Slide direction="left" in={true} mountOnEnter unmountOnExit {...{ timeout: 533 }}>
                <Box className="bond-data">
                    <div className="data-row">
                        <p className="bond-balance-title">Your Balance</p>
                        <p className="bond-balance-title">
                            {isBondLoading ? (
                                <Skeleton width="100px" />
                            ) : (
                                <>
                                    {trim(bond.balanceSab, 4)} {`SAB`}
                                </>
                            )}
                        </p>
                    </div>

                    <div className="data-row">
                        <p className="bond-balance-title">You Will Get</p>
                        <p className="price-data bond-balance-title">{isBondLoading ? <Skeleton width="100px" /> : `${trim(bond.withdrawQuote, 4)} ${displayUnits}`}</p>
                    </div>

                    <div className="data-row">
                        <p className="bond-balance-title">Withdrawal Fee</p>
                        <p className="price-data bond-balance-title">{isBondLoading ? <Skeleton width="100px" /> : `${trim(bond.withdrawFee, 4)} ${displayUnits}`}</p>
                    </div>

                    <div className={`data-row`}>
                        <p className="bond-balance-title">Max You Can Withdraw</p>
                        <p className="price-data bond-balance-title">{isBondLoading ? <Skeleton width="100px" /> : `${trim(bond.maxWithdraw, 4)} SAB`}</p>
                    </div>
                </Box>
            </Slide>
            <Zapin open={zapinOpen} handleClose={handleZapinClose} bond={bond} />
        </Box>
    );
}

export default BondWithdraw;
