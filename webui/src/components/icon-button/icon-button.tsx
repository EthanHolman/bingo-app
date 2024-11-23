import css from "./icon-button.module.css";

const IconButton = ({
  children,
  ...props
}: React.PropsWithChildren &
  React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >) => {
  return (
    <button type="button" className={css.iconButton} {...props}>
      {children}
    </button>
  );
};

export default IconButton;
