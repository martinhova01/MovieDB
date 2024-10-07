import { Button } from "@/shadcn/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/shadcn/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shadcn/components/ui/dropdown-menu";
import { Input } from "@/shadcn/components/ui/input";
import { Label } from "@/shadcn/components/ui/label";
import { Edit, LogOut, User } from "lucide-react";
import { useEffect, useState } from "react";

const UserDropdown = () => {
    const [username, setUsername] = useState("Guest");
    const [newUsername, setNewUsername] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        const storedUsername = localStorage.getItem("username");
        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, []);

    const handleUsernameChange = (e: React.FormEvent) => {
        e.preventDefault();
        if (newUsername.trim()) {
            setUsername(newUsername.trim());
            localStorage.setItem("username", newUsername.trim());
            setNewUsername("");
            setIsDialogOpen(false);
        }
    };

    const handleSignOut = () => {
        localStorage.removeItem("username");
        setUsername("Guest");
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    className="flex items-center space-x-2"
                >
                    <User className="h-4 w-4" />
                    <span className="max-w-48 truncate">{username}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <Edit className="mr-2 h-4 w-4" />
                            Change username
                        </DropdownMenuItem>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Change username</DialogTitle>
                            <DialogDescription />
                        </DialogHeader>
                        <form
                            onSubmit={handleUsernameChange}
                            className="space-y-4"
                        >
                            <div>
                                <Label htmlFor="new-username">
                                    New username
                                </Label>
                                <Input
                                    id="new-username"
                                    placeholder="Enter new username"
                                    value={newUsername}
                                    onChange={(e) =>
                                        setNewUsername(e.target.value)
                                    }
                                />
                            </div>
                            <Button type="submit">Change username</Button>
                        </form>
                    </DialogContent>
                </Dialog>
                <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default UserDropdown;
