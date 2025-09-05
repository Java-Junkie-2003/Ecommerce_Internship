import { use, useEffect, useState } from "react"
import { Plus, Pencil, Trash2, Eye, MoreHorizontal } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
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
import { Category } from "@/types/model/category"
import { useAppDispatch, useAppSelector } from "@/redux/hook"
import { RootState } from "@/redux/store"
import { createCategory, fetchCategories } from "@/redux/thunks/category.thunk"
import { toast } from "sonner"
import { Route } from "../+types/root"

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Quản lý danh mục" }, 
        { name: "description", content: "Quản lý và theo dõi các danh mục của bạn" },
    ]
}

export default function Component() {

    const category = useAppSelector((state: RootState) => state.category)
    const categories = category.categories

    const dispatch = useAppDispatch()

    const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false)
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
    const [currentCategory, setCurrentCategory] = useState<Category | null>(null)
    const [categoryName, setCategoryName] = useState("")

    const handleOpenAddModal = () => {
        setCurrentCategory(null) // Clear current category for add mode
        setCategoryName("")
        setIsAddEditModalOpen(true)
    }

    const handleOpenEditModal = (category: Category) => {
        setCurrentCategory(category)
        setCategoryName(category.category_name)
        setIsAddEditModalOpen(true)
    }

    const handleSaveCategory = () => {
        if (!categoryName.trim()) {
            alert("Tên danh mục không được để trống.")
            return
        }

        if (currentCategory) {
            // Edit existing category

        } else {
            // Add new category
            dispatch(createCategory({ category_name: categoryName })).unwrap()
                .then(() => {
                    console.log("Category created successfully");
                    toast.success("Danh mục đã được tạo thành công.")
                })
                .catch((error) => {
                    toast.error("Đã xảy ra lỗi khi tạo danh mục.")
                    console.error("Error creating category:", error)
                })
        }
        setIsAddEditModalOpen(false)
    }

    const handleOpenDeleteConfirm = (category: Category) => {
        setCurrentCategory(category)
        setIsDeleteConfirmOpen(true)
    }

    const handleDeleteCategory = () => {
        if (currentCategory) {
            // setCategories(categories.filter((cat) => cat.id !== currentCategory.id))
            setIsDeleteConfirmOpen(false)
            setCurrentCategory(null)
        }
    }

    return (
        <div className="flex-1 space-y-6 p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Quản lý danh mục</h1>
                    <p className="text-muted-foreground">Tổng cộng {categories.length} danh mục</p>
                </div>
                <Button onClick={handleOpenAddModal}>
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm danh mục mới
                </Button>
            </div>

            {/* Categories Table */}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">ID</TableHead>
                            <TableHead>Tên danh mục</TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {categories.map((category) => (
                            <TableRow key={category._id}>
                                <TableCell className="font-medium">{category._id}</TableCell>
                                <TableCell>{category.category_name}</TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => handleOpenEditModal(category)}>
                                                <Pencil className="h-4 w-4 mr-2" />
                                                Chỉnh sửa
                                            </DropdownMenuItem>
                                            {/* <DropdownMenuItem onClick={() => handleOpenDeleteConfirm(category)} className="text-red-600">
                                                <Trash2 className="h-4 w-4 mr-2" />
                                                Xóa
                                            </DropdownMenuItem> */}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Add/Edit Category Modal */}
            <Dialog open={isAddEditModalOpen} onOpenChange={setIsAddEditModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{currentCategory ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}</DialogTitle>
                        <DialogDescription>
                            {currentCategory ? "Cập nhật thông tin danh mục." : "Điền thông tin để thêm một danh mục mới."}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="categoryName" className="text-right">
                                Tên danh mục
                            </Label>
                            <Input
                                id="categoryName"
                                value={categoryName}
                                onChange={(e) => setCategoryName(e.target.value)}
                                className="col-span-3"
                                placeholder="Ví dụ: Nước hoa nam"
                            />
                        </div>
                        {/* <div className="grid grid-cols-4 items-start gap-4">
                            <Label htmlFor="categoryDescription" className="text-right pt-2">
                                Mô tả
                            </Label>
                            <Textarea
                                id="categoryDescription"
                                value={categoryDescription}
                                onChange={(e) => setCategoryDescription(e.target.value)}
                                className="col-span-3 min-h-[80px]"
                                placeholder="Mô tả ngắn về danh mục..."
                            />
                        </div> */}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddEditModalOpen(false)}>
                            Hủy
                        </Button>
                        <Button onClick={handleSaveCategory}>
                            {currentCategory ? "Lưu thay đổi" : "Thêm danh mục"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            {currentCategory && (
                <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Xác nhận xóa danh mục</DialogTitle>
                            <DialogDescription>
                                Bạn có chắc chắn muốn xóa danh mục <span className="font-semibold">{currentCategory.category_name}</span> không?
                                Hành động này không thể hoàn tác.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(false)}>
                                Hủy
                            </Button>
                            <Button variant="destructive" onClick={handleDeleteCategory}>
                                Xóa
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    )
}
