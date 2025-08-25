"use client"

import { useState, useEffect, use } from "react"
import { Plus, Eye, Pencil, Trash2, ChevronLeft, ChevronRight, MoreHorizontal, Package, DollarSign, Tag, BookOpen, Palette, Ruler, Star, CheckCircle, XCircle, FileText, List, PlusCircle, Clock, Droplet, Calendar } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ApiService } from "@/lib/api"
import { GetAllProductAdminDTO, ProductDTO } from "@/types/dto/product.dto"
import { ENDPOINTS } from "@/utils/api.endpoints"
import { Product } from "@/types/model/product"
import ProductDetailSkeleton from "@/components/skeleton/dashboard/product-detail-dialog"
import TableSkeleton from "@/components/skeleton/dashboard/table"
import { cn } from "@/lib/utils"
import { useNavigate } from "react-router"


export default function Component() {

    const navigate = useNavigate()

    const [isLoading, setIsLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 5
    const [products, setProducts] = useState<Partial<Product>[]>([])
    const [totalPages, setTotalPages] = useState(0)

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setIsLoading(true);
                const response = await ApiService.get<GetAllProductAdminDTO>(
                    ENDPOINTS.ADMIN.PRODUCT.FETCH_ALL(currentPage, itemsPerPage)
                ).then(res => {
                    setProducts(res.metadata.products);
                    setTotalPages(res.metadata.pagination.totalPages);
                }).finally(() => {
                    setTimeout(() => {
                        setIsLoading(false);
                    }, 200);
                });
            } catch (error) {
                console.error('Failed to fetch products:', error);
                throw error;
            }
        };
        fetchProducts();
    }, [currentPage]);

    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
    const [isDetailModalLoading, setIsDetailModalLoading] = useState(false)

    const formatCurrency = (amount: number) => {
        const formatted = new Intl.NumberFormat("vi-VN").format(amount);
        return (
            <>
                <b>VND</b> {formatted} đ
            </>
        );
    };

    const getStatusBadge = (isDraft: boolean, isPublished: boolean) => {
        if (isDraft) {
            return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Bản nháp</Badge>
        }
        if (isPublished) {
            return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Đang mở bán</Badge>
        }
        return <Badge variant="secondary">Không xác định</Badge>
    }

    const CombineCategories = (categories: { category_name: string }[]) => {
        return categories.map(cat => cat.category_name).join(", ");
    }

    const handleViewDetails = async (product_id: string) => {
        try {
            setIsDetailModalLoading(true);
            const response = await ApiService.get<ProductDTO>(
                ENDPOINTS.PRODUCT.FETCH_ONE(product_id)
            );
            setSelectedProduct(response.metadata);
            setIsDetailModalOpen(true);
        } catch (error) {
            console.error('Failed to fetch product details:', error);
            setSelectedProduct(null);
            setIsDetailModalLoading(false);
        } finally {
            setTimeout(() => {
                setIsDetailModalLoading(false);
            }, 500);
        }
    }

    // Placeholder for actual edit/delete logic
    const handleEditProduct = (productId: string) => {
        navigate(`/dashboard/edit/product/${productId}`)
    }

    const handleDeleteProduct = (productId: string) => {
        if (confirm(`Bạn có chắc chắn muốn xóa sản phẩm ${productId} không?`)) {
            setProducts(products.filter((p) => p._id !== productId))
        }
    }

    const handlePublishProduct = async (productId: string) => {
        try {
            // Check isPublish & isDraft
            const product = products.find(p => p._id === productId);
            if (product) {
                if (product.isPublished) {
                    // Unpublish the product
                    await ApiService.post(ENDPOINTS.ADMIN.PRODUCT.UNPUBLISH(productId));
                } else {
                    // Publish the product
                    await ApiService.post(ENDPOINTS.ADMIN.PRODUCT.PUBLISH(productId));
                }
            }
        } catch (error) {
            console.error('Failed to publish product:', error)
        } finally {
            const updatedProducts = products.map((p) =>
                p._id === productId ? { ...p, isPublished: !p.isPublished, isDraft: !p.isDraft } : p
            );
            setProducts(updatedProducts);
        }
    }

    // --- Stats Calculation ---
    const totalProducts = 19
    const publishedProducts = 12
    const draftProducts = 7
    const newProductsThisMonth = 2;

    return (
        <div className="flex-1 space-y-6 p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Quản lý sản phẩm</h1>
                    <p className="text-muted-foreground">Tổng cộng {products.length} sản phẩm</p>
                </div>
                <Button onClick={() => navigate('/dashboard/create/product')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm sản phẩm mới
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="relative overflow-hidden rounded-2xl border border-gray-100 bg-gradient-to-br from-blue-50 to-white shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="absolute right-3 top-3 opacity-10 -rotate-12">
                        <Package className="h-20 w-20 text-blue-400" />
                    </div>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-700">Tổng sản phẩm</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">{totalProducts}</div>
                        <p className="text-xs text-gray-500">Sản phẩm trong kho</p>
                    </CardContent>
                </Card>

                <Card className="relative overflow-hidden rounded-2xl border border-gray-100 bg-gradient-to-br from-green-50 to-white shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="absolute right-3 top-3 opacity-10 rotate-12">
                        <CheckCircle className="h-20 w-20 text-green-400" />
                    </div>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-700">Đang mở bán</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">{publishedProducts}</div>
                        <p className="text-xs text-gray-500">Đang hiển thị trên cửa hàng</p>
                    </CardContent>
                </Card>

                <Card className="relative overflow-hidden rounded-2xl border border-gray-100 bg-gradient-to-br from-orange-50 to-white shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="absolute right-3 top-3 opacity-10 -rotate-12">
                        <FileText className="h-20 w-20 text-orange-400" />
                    </div>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-700">Bản nháp</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">{draftProducts}</div>
                        <p className="text-xs text-gray-500">Sản phẩm đang được chỉnh sửa</p>
                    </CardContent>
                </Card>

                <Card className="relative overflow-hidden rounded-2xl border border-gray-100 bg-gradient-to-br from-purple-50 to-white shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="absolute right-3 top-3 opacity-10 rotate-12">
                        <PlusCircle className="h-20 w-20 text-purple-400" />
                    </div>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-700">Sản phẩm mới</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">{newProductsThisMonth}</div>
                        <p className="text-xs text-gray-500">Được thêm trong tháng này</p>
                    </CardContent>
                </Card>
            </div>



            {/* Products Table */}
            <h2 className="text-xl font-semibold">Sản phẩm</h2>
            <div className="rounded-md border shadow-sm">
                {isLoading ? <TableSkeleton /> :
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Ảnh</TableHead>
                                <TableHead>Tên sản phẩm</TableHead>
                                {/* <TableHead>Loại</TableHead> */}
                                <TableHead>Giá</TableHead>
                                <TableHead>Thương hiệu</TableHead>
                                <TableHead>Danh mục</TableHead>
                                <TableHead>Trạng thái</TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products.map((product) => (
                                <TableRow key={product._id}>
                                    <TableCell>
                                        <img
                                            src={product.product_thumb || "/placeholder.svg"}
                                            alt={product.product_name}
                                            className="w-16 h-16 object-cover rounded-md"
                                        />
                                    </TableCell>
                                    <TableCell className="font-medium">{product.product_name}</TableCell>
                                    {/* <TableCell>{product.product_type}</TableCell> */}
                                    <TableCell className="font-medium">{formatCurrency(product.product_price || 0)}</TableCell>
                                    <TableCell>{product.product_brand?.brand_name || 'N/A'}</TableCell>
                                    <TableCell>{CombineCategories(product.product_categories || [])}</TableCell>
                                    <TableCell>{getStatusBadge(product.isDraft || false, product.isPublished || false)}</TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleViewDetails(product._id || '')} disabled={!product._id}>
                                                    <Eye className="h-4 w-4 mr-2" />
                                                    Xem chi tiết
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => product._id && handleEditProduct(product._id)}>
                                                    <Pencil className="h-4 w-4 mr-2" />
                                                    Chỉnh sửa
                                                </DropdownMenuItem>
                                                {/* <DropdownMenuItem onClick={() => product._id && handleDeleteProduct(product._id)} className="text-red-600">
                                                <Trash2 className="h-4 w-4 mr-2" />
                                                Xóa
                                            </DropdownMenuItem> */}

                                                <DropdownMenuItem onClick={() => product._id && handlePublishProduct(product._id)}
                                                    className={cn(product.isDraft && !product.isPublished ? "text-green-600" : "text-gray-600")}>
                                                    {
                                                        product.isDraft && !product.isPublished ?
                                                            (
                                                                <>
                                                                    <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                                                                    Mở bán
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <XCircle className="h-4 w-4 mr-2 text-red-600" />
                                                                    Ngừng bán
                                                                </>
                                                            )
                                                    }
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                    Trang {currentPage} / {totalPages} - Hiển thị {products.length} sản phẩm
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
                        {isDetailModalLoading ? (
                            <ProductDetailSkeleton />
                        ) : (
                            <>
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
                                            <div className="flex items-center gap-2 w-1/2">
                                                <Star className="h-4 w-4 text-yellow-500" />
                                                <span className="text-sm">{selectedProduct.product_ratingAverage} / 5.0</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-4 text-sm">
                                        <div className="space-y-2 flex flex-row flex-1/2 flex-wrap relative">
                                            <p className="flex items-center gap-2 w-1/2">
                                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                                                Giá: <span className="font-semibold">{formatCurrency(selectedProduct.product_price)}</span>
                                            </p>
                                            <p className="flex items-center gap-2 w-1/2">
                                                <Tag className="h-4 w-4 text-muted-foreground" />
                                                Thương hiệu: <span className="font-semibold">{selectedProduct.product_brand.brand_name}</span>
                                            </p>
                                            <p className="flex items-center gap-2 w-1/2">
                                                <BookOpen className="h-4 w-4 text-muted-foreground" />
                                                Danh mục: <span className="font-semibold">{CombineCategories(selectedProduct.product_categories)}</span>
                                            </p>
                                            <p className="flex items-center gap-2 w-1/2">
                                                <Package className="h-4 w-4 text-muted-foreground" />
                                                Trạng thái: {getStatusBadge(selectedProduct.isDraft || false, selectedProduct.isPublished || false)}
                                            </p>
                                        </div>
                                        <Separator />
                                        <h4 className="font-semibold">Thuộc tính</h4>
                                        <div className="space-y-2 flex flex-row flex-1/2 flex-wrap relative text-sm">
                                            <p className="flex items-center gap-2 w-1/2">
                                                <Ruler className="h-4 w-4 text-muted-foreground" />
                                                Dung tích: <span className="font-semibold">{selectedProduct.product_attributes.volume}</span>
                                            </p>
                                            <p className="flex items-center gap-2 w-1/2">
                                                <Palette className="h-4 w-4 text-muted-foreground" />
                                                Giới tính: <span className="font-semibold">{selectedProduct.product_attributes.gender}</span>
                                            </p>
                                            <p className="flex items-center gap-2 w-1/2">
                                                <List className="h-4 w-4 text-muted-foreground" />
                                                Hương:{" "}
                                                <span className="font-semibold">
                                                    {selectedProduct.product_attributes.base_note} / {selectedProduct.product_attributes.top_note}
                                                </span>
                                            </p>
                                            <p className="flex items-center gap-2 w-1/2">
                                                <Clock className="h-4 w-4 text-muted-foreground" />
                                                Thời gian lưu hương: <span className="font-semibold">{selectedProduct.product_attributes.longevity_hours}</span>
                                            </p>
                                            <p className="flex items-center gap-2 w-1/2">
                                                <Droplet className="h-4 w-4 text-muted-foreground" />
                                                Độ tỏa hương: <span className="font-semibold">{selectedProduct.product_attributes.sillage}</span>
                                            </p>
                                            <p className="flex items-center gap-2 w-1/2">
                                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                                Năm phát hành: <span className="font-semibold">{selectedProduct.product_attributes.launch_year}</span>
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
                                    <Button variant="outline" onClick={() => handleEditProduct(selectedProduct._id)}>
                                        <Pencil className="h-4 w-4 mr-2" /> Chỉnh sửa
                                    </Button>
                                    {/* <Button variant="destructive" onClick={() => handleDeleteProduct(selectedProduct._id)}>
                                        <Trash2 className="h-4 w-4 mr-2" /> Xóa
                                    </Button> */}
                                    <Button variant="translucent" color={
                                        products.find(p => p._id === selectedProduct._id)?.isDraft && !products.find(p => p._id === selectedProduct._id)?.isPublished ? "green" : "red"
                                    } onClick={() => handlePublishProduct(selectedProduct._id)}>
                                        {
                                            products.find(p => p._id === selectedProduct._id)?.isDraft && !products.find(p => p._id === selectedProduct._id)?.isPublished ? (
                                                <>
                                                    <CheckCircle className="h-4 w-4 mr-2" /> Mở bán
                                                </>
                                            ) : (
                                                <>
                                                    <XCircle className="h-4 w-4 mr-2" /> Ngừng bán
                                                </>
                                            )
                                        }
                                    </Button>
                                </div>
                            </>
                        )}
                    </DialogContent>
                </Dialog>
            )}
        </div>
    )
}
