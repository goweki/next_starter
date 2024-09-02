"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import {
  BookOpen,
  FileInput,
  Home,
  Menu,
  Users,
  Settings,
  File,
  User,
  LibraryBig,
  Contact,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { Button } from "../ui/button";
import ThemeToggle from "./themeToggle";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import Image from "next/image";
import { useSession } from "next-auth/react";
import LoaderHourglass from "./loader";
import { cn, titleCase } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../ui/navigation-menu";
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { buttonVariants } from "@/components/ui/button";

const routes = {
  unauth: [
    { label: "home", link: "/", icon: Home },
    { label: "services", link: "/services", icon: Users },
    { label: "blog", link: "/blog", icon: LibraryBig },
    { label: "contacts", link: "/contacts", icon: Contact },
  ],
  auth: [{ label: "home", link: "/user", icon: Home }],
};

const Navbar = () => {
  const pathname = usePathname();
  return (
    <header
      id="navbar"
      className="sticky border-b border-border/50 p-4 top-0 z-30 flex items-center gap-4 bg-background/80 backdrop-blur-lg px-4 sm:bg-transparent sm:px-6 shadow-md"
    >
      <HamburgerMenu />
      <div className="hidden md:flex">
        <NavigationMenuComponent />
      </div>

      <div className="relative ml-auto flex-1 md:grow-0">
        {/* <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
            /> */}
      </div>
      <ThemeToggle />
      <UserDropDown />
    </header>
  );
};

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Alert Dialog",
    href: "/docs/primitives/alert-dialog",
    description:
      "A modal dialog that interrupts the user with important content and expects a response.",
  },
  {
    title: "Hover Card",
    href: "/docs/primitives/hover-card",
    description:
      "For sighted users to preview content available behind a link.",
  },
  {
    title: "Progress",
    href: "/docs/primitives/progress",
    description:
      "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
  },
  {
    title: "Scroll-area",
    href: "/docs/primitives/scroll-area",
    description: "Visually or semantically separates content.",
  },
  {
    title: "Tabs",
    href: "/docs/primitives/tabs",
    description:
      "A set of layered sections of content—known as tab panels—that are displayed one at a time.",
  },
  {
    title: "Tooltip",
    href: "/docs/primitives/tooltip",
    description:
      "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
  },
];

const NavigationMenuComponent = () => {
  const pathname = usePathname();
  // console.log("pathname: ", pathname);
  return (
    <NavigationMenu>
      <NavigationMenuList>
        {(pathname.includes("/user") ? routes.auth : routes.unauth).map(
          ({ label, link }) => (
            <NavigationMenuItem key={label}>
              <Link href={link} legacyBehavior passHref>
                {/* <NavigationMenuLink className={navigationMenuTriggerStyle()}> */}
                <NavigationMenuLink
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    pathname === link ? "font-black border-0" : "border-0"
                  )}
                >
                  {titleCase(label)}
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          )
        )}
      </NavigationMenuList>
    </NavigationMenu>
  );
};

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

const HamburgerMenu = () => {
  const pathname = usePathname();
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Hamburger Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="sm:max-w-xs">
        <SheetHeader className="text-start">
          <SheetTitle className="uppercase text-primary">Starter</SheetTitle>
          <SheetDescription className="sr-only">Main Menu</SheetDescription>
        </SheetHeader>
        <nav className="grid gap-2 mt-4 text-lg font-medium">
          {(pathname.includes("/user") ? routes.auth : routes.unauth).map(
            ({ label, link, icon: Icon }) => (
              <Link
                key={label}
                href={link}
                className={`${
                  pathname === link ? "bg-accent !text-foreground" : ""
                } p-2 rounded-lg mr-4 flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground`}
              >
                <Icon className="h-5 w-5" />
                {label}
              </Link>
            )
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
};

const UserDropDown = () => {
  const { data: userSession, status: authStatus } = useSession();
  //
  //
  return authStatus === "loading" ? (
    <LoaderHourglass isLoading={authStatus === "loading"} />
  ) : userSession?.user ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="overflow-hidden rounded-full"
        >
          {
            <Image
              src="/avatar-african-afro.jpg"
              width={36}
              height={36}
              alt="Avatar"
              className="overflow-hidden rounded-full"
            />
          }
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel className="-mx-1 -my-1 bg-muted/50 text-muted-foreground">
          {userSession?.user.name}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link href="/user/settings">Settings</Link>{" "}
        </DropdownMenuItem>
        <DropdownMenuItem>Support</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : null;
};

export default Navbar;
