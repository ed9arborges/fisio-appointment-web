import React from "react"

import { cx } from "class-variance-authority"

interface MainContentProps extends React.ComponentProps<"main"> {}

export default function MainContent({
  children,
  className,
  ...props
}: MainContentProps) {
  return (
    <main className={cx("flex-1 ", className)} {...props}>
      {children}
    </main>
  )
}
