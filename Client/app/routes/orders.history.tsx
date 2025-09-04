"use client"

import { useEffect, useState } from "react"
import {
  Package,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  Eye,
  Calendar,
  CreditCard,
  MapPin,
  ArrowLeft,
  RefreshCw,
  Box
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import SiteHeader from "@/components/layout/client-header"
import SiteFooter from "@/components/layout/client-footer"
import { ScrollArea } from "@/components/ui/scroll-area"
import { OrderDTO } from "@/types/dto/order.dto"
import { ProductDTO } from "@/types/dto/product.dto"
import { Order, OrderStatus, PaymentStatus } from "@/types/model/order"
import { Product } from "@/types/model/product"
import { ApiService } from "@/lib/api"
import { ENDPOINTS } from "@/utils/api.endpoints"
import { Link } from "react-router"
import type { Route } from "../+types/root"

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Lịch sử đơn hàng" },
    { name: "description", content: "Theo dõi và quản lý các đơn hàng của bạn" },
  ];
}

export default function UserOrderHistory() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState<any>(null)
  const [orderProducts, setOrderProducts] = useState<Product[]>([])
  const [isLoadingProducts, setIsLoadingProducts] = useState(false)

  useEffect(() => {
    fetchOrders(currentPage)
  }, [currentPage])

  const fetchOrders = async (page: number) => {
    setIsLoading(true)
    try {
      const response = await ApiService.get<OrderDTO>(ENDPOINTS.ORDER.FETCH_ALL(page))
      if (response.statusCode === 200) {
        setOrders(response.metadata.orders || [])
        setPagination(response.metadata.pagination)
      }
    }
    catch (error) {
      console.error("Error fetching orders:", error)
      setOrders([])
    }
    finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
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

  const handleCloseModal = (open: boolean) => {
    setIsDetailModalOpen(open)
    if (!open) {
      setSelectedOrder(null)
      setOrderProducts([])
      setIsLoadingProducts(false)
    }
  }

  const handleViewDetails = async (order: Order) => {
    setSelectedOrder(order)
    setIsDetailModalOpen(true)
    setOrderProducts([])
    setIsLoadingProducts(true)

    try {
      // Fetch product details for each product in the order
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

  if (isLoading && orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <SiteHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 animate-spin text-gray-500 mx-auto mb-4" />
              <p className="text-gray-600">Đang tải danh sách đơn hàng...</p>
            </div>
          </div>
        </div>
        <SiteFooter />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Lịch sử đơn hàng</h1>
          <p className="text-gray-600">Theo dõi tình trạng các đơn hàng của bạn</p>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Chưa có đơn hàng nào</h3>
              <p className="text-gray-600 mb-6">Bạn chưa có đơn hàng nào. Hãy bắt đầu mua sắm ngay!</p>
              <Button asChild>
                <Link to="/">Mua sắm ngay</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order._id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex items-center gap-2">
                          <Package className="h-5 w-5 text-gray-500" />
                          <span className="font-mono text-sm font-medium text-gray-900">
                            #{order._id.slice(-8)}
                          </span>
                        </div>
                        {getOrderStatusBadge(order.order_status)}
                        {getPaymentStatusBadge(order.payment_status)}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <span>Ngày đặt: {formatDate(order.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <CreditCard className="h-4 w-4" />
                          <span>Thanh toán: {order.order_payment}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="h-4 w-4" />
                          <span className="truncate">
                            {order.order_shipping.address}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Box className="h-4 w-4" />
                          <span>{order.order_products.length} sản phẩm</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col lg:items-end gap-3">
                      <div className="text-right">
                        <div className="text-sm text-gray-600">Tổng tiền</div>
                        <div className="text-lg font-bold text-gray-900">
                          {formatCurrency(order.order_checkout.totalCheckout)}
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewDetails(order)}
                        className="flex items-center gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        Xem chi tiết
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <Button
              variant="outline"
              size="sm"
              disabled={!pagination.hasPrev}
              onClick={() => setCurrentPage(pagination.prevPage)}
            >
              Trang trước
            </Button>
            <span className="text-sm text-gray-600 px-4">
              Trang {pagination.page} / {pagination.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={!pagination.hasNext}
              onClick={() => setCurrentPage(pagination.nextPage)}
            >
              Trang sau
            </Button>
          </div>
        )}

        {/* Order Detail Modal */}
        <Dialog open={isDetailModalOpen} onOpenChange={handleCloseModal}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Chi tiết đơn hàng #{selectedOrder?._id.slice(-8)}
              </DialogTitle>
            </DialogHeader>
            
            {selectedOrder && (
              <ScrollArea className="max-h-[60vh] pr-4">
                <div className="space-y-6">
                  {/* Order Info */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Ngày đặt hàng:</span>
                      <div className="font-medium">{formatDate(selectedOrder.createdAt)}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Trạng thái:</span>
                      <div className="mt-1">{getOrderStatusBadge(selectedOrder.order_status)}</div>
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

      <SiteFooter />
    </div>
  )
}