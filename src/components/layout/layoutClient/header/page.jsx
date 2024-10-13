import { Search, Bell, MessageCircle, BarChart2, Maximize, User } from "lucide-react"

export default function HeaderClient() {
  return (
    <header className="flex items-center justify-between px-4 py-2 bg-white border-b">
      <div className="flex items-center w-1/3">
        <div className="relative w-full max-w-sm">
          <input
            type="search"
            placeholder="Search"
            className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        </div>
      </div>
      <div className="flex items-center justify-center w-1/3">
        <span className="text-sm font-medium">Academic Year: 2024 / 2025</span>
      </div>
      <div className="flex items-center justify-end w-1/3 space-x-4">
        <button className="p-2 hover:bg-gray-100 rounded-full">
          <img
            src="https://flagcdn.com/w20/vn.png"
            width="20"
            alt="vn flag"
            className="rounded-sm"
          />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-full border">
          <Bell className="h-5 w-5 text-gray-600" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-full border">
          <MessageCircle className="h-5 w-5 text-gray-600" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-full border">
          <BarChart2 className="h-5 w-5 text-gray-600" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-full border">
          <Maximize className="h-5 w-5 text-gray-600" />
        </button>
        <button className="p-1 hover:bg-gray-100 rounded-full border">
          <img
            src="/placeholder.svg?height=32&width=32"
            alt="User avatar"
            className="rounded-full"
            width={32}
            height={32}
          />
        </button>
      </div>
    </header>
  )
}