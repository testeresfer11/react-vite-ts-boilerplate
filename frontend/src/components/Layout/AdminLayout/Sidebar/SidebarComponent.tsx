import {
  Sidebar,
  Menu,
  MenuItem,
  menuClasses,
  MenuItemStyles,
} from "react-pro-sidebar";
import { SidebarHeader } from "./components/SidebarHeader";
import { colors } from "@/components/config";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import dash from "@/assets/dash.svg";
import user from "@/assets/users.svg";
import analytic from "@/assets/analytic.svg";
import center from "@/assets/center.svg";
import admin from "@/assets/john.svg";
const themes = {
  light: {
    sidebar: {
      backgroundColor: "#081028",
      boxShadow: "0px 8px 28px 0px #0105114D",
      color: "#AEB9E1",
    },
    menu: {
      menuContent: "#AEB9E1",
      icon: colors.primary,
      hover: {
        backgroundColor: colors.secondary,
        color: "#000",
      },
      disabled: {
        color: "#9fb6cf",
      },
    },
  },
};

// hex to rgba converter
const hexToRgba = (hex: string, alpha: number) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const SidebarComponent = ({
  toggled,
  setToggled,
  setBroken,
}: {
  toggled: boolean;
  setToggled: (i: boolean) => void;
  setBroken: (i: boolean) => void;
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [active, setActive] = useState("");
  const to = (url: string) => () => {
    navigate(url);
  };

  const menuItemStyles: MenuItemStyles = {
    root: {
      fontSize: "14px",
      fontWeight: 400,
    },
    icon: {
      color: themes.light.menu.icon,
      [`&.${menuClasses.disabled}`]: {
        color: themes.light.menu.disabled.color,
      },
    },
    SubMenuExpandIcon: {
      color: "#b6b7b9",
    },
    subMenuContent: ({ level }) => ({
      backgroundColor:
        level === 0
          ? hexToRgba(themes.light.menu.menuContent, 0.4)
          : "transparent",
    }),
    button: {
      [`&.${menuClasses.disabled}`]: {
        color: themes.light.menu.disabled.color,
      },
      "&:hover": {
        backgroundColor: "#081028",
        color: "#CB3CFF",
      },
      [`&.ps-active`]: {
        backgroundColor: "#081028",
        color: "#CB3CFF",
      },
    },
    label: ({ open }) => ({
      fontWeight: open ? 600 : undefined,
    }),
  };

  useEffect(() => {
    const pathName = location.pathname;
    const parts = pathName.split("/");
    if (parts.length > 2) {
      const part = parts[2];
      setActive(part);
    } else {
      setActive("");
    }
  }, [location]);

  return (
    <motion.div
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <Sidebar
        toggled={toggled}
        onBackdropClick={() => setToggled(false)}
        onBreakPoint={setBroken}
        breakPoint="md"
        className="admin-sidebar border-0"
        backgroundColor={hexToRgba(themes.light.sidebar.backgroundColor, 1)}
        rootStyles={{
          color: themes.light.sidebar.color,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100vh",
          }}
        >
          <SidebarHeader style={{ marginBottom: "24px", marginTop: "16px" }} />
          <div className="sidebar-search">
            <form className="side-search relative">
              <input className="form-control" placeholder="Search" />
              <button className="sidebar-btn">
                <i className="fa fa-search" />
              </button>
            </form>
          </div>
          <div style={{ flex: 1, marginBottom: "32px" }}>
            <Menu menuItemStyles={menuItemStyles}>
              <MenuItem
                onClick={to("/admin")}
                active={active === ""}
                icon={<img src={dash} className="menu-icon" />}
              >
                Dashboard
              </MenuItem>
            </Menu>
            <Menu menuItemStyles={menuItemStyles}>
              <MenuItem
                onClick={to("/admin/users")}
                active={active === "users"}
                icon={<img src={user} className="menu-icon" />}
              >
                Users
              </MenuItem>
            </Menu>
            <Menu menuItemStyles={menuItemStyles}>
              <MenuItem
                onClick={to("/admin/content")}
                active={active === "content"}
                icon={<i className="fa-solid fa-file-alt menu-icon" style={{ color: '#CB3CFF' }}></i>}
              >
                Content Management
              </MenuItem>
            </Menu>
            <Menu menuItemStyles={menuItemStyles}>
              <MenuItem
                onClick={to("/admin/users")}
                active={active === "users"}
                icon={<img src={analytic} className="menu-icon" />}
              >
                Analytics & Insights
              </MenuItem>
            </Menu>
            <Menu menuItemStyles={menuItemStyles}>
              <MenuItem
                onClick={to("/admin/users")}
                active={active === "users"}
                icon={<img src={center} className="menu-icon" />}
              >
                Notification Center
              </MenuItem>
            </Menu>
            <hr />
            <div onClick={to('/admin/profile')} style={{ cursor: 'pointer' }} className="account-info px-3 d-flex gap-3 align-items-center">
              <img src={admin} className="admin-account-icon" />
              <div className="right-details">
                <h6 className="font-medium f-14 mb-0 text-white">John Carter</h6>
                <p className="mb-0 f-13 lighttxt">Account settings</p>
              </div>
            </div>
            {/* <Menu menuItemStyles={menuItemStyles}>
              <SubMenu
                label="Settings"
                icon={<i className="fa-solid fa-gear"></i>}
              >
                <MenuItem> Pie charts</MenuItem>
                <MenuItem> Line charts</MenuItem>
                <MenuItem> Bar charts</MenuItem>
              </SubMenu>
            </Menu> */}
          </div>
        </div>
      </Sidebar>
    </motion.div>
  );
};
