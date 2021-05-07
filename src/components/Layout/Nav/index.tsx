import { useState } from "react";

// Styles
import styles from "../../../styles/layout/nav.module.scss";

// Hooks
import { useIsMobile } from "../../../hooks/layout/index";

const Nav = () => {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  useIsMobile(setIsMobile);

  return (
    <nav className={styles.nav}>
      {isMobile ? (
        <h1>{process.env.REACT_APP_APP_NAME_SHORT}</h1>
      ) : (
        <h1>{process.env.REACT_APP_APP_NAME}</h1>
      )}
      <div className={styles.nav__right}>
        <button>Compute</button>
      </div>
    </nav>
  );
};

export default Nav;
