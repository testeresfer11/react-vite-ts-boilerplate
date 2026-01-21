import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MoreIcon from "@mui/icons-material/MoreVert";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useLogout, useUser } from "@/lib/auth";
import bell from "@/assets/bell.svg";
import globe from "@/assets/globe.svg";
import clock from "@/assets/clock.svg";
import cal from "@/assets/cal.svg";
import { Link } from "@/components/Elements";
export default function TopBar({
  toggled,
  broken,
  setToggled,
}: {
  toggled: boolean;
  broken: boolean;
  setToggled: (i: boolean) => void;
}) {
  const user = useUser();
  const logoutFn = useLogout();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    React.useState<null | HTMLElement>(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const logout = () => {
    logoutFn.mutate(
      {},
      {
        onSuccess: () => {
          handleMenuClose();
          navigate("/auth/login");
        },
      }
    );
  };

  const handleProfile = () => {
    handleMenuClose();
    navigate("/admin/profile");
  }

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleProfile}>Profile</MenuItem>
      <MenuItem onClick={logout}>Logout</MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={() => { handleMobileMenuClose(); navigate("/admin/profile"); }}>Profile</MenuItem>
      <MenuItem onClick={() => { handleMobileMenuClose(); logout(); }}>Logout</MenuItem>
    </Menu>
  );

  return (
    <motion.div
      className="bgcolor admin-topbar"
      initial={{ opacity: 0, y: -100 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Box sx={{ flexGrow: 1, background: "#081028" }}>
        <AppBar className="bgcolor" color="default" position="static">
          <Toolbar>
            {broken && (
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="open drawer"
                sx={{ mr: 2 }}
                onClick={() => setToggled(!toggled)}
              >
                <MenuIcon />
              </IconButton>
            )}
            <Box sx={{ flexGrow: 1 }} />
            <div className="top-bar-flex py-4 d-flex align-items-center gap-5">
              <div className="date-change d-flex align-items-center gap-2">
                <span className="text-white f-14">
                  <img src={cal} className="globe-icon me-2" />
                  Today
                </span>
                <span className="f-14 lighttxt">10 April, 2025</span>
              </div>
              <div className="date-change d-flex align-items-center gap-2">
                <span className="text-white f-14">
                  <img src={clock} className="globe-icon me-2" />
                  08:00 am
                </span>
                <Link to="/" className="f-14 lighttxt">
                  Change Format
                </Link>
              </div>
              <div className="lang-change d-flex align-items-center gap-2">
                <span className="text-white f-14">
                  <img src={globe} className="globe-icon me-2" /> English (USA)
                </span>
                <Link to="/" className="f-14 lighttxt">
                  Change
                </Link>
              </div>
              <div className="notifications">
                <div className="bell-icon relative">
                  <img src={bell} className="bell-notes" alt="" />
                  <span className="not-count">1</span>
                </div>
              </div>
              <Box
                sx={{
                  display: { xs: "none", md: "flex" },
                  alignItems: "center",
                }}
              >
                <Typography color="white">{user?.data?.name ?? ""}</Typography>
                <IconButton
                  size="large"
                  edge="end"
                  aria-label="account of current user"
                  aria-controls={menuId}
                  aria-haspopup="true"
                  onClick={handleProfileMenuOpen}
                  color="inherit"
                >
                  <AccountCircle style={{ color: "#fff" }} />
                </IconButton>
              </Box>
              <Box sx={{ display: { xs: "flex", md: "none" } }}>
                <IconButton
                  size="large"
                  aria-label="show more"
                  aria-controls={mobileMenuId}
                  aria-haspopup="true"
                  onClick={handleMobileMenuOpen}
                  color="inherit"
                >
                  <MoreIcon style={{ color: "#fff" }} />
                </IconButton>
              </Box>
            </div>
          </Toolbar>
        </AppBar>
        {renderMobileMenu}
        {renderMenu}
      </Box>
    </motion.div>
  );
}
