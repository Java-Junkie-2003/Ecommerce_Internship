import { useState } from "react";
import { Search, ShoppingBag, User, Menu} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog";
import { Link, useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "@/redux/hook";

export default function SiteHeader() {
    const [query, setQuery] = useState("");
    const navigate = useNavigate();

    const dispatch = useAppDispatch();
    const userData = useAppSelector((state) => state.user);
    
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && query.trim()) {
            navigate(`/filter?q=${encodeURIComponent(query.trim())}`);
        }
    };

    return (
        <header className="border-b border-gray-200 px-4 py-4 bg-white">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="text-2xl font-black">
                    <span className="text-dark font-semibold">E</span>
                    <span className="text-gray-500 font-semibold">W</span>
                    <span className="text-dark font-semibold">.</span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden lg:flex items-center space-x-8">
                    <a href="#" className="text-sm font-medium hover:text-gray-600">
                        NƯỚC HOA NAM
                    </a>
                    <a href="#" className="text-sm font-medium hover:text-gray-600">
                        NƯỚC HOA NỮ
                    </a>
                    <a href="#" className="text-sm font-medium hover:text-gray-600">
                        THƯƠNG HIỆU
                    </a>
                </nav>

                {/* Actions */}
                <div className="flex items-center space-x-2 md:space-x-4">
                    {/* Desktop Search */}
                    <div className="relative hidden sm:block">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Tìm kiếm..."
                            className="pl-10"
                        />
                    </div>

                    {/* Icons */}
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="sm:hidden">
                                <Search className="h-5 w-5" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-sm">
                            <div className="flex justify-between items-center mb-4">
                                <div className="text-lg font-semibold">Tìm kiếm</div>
                                <DialogClose asChild>
                                </DialogClose>
                            </div>
                            <Input
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Tìm kiếm..."
                            />
                        </DialogContent>
                    </Dialog>

                    <Link to="/cart">
                        <Button variant="ghost" size="icon" className="relative">
                            <ShoppingBag className="h-5 w-5" />
                            <span className="sr-only">Giỏ hàng</span>
                            <Badge variant="secondary" className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 mt-1">
                                3
                            </Badge>
                        </Button>
                    </Link>
                    <Link to={ userData.isLoggedIn ? "/account" : "/login"}>
                        <Button variant="ghost" size="icon">
                            <User className="h-5 w-5" />
                            <span className="sr-only">Tài khoản</span>
                        </Button>
                    </Link>

                    {/* Mobile Menu */}
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="lg:hidden">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </DialogTrigger>

                        <DialogContent className="p-6 lg:hidden">
                            <div className="flex items-center justify-between mb-4">
                                <div className="text-xl font-bold">Menu</div>
                                <DialogClose asChild>
                                </DialogClose>
                            </div>

                            <nav className="flex flex-col space-y-4 text-sm font-medium">
                                <a href="#" className="hover:text-gray-600">
                                    NƯỚC HOA NAM
                                </a>
                                <a href="#" className="hover:text-gray-600">
                                    NƯỚC HOA NỮ
                                </a>
                                <a href="#" className="hover:text-gray-600">
                                    THƯƠNG HIỆU
                                </a>
                            </nav>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </header>
    );
}