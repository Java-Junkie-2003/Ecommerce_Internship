
import type { Route } from "../+types/root";

"use client"

import { use, useEffect, useState } from "react"
import { Plus, Pencil, Trash2, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Brand } from "@/types/model/brand"
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { RootState } from "@/redux/store";
import { createBrand, disableBrand, fetchBrands, updateBrand } from "@/redux/thunks/brand.thunk";
import { toast } from "sonner";

export default function Component() {

  const brand = useAppSelector((state: RootState) => state.brand)
  const brands = brand.brands

  const dispatch = useAppDispatch()

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDisableConfirmOpen, setIsDisableConfirmOpen] = useState(false)
  const [currentBrand, setCurrentBrand] = useState<Brand | null>(null)
  const [newBrandName, setNewBrandName] = useState("")
  const [newBrandLogoUrl, setNewBrandLogoUrl] = useState("")

  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [filterStatus, setFilterStatus] = useState<"all" | "published" | "unpublished">("all")

  useEffect(() => {
    setNewBrandName("")
    setNewBrandLogoUrl("")
    setLogoFile(null)
    setCurrentBrand(null)
  }, [isAddModalOpen])

  const handleAddBrand = async () => {
    if (newBrandName.trim() && logoFile) {

      // upload brand logo
      const formData = new FormData()
      formData.append('file', logoFile)
      formData.append('upload_preset', 'ecommerce')

      fetch('https://api.cloudinary.com/v1_1/dqfpglgsr/image/upload', {
        method: 'POST',
        body: formData
      })
        .then(response => response.json())
        .then(data => {
          const logoUrl = data.secure_url
          setNewBrandLogoUrl(logoUrl)
        })
        .catch((error) => {
          toast.error("Có lỗi xảy ra khi tải ảnh lên.")
          console.error("Error uploading logo:", error)
        })
        .finally(() => {
          // Create brand after logo upload
          dispatch(createBrand({
            brand_name: newBrandName.trim(),
            brand_icon: newBrandLogoUrl.trim(),
          })).unwrap()
        })
        .then(() => {
          setIsAddModalOpen(false)
          setNewBrandName("")
          setNewBrandLogoUrl("")
          toast.success("Thêm thương hiệu thành công")
        })
        .catch((error) => {
          toast.error("Thêm thương hiệu thất bại")
          console.error("Error adding brand:", error)
        })
    }
  }

  // call api to update brand
  const handleEditBrand = () => {
    if (currentBrand && newBrandName.trim() && newBrandLogoUrl.trim()) {
      // call api to update brand
      console.log("Updating brand:", currentBrand._id, newBrandName, newBrandLogoUrl)
      dispatch(updateBrand({
        id: currentBrand._id,
        brandData: {
          brand_name: newBrandName.trim(),
          brand_icon: newBrandLogoUrl.trim(),
        }
      })).unwrap()
        .then(() => {
          setIsEditModalOpen(false)
          setCurrentBrand(null)
          setNewBrandName("")
          setNewBrandLogoUrl("")
          dispatch(fetchBrands())

          toast.success("Cập nhật thương hiệu thành công")
        })
        .catch((error) => {
          toast.error("Cập nhật thương hiệu thất bại")
          console.error("Error updating brand:", error)
        })
    }
  }

  const handleDisableBrand = () => {
    if (currentBrand) {
      // call api to disable brand
      dispatch(disableBrand(currentBrand._id)).unwrap()
        .then(() => {
          setIsDisableConfirmOpen(false)
          setCurrentBrand(null)
          dispatch(fetchBrands())
          toast.success("Vô hiệu hóa thương hiệu thành công")
        })
        .catch((error) => {
          toast.error("Vô hiệu hóa thương hiệu thất bại")
          console.error("Error disabling brand:", error)
        })

    }
  }

  const openEditModal = (brand: Brand) => {
    setCurrentBrand(brand)
    setNewBrandName(brand.brand_name)
    setNewBrandLogoUrl(brand.brand_icon)
    setIsEditModalOpen(true)
  }

  const openDisableConfirm = (brand: Brand) => {
    setCurrentBrand(brand)
    setIsDisableConfirmOpen(true)
  }

  // Filter brands based on status
  const filteredBrands = brands.filter(brand => {
    if (filterStatus === "published") return brand.isPublished
    if (filterStatus === "unpublished") return !brand.isPublished
    return true
  })

  // Count brands by status
  const publishedCount = brands.filter(brand => brand.isPublished).length
  const unpublishedCount = brands.length - publishedCount

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý thương hiệu</h1>
          <div className="flex items-center gap-4 mt-2">
            <p className="text-muted-foreground">Tổng cộng {brands.length} thương hiệu</p>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
                Hoạt động: {publishedCount}
              </Badge>
              <Badge variant="secondary" className="bg-red-50 text-red-700 border-red-200">
                Đã tắt: {unpublishedCount}
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={filterStatus} onValueChange={(value: "all" | "published" | "unpublished") => setFilterStatus(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Lọc theo trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả thương hiệu</SelectItem>
              <SelectItem value="published">Đang hoạt động</SelectItem>
              <SelectItem value="unpublished">Đã tắt</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Brands Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative">
        {/* Add New Brand Card */}
        <Card
          className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 hover:border-blue-500 transition-colors cursor-pointer"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus className="h-12 w-12 text-gray-400 mb-3" />
          <span className="text-lg font-medium text-gray-600">THÊM THƯƠNG HIỆU</span>
        </Card>

        {/* Existing Brand Cards */}
        {filteredBrands.length === 0 && filterStatus !== "all" ? (
          <div className="col-span-full text-center py-12">
            <div className="text-muted-foreground">
              <Filter className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Không có thương hiệu nào với bộ lọc này</p>
              <p className="text-sm mt-2">Hãy thử thay đổi bộ lọc hoặc thêm thương hiệu mới</p>
            </div>
          </div>
        ) : (
          filteredBrands.map((brand) => (
          <Card key={brand._id} className={`flex flex-col flex-wrap relative ${!brand.isPublished ? 'opacity-60 border-red-200' : ''}`}>
            <CardHeader className="flex flex-row items-center justify-between px-3 py-0 border-b relative">
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-gray-600 hover:text-gray-800 px-2"
                  onClick={() => openEditModal(brand)}
                >
                  <Pencil className="h-3 w-3 mr-1" /> Sửa
                </Button>
                {brand.isPublished && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-800 px-2"
                    onClick={() => openDisableConfirm(brand)}
                  >
                    <Trash2 className="h-3 w-3 mr-1" /> Tắt
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center p-6 flex-grow">
              <div className="relative w-full h-32 mb-4 flex items-center justify-center">
                <img
                  src={brand.brand_icon}
                  alt={brand.brand_name}
                  className="w-full h-full object-contain"
                  loading="lazy"
                />
              </div>
              <h3 className="text-lg font-semibold text-center">{brand.brand_name}</h3>
              {!brand.isPublished && (
                <p className="text-xs text-red-600 text-center mt-2">
                  Thương hiệu này đã bị vô hiệu hóa
                </p>
              )}
            </CardContent>
          </Card>
          ))
        )}
      </div>

      {/* Add Brand Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Thêm thương hiệu mới</DialogTitle>
            <DialogDescription>Điền thông tin để thêm một thương hiệu mới.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="brandName" className="text-right">
                Tên
              </Label>
              <Input
                id="brandName"
                value={newBrandName}
                onChange={(e) => setNewBrandName(e.target.value)}
                className="col-span-3"
                placeholder="Ví dụ: Lancôme Paris"
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-2">
                Logo
              </Label>
              <div className="col-span-3">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                  <input
                    type="file"
                    id="logoUpload"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setLogoFile(file);
                        // create object URL
                        const objectUrl = URL.createObjectURL(file);
                        setNewBrandLogoUrl(objectUrl);
                      }
                    }}
                  />

                  <label htmlFor="logoUpload" className="cursor-pointer">
                    {newBrandLogoUrl ? (
                      <div className="space-y-2">
                        <img
                          src={newBrandLogoUrl}
                          alt="Preview"
                          className="w-20 h-20 object-contain mx-auto"
                        />
                        <p className="text-sm text-blue-600">Nhần vào để đổi ảnh</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Plus className="w-8 h-8 mx-auto text-gray-400" />
                        <p className="text-sm text-gray-600">Nhấn vào để tải lên logo</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>
            </div>
            {/* <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="description" className="text-right pt-2">
                Mô tả
              </Label>
              <Textarea
                id="description"
                value={newBrandDescription}
                onChange={(e) => setNewBrandDescription(e.target.value)}
                className="col-span-3 min-h-[80px]"
                placeholder="Mô tả ngắn về thương hiệu..."
              />
            </div> */}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleAddBrand}>Thêm thương hiệu</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Brand Modal */}
      {currentBrand && (
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Chỉnh sửa thương hiệu</DialogTitle>
              <DialogDescription>Cập nhật thông tin cho thương hiệu {currentBrand.brand_name}.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editBrandName" className="text-right">
                  Tên thương hiệu
                </Label>
                <Input
                  id="editBrandName"
                  value={newBrandName}
                  onChange={(e) => setNewBrandName(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right pt-2">
                  Logo
                </Label>
                <div className="col-span-3">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                    <input
                      type="file"
                      id="logoUpload"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setLogoFile(file);
                          // create object URL
                          const objectUrl = URL.createObjectURL(file);
                          setCurrentBrand({ ...currentBrand, brand_icon: objectUrl, brand_name: newBrandName });
                        }
                      }}
                    />

                    <label htmlFor="logoUpload" className="cursor-pointer">
                      {currentBrand.brand_icon ? (
                        <div className="space-y-2">
                          <img
                            src={currentBrand.brand_icon}
                            alt="Preview"
                            className="w-20 h-20 object-contain mx-auto"
                          />
                          <p className="text-sm text-blue-600">Nhần vào để đổi ảnh</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Plus className="w-8 h-8 mx-auto text-gray-400" />
                          <p className="text-sm text-gray-600">Nhấn vào để tải lên logo</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>
              </div>
              {/* <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="editDescription" className="text-right pt-2">
                  Mô tả
                </Label>
                <Textarea
                  id="editDescription"
                  value={newBrandDescription}
                  onChange={(e) => setNewBrandDescription(e.target.value)}
                  className="col-span-3 min-h-[80px]"
                />
              </div> */}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Hủy
              </Button>
              <Button onClick={handleEditBrand}>Lưu thay đổi</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      {currentBrand && (
        <Dialog open={isDisableConfirmOpen} onOpenChange={setIsDisableConfirmOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-destructive">Xác nhận vô hiệu hóa thương hiệu</DialogTitle>
              <DialogDescription className="space-y-3 text-left">
                <p>
                  Bạn có chắc chắn muốn vô hiệu hóa thương hiệu <span className="font-semibold text-foreground">{currentBrand.brand_name}</span> không?
                </p>
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                  <p className="font-medium text-destructive mb-2">Cảnh báo quan trọng:</p>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Tất cả sản phẩm thuộc thương hiệu này sẽ bị vô hiệu hóa</li>
                    <li>• Khách hàng sẽ không thể tìm kiếm hoặc mua các sản phẩm này</li>
                    <li>• <span className="text-destructive font-medium">Hành động này KHÔNG THỂ hoàn tác</span></li>
                  </ul>
                </div>
                <p className="text-sm">
                  Vui lòng cân nhắc kỹ trước khi thực hiện hành động này.
                </p>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDisableConfirmOpen(false)}>
                Hủy bỏ
              </Button>
              <Button variant="destructive" onClick={handleDisableBrand}>
                Tôi hiểu - Vô hiệu hóa
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Quản lý thương hiệu" },
    { name: "description", content: "Quản lý và theo dõi các thương hiệu của bạn" },
  ];
}