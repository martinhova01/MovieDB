import { Button } from "@/shadcn/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetTitle,
    SheetTrigger,
} from "@/shadcn/components/ui/sheet";
import { Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { NavbarProps } from "./Navbar";

const NavbarOverlay = ({ links }: { links: NavbarProps }) => {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="sm:hidden">
                    <Menu />
                    <span className="sr-only">Toggle navigation menu</span>
                </Button>
            </SheetTrigger>
            <SheetTitle />
            <SheetContent side="right">
                <nav className="p-4 bg-muted shadow-sm">
                    <ul className="flex flex-col space-y-4">
                        {links.map((link) => (
                            <li key={link.name}>
                                <Link
                                    to={link.href}
                                    className="hover:text-primary text-foreground transistion-colors"
                                >
                                    {link.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </SheetContent>
        </Sheet>
    );
};

export default NavbarOverlay;
