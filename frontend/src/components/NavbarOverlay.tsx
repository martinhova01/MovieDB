import { Button } from "@/shadcn/components/ui/button";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetTitle,
    SheetTrigger,
} from "@/shadcn/components/ui/sheet";
import { Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { NavbarProps } from "./Navbar";

const NavbarOverlay = ({ links }: { links: NavbarProps }) => {
    // This component will show a hamburger menu on small screens
    // Clicking the menu will show an overlay with the navigation links
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="sm:hidden">
                    <Menu />
                    <span className="sr-only">Toggle navigation menu</span>
                </Button>
            </SheetTrigger>
            <SheetTitle />
            <SheetDescription />
            <SheetContent side="right">
                <nav className="p-4 shadow-sm">
                    <ul className="flex flex-col space-y-4">
                        {links.map((link) => (
                            <li key={link.name}>
                                {/* Clicking a link should close the overlay */}
                                <SheetClose asChild>
                                    <Link
                                        to={link.href}
                                        className="text-foreground transition-colors hover:text-primary"
                                    >
                                        {link.name}
                                    </Link>
                                </SheetClose>
                                <hr />
                            </li>
                        ))}
                    </ul>
                </nav>
            </SheetContent>
        </Sheet>
    );
};

export default NavbarOverlay;
