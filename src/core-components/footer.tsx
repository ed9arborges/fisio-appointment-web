import { NavLink } from "react-router"
import Text from "@/components/basic/text"

export default function Footer() {
  return (
    <footer className="my-5 md:my-10">
      <nav className="flex items-center justify-center gap-4">
        <NavLink to="/">
          <Text variant="text-sm-bold" className="text-gray-300">
            Main
          </Text>
        </NavLink>
        <NavLink to="/components">
          <Text variant="text-sm-bold" className="text-gray-300">
            Components
          </Text>
        </NavLink>
        <NavLink to="/appointments">
          <Text variant="text-sm-bold" className="text-gray-300">
            Appointments
          </Text>
        </NavLink>
      </nav>
    </footer>
  )
}
