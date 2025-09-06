
import { useEffect, useState } from "react"
import { ChevronLeft, ChevronRight, MoreHorizontal, Mail, Phone, MapPin, Calendar, Eye, Users, UserPlus, ShoppingBag, DollarSign } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Customer } from "@/types/model/customer"
import { ApiService } from "@/lib/api"
import { CustomerDTO } from "@/types/dto/customer.dto"

export function meta() {
  return [
    { title: "Quản lý khách hàng" },
    { name: "description", content: "Quản lý và theo dõi khách hàng của bạn" },
  ]
}


export default function Component() {

  const [customers, setCustomers] = useState<Customer[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const itemsPerPage = 10

  const [totalPages, setTotalPages] = useState(0)
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
  const currentMonth = new Date().getMonth() + 1 // getMonth() is 0-indexed
  const currentYear = new Date().getFullYear()

  const newCustomersThisMonth = 10 // Placeholder for new customers this month (needs real logic based on joinDate)
  // Placeholder for active customers (needs real logic based on activity)
  const activeCustomers = 2

  // Placeholder for average orders per customer (needs order data integration)
  const averageOrdersPerCustomer = 2

  const fetchCustomers = async (page: number = 1) => {
    try {
      const response = await ApiService.get<CustomerDTO>(`/user/all?page=${page}&limit=${itemsPerPage}`)
      setCustomers(response.metadata.results)
      setTotalPages(response.metadata.pagination.totalPages)
      setCurrentPage(response.metadata.pagination.page)
    } catch (error) {
      console.error("Error fetching customers:", error)
      setCustomers([])
    }
  }

  useEffect(() => {

    fetchCustomers()
  }, [])

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
              {/* <TableHead className="w-[50px]"></TableHead> */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedCustomers.map((customer) => (
              <TableRow key={customer._id}>
                <TableCell className="font-medium">{customer._id}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg?height=32&width=32&text=A" />
                      <AvatarFallback className="text-xs">{customer.user_name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{customer.user_name}</span>
                  </div>
                </TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.phone}</TableCell>
                {/* <TableCell>
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
                </TableCell> */}
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
            onClick={() => fetchCustomers(Math.max(1, currentPage - 1))}
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
                  onClick={() => fetchCustomers(pageNumber)}
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
            onClick={() => fetchCustomers(currentPage + 1)}
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
              <DialogDescription>Thông tin chi tiết của {selectedCustomer.user_name}.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex flex-col items-center gap-3">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="/placeholder.svg?height=80&width=80&text=A" />
                  <AvatarFallback className="text-3xl">{selectedCustomer.user_name.charAt(0)}</AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-bold">{selectedCustomer.user_name}</h3>
                <p className="text-sm text-muted-foreground">ID: {selectedCustomer._id}</p>
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
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
