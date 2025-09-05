"use client"

import { useState, useEffect } from "react"
import { 
  Eye, 
  ChevronLeft, 
  ChevronRight, 
  MoreHorizontal, 
  Package, 
  DollarSign, 
  MapPin, 
  Calendar, 
  CreditCard,
  User,
  RefreshCw,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  Edit
} from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ApiService } from "@/lib/api"
import { OrderDTO } from "@/types/dto/order.dto"
import { ProductDTO } from "@/types/dto/product.dto"
import { ENDPOINTS } from "@/utils/api.endpoints"
import { Order, OrderStatus, PaymentStatus } from "@/types/model/order"
import { Product } from "@/types/model/product"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import type { Route } from "../+types/root"

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Quản lý đơn hàng" },
    { name: "description", content: "Quản lý và theo dõi tất cả đơn hàng" },
  ];
}

export default function AdminOrdersPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [orders, setOrders] = useState<Order[]>([])
  const [pagination, setPagination] = useState<any>(null)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [orderProducts, setOrderProducts] = useState<Product[]>([])
  const [isLoadingProducts, setIsLoadingProducts] = useState(false)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)

  useEffect(() => {
    fetchOrders(currentPage)
  }, [currentPage])

  const fetchOrders = async (page: number) => {
    try {
      setIsLoading(true)
      const response = await ApiService.get<OrderDTO>(ENDPOINTS.ADMIN.ORDER.FETCH_ALL(page))
      if (response.statusCode === 200) {
        setOrders(response.metadata.orders || [])
        setPagination(response.metadata.pagination)
      }
    } catch (error) {
      console.error("Error fetching orders:", error)
      toast.error("Không thể tải danh sách đơn hàng")
      setOrders([])
    } finally {
      setIsLoading(false)
    }
  }

  const fetchProductDetails = async (order: Order) => {
    setIsLoadingProducts(true)
    try {
      const productPromises = order.order_products.map(async (orderProduct) => {
        try {
          const response = await ApiService.get<ProductDTO>(ENDPOINTS.PRODUCT.FETCH_ONE(orderProduct.productId))
          if (response.statusCode === 200) {
            return response.metadata
          }
          return null
        } catch (error) {
          console.error(`Error fetching product ${orderProduct.productId}:`, error)
          return null
        }
      })

      const fetchedProducts = await Promise.all(productPromises)
      const validProducts = fetchedProducts.filter((product): product is Product => product !== null)
      setOrderProducts(validProducts)
    } catch (error) {
      console.error("Error fetching product details:", error)
      setOrderProducts([])
    } finally {
      setIsLoadingProducts(false)
    }
  }

  const handleViewDetails = async (order: Order) => {
    setSelectedOrder(order)
    setIsDetailModalOpen(true)
    setOrderProducts([])
    await fetchProductDetails(order)
  }

  const handleCloseModal = (open: boolean) => {
    setIsDetailModalOpen(open)
    if (!open) {
      setSelectedOrder(null)
      setOrderProducts([])
      setIsLoadingProducts(false)
    }
  }

  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      setIsUpdatingStatus(true)
      // This endpoint will be implemented later
      // const response = await ApiService.put(ENDPOINTS.ADMIN.ORDER.UPDATE_STATUS(orderId), {
      //   order_status: newStatus
      // })
      
      // For now, just update the local state
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order._id === orderId 
            ? { ...order, order_status: newStatus }
            : order
        )
      )
      
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder(prev => prev ? { ...prev, order_status: newStatus } : null)
      }
      
      toast.success("Cập nhật trạng thái đơn hàng thành công")
    } catch (error) {
      console.error("Error updating order status:", error)
      toast.error("Không thể cập nhật trạng thái đơn hàng")
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    })
      .format(amount)
      .replace("₫", "đ")
  }

  const getOrderStatusBadge = (status: OrderStatus) => {
    const statusConfig = {
      [OrderStatus.PENDING]: { 
        label: "Chờ xác nhận", 
        className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
        icon: <Clock className="h-3 w-3" />
      },
      [OrderStatus.DELIVERING]: { 
        label: "Đang giao hàng", 
        className: "bg-gray-100 text-gray-800 hover:bg-gray-100",
        icon: <Truck className="h-3 w-3" />
      },
      [OrderStatus.DELIVERIED]: { 
        label: "Đã giao hàng", 
        className: "bg-green-100 text-green-800 hover:bg-green-100",
        icon: <CheckCircle className="h-3 w-3" />
      },
      [OrderStatus.CANCELED]: { 
        label: "Đã hủy", 
        className: "bg-red-100 text-red-800 hover:bg-red-100",
        icon: <XCircle className="h-3 w-3" />
      },
    }

    const config = statusConfig[status]
    return (
      <Badge className={`${config.className} flex items-center gap-1`}>
        {config.icon}
        {config.label}
      </Badge>
    )
  }

  const getPaymentStatusBadge = (status: PaymentStatus) => {
    const statusConfig = {
      [PaymentStatus.PENDING]: { 
        label: "Chưa thanh toán", 
        className: "bg-orange-100 text-orange-800 hover:bg-orange-100"
      },
      [PaymentStatus.PAID]: { 
        label: "Đã thanh toán", 
        className: "bg-green-100 text-green-800 hover:bg-green-100"
      },
    }

    const config = statusConfig[status]
    return <Badge className={config.className}>{config.label}</Badge>
  }

  if (isLoading && orders.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Quản lý đơn hàng</h1>
            <p className="text-gray-600">Quản lý và theo dõi tất cả đơn hàng</p>
          </div>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 animate-spin text-gray-500 mx-auto mb-4" />
              <p className="text-gray-600">Đang tải danh sách đơn hàng...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quản lý đơn hàng</h1>
          <p className="text-gray-600">Quản lý và theo dõi tất cả đơn hàng</p>
        </div>
        <Button 
          onClick={() => fetchOrders(currentPage)}
          variant="outline"
          disabled={isLoading}
        >
          <RefreshCw className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")} />
          Làm mới
        </Button>
      </div>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Danh sách đơn hàng
            {pagination && (
              <span className="text-sm font-normal text-gray-600">
                (Tổng: {pagination.totalOrders} đơn hàng)
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Chưa có đơn hàng nào</h3>
              <p className="text-gray-600">Chưa có đơn hàng nào được tạo.</p>
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mã đơn hàng</TableHead>
                      <TableHead>Khách hàng</TableHead>
                      <TableHead>Ngày đặt</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Thanh toán</TableHead>
                      <TableHead>Tổng tiền</TableHead>
                      <TableHead className="text-right">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order._id}>
                        <TableCell className="font-mono text-sm">
                          #{order._id.slice(-8)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-gray-500" />
                            <span>{order.order_userId.slice(-8)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">{formatDate(order.createdAt)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            {getOrderStatusBadge(order.order_status)}
                            {getPaymentStatusBadge(order.payment_status)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">{order.order_payment}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold">
                          {formatCurrency(order.order_checkout.totalCheckout)}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewDetails(order)}>
                                <Eye className="h-4 w-4 mr-2" />
                                Xem chi tiết
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Cập nhật trạng thái
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-gray-600">
                    Trang {pagination.page} / {pagination.totalPages} 
                    ({pagination.totalOrders} đơn hàng)
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!pagination.hasPrev}
                      onClick={() => setCurrentPage(pagination.prevPage)}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Trước
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!pagination.hasNext}
                      onClick={() => setCurrentPage(pagination.nextPage)}
                    >
                      Sau
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Order Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Chi tiết đơn hàng #{selectedOrder?._id.slice(-8)}
            </DialogTitle>
          </DialogHeader>
          
          {selectedOrder && (
            <ScrollArea className="max-h-[70vh] pr-4">
              <div className="space-y-6">
                {/* Order Info & Status Update */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Thông tin đơn hàng</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Ngày đặt hàng:</span>
                        <div className="font-medium">{formatDate(selectedOrder.createdAt)}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Khách hàng:</span>
                        <div className="font-medium">#{selectedOrder.order_userId.slice(-8)}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Thanh toán:</span>
                        <div className="font-medium">{selectedOrder.order_payment}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Trạng thái thanh toán:</span>
                        <div className="mt-1">{getPaymentStatusBadge(selectedOrder.payment_status)}</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">Cập nhật trạng thái</h4>
                    <div className="space-y-3">
                      <div>
                        <span className="text-gray-600 text-sm">Trạng thái hiện tại:</span>
                        <div className="mt-1">{getOrderStatusBadge(selectedOrder.order_status)}</div>
                      </div>
                      <div>
                        <span className="text-gray-600 text-sm">Thay đổi trạng thái:</span>
                        <Select
                          value={selectedOrder.order_status}
                          onValueChange={(value) => handleUpdateOrderStatus(selectedOrder._id, value as OrderStatus)}
                          disabled={isUpdatingStatus}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={OrderStatus.PENDING}>Chờ xác nhận</SelectItem>
                            <SelectItem value={OrderStatus.DELIVERING}>Đang giao hàng</SelectItem>
                            <SelectItem value={OrderStatus.DELIVERIED}>Đã giao hàng</SelectItem>
                            <SelectItem value={OrderStatus.CANCELED}>Đã hủy</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Shipping Address */}
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Địa chỉ giao hàng
                  </h4>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm">{selectedOrder.order_shipping.address}</p>
                    <p className="text-xs text-gray-600 mt-1">
                      Loại địa chỉ: {selectedOrder.order_shipping.address_type}
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Products */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    Sản phẩm đã đặt ({selectedOrder.order_products.length})
                    {isLoadingProducts && (
                      <RefreshCw className="h-4 w-4 animate-spin text-gray-500" />
                    )}
                  </h4>
                  
                  {isLoadingProducts ? (
                    <div className="text-center py-8">
                      <RefreshCw className="h-6 w-6 animate-spin text-gray-500 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Đang tải thông tin sản phẩm...</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {selectedOrder.order_products.map((orderProduct, index) => {
                        const productDetail = orderProducts.find(p => p._id === orderProduct.productId)
                        
                        return (
                          <div key={index} className="p-4 bg-gray-50 rounded-lg border">
                            <div className="flex gap-4">
                              {/* Product Image */}
                              {productDetail?.product_thumb && (
                                <div className="flex-shrink-0">
                                  <img 
                                    src={productDetail.product_thumb} 
                                    alt={productDetail.product_name}
                                    className="w-16 h-16 object-cover rounded-lg border"
                                    onError={(e) => {
                                      e.currentTarget.src = '/placeholder.svg'
                                    }}
                                  />
                                </div>
                              )}
                              
                              {/* Product Info */}
                              <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start">
                                  <div className="flex-1">
                                    <h5 className="font-medium text-sm text-gray-900 truncate">
                                      {productDetail?.product_name || `Sản phẩm ID: ${orderProduct.productId}`}
                                    </h5>
                                    
                                    {productDetail && (
                                      <div className="mt-1 space-y-1">
                                        <p className="text-xs text-gray-600">
                                          Thương hiệu: {productDetail.product_brand?.brand_name || 'N/A'}
                                        </p>
                                        {productDetail.product_attributes?.volume && (
                                          <p className="text-xs text-gray-600">
                                            Dung tích: {productDetail.product_attributes.volume}ml
                                          </p>
                                        )}
                                        {productDetail.product_attributes?.concentration && (
                                          <p className="text-xs text-gray-600">
                                            Nồng độ: {productDetail.product_attributes.concentration}
                                          </p>
                                        )}
                                      </div>
                                    )}
                                    
                                    <div className="mt-2 text-xs text-gray-600">
                                      Số lượng: {orderProduct.quantity}
                                    </div>
                                  </div>
                                  
                                  {/* Pricing */}
                                  <div className="text-right ml-4">
                                    <div className="font-medium text-sm">
                                      {formatCurrency(orderProduct.price)}
                                    </div>
                                    <div className="text-xs text-gray-600">
                                      Thành tiền: {formatCurrency(orderProduct.price * orderProduct.quantity)}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>

                <Separator />

                {/* Order Summary */}
                <div>
                  <h4 className="font-semibold mb-3">Tóm tắt đơn hàng</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Tổng tiền hàng:</span>
                      <span>{formatCurrency(selectedOrder.order_checkout.totalPrice)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Phí vận chuyển:</span>
                      <span>{formatCurrency(selectedOrder.order_checkout.feeShip)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold text-base">
                      <span>Tổng thanh toán:</span>
                      <span className="text-gray-900">
                        {formatCurrency(selectedOrder.order_checkout.totalCheckout)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
