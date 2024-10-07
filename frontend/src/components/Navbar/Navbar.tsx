import NavbarOverlay from "./NavbarOverlay";
import UserDropdown from "./UserDropdown";

export type NavbarProps = { name: string; href: string }[];

const Navbar = () => {
    const links: NavbarProps = [
        { name: "Movies", href: "/movies" },
        { name: "Feed", href: "/feed" },
    ];

    return (
        <header className="sticky top-0 left-0 z-50 bg-muted shadow-sm w-dvw flex items-center p-4">
            <nav className="flex-1 flex justify-center items-center gap-10">
                <a href="/" className="text-2xl font-bold text-primary">
                    Logo
                </a>
                <ul className="hidden sm:flex gap-4 text-lg">
                    {links.map((link) => (
                        <li key={link.name}>
                            <a
                                href={link.href}
                                className="hover:text-primary text-foreground transistion-colors"
                            >
                                {link.name}
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
            <div className="absolute right-4 flex items-center gap-2">
                <UserDropdown />
                <NavbarOverlay links={links} />
            </div>
        </header>
    );
};

export default Navbar;
