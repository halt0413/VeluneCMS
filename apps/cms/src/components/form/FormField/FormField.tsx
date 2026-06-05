import type { ReactNode } from "react";
import styles from "./FormField.module.css";

type FormFieldProps = {
  children: ReactNode;
  htmlFor: string;
  label: string;
};

export function FormField({
  children,
  htmlFor,
  label
}: FormFieldProps) {
  return (
    <label className={styles.field} htmlFor={htmlFor}>
      <span className={styles.label}>{label}</span>
      {children}
    </label>
  );
}

export function getFormControlClassName(className?: string): string {
  return [styles.control, className].filter(Boolean).join(" ");
}

export function getTextareaClassName(className?: string): string {
  return getFormControlClassName(
    [styles.textarea, className].filter(Boolean).join(" ")
  );
}
