import React from "react"
import Icon from "./icon"
import Text from "./text"
import { cva, type VariantProps } from "class-variance-authority"

export const buttonVariants = cva(
  "flex items-center justify-center cursor-pointer transition group gap-2",
  {
    variants: {
      variant: {
        primary: "bg-gray-100 hover:bg-gray-200",
        secundary: "bg-gray-500 hover:bg-gray-400",
        link: "bg-transparent hover:bg-gray-500"
      },
      size: {
        md: "h-10 py-4 px-2.75 rounded-[5px]",
        sm: "h-7 py-1.75 px-2 rounded-[5px]",
        lg: "h-14 py-5 px-3.5 rounded-lg",
        linksm: "h-5 py-0.5 px-0.75 ",
        linkmd: "h-6 py-0.5 px-0.75"
      },
      disabled: {
        true: "opacity-50 pointer-events-none",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      disabled: false,
    },
  }
)

export const buttonTextVariants = cva("",{
  variants: {
    variant: {
      primary: "text-gray-600",
      secundary: "text-gray-200",
      link: "text-gray-300"
    }
  },
  defaultVariants: {
    variant: "primary"
  }
})

export const buttonIconVariants = cva("transition", {
  variants: {
    variant: {
      primary: "fill-gray-600",
      secundary: "fill-gray-200",
      link: "fill-gray-300"
    },
    size: {
      md: "w-4.5 h-4.5",
      sm: "w-3.5 h-3.5",
      lg: "w-5 h-5",
      linkmd: "w-4.5 h-4.5",
      linksm: "w-3.5 h-3.5"
    },
  },
  defaultVariants: {
    variant: "primary",
  },
})

interface ButtonProps
  extends Omit<React.ComponentProps<"button">, "size" | "disabled">,
    VariantProps<typeof buttonVariants> {
  icon?: React.ComponentProps<typeof Icon>["svg"]
}


export default function Button({
  variant,
  size = "md",
  disabled,
  className,
  children,
  icon: IconComponent,
  ...props
}: ButtonProps) {

  return (
    <button className={buttonVariants({variant, size, disabled, className})} {...props}>
      {IconComponent && (<Icon
        svg={IconComponent}
        className={buttonIconVariants({ variant, size })}
      />)}
      {children && (
        <Text variant={size === 'md' ? 'text-sm-bold' : 'text-xs-bold'} className={buttonTextVariants({variant})}>{children}</Text>
      )}
    </button>
  )
}

