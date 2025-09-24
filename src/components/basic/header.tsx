import logo from "@/assets/head-logo.png"

export function Header() {
  return (
    <header className="absolute top-0 left-[177px] bg-gray-100 px-5 py-3 rounded-b-xl z-10">
      <img src={logo} alt="Logo" className="w-32 h-16" />
    </header>
  )
}
