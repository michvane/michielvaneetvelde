import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

type ButtonVariant = "primary" | "secondary" | "quiet" | "inverted";
type ButtonSize = "default" | "compact";

const variants: Record<ButtonVariant, string> = {
  primary:
    "border-accent bg-accent text-accent-contrast hover:border-accent-hover hover:bg-accent-hover",
  secondary:
    "border-border-strong bg-transparent text-text hover:border-text hover:bg-surface",
  quiet: "border-transparent bg-transparent text-text-muted hover:text-text",
  inverted:
    "border-accent-contrast bg-transparent text-accent-contrast hover:bg-accent-contrast hover:text-accent",
};

const sizes: Record<ButtonSize, string> = {
  default: "min-h-12 px-5 py-3 text-sm",
  compact: "min-h-11 px-3.5 py-2 text-sm",
};

function buttonClasses(
  variant: ButtonVariant,
  size: ButtonSize,
  className: string,
) {
  return `inline-flex cursor-pointer items-center justify-center gap-2 rounded-control border font-medium transition-[background-color,border-color,color] duration-200 ${variants[variant]} ${sizes[size]} ${className}`;
}

type ButtonProps = ComponentPropsWithoutRef<"button"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function Button({
  className = "",
  size = "default",
  variant = "primary",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClasses(variant, size, className)}
      data-gamification-activation
      {...props}
    />
  );
}

type LinkButtonProps = ComponentPropsWithoutRef<typeof Link> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function LinkButton({
  className = "",
  size = "default",
  variant = "primary",
  ...props
}: LinkButtonProps) {
  return (
    <Link
      className={buttonClasses(variant, size, className)}
      data-gamification-activation
      {...props}
    />
  );
}
