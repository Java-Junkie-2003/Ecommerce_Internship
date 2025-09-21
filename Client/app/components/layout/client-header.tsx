import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { Menu, Search, ShoppingBag, User, X, Loader2 } from "lucide-react";
import { useEffect, useState, useCallback, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { logout } from "@/lib/api/api.login";
import { toast } from "sonner";
import { removeUserInfo } from "@/redux/slices/user";
import { initCart } from "@/redux/thunks/cart.thunk";
import { ApiService } from "@/lib/api";
import { ENDPOINTS } from "@/utils/api.endpoints";
import { SearchProductDTO } from "@/types/dto/product.dto";

// Custom debounce hook
const useDebounce = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};

export default function SiteHeader() {
    const [query, setQuery] = useState("")
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [searchResults, setSearchResults] = useState<SearchProductDTO['metadata']>([])
    const [isSearching, setIsSearching] = useState(false)
    const [showResults, setShowResults] = useState(false)
    const searchRef = useRef<HTMLDivElement>(null)
    const navigate = useNavigate()
    const location = useLocation()

    // Debounce search query
    const debouncedQuery = useDebounce(query, 300)

    // Search function
    const performSearch = useCallback(async (searchQuery: string) => {
        if (!searchQuery.trim()) {
            setSearchResults([])
            setShowResults(false)
            return
        }

        setIsSearching(true)
        try {
            const response = await ApiService.get<SearchProductDTO>(
                ENDPOINTS.PRODUCT.SEARCH(searchQuery.trim())
            )
            setSearchResults(response.metadata || [])
            setShowResults(true)
        } catch (error) {
            console.error('Search error:', error)
            setSearchResults([])
            setShowResults(false)
        } finally {
            setIsSearching(false)
        }
    }, [])

    // Effect for debounced search
    useEffect(() => {
        if (debouncedQuery) {
            performSearch(debouncedQuery)
        } else {
            setSearchResults([])
            setShowResults(false)
        }
    }, [debouncedQuery, performSearch])

    // Close search results when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowResults(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    const dispatch = useAppDispatch()

    const brands = useAppSelector((state) => state.brand.brands)
    const categories = useAppSelector((state) => state.category.categories)

    // nav link list is use random brand and category, 8 item (brands/categories) in total
    const [navLinks, setNavLinks] = useState<{ name: string; href: string }[]>([])

    useEffect(() => {
        const links: { name: string; href: string }[] = [];
        if (categories.length > 0) {
            // get random 4 categories
            const shuffledCategories = [...categories].sort(() => 0.5 - Math.random());
            const selectedCategories = shuffledCategories.slice(0, 4);
            selectedCategories.forEach((cat: any) => {
                if (cat && cat.category_name) {
                    links.push({ name: cat.category_name.toUpperCase(), href: `/products?category=${encodeURIComponent(cat._id)}` });
                }
            });
        }
        if (brands.length > 0) {
            // get random 4 brands
            const shuffledBrands = [...brands].sort(() => 0.5 - Math.random());
            const selectedBrands = shuffledBrands.slice(0, 4);
            selectedBrands.forEach((brand: any) => {
                if (brand && brand.brand_name) {
                    links.push({ name: brand.brand_name.toUpperCase(), href: `/products?brand=${encodeURIComponent(brand.brand_name)}` });
                }
            });
        }
        setNavLinks(links);
    }, [brands, categories]);


    // Get user authentication state from Redux
    const { userInfo, isLoggedIn } = useAppSelector((state) => state.user);
    const cartItemCount = useAppSelector((state) => state.cart.count);
    const carts = useAppSelector((state) => state.cart.cartItems);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && query.trim()) {
            navigate(`/products?q=${encodeURIComponent(query.trim())}`)
            setIsSearchOpen(false)
            setShowResults(false)
        }
        if (e.key === "Escape") {
            setShowResults(false)
        }
    }

    const handleSearch = () => {
        if (query.trim()) {
            navigate(`/products?q=${encodeURIComponent(query.trim())}`)
            setIsSearchOpen(false)
            setShowResults(false)
        }
    }

    const handleResultClick = (productId: string) => {
        navigate(`/product/${productId}`)
        setShowResults(false)
        setQuery("")
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount)
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

    useEffect(() => {
        if (isLoggedIn) {
            dispatch(initCart())
        }
    }, [isLoggedIn]);

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
                <div className="relative hidden sm:block w-120" ref={searchRef}>
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
                    {isSearching && (
                        <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 animate-spin z-10" />
                    )}
                    <Input
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value)
                            if (e.target.value.trim()) {
                                setShowResults(true)
                            }
                        }}
                        onKeyDown={handleKeyDown}
                        onFocus={() => {
                            if (query.trim() && searchResults.length > 0) {
                                setShowResults(true)
                            }
                        }}
                        placeholder="Tìm kiếm..."
                        className="pl-10 pr-10 w-full"
                    />

                    {/* Search Results Dropdown */}
                    {showResults && (query.trim() || searchResults.length > 0) && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                            {isSearching && (
                                <div className="p-4 text-center text-gray-500">
                                    <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2" />
                                    Đang tìm kiếm...
                                </div>
                            )}

                            {!isSearching && searchResults.length === 0 && query.trim() && (
                                <div className="p-4 text-center text-gray-500">
                                    Không tìm thấy sản phẩm nào
                                </div>
                            )}

                            {!isSearching && searchResults.length > 0 && (
                                <>
                                    <ScrollArea className="max-h-96">
                                        {searchResults.slice(0, 5).map((product) => (
                                            <div
                                                key={product._id}
                                                className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                                                onClick={() => handleResultClick(product._id)}
                                            >
                                                <img
                                                    src={product.product_thumb || "/placeholder.svg"}
                                                    alt={product.product_name}
                                                    className="w-12 h-12 object-cover rounded"
                                                    onError={(e) => {
                                                        e.currentTarget.src = "/placeholder.svg"
                                                    }}
                                                />
                                                <div className="ml-3 flex-1">
                                                    <h4 className="text-sm font-medium text-gray-900 line-clamp-1">
                                                        {product.product_name}
                                                    </h4>
                                                    <p className="text-sm text-gray-600">
                                                        {formatCurrency(product.product_price)}
                                                    </p>
                                                    {product.score && (
                                                        <p className="text-xs text-gray-400">
                                                            Độ phù hợp: {Math.round(product.score * 100)}%
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </ScrollArea>

                                    {query.trim() && (
                                        <div className="p-3 border-t border-gray-100">
                                            <button
                                                onClick={handleSearch}
                                                className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium"
                                            >
                                                Xem tất cả kết quả cho "{query}"
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )}
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
                                <div className="relative">
                                    <Input
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        placeholder="Tìm kiếm sản phẩm..."
                                        className="w-full"
                                    />
                                    {isSearching && (
                                        <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 animate-spin" />
                                    )}
                                </div>

                                {/* Mobile Search Results */}
                                {query.trim() && searchResults.length > 0 && (
                                    <ScrollArea className="max-h-60">
                                        <div className="space-y-2">
                                            {searchResults.slice(0, 3).map((product) => (
                                                <div
                                                    key={product._id}
                                                    className="flex items-center p-2 hover:bg-gray-50 cursor-pointer rounded"
                                                    onClick={() => {
                                                        handleResultClick(product._id)
                                                        setIsSearchOpen(false)
                                                    }}
                                                >
                                                    <img
                                                        src={product.product_thumb || "/placeholder.svg"}
                                                        alt={product.product_name}
                                                        className="w-10 h-10 object-cover rounded"
                                                        onError={(e) => {
                                                            e.currentTarget.src = "/placeholder.svg"
                                                        }}
                                                    />
                                                    <div className="ml-3 flex-1">
                                                        <h4 className="text-sm font-medium text-gray-900 line-clamp-1">
                                                            {product.product_name}
                                                        </h4>
                                                        <p className="text-xs text-gray-600">
                                                            {formatCurrency(product.product_price)}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </ScrollArea>
                                )}

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
                                        <DialogContent className="sm:max-w-sm w-full max-w-2xs">
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

            {/* Desktop Nav - Hide when on route cart, checkout, check-payment, order, orders.history and profile */}

            {["/cart", "/checkout", "/check-payment", "/orders/history", "/profile"].includes(location.pathname) ? null : (
                <nav className="hidden lg:flex items-center justify-center space-x-8 max-w-7xl mx-auto pt-4">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.href}
                            className="text-sm font-medium text-gray-700 hover:text-gray-900"
                        >
                            {link.name}
                        </Link>
                    ))}
                </nav>
            )}
        </header>

    )
}
