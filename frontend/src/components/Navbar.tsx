import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import NavbarOverlay from "./NavbarOverlay";
import UserDropdown from "./UserDropdown";

export type NavbarProps = { name: string; href: string }[];

const Navbar = () => {
    const links: NavbarProps = [
        // TODO: Add links when pages are created
        // { name: "Movies", href: "/movies" },
    ];

    return (
        <header className="w-full flex items-center p-4 justify-between bg-gradient-to-r from-muted-foreground to-primary">
            <nav className="flex items-center gap-10 text-background">
                <Link to="/" className="text-2xl font-bold flex flex-row gap-3">
                    <img src={logo} alt="logo" className="h-8 w-8" />
                    MovieDB
                </Link>
                <ul className="hidden sm:flex gap-4 text-lg">
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
