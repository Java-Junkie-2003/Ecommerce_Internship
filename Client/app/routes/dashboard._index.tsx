
import { useState } from "react"
import { ChevronLeft, ChevronRight, MoreHorizontal, Eye, Truck, CheckCircle, XCircle, Clock, Package, DollarSign, Calendar, User, Mail, ShoppingCart, Hourglass } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

interface OrderItem {
  productId: string
  productName: string
  quantity: number
  price: number
  image: string
}

type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled"

interface Order {
  id: string
  customerName: string
  customerEmail: string
  orderDate: string
  totalAmount: number
  status: OrderStatus
  items: OrderItem[]
}

const orders: Order[] = [
  {
    id: "ORD001",
    customerName: "Nguyễn Văn An",
    customerEmail: "nguyen.van.an@email.com",
    orderDate: "2024-07-25",
    totalAmount: 4000000,
    status: "delivered",
    items: [
      {
        productId: "P001",
        productName: "A Luxury Perfume Era (Gold)",
        quantity: 2,
        price: 2000000,
        image: "/placeholder.svg?height=60&width=60&text=Perfume",
      },
    ],
  },
  {
    id: "ORD002",
    customerName: "Trần Thị Bình",
    customerEmail: "tran.thi.binh@email.com",
    orderDate: "2024-07-24",
    totalAmount: 2500000,
    status: "shipped",
    items: [
      {
        productId: "P002",
        productName: "Elegant Floral Scent",
        quantity: 1,
        price: 2500000,
        image: "/placeholder.svg?height=60&width=60&text=Perfume",
      },
    ],
  },
  {
    id: "ORD003",
    customerName: "Lê Văn Cường",
    customerEmail: "le.van.cuong@email.com",
    orderDate: "2024-07-23",
    totalAmount: 6000000,
    status: "processing",
    items: [
      {
        productId: "P003",
        productName: "Mystic Oud Perfume",
        quantity: 3,
        price: 2000000,
        image: "/placeholder.svg?height=60&width=60&text=Perfume",
      },
    ],
  },
  {
    id: "ORD004",
    customerName: "Phạm Thị Dung",
    customerEmail: "pham.thi.dung@email.com",
    orderDate: "2024-07-22",
    totalAmount: 1500000,
    status: "pending",
    items: [
      {
        productId: "P004",
        productName: "Fresh Citrus Splash",
        quantity: 1,
        price: 1500000,
        image: "/placeholder.svg?height=60&width=60&text=Perfume",
      },
    ],
  },
  {
    id: "ORD005",
    customerName: "Hoàng Văn Em",
    customerEmail: "hoang.van.em@email.com",
    orderDate: "2024-07-21",
    totalAmount: 3000000,
    status: "cancelled",
    items: [
      {
        productId: "P005",
        productName: "Ocean Breeze Fragrance",
        quantity: 1,
        price: 3000000,
        image: "/placeholder.svg?height=60&width=60&text=Perfume",
      },
    ],
  },
  {
    id: "ORD006",
    customerName: "Vũ Thị Phương",
    customerEmail: "vu.thi.phuong@email.com",
    orderDate: "2024-07-20",
    totalAmount: 8000000,
    status: "delivered",
    items: [
      {
        productId: "P001",
        productName: "A Luxury Perfume Era (Gold)",
        quantity: 4,
        price: 2000000,
        image: "/placeholder.svg?height=60&width=60&text=Perfume",
      },
    ],
  },
]

export default function Component() {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [orderList, setOrderList] = useState<Order[]>(orders) // Use state for orders to allow status updates
  const itemsPerPage = 8

  const totalPages = Math.ceil(orderList.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedOrders = orderList.slice(startIndex, startIndex + itemsPerPage)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN")
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount)
  }

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Chờ xử lý</Badge>
      case "processing":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Đang xử lý</Badge>
      case "shipped":
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Đang giao hàng</Badge>
      case "delivered":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Đã giao hàng</Badge>
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Đã hủy</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order)
    setIsDetailModalOpen(true)
  }

  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrderList((prevOrders) =>
      prevOrders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)),
    )
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null))
    }
  }

  // --- Stats Calculation ---
  const totalOrders = orderList.length
  const pendingOrders = orderList.filter(order => order.status === "pending").length
  const deliveredOrders = orderList.filter(order => order.status === "delivered").length
  const totalRevenue = orderList.reduce((sum, order) => sum + order.totalAmount, 0)
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0


  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Quản lý đơn hàng</h1>
        <p className="text-muted-foreground">Tổng cộng {orderList.length} đơn hàng</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Tổng đơn hàng */}
        <Card className="border border-gray-100 relative overflow-hidden bg-gradient-to-br from-blue-50 to-white shadow-sm hover:shadow-md transition">
          {/* Icon background */}
          <ShoppingCart className="absolute right-3 top-3 h-20 w-20 text-blue-200 opacity-30 rotate-12 pointer-events-none" />

          <CardHeader className="relative z-10 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">Tổng đơn hàng</CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-2xl font-bold text-blue-900">{totalOrders}</div>
            <p className="text-xs text-muted-foreground">Tổng số đơn hàng</p>
          </CardContent>
        </Card>

        {/* Đơn hàng chờ xử lý */}
        <Card className="border border-gray-100 relative overflow-hidden bg-gradient-to-br from-yellow-50 to-white shadow-sm hover:shadow-md transition">
          <Hourglass className="absolute right-3 top-3 h-20 w-20 text-yellow-300 opacity-30 -rotate-12 pointer-events-none" />

          <CardHeader className="relative z-10 pb-2">
            <CardTitle className="text-sm font-medium text-yellow-800">Đơn hàng chờ xử lý</CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-2xl font-bold text-yellow-900">{pendingOrders}</div>
            <p className="text-xs text-muted-foreground">Đang chờ xác nhận</p>
          </CardContent>
        </Card>

        {/* Đơn hàng đã giao */}
        <Card className="border border-gray-100 relative overflow-hidden bg-gradient-to-br from-green-50 to-white shadow-sm hover:shadow-md transition">
          <CheckCircle className="absolute right-3 top-3 h-20 w-20 text-green-300 opacity-30 rotate-12 pointer-events-none" />

          <CardHeader className="relative z-10 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">Đơn hàng đã giao</CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-2xl font-bold text-green-900">{deliveredOrders}</div>
            <p className="text-xs text-muted-foreground">Đã hoàn thành</p>
          </CardContent>
        </Card>

        {/* Tổng doanh thu */}
        <Card className="border border-gray-100 relative overflow-hidden bg-gradient-to-br from-purple-50 to-white shadow-sm hover:shadow-md transition">
          <DollarSign className="absolute right-3 top-3 h-20 w-20 text-purple-300 opacity-30 -rotate-12 pointer-events-none" />

          <CardHeader className="relative z-10 pb-2">
            <CardTitle className="text-sm font-medium text-purple-800">Tổng doanh thu</CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-2xl font-bold text-purple-900">
              {formatCurrency(totalRevenue).replace("₫", "đ")}
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
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>
                  <div className="font-medium">{order.customerName}</div>
                  <div className="text-sm text-muted-foreground">{order.customerEmail}</div>
                </TableCell>
                <TableCell>{formatDate(order.orderDate)}</TableCell>
                <TableCell className="font-medium"><span className="font-bold">VND</span> {formatCurrency(order.totalAmount).replace("₫", "đ")}</TableCell>
                <TableCell>{getStatusBadge(order.status)}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleViewDetails(order)}>
                        <Eye className="h-4 w-4 mr-2" />
                        Xem chi tiết
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Select
                          value={order.status}
                          onValueChange={(newStatus: OrderStatus) => handleUpdateOrderStatus(order.id, newStatus)}
                        >
                          <SelectTrigger className="w-full h-auto py-1 px-2 text-sm border-none shadow-none focus:ring-0">
                            <Package className="h-4 w-4 mr-2" />
                            <SelectValue placeholder="Cập nhật trạng thái" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Chờ xử lý</SelectItem>
                            <SelectItem value="processing">Đang xử lý</SelectItem>
                            <SelectItem value="shipped">Đang giao hàng</SelectItem>
                            <SelectItem value="delivered">Đã giao hàng</SelectItem>
                            <SelectItem value="cancelled">Đã hủy</SelectItem>
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
          Trang {currentPage} / {totalPages} - Hiển thị {paginatedOrders.length} đơn hàng
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

      {/* Order Detail Modal */}
      {selectedOrder && (
        <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Chi tiết đơn hàng #{selectedOrder.id}</DialogTitle>
              <DialogDescription>Thông tin chi tiết về đơn hàng này.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Thông tin chung</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Ngày đặt: {formatDate(selectedOrder.orderDate)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span>Tổng tiền: {formatCurrency(selectedOrder.totalAmount).replace("₫", "đ")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <span>Trạng thái: {getStatusBadge(selectedOrder.status)}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Thông tin khách hàng</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>Tên: {selectedOrder.customerName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>Email: {selectedOrder.customerEmail}</span>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="my-4" />

              <div>
                <h4 className="font-semibold mb-2">Sản phẩm trong đơn hàng</h4>
                <div className="space-y-3">
                  {selectedOrder.items.map((item) => (
                    <div key={item.productId} className="flex items-center gap-4">
                      <img src={item.image || "/placeholder.svg"} alt={item.productName} className="w-16 h-16 object-cover rounded-md" />
                      <div className="flex-1">
                        <p className="font-medium">{item.productName}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.quantity} x {formatCurrency(item.price).replace("₫", "đ")}
                        </p>
                      </div>
                      <span className="font-semibold">
                        {formatCurrency(item.quantity * item.price).replace("₫", "đ")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <Separator className="my-4" />

              <div>
                <h4 className="font-semibold mb-2">Cập nhật trạng thái đơn hàng</h4>
                <Select
                  value={selectedOrder.status}
                  onValueChange={(newStatus: OrderStatus) => handleUpdateOrderStatus(selectedOrder.id, newStatus)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn trạng thái mới" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-yellow-600" /> Chờ xử lý
                      </div>
                    </SelectItem>
                    <SelectItem value="processing">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-blue-600" /> Đang xử lý
                      </div>
                    </SelectItem>
                    <SelectItem value="shipped">
                      <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4 text-purple-600" /> Đang giao hàng
                      </div>
                    </SelectItem>
                    <SelectItem value="delivered">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" /> Đã giao hàng
                      </div>
                    </SelectItem>
                    <SelectItem value="cancelled">
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
