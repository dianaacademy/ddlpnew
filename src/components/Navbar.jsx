import { Link , useNavigate } from "react-router-dom"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import {
  CircleUser,
  Menu,
  Package2,
  Search,
} from "lucide-react";
import { useAuth, doSignOut } from "@/auth/hooks/useauth"
function Navbar() {
  const navigate = useNavigate()
  const { currentUser } = useAuth();
  const {role}= useAuth();

  console.log(currentUser);


  return (
    <div>

<header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link
            href="#"
            className="flex items-center gap-2 text-lg font-semibold md:text-base"
          >
            <Package2 className="h-6 w-6" />
          </Link>
          <Link
            to="/"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Home
          </Link>
          <Link
            to="courses"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Courses
          </Link>
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
        <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <form className="ml-auto   flex-1 sm:flex-initial">
            <div className="relative px-4 ">
              <Search className="absolute left-2.5 pr-6  top-2.5 h-4 w-14 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                className="mx-4 sm:w-[300px] md:w-[200px] lg:w-[400px]"
              />
            </div>
          </form>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
            <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 w-14 h-14 rounded-full flex items-center justify-center">          {currentUser?.photoURL ? (
            <img
              className="rounded-full w-12 h-12"
              src={currentUser.photoURL}
              alt="User profile"
            />
          ) : (
            <CircleUser className="text-white w-12 h-12" />
          )}
        </div>
              
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>   {currentUser && (
  <>
    { currentUser.email}
  </>
)}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem> { currentUser.displayName }</DropdownMenuItem>
              <DropdownMenuItem>{ role }</DropdownMenuItem>
              <DropdownMenuSeparator />
              <Button variant="destructive" onClick={() => { doSignOut().then(() => { navigate('/login') }) }} className='text-sm'> <DropdownMenuItem >Logout</DropdownMenuItem></Button>

            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    </div>
  )
}

export default Navbar