"use client"

import { useState } from "react"
import {
  Package,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  Eye,
  Search,
  Filter,
  Calendar,
  MapPin,
  Phone,
  Mail,
  ArrowLeft,
  Download,
  Scroll,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import SiteHeader from "@/components/layout/client-header"
import SiteFooter from "@/components/layout/client-footer"
import { ScrollArea } from "@/components/ui/scroll-area"

interface OrderItem {
  id: string
  productName: string
  productImage: string
  quantity: number
  price: number
  totalPrice: number
}

interface ShippingAddress {
  fullName: string
  phone: string
  address: string
  city: string
  district: string
  ward: string
}

type OrderStatus = "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled" | "returned"

interface Order {
  id: string
  orderDate: string
  status: OrderStatus
  totalAmount: number
  shippingFee: number
  discount: number
  finalAmount: number
  paymentMethod: string
  shippingAddress: ShippingAddress
  items: OrderItem[]
  trackingNumber?: string
  estimatedDelivery?: string
  notes?: string
}

const mockOrders: Order[] = [
  {
    id: "EW2024001",
    orderDate: "2024-01-15T10:30:00Z",
    status: "delivered",
    totalAmount: 4000000,
    shippingFee: 0,
    discount: 200000,
    finalAmount: 3800000,
    paymentMethod: "Thanh toán khi nhận hàng (COD)",
    trackingNumber: "VN123456789",
    estimatedDelivery: "2024-01-18",
    shippingAddress: {
      fullName: "Nguyễn Văn An",
      phone: "0901234567",
      address: "123 Đường Lê Lợi",
      city: "TP. Hồ Chí Minh",
      district: "Quận 1",
      ward: "Phường Bến Nghé",
    },
    items: [
      {
        id: "1",
        productName: "A Luxury Perfume Era (Gold Edition)",
        productImage: "/placeholder.svg?height=80&width=80",
        quantity: 2,
        price: 2000000,
        totalPrice: 4000000,
      },
    ],
    notes: "Giao hàng trong giờ hành chính",
  },
  {
    id: "EW2024002",
    orderDate: "2024-01-20T14:15:00Z",
    status: "shipped",
    totalAmount: 2500000,
    shippingFee: 30000,
    discount: 0,
    finalAmount: 2530000,
    paymentMethod: "Thanh toán online VNPAY",
    trackingNumber: "VN987654321",
    estimatedDelivery: "2024-01-25",
    shippingAddress: {
      fullName: "Trần Thị Bình",
      phone: "0912345678",
      address: "456 Đường Nguyễn Huệ",
      city: "TP. Hồ Chí Minh",
      district: "Quận 3",
      ward: "Phường Võ Thị Sáu",
    },
    items: [
      {
        id: "2",
        productName: "Elegant Floral Scent",
        productImage: "/placeholder.svg?height=80&width=80",
        quantity: 1,
        price: 2500000,
        totalPrice: 2500000,
      },
    ],
  },
  {
    id: "EW2024003",
    orderDate: "2024-01-22T09:45:00Z",
    status: "processing",
    totalAmount: 3500000,
    shippingFee: 0,
    discount: 350000,
    finalAmount: 3150000,
    paymentMethod: "Thanh toán khi nhận hàng (COD)",
    estimatedDelivery: "2024-01-28",
    shippingAddress: {
      fullName: "Lê Văn Cường",
      phone: "0923456789",
      address: "789 Đường Trần Hưng Đạo",
      city: "TP. Hồ Chí Minh",
      district: "Quận 5",
      ward: "Phường Cầu Ông Lãnh",
    },
    items: [
      {
        id: "3",
        productName: "Mystic Oud Elixir",
        productImage: "/placeholder.svg?height=80&width=80",
        quantity: 1,
        price: 2000000,
        totalPrice: 2000000,
      },
      {
        id: "4",
        productName: "Fresh Citrus Splash",
        productImage: "/placeholder.svg?height=80&width=80",
        quantity: 1,
        price: 1500000,
        totalPrice: 1500000,
      },
    ],
  },
  {
    id: "EW2024004",
    orderDate: "2024-01-10T16:20:00Z",
    status: "cancelled",
    totalAmount: 1800000,
    shippingFee: 30000,
    discount: 0,
    finalAmount: 1830000,
    paymentMethod: "Thanh toán online VNPAY",
    shippingAddress: {
      fullName: "Phạm Thị Dung",
      phone: "0934567890",
      address: "321 Đường Pasteur",
      city: "TP. Hồ Chí Minh",
      district: "Quận 1",
      ward: "Phường Nguyễn Thái Bình",
    },
    items: [
      {
        id: "5",
        productName: "Velvet Rose Infusion",
        productImage: "/placeholder.svg?height=80&width=80",
        quantity: 1,
        price: 1800000,
        totalPrice: 1800000,
      },
    ],
    notes: "Đơn hàng bị hủy do khách hàng thay đổi ý định",
  },
  {
    id: "EW2024005",
    orderDate: "2024-01-25T11:10:00Z",
    status: "pending",
    totalAmount: 4200000,
    shippingFee: 0,
    discount: 420000,
    finalAmount: 3780000,
    paymentMethod: "Thanh toán khi nhận hàng (COD)",
    estimatedDelivery: "2024-01-30",
    shippingAddress: {
      fullName: "Hoàng Văn Em",
      phone: "0945678901",
      address: "654 Đường Điện Biên Phủ",
      city: "TP. Hồ Chí Minh",
      district: "Quận Bình Thạnh",
      ward: "Phường 25",
    },
    items: [
      {
        id: "6",
        productName: "Spiced Amber Dream",
        productImage: "/placeholder.svg?height=80&width=80",
        quantity: 2,
        price: 1950000,
        totalPrice: 3900000,
      },
      {
        id: "7",
        productName: "Oceanic Breeze",
        productImage: "/placeholder.svg?height=80&width=80",
        quantity: 1,
        price: 300000,
        totalPrice: 300000,
      },
    ],
  },
]

export default function UserOrderHistory() {
  const [orders, setOrders] = useState<Order[]>(mockOrders)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("newest")

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

  const getStatusBadge = (status: OrderStatus) => {
    const statusConfig = {
      pending: { label: "Chờ xác nhận", className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100" },
      confirmed: { label: "Đã xác nhận", className: "bg-blue-100 text-blue-800 hover:bg-blue-100" },
      processing: { label: "Đang xử lý", className: "bg-purple-100 text-purple-800 hover:bg-purple-100" },
      shipped: { label: "Đang giao hàng", className: "bg-indigo-100 text-indigo-800 hover:bg-indigo-100" },
      delivered: { label: "Đã giao hàng", className: "bg-green-100 text-green-800 hover:bg-green-100" },
      cancelled: { label: "Đã hủy", className: "bg-red-100 text-red-800 hover:bg-red-100" },
      returned: { label: "Đã trả hàng", className: "bg-gray-100 text-gray-800 hover:bg-gray-100" },
    }

    const config = statusConfig[status]
    return <Badge className={config.className}>{config.label}</Badge>
  }

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "confirmed":
      case "processing":
        return <Package className="h-4 w-4 text-blue-600" />
      case "shipped":
        return <Truck className="h-4 w-4 text-indigo-600" />
      case "delivered":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "cancelled":
      case "returned":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <Package className="h-4 w-4 text-gray-600" />
    }
  }

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order)
    setIsDetailModalOpen(true)
  }

  const filteredOrders = orders
    .filter((order) => {
      const matchesSearch =
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.items.some((item) => item.productName.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesStatus = statusFilter === "all" || order.status === statusFilter
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
        case "oldest":
          return new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime()
        case "amount-high":
          return b.finalAmount - a.finalAmount
        case "amount-low":
          return a.finalAmount - b.finalAmount
        default:
          return 0
      }
    })

  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Lịch sử đơn hàng</h1>
          <p className="text-gray-600">Theo dõi và quản lý các đơn hàng của bạn</p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Tìm kiếm theo mã đơn hàng hoặc tên sản phẩm..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả trạng thái</SelectItem>
                    <SelectItem value="pending">Chờ xác nhận</SelectItem>
                    <SelectItem value="confirmed">Đã xác nhận</SelectItem>
                    <SelectItem value="processing">Đang xử lý</SelectItem>
                    <SelectItem value="shipped">Đang giao hàng</SelectItem>
                    <SelectItem value="delivered">Đã giao hàng</SelectItem>
                    <SelectItem value="cancelled">Đã hủy</SelectItem>
                    <SelectItem value="returned">Đã trả hàng</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Sắp xếp" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Mới nhất</SelectItem>
                    <SelectItem value="oldest">Cũ nhất</SelectItem>
                    <SelectItem value="amount-high">Giá cao đến thấp</SelectItem>
                    <SelectItem value="amount-low">Giá thấp đến cao</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Không tìm thấy đơn hàng</h3>
                <p className="text-gray-600 mb-6">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
                <Button
                  onClick={() => {
                    setSearchQuery("")
                    setStatusFilter("all")
                  }}
                >
                  Xóa bộ lọc
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredOrders.map((order) => (
              <Card key={order.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        {getStatusIcon(order.status)}
                        <h3 className="text-lg font-semibold text-gray-900">Đơn hàng #{order.id}</h3>
                        {getStatusBadge(order.status)}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>Ngày đặt: {formatDate(order.orderDate)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4" />
                          <span>{order.items.length} sản phẩm</span>
                        </div>
                        {order.trackingNumber && (
                          <div className="flex items-center gap-2">
                            <Truck className="h-4 w-4" />
                            <span>Mã vận đơn: {order.trackingNumber}</span>
                          </div>
                        )}
                        {order.estimatedDelivery && (
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>Dự kiến giao: {new Date(order.estimatedDelivery).toLocaleDateString("vi-VN")}</span>
                          </div>
                        )}
                      </div>

                      {/* Order Items Preview */}
                      <div className="mt-4">
                        <div className="flex flex-wrap gap-2">
                          {order.items.slice(0, 3).map((item) => (
                            <div key={item.id} className="flex items-center gap-2 bg-gray-100 rounded-lg p-2">
                              <img
                                src={item.productImage || "/placeholder.svg"}
                                alt={item.productName}
                                className="w-8 h-8 rounded object-cover"
                              />
                              <span className="text-sm text-gray-700 truncate max-w-[150px]">{item.productName}</span>
                              <span className="text-sm text-gray-500">x{item.quantity}</span>
                            </div>
                          ))}
                          {order.items.length > 3 && (
                            <div className="flex items-center justify-center bg-gray-100 rounded-lg p-2 text-sm text-gray-600">
                              +{order.items.length - 3} sản phẩm khác
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="lg:text-right">
                      <div className="mb-4">
                        <p className="text-2xl font-bold text-gray-900">{formatCurrency(order.finalAmount)}</p>
                        {order.discount > 0 && (
                          <p className="text-sm text-gray-500 line-through">
                            {formatCurrency(order.totalAmount + order.shippingFee)}
                          </p>
                        )}
                      </div>

                      <Button onClick={() => handleViewDetails(order)} className="w-full lg:w-auto">
                        <Eye className="h-4 w-4 mr-2" />
                        Xem chi tiết
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
          <DialogContent className="max-w-6xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <ArrowLeft className="h-5 w-5" />
                Chi tiết đơn hàng #{selectedOrder.id}
              </DialogTitle>
            </DialogHeader>
            <ScrollArea className="max-h-[80vh]">

              <div className="space-y-6 pb-6">
                {/* Order Status & Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Thông tin đơn hàng</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Trạng thái:</span>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(selectedOrder.status)}
                          {getStatusBadge(selectedOrder.status)}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Ngày đặt:</span>
                        <span className="font-medium">{formatDate(selectedOrder.orderDate)}</span>
                      </div>
                      {selectedOrder.trackingNumber && (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Mã vận đơn:</span>
                          <span className="font-medium">{selectedOrder.trackingNumber}</span>
                        </div>
                      )}
                      {selectedOrder.estimatedDelivery && (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Dự kiến giao:</span>
                          <span className="font-medium">
                            {new Date(selectedOrder.estimatedDelivery).toLocaleDateString("vi-VN")}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Thanh toán:</span>
                        <span className="font-medium">{selectedOrder.paymentMethod}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        Địa chỉ giao hàng
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="font-medium">{selectedOrder.shippingAddress.fullName}</p>
                      <p className="text-gray-600 flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        {selectedOrder.shippingAddress.phone}
                      </p>
                      <p className="text-gray-600">
                        {selectedOrder.shippingAddress.address}, {selectedOrder.shippingAddress.ward},{" "}
                        {selectedOrder.shippingAddress.district}, {selectedOrder.shippingAddress.city}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Order Items */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Sản phẩm đã đặt</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedOrder.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                          <img
                            src={item.productImage || "/placeholder.svg"}
                            alt={item.productName}
                            className="w-20 h-20 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{item.productName}</h4>
                            <p className="text-gray-600">Số lượng: {item.quantity}</p>
                            <p className="text-gray-600">Đơn giá: {formatCurrency(item.price)}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-lg">{formatCurrency(item.totalPrice)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Order Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Tổng kết đơn hàng</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tạm tính:</span>
                        <span>{formatCurrency(selectedOrder.totalAmount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Phí vận chuyển:</span>
                        <span>
                          {selectedOrder.shippingFee === 0 ? "Miễn phí" : formatCurrency(selectedOrder.shippingFee)}
                        </span>
                      </div>
                      {selectedOrder.discount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Giảm giá:</span>
                          <span>-{formatCurrency(selectedOrder.discount)}</span>
                        </div>
                      )}
                      <Separator />
                      <div className="flex justify-between text-lg font-semibold">
                        <span>Tổng cộng:</span>
                        <span>{formatCurrency(selectedOrder.finalAmount)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Notes */}
                {selectedOrder.notes && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Ghi chú</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700">{selectedOrder.notes}</p>
                    </CardContent>
                  </Card>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button variant="outline" className="flex-1 bg-transparent">
                    <Download className="h-4 w-4 mr-2" />
                    Tải hóa đơn
                  </Button>
                  {selectedOrder.status === "delivered" && (
                    <Button variant="outline" className="flex-1 bg-transparent">
                      Đánh giá sản phẩm
                    </Button>
                  )}
                  {(selectedOrder.status === "pending" || selectedOrder.status === "confirmed") && (
                    <Button variant="destructive" className="flex-1">
                      Hủy đơn hàng
                    </Button>
                  )}
                  {selectedOrder.status === "delivered" && (
                    <Button variant="outline" className="flex-1 bg-transparent">
                      Yêu cầu trả hàng
                    </Button>
                  )}
                  <Button className="flex-1">
                    <Mail className="h-4 w-4 mr-2" />
                    Liên hệ hỗ trợ
                  </Button>
                </div>
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      )}

      <SiteFooter />
    </div>
  )
}
