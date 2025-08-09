
import { useState } from "react"
import { ChevronLeft, ChevronRight, MoreHorizontal, Mail, Phone, MapPin, Calendar, Eye, Users, UserPlus, ShoppingBag, DollarSign } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  address: string
  joinDate: string
}

const customers: Customer[] = [
  {
    id: "1",
    name: "Nguyễn Văn An",
    email: "nguyen.van.an@email.com",
    phone: "0901234567",
    address: "123 Đường ABC, Quận 1, TP.HCM",
    joinDate: "2024-07-15",
  },
  {
    id: "2",
    name: "Trần Thị Bình",
    email: "tran.thi.binh@email.com",
    phone: "0912345678",
    address: "456 Đường XYZ, Quận 3, TP.HCM",
    joinDate: "2024-07-20",
  },
  {
    id: "3",
    name: "Lê Văn Cường",
    email: "le.van.cuong@email.com",
    phone: "0923456789",
    address: "789 Đường DEF, Quận 5, TP.HCM",
    joinDate: "2024-06-10",
  },
  {
    id: "4",
    name: "Phạm Thị Dung",
    email: "pham.thi.dung@email.com",
    phone: "0934567890",
    address: "321 Đường GHI, Quận 7, TP.HCM",
    joinDate: "2023-12-05",
  },
  {
    id: "5",
    name: "Hoàng Văn Em",
    email: "hoang.van.em@email.com",
    phone: "0945678901",
    address: "654 Đường JKL, Quận 2, TP.HCM",
    joinDate: "2024-07-30",
  },
  {
    id: "6",
    name: "Vũ Thị Phương",
    email: "vu.thi.phuong@email.com",
    phone: "0956789012",
    address: "987 Đường MNO, Quận 4, TP.HCM",
    joinDate: "2024-06-14",
  },
  {
    id: "7",
    name: "Đỗ Văn Giang",
    email: "do.van.giang@email.com",
    phone: "0967890123",
    address: "147 Đường PQR, Quận 6, TP.HCM",
    joinDate: "2024-07-01",
  },
  {
    id: "8",
    name: "Bùi Thị Hoa",
    email: "bui.thi.hoa@email.com",
    phone: "0978901234",
    address: "258 Đường STU, Quận 8, TP.HCM",
    joinDate: "2024-05-28",
  },
  {
    id: "9",
    name: "Ngô Văn Inh",
    email: "ngo.van.inh@email.com",
    phone: "0989012345",
    address: "369 Đường VWX, Quận 9, TP.HCM",
    joinDate: "2024-07-20",
  },
  {
    id: "10",
    name: "Lý Thị Kim",
    email: "ly.thi.kim@email.com",
    phone: "0990123456",
    address: "741 Đường YZ, Quận 10, TP.HCM",
    joinDate: "2024-06-15",
  },
  {
    id: "11",
    name: "Trương Văn Long",
    email: "truong.van.long@email.com",
    phone: "0901234568",
    address: "852 Đường ABC, Quận 11, TP.HCM",
    joinDate: "2024-05-08",
  },
  {
    id: "12",
    name: "Phan Thị Mai",
    email: "phan.thi.mai@email.com",
    phone: "0912345679",
    address: "963 Đường DEF, Quận 12, TP.HCM",
    joinDate: "2024-07-12",
  },
]

export default function Component() {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const itemsPerPage = 8

  const totalPages = Math.ceil(customers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedCustomers = customers.slice(startIndex, startIndex + itemsPerPage)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN")
  }

  const handleViewDetails = (customer: Customer) => {
    setSelectedCustomer(customer)
    setIsDetailModalOpen(true)
  }

  // --- Stats Calculation ---
  const totalCustomers = customers.length
  // For new customers, let's count those who joined in the current month (July)
  const currentMonth = new Date().getMonth() + 1; // getMonth() is 0-indexed
  const currentYear = new Date().getFullYear();

  const newCustomersThisMonth = customers.filter(customer => {
    const joinDate = new Date(customer.joinDate);
    return joinDate.getMonth() + 1 === currentMonth && joinDate.getFullYear() === currentYear;
  }).length;

  // Placeholder for active customers (needs real logic based on activity)
  const activeCustomers = Math.floor(totalCustomers * 0.7); // 70% as an example

  // Placeholder for average orders per customer (needs order data integration)
  const averageOrdersPerCustomer = totalCustomers > 0 ? (totalCustomers * 2.5).toFixed(1) : "N/A";


  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Quản lý khách hàng</h1>
        <p className="text-muted-foreground">Tổng cộng {customers.length} khách hàng</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng số khách hàng</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers}</div>
            <p className="text-xs text-muted-foreground">Tổng số khách hàng đã đăng ký</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Khách hàng mới (tháng này)</CardTitle>
            <UserPlus className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{newCustomersThisMonth}</div>
            <p className="text-xs text-muted-foreground">Khách hàng mới trong tháng 7</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Khách hàng hoạt động</CardTitle>
            <ShoppingBag className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCustomers}</div>
            <p className="text-xs text-muted-foreground">Khách hàng có tương tác gần đây</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trung bình đơn hàng/KH</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageOrdersPerCustomer}</div>
            <p className="text-xs text-muted-foreground">Giá trị trung bình mỗi khách hàng</p>
          </CardContent>
        </Card>
      </div>


      {/* Customer Table */}

      <h2 className="text-xl font-semibold">Khách hàng</h2>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Khách hàng</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Số điện thoại</TableHead>
              <TableHead>Địa chỉ</TableHead>
              <TableHead>Ngày tham gia</TableHead>
              <TableHead className="w-[50px]"></TableHead> {/* For actions */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedCustomers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell className="font-medium">{customer.id}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg?height=32&width=32&text=A" />
                      <AvatarFallback className="text-xs">{customer.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{customer.name}</span>
                  </div>
                </TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.phone}</TableCell>
                <TableCell>
                  <div className="max-w-[200px] truncate" title={customer.address}>
                    {customer.address}
                  </div>
                </TableCell>
                <TableCell>{formatDate(customer.joinDate)}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleViewDetails(customer)}>
                        <Eye className="h-4 w-4 mr-2" />
                        Xem chi tiết
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
          Trang {currentPage} / {totalPages} - Hiển thị {paginatedCustomers.length} khách hàng
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

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Chi tiết khách hàng</DialogTitle>
              <DialogDescription>Thông tin chi tiết của {selectedCustomer.name}.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex flex-col items-center gap-3">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="/placeholder.svg?height=80&width=80&text=A" />
                  <AvatarFallback className="text-3xl">{selectedCustomer.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-bold">{selectedCustomer.name}</h3>
                <p className="text-sm text-muted-foreground">ID: {selectedCustomer.id}</p>
              </div>

              <div className="grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" /> Email:
                </div>
                <div>{selectedCustomer.email}</div>

                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" /> Điện thoại:
                </div>
                <div>{selectedCustomer.phone}</div>

                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" /> Địa chỉ:
                </div>
                <div>{selectedCustomer.address}</div>

                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" /> Ngày tham gia:
                </div>
                <div>{formatDate(selectedCustomer.joinDate)}</div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
