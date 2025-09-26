import React from "react"
import { cva, type VariantProps, cx } from "class-variance-authority"
import { textVariants } from "./text"
import Text from "./text"
import Icon from "./icon"

export const inputTextVariants = cva(
  "border-b border-solid focus:border-pink-base bg-transparent outline-none p-0",
  {
    variants: {
      variant: {
        default: "border-gray-200",
      },
      size: {
        md: "pb-2",
      },
      disabled: {
        true: "pointer-events-none",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      disabled: false,
    },
  }
)

export const inputTextLabelVariants = cva("pl-0 text-left", {
  variants: {
    variant: {
      default: "",
    },
    size: { md: "text-xxs" },
  },
  defaultVariants: {
    size: "md",
  },
})

interface InputTextProps
  extends VariantProps<typeof inputTextVariants>,
    Omit<React.ComponentProps<"input">, "disabled" | "size"> {
  label?: string
  helperText?: string
  error?: boolean
  helperIcon?: React.ComponentProps<typeof Icon>["svg"]
}

export default function InputText({
  size,
  disabled,
  className,
  label,
  helperText,
  error,
  helperIcon: HelperIcon,
  ...props
}: InputTextProps) {
  const [isFocused, setIsFocused] = React.useState(false)

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true)
    props.onFocus?.(e)
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false)
    props.onBlur?.(e)
  }

  // Determine label color
  const labelColor = error
    ? "text-feedback-danger"
    : isFocused
    ? "text-blue-base"
    : "text-gray-300"

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <Text
          variant="text-xxs"
          className={cx(labelColor, inputTextLabelVariants())}
        >
          {label}
        </Text>
      )}
      <input
        className={cx(
          inputTextVariants({ size, disabled }),
          textVariants(),
          "pl-0",
          className
        )}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}
      />
      {helperText && (
        <div className="flex items-start gap-1 pl-0">
          {HelperIcon && error && (
            <Icon
              svg={HelperIcon}
              className={cx(
                "w-4 h-4",
                error ? "fill-feedback-danger" : "fill-gray-400"
              )}
            />
          )}
          <Text
            variant="text-xs"
            className={
              error ? "text-feedback-danger italic" : "text-gray-400 italic"
            }
          >
            {helperText}
          </Text>
        </div>
      )}
    </div>
  )
}
