import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { logout } from "@/lib/api/api.login";
import { toast } from "sonner";
import { removeUserInfo } from "@/redux/slices/user";

export default function SiteHeader() {
    const [query, setQuery] = useState("")
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const navigate = useNavigate()

    const dispatch = useAppDispatch()

    // Get user authentication state from Redux
    const { userInfo, isLoggedIn } = useAppSelector((state) => state.user);
    const cartItemCount = 3 // Mock cart count

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && query.trim()) {
            navigate(`/filter?q=${encodeURIComponent(query.trim())}`)
            setIsSearchOpen(false)
        }
    }

    const handleSearch = () => {
        if (query.trim()) {
            navigate(`/filter?q=${encodeURIComponent(query.trim())}`)
            setIsSearchOpen(false)
        }
    }

    const handleLogout = async () => {
        try {
            await logout();
            // Only clear user info from Redux store if logout API call succeeded
            dispatch(removeUserInfo());
            toast.success("Đăng xuất thành công");
            navigate("/");
        } catch (error: any) {
            console.error("Logout error:", error);
            // Don't clear local state if logout failed - keep user logged in
            toast.error("Đăng xuất thất bại. Vui lòng thử lại.");
            
            // Check if it's a server error that we should handle gracefully
            if (error?.message?.includes('24 character hex string') || 
                error?.message?.includes('ObjectId') ||
                error?.status === 500) {
                toast.error("Có lỗi từ máy chủ. Vui lòng thử lại sau hoặc liên hệ admin.");
            }
        }
    }

    return (
        <header className="border-b border-gray-200 px-4 py-4 bg-white sticky top-0 z-50">
            <div className="max-w-7xl mx-auto flex items-center justify-between space-x-4">
                {/* Logo */}
                <Link to="/" className="text-2xl font-black">
                    <span className="text-gray-900 font-semibold">E</span>
                    <span className="text-gray-500 font-semibold">W</span>
                    <span className="text-gray-900 font-semibold">.</span>
                </Link>
                {/* Desktop Search */}
                <div className="relative hidden sm:block w-120">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Tìm kiếm..."
                        className="pl-10 w-full"
                    />
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 md:space-x-4">

                    {/* Mobile Search Dialog */}
                    <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
                        <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="sm:hidden">
                                <Search className="h-5 w-5" />
                                <span className="sr-only">Tìm kiếm</span>
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-sm">
                            <div className="flex justify-between items-center mb-4">
                                <div className="text-lg font-semibold">Tìm kiếm</div>
                                <DialogClose asChild>
                                    <Button variant="ghost" size="icon">
                                        <X className="h-4 w-4" />
                                    </Button>
                                </DialogClose>
                            </div>
                            <div className="space-y-4">
                                <Input
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Tìm kiếm sản phẩm..."
                                    className="w-full"
                                />
                                <Button onClick={handleSearch} className="w-full">
                                    Tìm kiếm
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>

                    {/* Shopping Cart */}
                    {isLoggedIn && (
                        <Link to="/cart">
                            <Button variant="ghost" size="icon" className="relative">
                                <ShoppingBag className="h-5 w-5" />
                                <span className="sr-only">Giỏ hàng</span>
                                {cartItemCount > 0 && (
                                    <Badge
                                        variant="secondary"
                                        className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 mt-1"
                                    >
                                        {cartItemCount}
                                    </Badge>
                                )}
                            </Button>
                        </Link>
                    )}

                    {/* User Account Dropdown */}
                    {isLoggedIn ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <User className="h-5 w-5" />
                                    <span className="sr-only">Tài khoản</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuItem asChild>
                                    <Link to="/orders/history" className="w-full">
                                        Lịch sử đơn hàng
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link to="/profile" className="w-full">
                                        Chỉnh sửa thông tin
                                    </Link>
                                </DropdownMenuItem>
                                {/* <DropdownMenuItem asChild>
                                    <Link to="/wishlist" className="w-full">
                                        Danh sách yêu thích
                                    </Link>
                                </DropdownMenuItem> */}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <button className="w-full text-left text-red-600 focus:text-red-600 px-2 py-1.5 text-sm">
                                                Đăng xuất
                                            </button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <div className="space-y-4">
                                                <h2 className="text-lg font-semibold">Xác nhận đăng xuất</h2>
                                                <p>Bạn có muốn đăng xuất không?</p>
                                                <div className="flex justify-end space-x-2">
                                                    <DialogClose asChild>
                                                        <Button variant="outline">Hủy</Button>
                                                    </DialogClose>
                                                    <DialogClose asChild>
                                                        <Button
                                                            variant="destructive"
                                                            onClick={() => handleLogout()}
                                                        >
                                                            Đăng xuất
                                                        </Button>
                                                    </DialogClose>
                                                </div>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Link to="/login/user">
                            <Button variant="ghost" size="icon">
                                <User className="h-5 w-5" />
                                <span className="sr-only">Đăng nhập</span>
                            </Button>
                        </Link>
                    )}

                    {/* Mobile Menu Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="lg:hidden">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 lg:hidden">
                            <DropdownMenuItem asChild>
                                <Link to="/products?category=nam" className="w-full">
                                    NƯỚC HOA NAM
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link to="/products?category=nu" className="w-full">
                                    NƯỚC HOA NỮ
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link to="/brands" className="w-full">
                                    THƯƠNG HIỆU
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center justify-center space-x-8 max-w-7xl mx-auto pt-4">
                <Link to="/products?category=nam" className="text-sm font-medium hover:text-gray-600 transition-colors">
                    NƯỚC HOA NAM
                </Link>
                <Link to="/products?category=nu" className="text-sm font-medium hover:text-gray-600 transition-colors">
                    NƯỚC HOA NỮ
                </Link>
                <Link to="/brands" className="text-sm font-medium hover:text-gray-600 transition-colors">
                    THƯƠNG HIỆU
                </Link>
                <Link to="/about" className="text-sm font-medium hover:text-gray-600 transition-colors">
                    VỀ CHÚNG TÔI
                </Link>
                <Link to="/contact" className="text-sm font-medium hover:text-gray-600 transition-colors">
                    LIÊN HỆ
                </Link>
                <Link to="/faq" className="text-sm font-medium hover:text-gray-600 transition-colors">
                    HỎI ĐÁP
                </Link>
                <Link to="/terms" className="text-sm font-medium hover:text-gray-600 transition-colors">
                    ĐIỀU KHOẢN SỬ DỤNG
                </Link>

            </nav>
        </header>

    )
}
