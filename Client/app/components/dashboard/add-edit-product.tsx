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
import { Product, ProductAttributes } from "@/types/model/product"
import { Brand } from "@/types/model/brand"
import { Category } from "@/types/model/category"
import { useAppDispatch, useAppSelector } from "@/redux/hook"
import { RootState } from "@/redux/store"
import { ApiService } from "@/lib/api"
import { ENDPOINTS } from "@/utils/api.endpoints"
import { DefaultDTO } from "@/types/dto"
import { useNavigate } from "react-router"
import { toast } from "sonner"

export default function AddEditProduct({ productToEdit }: { productToEdit?: Product }) {

    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const category = useAppSelector((state: RootState) => state.category)
    const brand = useAppSelector((state: RootState) => state.brand)

    const isCreateMode = !productToEdit;

    const [brands, setBrands] = useState<Brand[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [priceInput, setPriceInput] = useState<number | "">("")

    useEffect(() => {
        setBrands(brand.brands)
        setCategories(category.categories)
    }, [brand, category])

    const [product, setProduct] = useState<Product>(
        productToEdit || {
            _id: "",
            product_name: "",
            product_thumb: "",
            product_description: "",
            product_price: 0,
            product_type: "Perfume",
            product_attributes: {
                fragrance_family: "",
                top_note: "",
                base_note: "",
                concentration: "",
                volume: 0,
                gender: "",
                longevity_hours: "",
                sillage: "",
                launch_year: new Date().getFullYear(),
            },
            product_ratingAverage: 5,
            product_categories: [],
            product_brand: {
                _id: "",
                brand_name: "",
                brand_icon: "",
            },
            isDraft: true,
            isPublished: false,
            createdAt: "",
            updatedAt: "",
            __v: 0,
        }
    )
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
                [id]: id === 'volume' || id === 'launch_year' ? Number(value) : value,
            },
        }))
    }

    const handleSwitchChange = (id: keyof Product, checked: boolean) => {
        setProduct((prev) => ({
            ...prev,
            [id]: checked,
        }))
    }

    const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            setImageFile(file)

            // Create object URL
            const objectUrl = URL.createObjectURL(file)
            setImagePreviewUrl(objectUrl)
        } else {
            setImageFile(null)
            setImagePreviewUrl(product.product_thumb || null) // Revert to original if no new file
        }
    }

    const preSaveCheck = () => {
        if (!product.product_name) {
            setDialogTitle("Thiếu tên sản phẩm")
            setDialogDescription("Vui lòng nhập tên sản phẩm.")
            setDialogOpen(true)
            return false
        }
        if (!product.product_price) {
            setDialogTitle("Thiếu giá sản phẩm")
            setDialogDescription("Vui lòng nhập giá sản phẩm.")
            setDialogOpen(true)
            return false
        }
        return true
    }

    const handleSave = async () => {
        setIsSaving(true)
        let finalThumbUrl = product.product_thumb

        const productToSave = {
            ...product,
            product_thumb: finalThumbUrl,
        }

        console.log("Product data to save:", productToSave)

        if (!preSaveCheck()) {
            setIsSaving(false)
            return
        } else {
            try {
                // Transform the product data for API request
                
                // Upload image to Cloudinary if a new image file is selected
                if (imageFile) {
                    const formData = new FormData()
                    formData.append('file', imageFile)
                    formData.append('upload_preset', 'ecommerce') // Replace with your actual upload preset name
                    
                    try {
                        const cloudinaryResponse = await fetch(
                            'https://api.cloudinary.com/v1_1/dqfpglgsr/image/upload', // Replace with your actual cloud name
                            {
                                method: 'POST',
                                body: formData
                            }
                        )
                        
                        if (cloudinaryResponse.ok) {
                            const cloudinaryData = await cloudinaryResponse.json()
                            finalThumbUrl = cloudinaryData.secure_url
                        } else {
                            throw new Error('Failed to upload image to Cloudinary')
                        }
                    } catch (uploadError) {
                        console.error('Error uploading image:', uploadError)
                        toast.error("Có lỗi xảy ra khi tải ảnh lên.")
                        setIsSaving(false)
                        return
                    }
                }

                const productForApi = {
                    ...productToSave,
                    product_thumb: finalThumbUrl,
                    product_brand: productToSave.product_brand._id,
                    product_categories: productToSave.product_categories.map(cat => cat._id)
                }

                if(isCreateMode) {
                    const response = await ApiService.post<DefaultDTO>(ENDPOINTS.ADMIN.PRODUCT.CREATE, productForApi)
                    console.log("Product created successfully:", response)
                    toast.success("Tạo sản phẩm thành công.")
                    // Navigate to the product management
                    navigate(`/dashboard/products`)
                } else {
                    const response = await ApiService.patch<DefaultDTO>(ENDPOINTS.ADMIN.PRODUCT.UPDATE(productToEdit._id), productForApi)
                    toast.success("Cập nhật sản phẩm thành công.")
                    setIsSaving(false)
                }
            } catch (error) {
                console.error("Error saving product:", error)
                toast.error("Có lỗi xảy ra khi lưu sản phẩm.")
                setIsSaving(false)
            }
        }
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

                        <div className="grid grid-cols-1 gap-4">
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
                                                product_price: Number(value),
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

                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex flex-col gap-2 flex-1">
                                <Label htmlFor="product_brand">Thương hiệu</Label>
                                <Select
                                    value={product.product_brand._id}
                                    onValueChange={(value) => {
                                        const selectedBrand = brands.find(brand => brand._id === value);
                                        if (selectedBrand) {
                                            setProduct((prev) => ({
                                                ...prev,
                                                product_brand: {
                                                    _id: selectedBrand._id,
                                                    brand_name: selectedBrand.brand_name,
                                                    brand_icon: selectedBrand.brand_icon,
                                                },
                                            }));
                                        }
                                    }}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Chọn thương hiệu" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {brands.map((brand) => (
                                            <SelectItem key={brand._id} value={brand._id}>
                                                <img src={brand.brand_icon} alt={brand.brand_name} className="w-6 h-6 mr-2" />
                                                {brand.brand_name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex flex-col gap-2 flex-1">
                                <Label htmlFor="product_categories">Danh mục</Label>
                                <Select
                                    value=""
                                    onValueChange={(value) => {
                                        const category = categories.find(cat => cat._id === value);
                                        if (category && !product.product_categories.some(cat => cat._id === category._id)) {
                                            setProduct((prev) => ({
                                                ...prev,
                                                product_categories: [...prev.product_categories, { _id: category._id, category_name: category.category_name }]
                                            }));
                                        }
                                    }}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Chọn danh mục" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories
                                            .filter(category => !product.product_categories.some(cat => cat._id === category._id))
                                            .map((category) => (
                                                <SelectItem key={category._id} value={category._id}>
                                                    {category.category_name}
                                                </SelectItem>
                                            ))}
                                    </SelectContent>
                                </Select>
                                {product.product_categories.length > 0 && (
                                    <div className="mt-2 flex flex-wrap gap-1">
                                        {product.product_categories.map((category) => (
                                            <div
                                                key={category._id}
                                                className="flex items-center bg-gray-200 text-gray-800 text-xs pe-1 ps-2 py-1 rounded-full"
                                            >
                                                <span>{category.category_name}</span>
                                                <button
                                                    type="button"
                                                    className="ml-1 p-1 rounded-full hover:bg-gray-300 flex items-center justify-center"
                                                    onClick={() =>
                                                        setProduct((prev) => ({
                                                            ...prev,
                                                            product_categories: prev.product_categories.filter(
                                                                (cat) => cat._id !== category._id
                                                            ),
                                                        }))
                                                    }
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

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
                                <Label htmlFor="fragrance_family">Họ hương</Label>
                                <Input
                                    id="fragrance_family"
                                    value={product.product_attributes.fragrance_family}
                                    onChange={handleAttributeChange}
                                    placeholder="Ví dụ: Oriental, Fresh, Woody"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="top_note">Hương đầu</Label>
                                <Input
                                    id="top_note"
                                    value={product.product_attributes.top_note}
                                    onChange={handleAttributeChange}
                                    placeholder="Ví dụ: Bergamot, Lemon"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="base_note">Hương cuối</Label>
                                <Input
                                    id="base_note"
                                    value={product.product_attributes.base_note}
                                    onChange={handleAttributeChange}
                                    placeholder="Ví dụ: Musk, Sandalwood"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="concentration">Nồng độ</Label>
                                <Input
                                    id="concentration"
                                    value={product.product_attributes.concentration}
                                    onChange={handleAttributeChange}
                                    placeholder="Ví dụ: Eau de Parfum, Eau de Toilette"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="volume">Dung tích (ml)</Label>
                                <Input
                                    id="volume"
                                    type="number"
                                    value={product.product_attributes.volume}
                                    onChange={handleAttributeChange}
                                    placeholder="Ví dụ: 50"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="gender">Giới tính</Label>
                                <Select
                                    value={product.product_attributes.gender}
                                    onValueChange={(value) => setProduct((prev) => ({
                                        ...prev,
                                        product_attributes: {
                                            ...prev.product_attributes,
                                            gender: value,
                                        },
                                    }))}
                                    
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Chọn giới tính" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Male">Nam</SelectItem>
                                        <SelectItem value="Female">Nữ</SelectItem>
                                        <SelectItem value="Unisex">Unisex</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="longevity_hours">Độ lưu hương</Label>
                                <Input
                                    id="longevity_hours"
                                    value={product.product_attributes.longevity_hours}
                                    onChange={handleAttributeChange}
                                    placeholder="Ví dụ: 6-8 giờ"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="sillage">Độ tỏa hương</Label>
                                <Input
                                    id="sillage"
                                    value={product.product_attributes.sillage}
                                    onChange={handleAttributeChange}
                                    placeholder="Ví dụ: Moderate, Strong"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="launch_year">Năm ra mắt</Label>
                                <Input
                                    id="launch_year"
                                    type="number"
                                    value={product.product_attributes.launch_year}
                                    onChange={handleAttributeChange}
                                    placeholder="Ví dụ: 2023"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* <Card>
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
                    </Card> */}
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
