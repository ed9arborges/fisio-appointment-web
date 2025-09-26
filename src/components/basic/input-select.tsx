import React, { useRef } from "react"
import { cva, type VariantProps, cx } from "class-variance-authority"
import { textVariants } from "./text"
import Text from "./text"
import Icon from "./icon"

// check icon, simple SVG:
const CheckIcon = () => (
  <svg
    className="w-4 h-4 text-blue-500"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={3}
      d="M5 13l4 4L19 7"
    />
  </svg>
)

export const inputSelectVariants = cva(
  "border-b border-solid focus:border-pink-base bg-transparent outline-none p-0",
  {
    variants: {
      variant: {
        default: "min-w-50",
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

export const inputSelectLabelVariants = cva("pl-0 text-left", {
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

interface InputSelectProps
  extends VariantProps<typeof inputSelectVariants>,
    Omit<React.ComponentProps<"select">, "disabled" | "size" | "onChange"> {
  label?: string
  helperText?: string
  error?: boolean
  helperIcon?: React.ComponentProps<typeof Icon>["svg"]
  items?: { value: string; label: string }[]
  value?: string
  onChange?: (value: string) => void
}

export default function InputSelect({
  size,
  disabled,
  className,
  label,
  helperText,
  error,
  helperIcon: HelperIcon,
  items = [
    { value: "", label: "Option" },
    { value: "mock1", label: "Mockup Item 1" },
    { value: "mock2", label: "Mockup Item 2" },
    { value: "mock3", label: "Mockup Item 3" },
  ],
  value,
  onChange
}: InputSelectProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [selected, setSelected] = React.useState(value ?? items[0].value)
  const [isFocused, setIsFocused] = React.useState(false)
  const selectRef = useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (value !== undefined) setSelected(value)
  }, [value])

  // Close dropdown when clicking outside
  React.useEffect(() => {
    if (!isOpen) return
    function handleClickOutside(event: MouseEvent) {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
        setIsFocused(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  const handleSelect = (val: string) => {
    setSelected(val)
    setIsOpen(false)
    onChange?.(val)
  }

  const labelColor = error
    ? "text-feedback-danger"
    : isFocused
    ? "text-blue-base"
    : "text-gray-300"

  return (
    <div ref={selectRef} className="flex flex-col gap-1 relative">
      {label && (
        <Text
          variant="text-xxs"
          className={cx(labelColor, inputSelectLabelVariants({ size }))}
        >
          {label}
        </Text>
      )}
      <button
        type="button"
        className={cx(
          inputSelectVariants({ size, disabled }),
          textVariants(),
          "pl-0 w-full flex items-center justify-between bg-white",
          error
            ? "border-feedback-danger"
            : isFocused
            ? "border-blue-base"
            : "",
          className
        )}
        onClick={() => setIsOpen((open) => !open)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      >
        <Text variant="text-xxs" className="text-gray-400">
          {items.find((i) => i.value === selected)?.label}
        </Text>
        <svg
          className="w-4 h-4 ml-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={
              isOpen
                ? "M19 15l-7-7-7 7" // arrow up
                : "M19 9l-7 7-7-7" // arrow down
            }
          />
        </svg>
      </button>
      {isOpen && (
        <ul className="absolute left-0 right-0 top-full z-20 bg-gray-600 border-0 rounded-sm shadow-sm max-h-60 overflow-visible mt-1">
          {items.map((item) => (
            <li
              key={item.value}
              className={cx(
                "flex items-center px-3 py-2 cursor-pointer rounded-lg hover:bg-blue-50 transition-colors",
                selected === item.value
                  ? "bg-blue-100 font-semibold text-blue-600"
                  : "text-gray-400"
              )}
              onClick={() => handleSelect(item.value)}
            >
              <Text
                variant={item.value === "" ? "text-xxs" : "text-md"}
                className="flex-1"
              >
                {item.label}
              </Text>
              {selected === item.value && <CheckIcon />}
            </li>
          ))}
        </ul>
      )}
      {helperText && (
        <div className="flex items-start gap-1 pl-0 mt-1">
          {HelperIcon && error && (
            <Icon svg={HelperIcon} className="w-4 h-4 fill-feedback-danger" />
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
