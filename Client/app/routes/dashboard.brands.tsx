
import type { Route } from "../+types/root";

"use client"

import { use, useEffect, useState } from "react"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
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
import { createBrand, fetchBrands } from "@/redux/thunks/brand.thunk";
import { toast } from "sonner";


export default function Component() {

  const brand = useAppSelector((state: RootState) => state.brand)
  const brands = brand.brands

  const dispatch = useAppDispatch()

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [currentBrand, setCurrentBrand] = useState<Brand | null>(null)
  const [newBrandName, setNewBrandName] = useState("")
  const [newBrandLogoUrl, setNewBrandLogoUrl] = useState("")

  const [logoFile, setLogoFile] = useState<File | null>(null)

  // useEffect(() => {
  //   setNewBrandName("")
  //   setNewBrandLogoUrl("")
  //   setLogoFile(null)
  //   setCurrentBrand(null)
  // }, [isAddModalOpen])

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
            brand_name: newBrandName.trim().toUpperCase(),
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

  const handleEditBrand = () => {
    if (currentBrand && newBrandName.trim() && newBrandLogoUrl.trim()) {
      setIsEditModalOpen(false)
      setCurrentBrand(null)
      setNewBrandName("")
      setNewBrandLogoUrl("")
    }
  }

  const handleDeleteBrand = () => {
    if (currentBrand) {
      setIsDeleteConfirmOpen(false)
      setCurrentBrand(null)
    }
  }

  const openEditModal = (brand: Brand) => {
    setCurrentBrand(brand)
    setNewBrandName(brand.brand_icon)
    setNewBrandLogoUrl(brand.brand_icon)
    setIsEditModalOpen(true)
  }

  const openDeleteConfirm = (brand: Brand) => {
    setCurrentBrand(brand)
    setIsDeleteConfirmOpen(true)
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Quản lý thương hiệu</h1>
        <p className="text-muted-foreground">Tổng cộng {brands.length} thương hiệu</p>
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
        {brands.map((brand) => (
          <Card key={brand._id} className="flex flex-col flex-wrap relative">
            <CardHeader className="flex flex-row items-center justify-between px-3 py-0 border-b relative">
              <Button
                variant="outline"
                size="sm"
                className="text-gray-600 hover:text-gray-800 w-1/2"
                onClick={() => openEditModal(brand)}
              >
                <Pencil className="h-4 w-4 mr-1" /> Thay đổi
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 hover:text-red-800 w-1/2"
                onClick={() => openDeleteConfirm(brand)}
              >
                <Trash2 className="h-4 w-4 mr-1" /> Xóa
              </Button>
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
            </CardContent>
          </Card>
        ))}
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
                  value={currentBrand.brand_name}
                  onChange={(e) => setCurrentBrand({ ...currentBrand, brand_name: e.target.value })}
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
                          setCurrentBrand({ ...currentBrand, brand_icon: objectUrl });
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
        <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Xác nhận xóa thương hiệu</DialogTitle>
              <DialogDescription>
                Bạn có chắc chắn muốn xóa thương hiệu <span className="font-semibold">{currentBrand.brand_name}</span> không?
                Hành động này không thể hoàn tác.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(false)}>
                Hủy
              </Button>
              <Button variant="destructive" onClick={handleDeleteBrand}>
                Xóa
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