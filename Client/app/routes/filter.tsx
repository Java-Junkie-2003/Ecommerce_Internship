"use client"

import { useState } from "react"
import { Search, Filter, Grid, List, ShoppingCart, Heart, Star } from "lucide-react"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Card, CardContent } from "~/components/ui/card"
import { Badge } from "~/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import SiteHeader from "~/components/layout/client-header"
import SiteFooter from "~/components/layout/client-footer"

const products = Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    name: "A Luxury Perfume Era",
    price: 2000000,
    originalPrice: 2500000,
    image: "/images/perfumes/irish-leather-eau-de-parfum-781.jpg",
    rating: 4.8,
    reviews: 124,
    isNew: i < 2,
    isSale: i % 3 === 0,
}))

export default function Component() {
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
    const [searchQuery, setSearchQuery] = useState("Nước hoa pháp")

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <SiteHeader />

            <div className="container mx-auto px-4 py-8 max-w-7xl">
                {/* Search Results Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Kết quả tìm kiếm cho từ khóa: <span className="text-blue-600">"{searchQuery}"</span>
                    </h1>
                    <p className="text-gray-600">Tìm thấy {products.length} sản phẩm</p>
                </div>

                {/* Filters and Controls */}
                <div className="bg-white rounded-lg border p-4 mb-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="text-sm font-medium text-gray-700">Lọc theo:</span>
                            <Select defaultValue="all">
                                <SelectTrigger className="w-[140px]">
                                    <SelectValue placeholder="Danh mục" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tất cả</SelectItem>
                                    <SelectItem value="men">Nam</SelectItem>
                                    <SelectItem value="women">Nữ</SelectItem>
                                    <SelectItem value="unisex">Unisex</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select defaultValue="all">
                                <SelectTrigger className="w-[140px]">
                                    <SelectValue placeholder="Thương hiệu" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tất cả</SelectItem>
                                    <SelectItem value="chanel">Chanel</SelectItem>
                                    <SelectItem value="dior">Dior</SelectItem>
                                    <SelectItem value="gucci">Gucci</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select defaultValue="all">
                                <SelectTrigger className="w-[140px]">
                                    <SelectValue placeholder="Giá tiền" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tất cả</SelectItem>
                                    <SelectItem value="under-1m">Dưới 1 triệu</SelectItem>
                                    <SelectItem value="1m-3m">1-3 triệu</SelectItem>
                                    <SelectItem value="over-3m">Trên 3 triệu</SelectItem>
                                </SelectContent>
                            </Select>

                            <Button variant="outline" size="sm">
                                <Filter className="h-4 w-4 mr-2" />
                                Bộ lọc nâng cao
                            </Button>
                        </div>

                        <div className="flex items-center gap-3">
                            <Select defaultValue="newest">
                                <SelectTrigger className="w-[140px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="newest">Mới nhất</SelectItem>
                                    <SelectItem value="price-low">Giá thấp đến cao</SelectItem>
                                    <SelectItem value="price-high">Giá cao đến thấp</SelectItem>
                                    <SelectItem value="popular">Phổ biến nhất</SelectItem>
                                </SelectContent>
                            </Select>

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
                </div>

                {/* Products Grid */}
                <div
                    className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
                        }`}
                >
                    {products.map((product) => (
                        <Card key={product.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                            <div className="relative">
                                <div className="aspect-square overflow-hidden bg-gray-100">
                                    <img
                                        src={product?.image ?? "/placeholder.svg"}
                                        alt={product?.name ?? "Product image"}
                                        loading="lazy"
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />

                                </div>
                                {/* <div className="absolute top-3 left-3 flex flex-col gap-2">
                                    {product.isNew && <Badge className="bg-green-500 hover:bg-green-600">Mới</Badge>}
                                    {product.isSale && <Badge className="bg-red-500 hover:bg-red-600">Giảm giá</Badge>}
                                </div> */}
                                {/* <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute top-3 right-3 bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Heart className="h-4 w-4" />
                                </Button> */}
                            </div>

                            <CardContent className="p-4">
                                {/* <div className="flex items-center gap-1 mb-2">
                                    <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`h-3 w-3 ${i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-xs text-gray-500">({product.reviews})</span>
                                </div> */}

                                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>

                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-lg font-bold text-gray-900">{product.price.toLocaleString("vi-VN")} đ</span>
                                    {/* {product.isSale && (
                                        <span className="text-sm text-gray-500 line-through">
                                            {product.originalPrice.toLocaleString("vi-VN")} đ
                                        </span>
                                    )} */}
                                </div>

                                <Button className="w-full" size="sm">
                                    <ShoppingCart className="h-4 w-4 mr-2" />
                                    Thêm vào giỏ
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Load More */}
                <div className="text-center mt-12">
                    <Button variant="outline" size="lg">
                        Xem thêm sản phẩm
                    </Button>
                </div>
            </div>

            {/* Footer */}
            <SiteFooter />
        </div>
    )
}
