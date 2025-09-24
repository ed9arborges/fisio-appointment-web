import React from "react"
import { cva, type VariantProps } from "class-variance-authority"

export const textVariants = cva("font-sans",{
  variants: {
    variant: {
      "text-xl-bold": "text-2xl font-bold",
      "text-lg-bold": "text-xl font-bold",
      "heading-md-bold": "text-base font-bold",
      "heading-md": "text-base font-normal",
      "text-sm-bold": "text-sm font-bold",
      "text-sm": "text-sm font-normal",
      "text-md": "text-md font-normal",
      "text-xs": "text-xs font-normal",
      "text-xs-bold": "text-xs font-bold",
      "text-xxs": "text-xs font-bold uppercase",
    }
  },
  defaultVariants: {
    variant: "text-sm"
  }
});

export interface TextProps extends VariantProps<typeof textVariants>{
  as?: keyof React.JSX.IntrinsicElements
  className?: string
  children?: React.ReactNode
}

export default function Text({
  as = "span",
  variant,
  className,
  children,
  ...props
}: TextProps) {
  return React.createElement(as, { className: textVariants({ variant, className}), ...props, }, children)
}
