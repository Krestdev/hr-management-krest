import { cn } from '@/lib/utils';
import { cva, VariantProps } from 'class-variance-authority';
import React from 'react'

const headerVariants = cva("w-full min-h-24 px-4 flex flex-row flex-wrap items-center justify-between gap-3 rounded-lg relative", {
  variants: {
    variant: {
      primary:
        "bg-linear-to-l from-primary-400 to-primary-700 text-white",
      default: "bg-transparent text-neutral-900",
      dark: "bg-linear-to-l from-neutral-900 to-neutral-800 text-white",
      grey: "bg-[#4D5766] text-white",
      accent: "bg-accent-dark text-white"
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

interface Props {
    title: string;
    className?: string;
    children?: React.ReactNode;
}

function Header({children, title, variant, className=""}:Props & VariantProps<typeof headerVariants>) {
  return (
    <header className={cn(headerVariants({variant}), className)}>
        <h1 className="text-[clamp(18px,1.5vw,24px)] leading-[120%] z-10">{title}</h1>
        {children}
    </header>
  )
}

export default Header