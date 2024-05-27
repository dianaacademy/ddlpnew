import { Link } from "react-router-dom"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import routes from "../../studentroutes";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/auth/hooks/useauth"
import logo from "../assets/logo.png";

import {
  CircleUser,
  Menu,
  Package2,
  Search,
} from "lucide-react"
import { Button } from "./ui/button"
import SidebarLinks from "./sidebar/studentssidebar/Links";



function Navbar() {
  const {logout} = useAuth();


  return (
    <div className=" bg-opacity-25	 backdrop-blur-lg sticky top-0 z-50  shadow-md bg-slate-900 mb-3">

<header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
<div className={`mx-[16px]  flex items-center`}>
        <div className="flex   font-poppins text-[16px] font-bold uppercase text-[#FFFFFF] dark:text-white">
   <div className="w-8 h-8  flex">
   <img 
    width={34}
    height={24}
    className="flex" src={logo} alt="diana logo" />
   </div>
        <p className="flex pl-1 pt-1 navbardd">iana learning portal</p>
        </div>
      </div>
  
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        
        <SidebarLinks routes={routes} />
        </nav>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <nav className="grid gap-6 text-lg font-medium">
              <Link
                href="#"
                className="flex items-center gap-2 text-lg font-semibold"
              >
                <Package2 className="h-6 w-6" />
                <span className="sr-only">Acme Inc</span>
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                Dashboard
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                Orders
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                Products
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                Customers
              </Link>
              <Link href="#" className="hover:text-foreground">
                Settings
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
        <div className="flex w-60% items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <form className="ml-auto   flex-1 sm:flex-initial">
            <div className="relative px-4 ">
              <Search className="absolute left-2.5 pr-6  top-2.5 h-4 w-14 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                className=" bg-slate-700 mx-4 sm:w-[300px] md:w-[200px] lg:w-[400px] border border-indigo-600 "
              />
            </div>
          </form>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full bg-slate-700 text-white border border-indigo-600">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <button onClick={logout}>

        
              <DropdownMenuItem >Logout</DropdownMenuItem>
              </button>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    </div>
  )
}

export default Navbar