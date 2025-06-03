import styles from "./Sidebar.module.css";
import AppNav from "../pages/AppNav";
import Logo from "../components/Logo";
import { Outlet } from "react-router-dom";
function Sidebar() {
  return (
    <div className={styles.sidebar}>
      <Logo />
      <AppNav />
      <Outlet />
      <footer className={styles.footer}>
        <p>© Copyright {new Date().getFullYear()} by WorldWise Inc.</p>
      </footer>
    </div>
  );
}

export default Sidebar;
