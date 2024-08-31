import styles from "./loader.module.css";
import "./styles.css";
import { useRef } from "react";
import { TransitionGroup, CSSTransition } from "react-transition-group";
export default function LoaderHourglass({
  isLoading,
  onExited,
}: {
  isLoading: boolean;
  onExited?: any;
}) {
  const nodeRef = useRef(null);
  return (
    <CSSTransition
      nodeRef={nodeRef}
      in={isLoading}
      timeout={1000}
      classNames="fade"
      appear={true}
      unmountOnExit
      onExited={onExited}
    >
      <div className={styles.loader + " opacity-0"} ref={nodeRef}>
        <div className={styles.hourglass}></div>
      </div>
    </CSSTransition>
  );
}
