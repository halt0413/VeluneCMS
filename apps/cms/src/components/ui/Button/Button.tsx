import type { ButtonHTMLAttributes } from "react";
import styles from "./Button.module.css";

export type ButtonVariant = "danger" | "icon" | "primary" | "secondary";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

export function Button({
  className,
  variant = "secondary",
  ...props
}: ButtonProps) {
  return (
    <button
      className={getButtonClassName(variant, className)}
      {...props}
    />
  );
}

export function getButtonClassName(
  variant: ButtonVariant = "secondary",
  className?: string
): string {
  return [styles.button, styles[variant], className].filter(Boolean).join(" ");
}
