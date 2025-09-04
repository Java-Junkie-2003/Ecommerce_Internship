"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "react-router"
import { Search, Filter, Grid, List, ShoppingCart, RefreshCw, X, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import SiteHeader from "@/components/layout/client-header"
import SiteFooter from "@/components/layout/client-footer"
import { ApiService } from "@/lib/api"
import { ENDPOINTS } from "@/utils/api.endpoints"
import { FilteredProductDTO } from "@/types/dto/product.dto"
import { FilteredProduct } from "@/types/model/product"
import { Category } from "@/types/model/category"
import { Brand } from "@/types/model/brand"
import { toast } from "sonner"
import { useSelector } from "react-redux"
import { useAppSelector } from "@/redux/hook"

export default function FilterPage() {
    // Get URL search parameters
    const [searchParams, setSearchParams] = useSearchParams()

    // State for filters and data
    const [products, setProducts] = useState<FilteredProduct[]>([])

    const brands = useAppSelector(state => state.brand.brands)
    const categories = useAppSelector(state => state.category.categories)

    const [loading, setLoading] = useState(true)
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

    // Filter states - Initialize from URL params
    const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '')
    const [selectedBrand, setSelectedBrand] = useState(searchParams.get('brand') || '')
    const [minPrice, setMinPrice] = useState<number>(parseInt(searchParams.get('minPrice') || '0') || 0)
    const [maxPrice, setMaxPrice] = useState<number | null>(
        searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!) : null
    )
    const [sortBy, setSortBy] = useState(searchParams.get('sort') || '-ctime')
    const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1') || 1)

    // Pagination
    const [totalPages, setTotalPages] = useState(1)
    const [totalResults, setTotalResults] = useState(0)
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)

    // Form states for inputs - Initialize from URL params
    const [minPriceInput, setMinPriceInput] = useState(searchParams.get('minPrice') || '')
    const [maxPriceInput, setMaxPriceInput] = useState(searchParams.get('maxPrice') || '')

    // Fetch initial data
    useEffect(() => {
        fetchProducts()
    }, [])

    // Update state when URL params change (for browser navigation)
    useEffect(() => {
        const urlSearchQuery = searchParams.get('q') || ''
        const urlCategory = searchParams.get('category') || ''
        const urlBrand = searchParams.get('brand') || ''
        const urlMinPrice = parseInt(searchParams.get('minPrice') || '0') || 0
        const urlMaxPrice = searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!) : null
        const urlSort = searchParams.get('sort') || '-ctime'
        const urlPage = parseInt(searchParams.get('page') || '1') || 1

        // Update states if different from current values
        if (urlSearchQuery !== searchQuery) setSearchQuery(urlSearchQuery)
        if (urlCategory !== selectedCategory) setSelectedCategory(urlCategory)
        if (urlBrand !== selectedBrand) setSelectedBrand(urlBrand)
        if (urlMinPrice !== minPrice) setMinPrice(urlMinPrice)
        if (urlMaxPrice !== maxPrice) setMaxPrice(urlMaxPrice)
        if (urlSort !== sortBy) setSortBy(urlSort)
        if (urlPage !== currentPage) setCurrentPage(urlPage)

        // Update form inputs
        setMinPriceInput(searchParams.get('minPrice') || '')
        setMaxPriceInput(searchParams.get('maxPrice') || '')
    }, [searchParams.toString()]) // Use toString() to avoid dependency issues

    useEffect(() => {
        fetchProducts()
        updateUrlParams()
    }, [searchQuery, selectedCategory, selectedBrand, minPrice, maxPrice, sortBy, currentPage])

    const fetchProducts = async () => {
        try {
            setLoading(true)
            const endpoint = ENDPOINTS.PRODUCT.FILTER(
                searchQuery || undefined,
                selectedCategory || undefined,
                selectedBrand || undefined,
                maxPrice || undefined,
                minPrice > 0 ? minPrice : undefined,
                12, // limit
                searchQuery ? undefined : sortBy, // Disable sort when searching by key
                currentPage
            )

            const response = await ApiService.get<FilteredProductDTO>(endpoint)
            setProducts(response.metadata.products || [])
            setTotalPages(response.metadata.pagination.totalPages)
            setTotalResults(response.metadata.pagination.totalResult)
        } catch (error) {
            console.error('Failed to fetch products:', error)
            toast.error('Không thể tải sản phẩm')
            setProducts([])
        } finally {
            setLoading(false)
        }
    }

    // Function to update URL parameters
    const updateUrlParams = () => {
        const params = new URLSearchParams()

        if (searchQuery) params.set('q', searchQuery)
        if (selectedCategory) params.set('category', selectedCategory)
        if (selectedBrand) params.set('brand', selectedBrand)
        if (minPrice > 0) params.set('minPrice', minPrice.toString())
        if (maxPrice) params.set('maxPrice', maxPrice.toString())
        if (sortBy !== '-ctime') params.set('sort', sortBy)
        if (currentPage > 1) params.set('page', currentPage.toString())

        setSearchParams(params, { replace: true })
    }

    const handleCategoryChange = (value: string) => {
        setSelectedCategory(value === 'all' ? '' : value)
        setCurrentPage(1)
    }

    const handleBrandChange = (value: string) => {
        setSelectedBrand(value === 'all' ? '' : value)
        setCurrentPage(1)
    }

    const handlePriceFilter = () => {
        const min = parseInt(minPriceInput) || 0
        const max = parseInt(maxPriceInput) || null
        setMinPrice(min)
        setMaxPrice(max)
        setCurrentPage(1)
    }

    const handleRecommendedPriceRange = (min: number, max: number | null) => {
        setMinPrice(min)
        setMaxPrice(max)
        setMinPriceInput(min.toString())
        setMaxPriceInput(max ? max.toString() : '')
        setCurrentPage(1)
    }

    const handleSortChange = (value: string) => {
        setSortBy(value)
        setCurrentPage(1)
    }

    const clearFilters = () => {
        setSearchQuery('')
        setSelectedCategory('')
        setSelectedBrand('')
        setMinPrice(0)
        setMaxPrice(null)
        setMinPriceInput('')
        setMaxPriceInput('')
        setSortBy('-ctime')
        setCurrentPage(1)
        // Clear URL parameters
        setSearchParams({}, { replace: true })
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount)
    }

    const formatPrice = (amount: number) => {
        if (amount >= 1000000) {
            return `${(amount / 1000000).toFixed(amount % 1000000 === 0 ? 0 : 1)}M`
        }
        if (amount >= 1000) {
            return `${(amount / 1000).toFixed(amount % 1000 === 0 ? 0 : 1)}K`
        }
        return amount.toString()
    }

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <SiteHeader />

            <div className="container mx-auto px-4 py-8 max-w-7xl">
                {/* Search Results Header */}
                <div className="mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                {searchQuery ? (
                                    <>Kết quả tìm kiếm cho: <span className="text-black">"{searchQuery}"</span></>
                                ) : (
                                    "Tất cả sản phẩm"
                                )}
                            </h1>
                            <p className="text-gray-600">
                                {loading ? "Đang tải..." : `Tìm thấy ${totalResults} sản phẩm`}
                            </p>
                        </div>

                        {/* View Mode Toggle */}
                        <div className="flex border rounded-md">
                            <Button
                                variant={viewMode === "grid" ? "default" : "ghost"}
                                size="sm"
                                onClick={() => setViewMode("grid")}
                                className="rounded-r-none"
                            >
                                <Grid className="h-4 w-4" />
                            </Button>
                            <Button
                                variant={viewMode === "list" ? "default" : "ghost"}
                                size="sm"
                                onClick={() => setViewMode("list")}
                                className="rounded-l-none"
                            >
                                <List className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="text-lg">Bộ lọc sản phẩm</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Brand Filter */}
                        <div>
                            <span className="text-sm font-medium text-gray-700 block mb-2">Thương hiệu:</span>
                            <div className="flex flex-wrap gap-3">
                                <Button
                                    variant={selectedBrand === "" ? "default" : "outline"}
                                    className="flex items-center gap-2 px-4 py-2 h-auto"
                                    onClick={() => handleBrandChange("all")}
                                >
                                    Tất cả
                                </Button>
                                {brands.map((brand) => (
                                    <Button
                                        key={brand._id}
                                        variant={selectedBrand === brand.brand_name ? "default" : "outline"}
                                        className="flex items-center gap-2 px-4 py-2 h-auto"
                                        onClick={() => handleBrandChange(brand.brand_name)}
                                    >
                                        <img
                                            src={brand.brand_icon}
                                            alt={brand.brand_name}
                                            className="w-5 h-5 rounded-sm object-contain"
                                        />
                                        {brand.brand_name}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            {/* Category & Controls */}
                            <div className="flex flex-wrap items-center gap-3">
                                <span className="text-sm font-medium text-gray-700">Danh mục:</span>
                                <Select value={selectedCategory || "all"} onValueChange={handleCategoryChange}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Danh mục" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Tất cả danh mục</SelectItem>
                                        {categories.map((category) => (
                                            <SelectItem key={category._id} value={category._id}>
                                                {category.category_name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                                >
                                    <Filter className="h-4 w-4 mr-2" />
                                    Bộ lọc nâng cao
                                </Button>
                                {(searchQuery || selectedCategory || selectedBrand || minPrice > 0 || maxPrice !== null) && (
                                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                                        <X className="h-4 w-4 mr-2" />
                                        Xóa bộ lọc
                                    </Button>
                                )}
                            </div>
                            {/* Sort */}
                            <div>
                                {!searchQuery ? (
                                    <Select value={sortBy} onValueChange={handleSortChange}>
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Sắp xếp" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ctime">Mới nhất</SelectItem>
                                            <SelectItem value="-ctime">Cũ nhất</SelectItem>
                                            <SelectItem value="price">Giá thấp đến cao</SelectItem>
                                            <SelectItem value="-price">Giá cao đến thấp</SelectItem>
                                            <SelectItem value="name">Tên A-Z</SelectItem>
                                            <SelectItem value="-name">Tên Z-A</SelectItem>
                                        </SelectContent>
                                    </Select>
                                ) : (
                                    <div className="text-sm text-gray-500 italic">
                                        Sắp xếp tự động khi tìm kiếm
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Advanced Filters */}
                        {showAdvancedFilters && (
                            <div className="border-t pt-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <Label className="text-sm font-medium mb-3 block">Khoảng giá</Label>

                                        {/* Recommended Price Ranges */}
                                        <div className="mb-4">
                                            <span className="text-xs text-gray-500 mb-2 block">Gợi ý khoảng giá:</span>
                                            <div className="flex flex-wrap gap-2">
                                                <Badge
                                                    variant={(minPrice === 0 && maxPrice === 500000) ? "default" : "secondary"}
                                                    className="cursor-pointer"
                                                    onClick={() => handleRecommendedPriceRange(0, 500000)}
                                                >
                                                    Dưới 500K
                                                </Badge>
                                                <Badge
                                                    variant={(minPrice === 500000 && maxPrice === 1000000) ? "default" : "secondary"}
                                                    className="cursor-pointer"
                                                    onClick={() => handleRecommendedPriceRange(500000, 1000000)}
                                                >
                                                    500K - 1M
                                                </Badge>
                                                <Badge
                                                    variant={(minPrice === 1000000 && maxPrice === 2000000) ? "default" : "secondary"}
                                                    className="cursor-pointer"
                                                    onClick={() => handleRecommendedPriceRange(1000000, 2000000)}
                                                >
                                                    1M - 2M
                                                </Badge>
                                                <Badge
                                                    variant={(minPrice === 2000000 && maxPrice === 5000000) ? "default" : "secondary"}
                                                    className="cursor-pointer"
                                                    onClick={() => handleRecommendedPriceRange(2000000, 5000000)}
                                                >
                                                    2M - 5M
                                                </Badge>
                                                <Badge
                                                    variant={(minPrice === 5000000 && maxPrice === null) ? "default" : "secondary"}
                                                    className="cursor-pointer"
                                                    onClick={() => handleRecommendedPriceRange(5000000, null)}
                                                >
                                                    Trên 5M
                                                </Badge>
                                            </div>
                                        </div>

                                        {/* Custom Price Range */}
                                        <div>
                                            <span className="text-xs text-gray-500 mb-2 block">Hoặc nhập khoảng giá tùy chỉnh:</span>
                                            <div className="flex gap-2 items-center">
                                                <Input
                                                    placeholder="Giá tối thiểu"
                                                    type="number"
                                                    value={minPriceInput}
                                                    onChange={(e) => setMinPriceInput(e.target.value)}
                                                    className="w-32"
                                                />
                                                <span className="text-gray-500">-</span>
                                                <Input
                                                    placeholder="Giá tối đa"
                                                    type="number"
                                                    value={maxPriceInput}
                                                    onChange={(e) => setMaxPriceInput(e.target.value)}
                                                    className="w-32"
                                                />
                                                <Button onClick={handlePriceFilter} size="sm">
                                                    Áp dụng
                                                </Button>
                                            </div>
                                        </div>

                                        {(minPrice > 0 || maxPrice !== null) && (
                                            <div className="text-xs text-gray-500 mt-2">
                                                Hiện tại: {formatCurrency(minPrice)} - {maxPrice ? formatCurrency(maxPrice) : "Không giới hạn"}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Active Filters */}
                {(searchQuery || selectedCategory || selectedBrand || minPrice > 0 || maxPrice !== null) && (
                    <div className="mb-6">
                        <div className="flex flex-wrap gap-2 aligin-items-center">
                            <span className="text-sm text-gray-600">Bộ lọc đang áp dụng:</span>
                            {searchQuery && (
                                <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-md text-sm">
                                    <span>Từ khóa: {searchQuery}</span>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-4 w-4 p-0 hover:bg-gray-200"
                                        onClick={() => setSearchQuery('')}
                                    >
                                        <X className="h-3 w-3" />
                                    </Button>
                                </div>
                            )}
                            {selectedCategory && (
                                <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-md text-sm">
                                    <span>Danh mục: {categories.find(c => c._id === selectedCategory)?.category_name}</span>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-4 w-4 p-0 hover:bg-gray-200"
                                        onClick={() => setSelectedCategory('')}
                                    >
                                        <X className="h-3 w-3" />
                                    </Button>
                                </div>
                            )}
                            {selectedBrand && (
                                <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-md text-sm">
                                    <span>Thương hiệu: {selectedBrand}</span>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-4 w-4 p-0 hover:bg-gray-200"
                                        onClick={() => setSelectedBrand('')}
                                    >
                                        <X className="h-3 w-3" />
                                    </Button>
                                </div>
                            )}
                            {(minPrice > 0 || maxPrice !== null) && (
                                <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-md text-sm">
                                    <span>Giá: {formatCurrency(minPrice)} - {maxPrice ? formatCurrency(maxPrice) : 'Không giới hạn'}</span>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-4 w-4 p-0 hover:bg-gray-200"
                                        onClick={() => {
                                            setMinPrice(0)
                                            setMaxPrice(null)
                                            setMinPriceInput('')
                                            setMaxPriceInput('')
                                        }}
                                    >
                                        <X className="h-3 w-3" />
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="flex items-center justify-center py-12">
                        <RefreshCw className="h-8 w-8 animate-spin mr-2" />
                        <span className="text-lg">Đang tải sản phẩm...</span>
                    </div>
                )}

                {/* Products Grid */}
                {!loading && (
                    <div
                        className={`grid gap-6 ${viewMode === "grid"
                            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                            : "grid-cols-1"
                            }`}
                    >
                        {products.filter(product => product && product._id).map((product) => (
                            <Card key={product._id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                                <div className="relative">
                                    <div className="aspect-square overflow-hidden bg-gray-100">
                                        <img
                                            src={product.product_thumb || "/placeholder.svg"}
                                            alt={product.product_name || "Sản phẩm"}
                                            loading="lazy"
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            onError={(e) => {
                                                e.currentTarget.src = "/placeholder.svg"
                                            }}
                                        />
                                    </div>
                                    {product.score && (
                                        <div className="absolute top-3 left-3">
                                            <Badge className="bg-black text-white">
                                                Phù hợp: {Math.round(product.score * 100)}%
                                            </Badge>
                                        </div>
                                    )}
                                </div>

                                <CardContent className="p-4">
                                    <div className="mb-2">
                                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                                            <span>{product.product_brand?.brand_name || 'Không có thương hiệu'}</span>
                                            <span>•</span>
                                            <span>{product.product_categories[0]?.category_name || 'Không có danh mục'}</span>
                                        </div>
                                    </div>

                                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                                        {product.product_name || 'Tên sản phẩm không có'}
                                    </h3>

                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="text-lg font-bold text-gray-900">
                                            {product.product_price ? formatCurrency(product.product_price) : 'Giá không có'}
                                        </span>
                                    </div>

                                    <Button className="w-full bg-black hover:bg-gray-800" size="sm">
                                        <ShoppingCart className="h-4 w-4 mr-2" />
                                        Thêm vào giỏ
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!loading && products.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-gray-500 mb-4">
                            <Search className="h-16 w-16 mx-auto mb-4 opacity-50" />
                            <h3 className="text-xl font-semibold mb-2">Không tìm thấy sản phẩm</h3>
                            <p>Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
                        </div>
                        <Button onClick={clearFilters} variant="outline">
                            Xóa tất cả bộ lọc
                        </Button>
                    </div>
                )}

                {/* Pagination */}
                {!loading && products.length > 0 && totalPages > 1 && (
                    <div className="flex items-center justify-center mt-12">
                        <div className="flex items-center space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                <ChevronLeft className="h-4 w-4 mr-1" />
                                Trước
                            </Button>

                            <div className="flex items-center space-x-1">
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    let pageNumber
                                    if (totalPages <= 5) {
                                        pageNumber = i + 1
                                    } else if (currentPage <= 3) {
                                        pageNumber = i + 1
                                    } else if (currentPage >= totalPages - 2) {
                                        pageNumber = totalPages - 4 + i
                                    } else {
                                        pageNumber = currentPage - 2 + i
                                    }

                                    return (
                                        <Button
                                            key={pageNumber}
                                            variant={currentPage === pageNumber ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => handlePageChange(pageNumber)}
                                            className="w-8 h-8 p-0"
                                        >
                                            {pageNumber}
                                        </Button>
                                    )
                                })}
                            </div>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            >
                                Sau
                                <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                        </div>
                    </div>
                )}

                {/* Results Summary */}
                {!loading && products.length > 0 && (
                    <div className="text-center text-gray-500 text-sm mt-6">
                        Hiển thị {((currentPage - 1) * 12) + 1} - {Math.min(currentPage * 12, totalResults)} trong tổng số {totalResults} sản phẩm
                    </div>
                )}
            </div>

            {/* Footer */}
            <SiteFooter />
        </div>
    )
}
