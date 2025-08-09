"use client"

import { useState, useEffect, type ChangeEvent } from "react"
import { Save, Package, Tag, DollarSign, Info, List, Star, Palette, Ruler, BookOpen, Upload, PlusCircle, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"

interface ProductAttributes {
    volume: string
    gender: string
    notes: string[]
}

interface Product {
    id?: string // Optional for new products
    product_name: string
    product_thumb: string
    product_description: string
    product_price: string
    product_type: string
    product_attributes: ProductAttributes
    product_ratingAverage: number
    product_brand_id: string // Changed to ID to link to Brand interface
    category_id: string // Changed to ID to link to Category interface
    isDraft: boolean
    isPublished: boolean
}

interface Brand {
    id: string
    name: string
    logoUrl: string
}

interface Category {
    id: string
    name: string
}

// Mock Data for Brands and Categories
const mockBrands: Brand[] = [
    { id: "brand1", name: "Lancôme Paris", logoUrl: "/placeholder.svg?height=30&width=30&text=LP" },
    { id: "brand2", name: "Dior", logoUrl: "/placeholder.svg?height=30&width=30&text=DR" },
    { id: "brand3", name: "Chanel", logoUrl: "/placeholder.svg?height=30&width=30&text=CH" },
    { id: "brand4", name: "Gucci", logoUrl: "/placeholder.svg?height=30&width=30&text=GC" },
    { id: "brand5", name: "Versace", logoUrl: "/placeholder.svg?height=30&width=30&text=VS" },
]

const mockCategories: Category[] = [
    { id: "cat1", name: "Nước hoa nam" },
    { id: "cat2", name: "Nước hoa nữ" },
    { id: "cat3", name: "Nước hoa unisex" },
    { id: "cat4", name: "Nước hoa chiếc" },
]

// Mock initial product data for editing (if applicable)
const initialProductData: Product = {
    id: "PROD001",
    product_name: "Eternal Bloom",
    product_thumb: "/placeholder.svg?height=100&width=100&text=Eternal Bloom",
    product_description: "A floral fragrance that captures the essence of springtime romance.",
    product_price: "89.99",
    product_type: "eau de parfum",
    product_attributes: {
        volume: "50ml",
        gender: "female",
        notes: ["rose", "jasmine", "vanilla"],
    },
    product_ratingAverage: 4.7,
    product_brand_id: "brand1", // Linked to mockBrands
    category_id: "cat2", // Linked to mockCategories
    isDraft: false,
    isPublished: true,
}

interface AddEditProductProps {
    productToEdit?: Product // Optional prop for editing existing products
}

export default function AddEditProduct({ productToEdit }: AddEditProductProps) {
    const [product, setProduct] = useState<Product>(
        productToEdit || {
            product_name: "",
            product_thumb: "",
            product_description: "",
            product_price: "",
            product_type: "",
            product_attributes: {
                volume: "",
                gender: "",
                notes: [],
            },
            product_ratingAverage: 0,
            product_brand_id: "",
            category_id: "",
            isDraft: true,
            isPublished: false,
        },
    )
    const [notesInput, setNotesInput] = useState(product.product_attributes.notes.join(", "))
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(product.product_thumb)
    const [isSaving, setIsSaving] = useState(false)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [dialogTitle, setDialogTitle] = useState("")
    const [dialogDescription, setDialogDescription] = useState("")

    useEffect(() => {
        setImagePreviewUrl(product.product_thumb)
    }, [product])

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target
        setProduct((prev) => ({
            ...prev,
            [id]: value,
        }))
    }

    const handleAttributeChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target
        setProduct((prev) => ({
            ...prev,
            product_attributes: {
                ...prev.product_attributes,
                [id]: value,
            },
        }))
    }

    const handleNotesChange = (e: ChangeEvent<HTMLInputElement>) => {
        setNotesInput(e.target.value)
        const notesArray = e.target.value.split(",").map((note) => note.trim()).filter((note) => note)
        setProduct((prev) => ({
            ...prev,
            product_attributes: {
                ...prev.product_attributes,
                notes: notesArray,
            },
        }))
    }

    const handleSwitchChange = (id: keyof Product, checked: boolean) => {
        setProduct((prev) => ({
            ...prev,
            [id]: checked,
        }))
    }

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            setImageFile(file)
            setImagePreviewUrl(URL.createObjectURL(file))
        } else {
            setImageFile(null)
            setImagePreviewUrl(product.product_thumb || null) // Revert to original if no new file
        }
    }

    // Simulate image upload to a cloud service
    const uploadImageToCloud = async (file: File): Promise<string> => {
        setIsSaving(true)
        return new Promise((resolve) => {
            setTimeout(() => {
                const mockCloudUrl = `/uploaded-images/${Date.now()}-${file.name}`
                console.log(`Simulating upload of ${file.name} to cloud. Mock URL: ${mockCloudUrl}`)
                setIsSaving(false)
                resolve(mockCloudUrl)
            }, 1500) // Simulate network delay
        })
    }

    const handleSave = async () => {
        setIsSaving(true)
        let finalThumbUrl = product.product_thumb

        if (imageFile) {
            // Only upload if a new file is selected
            try {
                finalThumbUrl = await uploadImageToCloud(imageFile)
            } catch (error) {
                console.error("Image upload failed:", error)
                setDialogTitle("Lỗi tải ảnh")
                setDialogDescription("Không thể tải ảnh lên. Vui lòng thử lại.")
                setDialogOpen(true)
                setIsSaving(false)
                return
            }
        }

        const productToSave = {
            ...product,
            product_thumb: finalThumbUrl,
        }

        console.log("Product data to save:", productToSave)

        // Simulate API call
        setTimeout(() => {
            setIsSaving(false)
            setDialogTitle(productToEdit ? "Cập nhật thành công" : "Thêm sản phẩm thành công")
            setDialogDescription(
                productToEdit
                    ? `Sản phẩm "${productToSave.product_name}" đã được cập nhật.`
                    : `Sản phẩm "${productToSave.product_name}" đã được thêm mới.`,
            )
            setDialogOpen(true)
            // In a real app, you would navigate away or clear the form for new product
            if (!productToEdit) {
                setProduct({
                    product_name: "",
                    product_thumb: "",
                    product_description: "",
                    product_price: "",
                    product_type: "",
                    product_attributes: {
                        volume: "",
                        gender: "",
                        notes: [],
                    },
                    product_ratingAverage: 0,
                    product_brand_id: "",
                    category_id: "",
                    isDraft: true,
                    isPublished: false,
                })
                setNotesInput("")
                setImageFile(null)
                setImagePreviewUrl(null)
            }
        }, 1000)
    }

    const pageTitle = productToEdit ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"
    const pageDescription = productToEdit ? "Cập nhật thông tin chi tiết sản phẩm" : "Điền thông tin để thêm sản phẩm mới"

    return (
        <div className="flex-1 space-y-6 p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{pageTitle}</h1>
                    <p className="text-muted-foreground">{pageDescription}</p>
                </div>
                <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving ? "Đang lưu..." : <><Save className="h-4 w-4 mr-2" /> Lưu sản phẩm</>}
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Product Details Card */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Package className="h-5 w-5" /> Thông tin sản phẩm
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="product_name">Tên sản phẩm</Label>
                            <Input
                                id="product_name"
                                value={product.product_name}
                                onChange={handleChange}
                                placeholder="Ví dụ: Nước hoa Eternal Bloom"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="product_description">Mô tả sản phẩm</Label>
                            <Textarea
                                id="product_description"
                                value={product.product_description}
                                onChange={handleChange}
                                placeholder="Mô tả chi tiết về sản phẩm..."
                                className="min-h-[100px]"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="product_price">Giá sản phẩm (VND)</Label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="product_price"
                                        type="text"
                                        value={product.product_price ? new Intl.NumberFormat('vi-VN').format(Number(product.product_price)) : ''}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/[^\d]/g, '');
                                            setProduct((prev) => ({
                                                ...prev,
                                                product_price: value,
                                            }));
                                        }}
                                        placeholder="Ví dụ: 89,990"
                                        className="pl-10"
                                    />
                                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground">
                                        VND
                                    </span>
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="product_type">Loại sản phẩm</Label>
                                <Input
                                    id="product_type"
                                    value={product.product_type}
                                    onChange={handleChange}
                                    placeholder="Ví dụ: eau de parfum"
                                />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="product_thumb">Ảnh đại diện sản phẩm</Label>
                            <div 
                                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer"
                                onClick={() => document.getElementById('product_thumb_file')?.click()}
                                onDragOver={(e) => {
                                    e.preventDefault();
                                    e.currentTarget.classList.add('border-blue-400');
                                }}
                                onDragLeave={(e) => {
                                    e.preventDefault();
                                    e.currentTarget.classList.remove('border-blue-400');
                                }}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    e.currentTarget.classList.remove('border-blue-400');
                                    const files = e.dataTransfer.files;
                                    if (files && files[0]) {
                                        const file = files[0];
                                        setImageFile(file);
                                        setImagePreviewUrl(URL.createObjectURL(file));
                                    }
                                }}
                            >
                                <input
                                    id="product_thumb_file"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                                {imagePreviewUrl ? (
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="relative w-32 h-32 rounded-md overflow-hidden border">
                                            <img src={imagePreviewUrl} alt="Product Thumbnail" className="w-full h-full object-cover" />
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="absolute top-1 right-1 h-6 w-6 bg-white/80 hover:bg-white"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setImageFile(null);
                                                    setImagePreviewUrl(null);
                                                    setProduct(prev => ({ ...prev, product_thumb: "" }));
                                                }}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <p className="text-sm text-muted-foreground">Click hoặc kéo thả để thay đổi ảnh</p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                                            <Upload className="h-8 w-8 text-gray-400" />
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-lg font-medium">Tải ảnh lên</p>
                                            <p className="text-sm text-muted-foreground">Kéo thả ảnh vào đây hoặc click để chọn</p>
                                            <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 10MB</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <p className="text-xs text-muted-foreground">Chọn một ảnh từ máy tính của bạn.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="product_brand_id">Thương hiệu</Label>
                                <Select
                                    value={product.product_brand_id}
                                    onValueChange={(value) => setProduct((prev) => ({ ...prev, product_brand_id: value }))}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Chọn thương hiệu" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {mockBrands.map((brand) => (
                                            <SelectItem key={brand.id} value={brand.id}>
                                                <div className="flex items-center gap-2">
                                                    <img src={brand.logoUrl} alt={brand.name} className="w-6 h-6 rounded-full" />
                                                    {brand.name}
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="category_id">Danh mục</Label>
                                <Select
                                    value={product.category_id}
                                    onValueChange={(value) => setProduct((prev) => ({ ...prev, category_id: value }))}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Chọn danh mục" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {mockCategories.map((category) => (
                                            <SelectItem key={category.id} value={category.id}>
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Attributes & Status Card */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <List className="h-5 w-5" /> Thuộc tính sản phẩm
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="volume">Dung tích</Label>
                                <Input
                                    id="volume"
                                    value={product.product_attributes.volume}
                                    onChange={handleAttributeChange}
                                    placeholder="Ví dụ: 50ml"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="gender">Giới tính</Label>
                                <Input
                                    id="gender"
                                    value={product.product_attributes.gender}
                                    onChange={handleAttributeChange}
                                    placeholder="Ví dụ: female"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="notesInput">Hương (cách nhau bởi dấu phẩy)</Label>
                                <Input
                                    id="notesInput"
                                    value={notesInput}
                                    onChange={handleNotesChange}
                                    placeholder="Ví dụ: rose, jasmine, vanilla"
                                />
                                <div className="flex flex-wrap gap-1 mt-2">
                                    {product.product_attributes.notes.map((note, index) => (
                                        <Badge key={index} variant="secondary">
                                            {note}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Info className="h-5 w-5" /> Trạng thái & Đánh giá
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="isPublished">Công khai</Label>
                                <Switch
                                    id="isPublished"
                                    checked={product.isPublished}
                                    onCheckedChange={(checked) => handleSwitchChange("isPublished", checked)}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label htmlFor="isDraft">Bản nháp</Label>
                                <Switch
                                    id="isDraft"
                                    checked={product.isDraft}
                                    onCheckedChange={(checked) => handleSwitchChange("isDraft", checked)}
                                />
                            </div>
                            <Separator />
                            <div className="grid gap-2">
                                <Label htmlFor="product_ratingAverage">Đánh giá trung bình</Label>
                                <div className="flex items-center gap-2">
                                    <Star className="h-4 w-4 text-yellow-500" />
                                    <Input
                                        id="product_ratingAverage"
                                        type="number"
                                        step="0.1"
                                        min="0"
                                        max="5"
                                        value={product.product_ratingAverage}
                                        onChange={(e) =>
                                            setProduct((prev) => ({
                                                ...prev,
                                                product_ratingAverage: parseFloat(e.target.value),
                                            }))
                                        }
                                        className="w-24"
                                    />
                                    <span className="text-sm text-muted-foreground">/ 5.0</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Success/Error Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{dialogTitle}</DialogTitle>
                        <DialogDescription>{dialogDescription}</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button onClick={() => setDialogOpen(false)}>Đóng</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
