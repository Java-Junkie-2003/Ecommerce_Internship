"use client"

import { useState } from "react"
import { Plus, Eye, Pencil, Trash2, ChevronLeft, ChevronRight, MoreHorizontal, Package, DollarSign, Tag, BookOpen, Palette, Ruler, Star, CheckCircle, XCircle, FileText, List } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface ProductAttributes {
    volume: string
    gender: string
    notes: string[]
}

interface Product {
    id: string // Added ID for unique identification
    product_name: string
    product_thumb: string
    product_description: string
    product_price: string
    product_type: string
    product_attributes: ProductAttributes
    product_ratingAverage: number
    product_brand: string // This would typically be an ID linked to a Brands table
    category_id: string // This would typically be an ID linked to a Categories table
    isDraft: boolean
    isPublished: boolean
}

const mockProducts: Product[] = [
    {
        "id": "1",
        "product_name": "Eternal Bloom",
        "product_thumb": "/images/perfumes/img__77884.png",
        "product_description": "A floral fragrance that captures the essence of springtime romance.",
        "product_price": "1500000",
        "product_type": "eau de parfum",
        "product_attributes": {
            "volume": "50ml",
            "gender": "male",
            "notes": ["rose", "jasmine", "vanilla"]
        },
        "product_ratingAverage": 3.8,
        "product_brand": "64d9f5b16a77e5b8f1e57a10",
        "category_id": "64d9f5b16a77e5b8f1e57b20",
        "isDraft": false,
        "isPublished": true
    },
    {
        "id": "2",
        "product_name": "Midnight Leather",
        "product_thumb": "/images/perfumes/img__77885.png",
        "product_description": "A bold and mysterious scent with leathery and smoky undertones.",
        "product_price": "1550000",
        "product_type": "eau de toilette",
        "product_attributes": {
            "volume": "55ml",
            "gender": "female",
            "notes": ["leather", "amber", "smoke"]
        },
        "product_ratingAverage": 4.0,
        "product_brand": "64d9f5b16a77e5b8f1e57a11",
        "category_id": "64d9f5b16a77e5b8f1e57b21",
        "isDraft": false,
        "isPublished": true
    },
    {
        "id": "3",
        "product_name": "Citrus Wave",
        "product_thumb": "/images/perfumes/img__77886.png",
        "product_description": "A refreshing burst of citrus perfect for summer days.",
        "product_price": "1600000",
        "product_type": "body mist",
        "product_attributes": {
            "volume": "60ml",
            "gender": "unisex",
            "notes": ["lemon", "bergamot", "mint"]
        },
        "product_ratingAverage": 4.2,
        "product_brand": "64d9f5b16a77e5b8f1e57a12",
        "category_id": "64d9f5b16a77e5b8f1e57b22",
        "isDraft": false,
        "isPublished": true
    },
    {
        "id": "4",
        "product_name": "Ocean Breeze",
        "product_thumb": "/images/perfumes/img__77887.png",
        "product_description": "Cool aquatic scent for a crisp and clean feeling.",
        "product_price": "1650000",
        "product_type": "eau de parfum",
        "product_attributes": {
            "volume": "65ml",
            "gender": "male",
            "notes": ["marine", "cedar", "grapefruit"]
        },
        "product_ratingAverage": 4.4,
        "product_brand": "64d9f5b16a77e5b8f1e57a13",
        "category_id": "64d9f5b16a77e5b8f1e57b23",
        "isDraft": false,
        "isPublished": true
    },
    {
        "id": "5",
        "product_name": "Amber Nights",
        "product_thumb": "/images/perfumes/img__77888.png",
        "product_description": "Warm and spicy blend that lingers into the night.",
        "product_price": "1700000",
        "product_type": "eau de toilette",
        "product_attributes": {
            "volume": "70ml",
            "gender": "female",
            "notes": ["amber", "vanilla", "patchouli"]
        },
        "product_ratingAverage": 4.6,
        "product_brand": "64d9f5b16a77e5b8f1e57a10",
        "category_id": "64d9f5b16a77e5b8f1e57b20",
        "isDraft": false,
        "isPublished": true
    },
    {
        "id": "6",
        "product_name": "Velvet Musk",
        "product_thumb": "/images/perfumes/img__77889.png",
        "product_description": "Soft musk base with creamy florals.",
        "product_price": "1750000",
        "product_type": "body mist",
        "product_attributes": {
            "volume": "75ml",
            "gender": "unisex",
            "notes": ["musk", "iris", "sandalwood"]
        },
        "product_ratingAverage": 3.8,
        "product_brand": "64d9f5b16a77e5b8f1e57a11",
        "category_id": "64d9f5b16a77e5b8f1e57b21",
        "isDraft": false,
        "isPublished": true
    },
    {
        "id": "7",
        "product_name": "Green Escape",
        "product_thumb": "/images/perfumes/img__77890.png",
        "product_description": "Earthy and natural scent that brings nature closer.",
        "product_price": "1800000",
        "product_type": "eau de parfum",
        "product_attributes": {
            "volume": "80ml",
            "gender": "female",
            "notes": ["oakmoss", "basil", "lime"]
        },
        "product_ratingAverage": 4.0,
        "product_brand": "64d9f5b16a77e5b8f1e57a12",
        "category_id": "64d9f5b16a77e5b8f1e57b22",
        "isDraft": false,
        "isPublished": true
    },
    {
        "id": "8",
        "product_name": "Golden Hour",
        "product_thumb": "/images/perfumes/img__77891.png",
        "product_description": "Radiant blend for perfect sunset vibes.",
        "product_price": "1850000",
        "product_type": "eau de toilette",
        "product_attributes": {
            "volume": "85ml",
            "gender": "male",
            "notes": ["peach", "orange blossom", "saffron"]
        },
        "product_ratingAverage": 4.2,
        "product_brand": "64d9f5b16a77e5b8f1e57a13",
        "category_id": "64d9f5b16a77e5b8f1e57b23",
        "isDraft": false,
        "isPublished": true
    },
    {
        "id": "9",
        "product_name": "Frosted Mint",
        "product_thumb": "/images/perfumes/img__77892.png",
        "product_description": "Cool minty fragrance for a fresh start.",
        "product_price": "1900000",
        "product_type": "eau de parfum",
        "product_attributes": {
            "volume": "90ml",
            "gender": "female",
            "notes": ["mint", "eucalyptus", "ice accord"]
        },
        "product_ratingAverage": 4.4,
        "product_brand": "64d9f5b16a77e5b8f1e57a10",
        "category_id": "64d9f5b16a77e5b8f1e57b20",
        "isDraft": false,
        "isPublished": true
    },
    {
        "id": "10",
        "product_name": "Rosewood",
        "product_thumb": "/images/perfumes/img__77893.png",
        "product_description": "Elegant and woody floral for special occasions.",
        "product_price": "1950000",
        "product_type": "body mist",
        "product_attributes": {
            "volume": "95ml",
            "gender": "unisex",
            "notes": ["rosewood", "peony", "white musk"]
        },
        "product_ratingAverage": 4.6,
        "product_brand": "64d9f5b16a77e5b8f1e57a11",
        "category_id": "64d9f5b16a77e5b8f1e57b21",
        "isDraft": false,
        "isPublished": true
    }
];


export default function Component() {
    const [products, setProducts] = useState<Product[]>(mockProducts)
    const [currentPage, setCurrentPage] = useState(1)
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
    const itemsPerPage = 5

    const totalPages = Math.ceil(products.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const paginatedProducts = products.slice(startIndex, startIndex + itemsPerPage)

    const formatCurrency = (amount: string) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(parseFloat(amount)).replace("₫", "đ") // Replace default currency symbol
    }

    const getStatusBadge = (isDraft: boolean, isPublished: boolean) => {
        if (isDraft) {
            return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Bản nháp</Badge>
        }
        if (isPublished) {
            return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Đang mở bán</Badge>
        }
        return <Badge variant="secondary">Không xác định</Badge>
    }

    const getGenderBadge = (gender: string) => {
        switch (gender) {
            case "male":
                return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Nam</Badge>
            case "female":
                return <Badge className="bg-pink-100 text-pink-800 hover:bg-pink-100">Nữ</Badge>
            case "unisex":
                return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Unisex</Badge>
            default:
                return <Badge variant="secondary">Không xác định</Badge>
        }
    }

    const handleViewDetails = (product: Product) => {
        setSelectedProduct(product)
        setIsDetailModalOpen(true)
    }

    // Placeholder for actual edit/delete logic
    const handleEditProduct = (productId: string) => {
        alert(`Chỉnh sửa sản phẩm với ID: ${productId}`)
        // In a real app, navigate to the product edit page or open an edit modal
    }

    const handleDeleteProduct = (productId: string) => {
        if (confirm(`Bạn có chắc chắn muốn xóa sản phẩm ${productId} không?`)) {
            setProducts(products.filter((p) => p.id !== productId))
        }
    }

    // --- Stats Calculation ---
    const totalProducts = products.length
    const publishedProducts = products.filter(p => p.isPublished && !p.isDraft).length
    const draftProducts = products.filter(p => p.isDraft).length
    const totalProductValue = products.reduce((sum, p) => sum + parseFloat(p.product_price), 0)
    const averageRating = products.length > 0
        ? (products.reduce((sum, p) => sum + p.product_ratingAverage, 0) / products.length).toFixed(1)
        : "N/A"


    return (
        <div className="flex-1 space-y-6 p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Quản lý sản phẩm</h1>
                    <p className="text-muted-foreground">Tổng cộng {products.length} sản phẩm</p>
                </div>
                <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm sản phẩm mới
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tổng sản phẩm</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalProducts}</div>
                        <p className="text-xs text-muted-foreground">Sản phẩm trong kho</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Đang mở bán</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{publishedProducts}</div>
                        <p className="text-xs text-muted-foreground">Đang hiển thị trên cửa hàng</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Bản nháp</CardTitle>
                        <FileText className="h-4 w-4 text-orange-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{draftProducts}</div>
                        <p className="text-xs text-muted-foreground">Sản phẩm đang được chỉnh sửa</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Giá trị tổng cộng</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(totalProductValue.toFixed(2))}</div>
                        <p className="text-xs text-muted-foreground">Tổng giá trị sản phẩm</p>
                    </CardContent>
                </Card>
            </div>


            {/* Products Table */}
            <h2 className="text-xl font-semibold">Sản phẩm</h2>
            <div className="rounded-md border shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Ảnh</TableHead>
                            <TableHead>Tên sản phẩm</TableHead>
                            <TableHead>Loại</TableHead>
                            <TableHead>Giá</TableHead>
                            <TableHead>Thương hiệu</TableHead>
                            <TableHead>Danh mục</TableHead>
                            <TableHead>Trạng thái</TableHead>
                            <TableHead className="w-[50px]"></TableHead> {/* For actions */}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedProducts.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell>
                                    <img
                                        src={product.product_thumb || "/placeholder.svg"}
                                        alt={product.product_name}
                                        className="w-16 h-16 object-cover rounded-md"
                                    />
                                </TableCell>
                                <TableCell className="font-medium">{product.product_name}</TableCell>
                                <TableCell>{product.product_type}</TableCell>
                                <TableCell className="font-medium">{formatCurrency(product.product_price)}</TableCell>
                                <TableCell>{product.product_brand}</TableCell>
                                <TableCell>{product.category_id}</TableCell>
                                <TableCell>{getStatusBadge(product.isDraft, product.isPublished)}</TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => handleViewDetails(product)}>
                                                <Eye className="h-4 w-4 mr-2" />
                                                Xem chi tiết
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleEditProduct(product.id)}>
                                                <Pencil className="h-4 w-4 mr-2" />
                                                Chỉnh sửa
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleDeleteProduct(product.id)} className="text-red-600">
                                                <Trash2 className="h-4 w-4 mr-2" />
                                                Xóa
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                    Trang {currentPage} / {totalPages} - Hiển thị {paginatedProducts.length} sản phẩm
                </div>

                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
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
                                    onClick={() => setCurrentPage(pageNumber)}
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
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                    >
                        Sau
                        <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                </div>
            </div>

            {/* Product Detail Modal */}
            {selectedProduct && (
                <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>Chi tiết sản phẩm: {selectedProduct.product_name}</DialogTitle>
                            <DialogDescription>Thông tin chi tiết về sản phẩm này.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="flex items-center gap-4">

                                <img
                                    src={selectedProduct.product_thumb || "/placeholder.svg"}
                                    alt={selectedProduct.product_name}
                                    className="w-24 h-24 object-cover rounded-md"
                                />

                                <div className="space-y-1">
                                    <h3 className="text-xl font-bold">{selectedProduct.product_name}</h3>
                                    <p className="text-muted-foreground">{selectedProduct.product_type}</p>
                                    <div className="flex items-center gap-2">
                                        <Star className="h-4 w-4 text-yellow-500" />
                                        <span className="text-sm">{selectedProduct.product_ratingAverage} / 5.0</span>
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="space-y-2">
                                    <p className="flex items-center gap-2">
                                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                                        Giá: <span className="font-semibold">{formatCurrency(selectedProduct.product_price)}</span>
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <Tag className="h-4 w-4 text-muted-foreground" />
                                        Thương hiệu: <span className="font-semibold">N\A</span>
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                                        Danh mục: <span className="font-semibold">N\A</span>
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <Package className="h-4 w-4 text-muted-foreground" />
                                        Trạng thái: {getStatusBadge(selectedProduct.isDraft, selectedProduct.isPublished)}
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <p className="flex items-center gap-2">
                                        <Ruler className="h-4 w-4 text-muted-foreground" />
                                        Dung tích: <span className="font-semibold">{selectedProduct.product_attributes.volume}</span>
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <Palette className="h-4 w-4 text-muted-foreground" />
                                        Giới tính: <span className="font-semibold">{selectedProduct.product_attributes.gender}</span>
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <List className="h-4 w-4 text-muted-foreground" />
                                        Hương:{" "}
                                        <span className="font-semibold">
                                            {selectedProduct.product_attributes.notes.join(", ")}
                                        </span>
                                    </p>
                                </div>
                            </div>

                            <Separator />

                            <div>
                                <h4 className="font-semibold mb-2">Mô tả sản phẩm</h4>
                                <p className="text-sm text-muted-foreground">{selectedProduct.product_description}</p>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => handleEditProduct(selectedProduct.id)}>
                                <Pencil className="h-4 w-4 mr-2" /> Chỉnh sửa
                            </Button>
                            <Button variant="destructive" onClick={() => handleDeleteProduct(selectedProduct.id)}>
                                <Trash2 className="h-4 w-4 mr-2" /> Xóa
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    )
}
