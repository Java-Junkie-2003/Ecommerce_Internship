
import { useState, useEffect } from "react"
import {
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Eye,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  Package,
  DollarSign,
  Calendar,
  User,
  Mail,
  ShoppingCart,
  Hourglass,
  RefreshCw,
  CreditCard,
  MapPin,
  Edit
} from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ApiService } from "@/lib/api"
import { OrderDTO } from "@/types/dto/order.dto"
import { ProductDTO } from "@/types/dto/product.dto"
import { ENDPOINTS } from "@/utils/api.endpoints"
import { OrderStatus, PaymentStatus } from "@/types/model/order"
import { Order } from "@/types/model/order"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

// Dashboard Index Component for Order Management
export default function DashboardIndex() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [selectedProducts, setSelectedProducts] = useState<ProductDTO[]>([])
  const [productsLoading, setProductsLoading] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    delivering: 0,
    delivered: 0,
    cancelled: 0
  })

  // Fetch orders data
  const fetchOrders = async (page: number = 1, status: string = "all") => {
    try {
      setLoading(true)
      const response = await ApiService.get<OrderDTO>(ENDPOINTS.ADMIN.ORDER.FETCH_ALL(page))

      setOrders(response.metadata.orders)
      setCurrentPage(response.metadata.pagination.page)
      setTotalPages(response.metadata.pagination.totalPages)

      // Calculate stats from orders
      const allOrders = response.metadata.orders
      setStats({
        total: allOrders.length,
        pending: allOrders.filter(order => order.order_status === OrderStatus.PENDING).length,
        delivering: allOrders.filter(order => order.order_status === OrderStatus.DELIVERING).length,
        delivered: allOrders.filter(order => order.order_status === OrderStatus.DELIVERIED).length,
        cancelled: allOrders.filter(order => order.order_status === OrderStatus.CANCELED).length
      })
    } catch (error) {
      console.error("Failed to fetch orders:", error)
      toast.error("Không thể tải danh sách đơn hàng")
    } finally {
      setLoading(false)
    }
  }

  // Fetch product details for order
  const fetchProductDetails = async (order: Order) => {
    if (!order.order_products?.length) return

    try {
      setProductsLoading(true)
      const productPromises = order.order_products.map(item =>
        ApiService.get<ProductDTO>(ENDPOINTS.PRODUCT.FETCH_ONE(item.productId))
      )
      const products = await Promise.all(productPromises)
      setSelectedProducts(products)
    } catch (error) {
      console.error("Failed to fetch product details:", error)
      toast.error("Không thể tải thông tin sản phẩm")
      setSelectedProducts([])
    } finally {
      setProductsLoading(false)
    }
  }

  // Update order status
  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await ApiService.put(ENDPOINTS.ADMIN.ORDER.UPDATE_STATUS(orderId), {
        status: newStatus
      })
      toast.success("Cập nhật trạng thái đơn hàng thành công")
      fetchOrders(currentPage, statusFilter)
    } catch (error) {
      console.error("Failed to update order status:", error)
      toast.error("Không thể cập nhật trạng thái đơn hàng")
    }
  }

  const handleViewDetails = async (order: Order) => {
    setSelectedOrder(order)
    setDialogOpen(true)
    await fetchProductDetails(order)
  }

  const handleStatusChange = (orderId: string, newStatus: string) => {
    updateOrderStatus(orderId, newStatus)
  }

  const handlePageChange = (page: number) => {
    fetchOrders(page, statusFilter)
  }

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status)
    setCurrentPage(1)
    fetchOrders(1, status)
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case OrderStatus.PENDING:
        return <Clock className="h-4 w-4" />
      case OrderStatus.DELIVERING:
        return <Truck className="h-4 w-4" />
      case OrderStatus.DELIVERIED:
        return <CheckCircle className="h-4 w-4" />
      case OrderStatus.CANCELED:
        return <XCircle className="h-4 w-4" />
      default:
        return <Package className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case OrderStatus.PENDING:
        return "bg-yellow-500"
      case OrderStatus.DELIVERING:
        return "bg-blue-500"
      case OrderStatus.DELIVERIED:
        return "bg-green-500"
      case OrderStatus.CANCELED:
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case PaymentStatus.PENDING:
        return "bg-yellow-500"
      case PaymentStatus.PAID:
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case OrderStatus.PENDING:
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Chờ xử lý</Badge>
      case OrderStatus.DELIVERING:
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Đang giao hàng</Badge>
      case OrderStatus.DELIVERIED:
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Đã giao hàng</Badge>
      case OrderStatus.CANCELED:
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Đã hủy</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin" />
        <span className="ml-2">Đang tải...</span>
      </div>
    )
  }


  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Quản lý đơn hàng</h1>
        <p className="text-muted-foreground">Tổng cộng {stats.total} đơn hàng</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Tổng đơn hàng */}
        <Card className="border border-gray-100 relative overflow-hidden bg-gradient-to-br from-blue-50 to-white shadow-sm hover:shadow-md transition">
          {/* Icon background */}
          <ShoppingCart className="absolute right-3 top-3 h-20 w-20 text-blue-200 opacity-30  pointer-events-none" />

          <CardHeader className="relative z-10 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">Tổng đơn hàng</CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-2xl font-bold text-blue-900">8</div>
            <p className="text-xs text-muted-foreground">Tổng số đơn hàng</p>
          </CardContent>
        </Card>

        {/* Đơn hàng chờ xử lý */}
        <Card className="border border-gray-100 relative overflow-hidden bg-gradient-to-br from-yellow-50 to-white shadow-sm hover:shadow-md transition">
          <Hourglass className="absolute right-3 top-3 h-20 w-20 text-yellow-300 opacity-30  pointer-events-none" />

          <CardHeader className="relative z-10 pb-2">
            <CardTitle className="text-sm font-medium text-yellow-800">Đơn hàng chờ xử lý</CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-2xl font-bold text-yellow-900">10</div>
            <p className="text-xs text-muted-foreground">Đang chờ xác nhận</p>
          </CardContent>
        </Card>

        {/* Đơn hàng đã giao */}
        <Card className="border border-gray-100 relative overflow-hidden bg-gradient-to-br from-green-50 to-white shadow-sm hover:shadow-md transition">
          <CheckCircle className="absolute right-3 top-3 h-20 w-20 text-green-300 opacity-30  pointer-events-none" />

          <CardHeader className="relative z-10 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">Đơn hàng đã giao</CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-2xl font-bold text-green-900">0</div>
            <p className="text-xs text-muted-foreground">Đã hoàn thành</p>
          </CardContent>
        </Card>

        {/* Tổng doanh thu */}
        <Card className="border border-gray-100 relative overflow-hidden bg-gradient-to-br from-purple-50 to-white shadow-sm hover:shadow-md transition">
          <DollarSign className="absolute right-3 top-3 h-20 w-20 text-purple-300 opacity-30  pointer-events-none" />

          <CardHeader className="relative z-10 pb-2">
            <CardTitle className="text-sm font-medium text-purple-800">Tổng doanh thu</CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-2xl font-bold text-purple-900">
              20000
            </div>
            <p className="text-xs text-muted-foreground">Giá trị đơn hàng</p>
          </CardContent>
        </Card>
      </div>



      {/* Order Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã đơn hàng</TableHead>
              <TableHead>Khách hàng</TableHead>
              <TableHead>Ngày đặt</TableHead>
              <TableHead>Tổng tiền</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Thanh toán</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order._id}>
                <TableCell className="font-medium">{order._id}</TableCell>
                <TableCell>
                  <div className="font-medium">{order.order_userId || 'N/A'}</div>
                  <div className="text-sm text-muted-foreground">{order.order_shipping?.address || 'N/A'}</div>
                </TableCell>
                <TableCell>{formatDate(order.createdAt)}</TableCell>
                <TableCell className="font-medium">{formatCurrency(order.order_checkout.totalCheckout)}</TableCell>
                <TableCell>{getStatusBadge(order.order_status)}</TableCell>
                <TableCell>
                  <Badge className={cn("text-white", getPaymentStatusColor(order.payment_status))}>
                    {order.payment_status === PaymentStatus.PENDING && "Chờ thanh toán"}
                    {order.payment_status === PaymentStatus.PAID && "Đã thanh toán"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="ps-3" onClick={() => handleViewDetails(order)}>
                        <Eye className="h-4 w-4 mr-2" />
                        Xem chi tiết
                      </DropdownMenuItem>
                      <DropdownMenuItem className="p-0">
                        <Select
                          value={order.order_status}
                          onValueChange={(newStatus: string) => handleStatusChange(order._id, newStatus)}
                        >
                          <SelectTrigger className="w-full text-sm border-none shadow-none focus:ring-0">
                            <SelectValue placeholder="Cập nhật trạng thái" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={OrderStatus.PENDING}>
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-yellow-600" />
                                <span className="text-yellow-800">Chờ xử lý</span>
                              </div>
                            </SelectItem>
                            <SelectItem value={OrderStatus.DELIVERING}>
                              <div className="flex items-center gap-2">
                                <Truck className="h-4 w-4 text-blue-600" />
                                <span className="text-blue-800">Đang giao hàng</span>
                              </div>
                            </SelectItem>
                            <SelectItem value={OrderStatus.DELIVERIED}>
                              <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <span className="text-green-800">Đã giao hàng</span>
                              </div>
                            </SelectItem>
                            <SelectItem value={OrderStatus.CANCELED}>
                              <div className="flex items-center gap-2">
                                <XCircle className="h-4 w-4 text-red-600" />
                                <span className="text-red-800">Đã hủy</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
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
          Trang {currentPage} / {totalPages} - Hiển thị {orders.length} đơn hàng
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
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
            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            Sau
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Chi tiết đơn hàng #{selectedOrder._id}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Thông tin chung</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Ngày đặt: {formatDate(selectedOrder.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span>Tổng tiền: {formatCurrency(selectedOrder.order_checkout.totalCheckout)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <span>Trạng thái: {getStatusBadge(selectedOrder.order_status)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                      <span>Thanh toán:
                        <Badge className={cn("ml-2 text-white", getPaymentStatusColor(selectedOrder.payment_status))}>
                          {selectedOrder.payment_status === PaymentStatus.PENDING && "Chờ thanh toán"}
                          {selectedOrder.payment_status === PaymentStatus.PAID && "Đã thanh toán"}
                        </Badge>
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Thông tin giao hàng</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>Mã khách hàng: {selectedOrder.order_userId}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>Địa chỉ: {selectedOrder.order_shipping?.address || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="my-4" />

              <div>
                <h4 className="font-semibold mb-2">Sản phẩm trong đơn hàng</h4>
                {productsLoading ? (
                  <div className="flex items-center justify-center py-4">
                    <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                    <span>Đang tải thông tin sản phẩm...</span>
                  </div>
                ) : (
                  <ScrollArea className="h-48">
                    <div className="space-y-3">
                      {selectedOrder.order_products.map((item, index) => {
                        const productData = selectedProducts[index]
                        const product = productData?.metadata
                        return (
                          <div key={item.productId} className="flex items-center gap-4 p-2 border rounded">
                            <img
                              src={product?.product_thumb || "/placeholder.svg"}
                              alt={product?.product_name || "Product"}
                              className="w-16 h-16 object-cover rounded-md"
                              onError={(e) => {
                                e.currentTarget.src = "/placeholder.svg"
                              }}
                            />
                            <div className="flex-1">
                              <p className="font-medium">{product?.product_name || `Product ${item.productId}`}</p>
                              <p className="text-sm text-muted-foreground">
                                {item.quantity} x {formatCurrency(item.price)}
                              </p>
                            </div>
                            <span className="font-semibold">
                              {formatCurrency(item.quantity * item.price)}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </ScrollArea>
                )}
              </div>

              <Separator className="my-4" />

              <div>
                <h4 className="font-semibold mb-2">Cập nhật trạng thái đơn hàng</h4>
                <Select
                  value={selectedOrder.order_status}
                  onValueChange={(newStatus: string) => updateOrderStatus(selectedOrder._id, newStatus)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn trạng thái mới" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={OrderStatus.PENDING}>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-yellow-600" /> Chờ xử lý
                      </div>
                    </SelectItem>
                    <SelectItem value={OrderStatus.DELIVERING}>
                      <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4 text-blue-600" /> Đang giao hàng
                      </div>
                    </SelectItem>
                    <SelectItem value={OrderStatus.DELIVERIED}>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" /> Đã giao hàng
                      </div>
                    </SelectItem>
                    <SelectItem value={OrderStatus.CANCELED}>
                      <div className="flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-red-600" /> Đã hủy
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
