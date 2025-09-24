import React from "react"
import Text from "./basic/text"

import Icon from "./basic/icon"

import { cva, type VariantProps } from "class-variance-authority"

export const tagtimeVariants = cva(
  "inline-flex items-center justify-center transition group rounded-full gap-2 py-1.5 px-3",
  {
    variants: {
      variant: {
        default: "bg-transparent border border-gray-400 hover:bg-gray-500",
        selected: "bg-blue-base",
        read: "bg-transparent border border-gray-500",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export const tagtimeTextVariants = cva("", {
  variants: {
    variant: {
      default: "text-gray-200",
      selected: "text-gray-600",
      read: "text-gray-400",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

export const tagtimeIconVariants = cva("size-4", {
  variants: {
    variant: {
      default: "fill-feedback-open",
      selected: "fill-gray-600",
      read: "fill-gray-400",
    },
  },
  defaultVariants: { variant: "default" },
})

interface TagTimeProps
  extends Omit<React.ComponentProps<"div">, "size" | "disabled">,
    VariantProps<typeof tagtimeVariants> {
  iconAdd?: React.ComponentProps<typeof Icon>["svg"]
}

export default function TagTime({
  variant,
  className,
  children,
  iconAdd: IconComponent,
  ...props
}: TagTimeProps) {
  return (
    <div className={tagtimeVariants({ variant, className })} {...props}>
      <Text className={tagtimeTextVariants({ variant })}>{children}</Text>
      {IconComponent && (
        <Icon
          svg={IconComponent}
          className={tagtimeIconVariants({ variant })}
        />
      )}
    </div>
  )
}
