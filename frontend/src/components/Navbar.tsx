import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import NavbarOverlay from "./NavbarOverlay";
import UserDropdown from "./UserDropdown";
import { useReactiveVar } from "@apollo/client";
import { usernameVar } from "@/utils/cache";

export type NavbarProps = { name: string; href: string }[];

const Navbar = () => {
    const username = useReactiveVar(usernameVar);
    const links: NavbarProps = [
        { name: "Activity", href: "/activity" },
        // Only "logged in" users should see the "My Reviews" link
        ...(username != "Guest"
            ? [{ name: "My Reviews", href: "/myReviews" }]
            : []),
    ];

    return (
        <header className="flex w-full items-center justify-between bg-gradient-to-r from-muted-foreground to-primary p-4">
            <nav className="flex items-center gap-10 text-background">
                {/* Skip past navigation. main-content is defined in `routerConfig.tsx` */}
                <a
                    href="#main-content"
                    className="sr-only left-0 top-0 bg-primary font-bold focus:not-sr-only focus:absolute focus:m-2 focus:p-2"
                >
                    Skip to main content
                </a>
                <Link to="/" className="flex flex-row gap-3 text-2xl font-bold">
                    <img src={logo} alt="logo" className="h-8" />
                    MovieDB
                </Link>
                <ul className="hidden gap-4 text-lg sm:flex">
                    {links.map((link) => (
                        <li key={link.name}>
                            <Link to={link.href} className="hover:underline">
                                {link.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
            <div className="flex items-center">
                <UserDropdown />
                {/* Do not render the overlay/hamburger menu (for small screens) if there are no links */}
                {links.length > 0 && (
                    <div className="ml-2">
                        <NavbarOverlay links={links} />
                    </div>
                )}
            </div>
        </header>
    );
};

export default Navbar;
