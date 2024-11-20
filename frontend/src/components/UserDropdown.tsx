import { usernameVar } from "@/utils/cache";
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
import { validateUsername } from "@/utils/userInputValidation";
import { useReactiveVar } from "@apollo/client";
import { Edit, LogOut, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const UserDropdown = () => {
    const username = useReactiveVar(usernameVar);
    const [newUsername, setNewUsername] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleUsernameChange = (e: React.FormEvent) => {
        e.preventDefault();

        const trimmedUsername = newUsername.trim();
        if (!validateUsername(trimmedUsername)) return;

        if (trimmedUsername) {
            usernameVar(trimmedUsername);
            localStorage.setItem("username", trimmedUsername);
            setNewUsername("");
            setIsDialogOpen(false);
            setIsDropdownOpen(false);
            toast.success("Username changed successfully");
        }
    };

    const handleSignOut = () => {
        localStorage.removeItem("username");
        usernameVar("Guest");
        toast.success("Signed out successfully");
    };

    const handleDialogOpenChange = (open: boolean) => {
        setIsDialogOpen(open);
        setNewUsername("");
    };

    return (
        <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    className="flex items-center space-x-2"
                    aria-label="user"
                >
                    <User className="h-4 w-4" />
                    <span className="hidden truncate sm:flex sm:max-w-32">
                        {username}
                    </span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="truncate">
                    {username}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Dialog
                    open={isDialogOpen}
                    onOpenChange={(open) => handleDialogOpenChange(open)}
                >
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
                                    maxLength={20}
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
