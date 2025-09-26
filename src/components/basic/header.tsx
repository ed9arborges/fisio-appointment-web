import logo from "@/assets/head-logo.png"

export function Header() {
  return (
    <header className="flex justify-center items-center w-auto">
      <div className="bg-gray-100 px-5 py-3 rounded-b-xl">
        <img src={logo} alt="Logo" className="w-32 h-16" />
      </div>
    </header>
  )
}
