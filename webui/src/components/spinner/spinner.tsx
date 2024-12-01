import { CgSpinnerTwo } from "react-icons/cg";
import css from "./spinner.module.css";

const Spinner = ({ scale = 1 }: { scale?: number }) => {
  return (
    <div className={css.container} style={{ fontSize: `${scale}rem` }}>
      <CgSpinnerTwo className={css.spinner} />
    </div>
  );
};

export default Spinner;
