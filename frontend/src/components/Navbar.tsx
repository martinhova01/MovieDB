import NavbarOverlay from "./NavbarOverlay";
import UserDropdown from "./UserDropdown";

export type NavbarProps = { name: string; href: string }[];

const Navbar = () => {
    const links: NavbarProps = [
        // TODO: Add links when pages are created
        // { name: "Movies", href: "/movies" },
    ];

    return (
        <header className="sticky top-0 left-0 z-50 bg-muted shadow-sm w-full flex items-center p-4">
            <nav className="flex-1 flex justify-center items-center gap-10">
                <a
                    href="/"
                    className="text-2xl font-bold text-primary flex flex-row gap-3"
                >
                    <img src="/logo.png" alt="logo" className="h-8 w-8" />
                    MovieDB
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
                {links.length > 0 && <NavbarOverlay links={links} />}
            </div>
        </header>
    );
};

export default Navbar;
