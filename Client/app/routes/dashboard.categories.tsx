
import { useState } from "react"
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

interface Category {
    id: string
    name: string
    description?: string
}

const initialCategories: Category[] = [
    { id: "cat1", name: "Nước hoa nam", description: "Các loại nước hoa dành cho nam giới." },
    { id: "cat2", name: "Nước hoa nữ", description: "Các loại nước hoa dành cho nữ giới." },
    { id: "cat3", name: "Nước hoa unisex", description: "Các loại nước hoa phù hợp cho cả nam và nữ." },
    { id: "cat4", name: "Nước hoa chiếc", description: "Nước hoa chiết, dung tích nhỏ gọn." },
    { id: "cat5", name: "Nước hoa mini", description: "Các chai nước hoa dung tích nhỏ, tiện lợi mang theo." },
]

export default function Component() {
    const [categories, setCategories] = useState<Category[]>(initialCategories)
    const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false)
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
    const [currentCategory, setCurrentCategory] = useState<Category | null>(null)
    const [categoryName, setCategoryName] = useState("")
    const [categoryDescription, setCategoryDescription] = useState("")

    const handleOpenAddModal = () => {
        setCurrentCategory(null) // Clear current category for add mode
        setCategoryName("")
        setCategoryDescription("")
        setIsAddEditModalOpen(true)
    }

    const handleOpenEditModal = (category: Category) => {
        setCurrentCategory(category)
        setCategoryName(category.name)
        setCategoryDescription(category.description || "")
        setIsAddEditModalOpen(true)
    }

    const handleSaveCategory = () => {
        if (!categoryName.trim()) {
            alert("Tên danh mục không được để trống.")
            return
        }

        if (currentCategory) {
            // Edit existing category
            setCategories(
                categories.map((cat) =>
                    cat.id === currentCategory.id
                        ? { ...cat, name: categoryName.trim(), description: categoryDescription.trim() }
                        : cat,
                ),
            )
        } else {
            // Add new category
            const newId = `cat${categories.length + 1}` // Simple ID generation
            setCategories([
                ...categories,
                { id: newId, name: categoryName.trim(), description: categoryDescription.trim() },
            ])
        }
        setIsAddEditModalOpen(false)
    }

    const handleOpenDeleteConfirm = (category: Category) => {
        setCurrentCategory(category)
        setIsDeleteConfirmOpen(true)
    }

    const handleDeleteCategory = () => {
        if (currentCategory) {
            setCategories(categories.filter((cat) => cat.id !== currentCategory.id))
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
                            <TableHead>Mô tả</TableHead>
                            <TableHead className="w-[50px]"></TableHead> {/* For actions */}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {categories.map((category) => (
                            <TableRow key={category.id}>
                                <TableCell className="font-medium">{category.id}</TableCell>
                                <TableCell>{category.name}</TableCell>
                                <TableCell className="text-muted-foreground max-w-[400px] truncate">
                                    {category.description || "Không có mô tả"}
                                </TableCell>
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
                                            <DropdownMenuItem onClick={() => handleOpenDeleteConfirm(category)} className="text-red-600">
                                                <Trash2 className="h-4 w-4 mr-2" />
                                                Xóa
                                            </DropdownMenuItem>
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
                        <div className="grid grid-cols-4 items-start gap-4">
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
                        </div>
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
                                Bạn có chắc chắn muốn xóa danh mục <span className="font-semibold">{currentCategory.name}</span> không?
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
