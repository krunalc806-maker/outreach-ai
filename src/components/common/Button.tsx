import Link from "next/link";
import { ButtonProps } from "@/types";
import { cn } from "@/lib/utils";

const variants = {
  primary:
    "bg-[#d4ff32] hover:bg-[#bbf426] text-black font-extrabold shadow-lg shadow-[#d4ff32]/20",
  secondary: "bg-[#121216] hover:bg-[#1c1c22] text-white border border-white/10",
  outline:
    "border border-zinc-700 bg-transparent text-white hover:bg-zinc-900",
};

const sizes = {
  sm: "h-9 px-3.5 text-xs",
  md: "h-10 px-5 text-xs sm:text-sm",
  lg: "h-11 px-7 text-sm",
};

export default function Button({
  children,
  href,
  onClick,
  variant = "primary",
  size = "md",
  className,
  type = "button",
  disabled = false,
  ...props
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#d4ff32] disabled:cursor-not-allowed disabled:opacity-50",
    variants[variant],
    sizes[size],
    className
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
      {...props}
    >
      {children}
    </button>
  );
}