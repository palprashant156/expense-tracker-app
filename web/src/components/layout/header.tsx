import { Bell, Search, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Header() {
  return (
    <header className="h-16 bg-white border-b border-zinc-200 flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
          <Input 
            type="search" 
            placeholder="Search users, transactions, or logs..." 
            className="w-full bg-zinc-50 border-zinc-200 pl-9 focus-visible:ring-emerald-500"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button className="text-zinc-500 hover:text-zinc-900 relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>
        
        <div className="flex items-center space-x-3 border-l border-zinc-200 pl-4 ml-2">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-zinc-900 leading-none">Admin User</p>
            <p className="text-xs text-zinc-500 mt-1">Super Admin</p>
          </div>
          <Avatar className="h-9 w-9 border border-zinc-200">
            <AvatarImage src="" />
            <AvatarFallback className="bg-emerald-100 text-emerald-700 font-medium">AD</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
