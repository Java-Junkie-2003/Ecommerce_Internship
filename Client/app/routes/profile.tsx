"use client"

import { useState, useEffect } from "react"
import { User as UserIcon, Mail, Phone, MapPin, Calendar, Edit, Save, X, Camera, ShoppingBag, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import SiteHeader from "@/components/layout/client-header"
import SiteFooter from "@/components/layout/client-footer"
import { User } from "@/types/model/user"
import { useSelector } from "react-redux"
import { RootState } from "@/redux/store"
import { toast } from "sonner"

export function meta() {
  return [
    { title: "Thông tin cá nhân" },
    { name: "description", content: "Quản lý thông tin cá nhân và cài đặt tài khoản của bạn" },
  ]
}

export default function UserProfile() {
  const userInfo = useSelector((state: RootState) => state.user.userInfo)
  const [profile, setProfile] = useState<User | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedProfile, setEditedProfile] = useState<User | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  // Use useEffect to initialize profile data from Redux
  useEffect(() => {
    if (userInfo) {
      setProfile(userInfo)
      setEditedProfile(userInfo)
    }
  }, [userInfo])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    })
      .format(amount)
      .replace("₫", "đ")
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const handleEdit = () => {
    setEditedProfile(profile ? { ...profile } : null)
    setIsEditing(true)
  }

  const handleCancel = () => {
    setEditedProfile(profile ? { ...profile } : null)
    setIsEditing(false)
  }

  const handleSave = async () => {
    setIsSaving(true)

    // Simulate API call
    setTimeout(() => {
      if (editedProfile) {
        setProfile(editedProfile)
      }
      setIsEditing(false)
      setIsSaving(false)
      // In a real app, you would show a success message
      toast.success("Thông tin đã được cập nhật thành công!")
    }, 1000)
  }

  const handleInputChange = (field: keyof User, value: string) => {
    setEditedProfile((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        [field]: value,
      } as User;
    })
  }

//   const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       const file = e.target.files[0]
//       const reader = new FileReader()
//       reader.onload = (event) => {
//         if (event.target?.result) {
//           setEditedProfile((prev) => ({
//             ...prev,
//             avatar: event.target?.result as string,
//           }))
//         }
//       }
//       reader.readAsDataURL(file)
//     }
//   }

  const currentProfile = isEditing ? editedProfile : profile

  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Thông tin cá nhân</h1>
          <p className="text-gray-600">Quản lý thông tin tài khoản và cài đặt của bạn</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Summary Card */}
          <Card className="lg:col-span-1">
            <CardHeader className="text-center">
              <div className="relative mx-auto mb-4">
                <Avatar className="w-24 h-24 mx-auto">
                  <AvatarImage src={"/placeholder.svg"} alt="Avatar" />
                  <AvatarFallback className="text-2xl">
                    {currentProfile?.user_name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                {/* {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 cursor-pointer hover:bg-blue-700 transition-colors">
                    <Camera className="h-4 w-4" />
                    <input type="file" accept="image/*" onChange={() => {}} className="hidden" />
                  </label>
                )} */}
              </div>
              <CardTitle className="text-xl">
                {currentProfile?.user_name}
              </CardTitle>
              <p className="text-gray-600">{currentProfile?.email}</p>
              {/* <Badge variant="secondary" className="mt-2">
                Thành viên từ {currentProfile?.created_at ? formatDate(currentProfile.created_at) : "N/A"}
              </Badge> */}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-2xl font-bold text-gray-900">30</div>
                    <div className="text-sm text-gray-600">Đơn hàng</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-lg font-bold text-gray-900">{formatCurrency(200000)}</div>
                    <div className="text-sm text-gray-600">Tổng chi tiêu</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Details Card */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <UserIcon className="h-5 w-5" />
                Thông tin chi tiết
              </CardTitle>
              {!isEditing ? (
                <Button onClick={handleEdit} variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Chỉnh sửa
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button onClick={handleCancel} variant="outline" disabled={isSaving}>
                    <X className="h-4 w-4 mr-2" />
                    Hủy
                  </Button>
                  <Button onClick={handleSave} disabled={isSaving}>
                    <Save className="h-4 w-4 mr-2" />
                    {isSaving ? "Đang lưu..." : "Lưu"}
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Thông tin cá nhân</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* <div className="space-y-2">
                    <Label htmlFor="firstName">Họ</Label>
                    {isEditing ? (
                      <Input
                        id="firstName"
                        value={editedProfile.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        placeholder="Nhập họ"
                      />
                    ) : (
                      <div className="p-2 bg-gray-50 rounded-md">{currentProfile.firstName}</div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Tên</Label>
                    {isEditing ? (
                      <Input
                        id="lastName"
                        value={editedProfile.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        placeholder="Nhập tên"
                      />
                    ) : (
                      <div className="p-2 bg-gray-50 rounded-md">{currentProfile.lastName}</div>
                    )}
                  </div> */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    {isEditing ? (
                      <Input
                        id="email"
                        type="email"
                        value={editedProfile?.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="Nhập email"
                      />
                    ) : (
                      <div className="p-2 bg-gray-50 rounded-md flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-500" />
                        {currentProfile?.email}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Số điện thoại</Label>
                    {isEditing ? (
                      <Input
                        id="phone"
                        value={editedProfile?.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        placeholder="Nhập số điện thoại"
                      />
                    ) : (
                      <div className="p-2 bg-gray-50 rounded-md flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-500" />
                        {currentProfile?.phone}
                      </div>
                    )}
                  </div>
                  {/* <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Ngày sinh</Label>
                    {isEditing ? (
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={editedProfile.dateOfBirth}
                        onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                      />
                    ) : (
                      <div className="p-2 bg-gray-50 rounded-md flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        {formatDate(currentProfile.dateOfBirth)}
                      </div>
                    )}
                  </div> */}
                  {/* <div className="space-y-2">
                    <Label htmlFor="gender">Giới tính</Label>
                    {isEditing ? (
                      <Select
                        value={editedProfile.gender}
                        onValueChange={(value) => handleInputChange("gender", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn giới tính" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Nam</SelectItem>
                          <SelectItem value="female">Nữ</SelectItem>
                          <SelectItem value="other">Khác</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="p-2 bg-gray-50 rounded-md">
                        {currentProfile.gender === "male" ? "Nam" : currentProfile.gender === "female" ? "Nữ" : "Khác"}
                      </div>
                    )}
                  </div> */}
                </div>
              </div>

              {/* Address Information */}
              {/* <div>
                <h3 className="text-lg font-semibold mb-4">Địa chỉ</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">Địa chỉ</Label>
                    {isEditing ? (
                      <Input
                        id="address"
                        value={editedProfile.address}
                        onChange={(e) => handleInputChange("address", e.target.value)}
                        placeholder="Nhập địa chỉ"
                      />
                    ) : (
                      <div className="p-2 bg-gray-50 rounded-md flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        {currentProfile.address}
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="ward">Phường/Xã</Label>
                      {isEditing ? (
                        <Input
                          id="ward"
                          value={editedProfile.ward}
                          onChange={(e) => handleInputChange("ward", e.target.value)}
                          placeholder="Nhập phường/xã"
                        />
                      ) : (
                        <div className="p-2 bg-gray-50 rounded-md">{currentProfile.ward}</div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="district">Quận/Huyện</Label>
                      {isEditing ? (
                        <Input
                          id="district"
                          value={editedProfile.district}
                          onChange={(e) => handleInputChange("district", e.target.value)}
                          placeholder="Nhập quận/huyện"
                        />
                      ) : (
                        <div className="p-2 bg-gray-50 rounded-md">{currentProfile.district}</div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">Tỉnh/Thành phố</Label>
                      {isEditing ? (
                        <Input
                          id="city"
                          value={editedProfile.city}
                          onChange={(e) => handleInputChange("city", e.target.value)}
                          placeholder="Nhập tỉnh/thành phố"
                        />
                      ) : (
                        <div className="p-2 bg-gray-50 rounded-md">{currentProfile.city}</div>
                      )}
                    </div>
                  </div>
                </div>
              </div> */}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Liên kết nhanh</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent" asChild>
                <a href="/orders/history">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <ShoppingBag className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="text-center">
                    <div className="font-medium">Lịch sử đơn hàng</div>
                    <div className="text-sm text-gray-500">Xem các đơn hàng đã đặt</div>
                  </div>
                </a>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent" asChild>
                <a href="/wishlist">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <Heart className="h-4 w-4 text-red-600" />
                  </div>
                  <div className="text-center">
                    <div className="font-medium">Danh sách yêu thích</div>
                    <div className="text-sm text-gray-500">Sản phẩm đã lưu</div>
                  </div>
                </a>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent" asChild>
                <a href="/support">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Mail className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="text-center">
                    <div className="font-medium">Hỗ trợ khách hàng</div>
                    <div className="text-sm text-gray-500">Liên hệ với chúng tôi</div>
                  </div>
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <SiteFooter />
    </div>
  )
}
