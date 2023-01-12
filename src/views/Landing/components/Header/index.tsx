import React, { useState } from "react";
import "./header.scss";
import { ReactComponent as WonderlandIcon } from "../../../../assets/icons/wonderland-icon.svg";
import SabongcashIcon from "../../../../assets/icons/cbcash-icon.png";
import { SvgIcon, Link, Box, Popper, Fade } from "@material-ui/core";
import { ReactComponent as GitHub } from "../../../../assets/icons/github.svg";
import { ReactComponent as Twitter } from "../../../../assets/icons/twitter.svg";
import { ReactComponent as Telegram } from "../../../../assets/icons/telegram.svg";
import { ReactComponent as Discord } from "../../../../assets/icons/discord.svg";
import { ReactComponent as Facebook } from "../../../../assets/icons/facebook.svg";
import { ReactComponent as Email } from "../../../../assets/icons/email.svg";

function Header() {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event: any) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    };

    const open = Boolean(anchorEl);

    return (
        <div className="landing-header">
            {/* <SvgIcon color="primary" component={WonderlandIcon} viewBox="0 0 174 40" style={{ minWidth: 174, minHeight: 40 }} /> */}
            <img alt="" src={SabongcashIcon} height="40px" />
            <div className="landing-header-nav-wrap">
                <Box component="div" onMouseEnter={e => handleClick(e)} onMouseLeave={e => handleClick(e)}>
                    <p className="landing-header-nav-text">Social</p>
                    <Popper className="landing-header-poper" open={open} anchorEl={anchorEl} transition>
                        {({ TransitionProps }) => (
                            <Fade {...TransitionProps} timeout={200}>
                                <div className="tooltip">
                                    <Link className="tooltip-item disabled-link" href="https://facebook.com/" style={{ textDecoration: "none" }} target="_blank">
                                        <SvgIcon color="primary" component={Facebook} />
                                        <p>Facebook</p>
                                    </Link>
                                    <Link className="tooltip-item disabled-link" href="https://twitter.com/" style={{ textDecoration: "none" }} target="_blank">
                                        <SvgIcon color="primary" component={Twitter} />
                                        <p>Twitter</p>
                                    </Link>
                                    <Link className="tooltip-item disabled-link" href="https://t.me/joinchat/6UybL5rJMEhjN2Y5" style={{ textDecoration: "none" }} target="_blank">
                                        <SvgIcon color="primary" component={Telegram} />
                                        <p>Telegram</p>
                                    </Link>
                                    <Link className="tooltip-item disabled-link" href="https://gmail.com/" style={{ textDecoration: "none" }} target="_blank">
                                        <SvgIcon color="primary" component={Email} />
                                        <p>Email</p>
                                    </Link>
                                </div>
                            </Fade>
                        )}
                    </Popper>
                </Box>
            </div>
        </div>
    );
}

export default Header;
