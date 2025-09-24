import React from "react"
import Text from "./basic/text"

import Icon from "./basic/icon"

import { cva, type VariantProps } from "class-variance-authority"

export const tagVariants = cva(
  "inline-flex items-center justify-center transition group rounded-full gap-2",
  {
    variants: {
      variant: {
        new: "bg-feedback-open-20",
        info: "bg-feedback-progress-20",
        success: "bg-feedback-done-20",
        danger: "bg-feedback-danger-20",
      },
      size: {
        sm: "py-0.5 px-2",
      },
    },
    defaultVariants: {
      variant: "new",
      size: "sm",
    },
  }
)

export const tagTextVariants = cva("", {
  variants: {
    variant: {
      new: "text-feedback-open",
      info: "text-feedback-progress",
      success: "text-feedback-done",
      danger: "text-feedback-danger",
    },
  },
  defaultVariants: {
    variant: "new",
  },
})

export const tagIconVariants = cva("size-4", {
  variants: {
    variant: {
      new: "fill-feedback-open",
      info: "fill-feedback-progress",
      success: "fill-feedback-done",
      danger: "fill-feedback-danger",
    },
    size: {
      sm: "py-0.5 px-2",
    },
  },
  defaultVariants: { variant: "new" },
})

interface TagProps
  extends Omit<React.ComponentProps<"div">, "size" | "disabled">,
    VariantProps<typeof tagVariants> {
  iconAdd: React.ComponentProps<typeof Icon>["svg"]
}

export default function Tag({
  variant,
  size,
  className,
  children,
  iconAdd: IconComponent,
  ...props
}: TagProps) {
  return (
    <div className={tagVariants({ variant, size, className })} {...props}>
      <Icon
        svg={IconComponent}
        className={tagIconVariants({ variant, size })}
      />
      <Text className={tagTextVariants({ variant })}>{children}</Text>
    </div>
  )
}
