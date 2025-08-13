
import { useState } from "react"
import {
    Heart,
    ShoppingCart,
    Star,
    Share2,
    Truck,
    Shield,
    RotateCcw,
    ChevronLeft,
    ChevronRight,
    Plus,
    Minus,
    Tag,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import SiteFooter from "@/components/layout/client-footer"
import SiteHeader from "@/components/layout/client-header"

const productImages = [
    "/images/perfumes/irish-leather-eau-de-parfum-781.jpg",
    "/images/perfumes/irish-leather-eau-de-parfum-781.jpg",
    "/images/perfumes/irish-leather-eau-de-parfum-781.jpg",
    "/images/perfumes/irish-leather-eau-de-parfum-781.jpg",
]

const relatedProducts = [
    {
        id: 1,
        name: "Luxury Perfume Collection",
        price: 1800000,
        image: "/placeholder.svg?height=200&width=200",
        rating: 4.8,
    },
    {
        id: 2,
        name: "Premium Fragrance Set",
        price: 2200000,
        image: "/placeholder.svg?height=200&width=200",
        rating: 4.9,
    },
    {
        id: 3,
        name: "Exclusive Scent Edition",
        price: 2500000,
        image: "/placeholder.svg?height=200&width=200",
        rating: 4.7,
    },
    {
        id: 4,
        name: "Designer Perfume Line",
        price: 1900000,
        image: "/placeholder.svg?height=200&width=200",
        rating: 4.6,
    },
]

const reviews = [
    {
        id: 1,
        name: "Nguyễn Văn A",
        rating: 5,
        date: "2024-01-15",
        comment: "Sản phẩm rất tuyệt vời, mùi hương thơm lâu và sang trọng. Đóng gói cẩn thận, giao hàng nhanh.",
        avatar: "/placeholder.svg?height=40&width=40",
    },
    {
        id: 2,
        name: "Trần Thị B",
        rating: 4,
        date: "2024-01-10",
        comment: "Chất lượng tốt, mùi hương dễ chịu. Giá cả hợp lý so với chất lượng sản phẩm.",
        avatar: "/placeholder.svg?height=40&width=40",
    },
    {
        id: 3,
        name: "Lê Văn C",
        rating: 5,
        date: "2024-01-05",
        comment: "Mình đã dùng nhiều loại nước hoa khác nhau, nhưng sản phẩm này thực sự ấn tượng. Sẽ mua lại.",
        avatar: "/placeholder.svg?height=40&width=40",
    },
]

export default function Component() {
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [quantity, setQuantity] = useState(1)
    const [isWishlisted, setIsWishlisted] = useState(false)

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % productImages.length)
    }

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length)
    }

    const updateQuantity = (newQuantity: number) => {
        if (newQuantity >= 1) {
            setQuantity(newQuantity)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <SiteHeader />

            <div className="container mx-auto px-4 py-8 max-w-7xl">
                {/* Breadcrumb */}
                <nav className="text-sm text-gray-500 mb-8">
                    <a href="#" className="hover:text-gray-700">
                        Trang chủ
                    </a>
                    <span className="mx-2">/</span>
                    <a href="#" className="hover:text-gray-700">
                        Nước hoa nam
                    </a>
                    <span className="mx-2">/</span>
                    <span className="text-gray-900">A Luxury Perfume Every Ever</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                    {/* Product Images */}
                    <div className="space-y-4">
                        <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                            <img
                                src={productImages[currentImageIndex]}
                                alt="Product Image"
                                className="object-cover w-full h-full"
                            />
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                                onClick={prevImage}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                                onClick={nextImage}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>

                        {/* Thumbnail Images */}
                        <div className="grid grid-cols-4 gap-2">
                            {productImages.map((image, index) => (
                                <button
                                    key={index}
                                    className={`aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 ${index === currentImageIndex ? "border-blue-500" : "border-transparent"
                                        }`}
                                    onClick={() => setCurrentImageIndex(index)}
                                >
                                    <img src={image} alt={`Thumbnail ${index + 1}`} className="object-cover w-full h-full" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-4">A LUXURY PERFUME EVERY EVER.</h1>

                            <div className="flex items-center gap-4 mb-4">
                                <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`h-4 w-4 ${i < 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                                        />
                                    ))}
                                    <span className="ml-2 text-sm text-gray-600">(4.8) • 124 đánh giá</span>
                                </div>
                                <Badge variant="secondary">Còn hàng</Badge>
                            </div>

                            <p className="text-gray-600 leading-relaxed mb-6">
                                Lorem ipsum dolor sit amet consectetur adipiscing elit. Sit amet consectetur adipiscing elit quisque
                                faucibus ex. Adipiscing elit quisque faucibus ex sapien vitae pellentesque.
                            </p>

                            <div className="text-3xl font-bold text-gray-900 mb-6">VND 2.000.000 đ</div>
                        </div>

                        {/* Quantity and Add to Cart */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-medium">Số lượng:</span>
                                <div className="flex items-center border rounded-lg">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-10 w-10"
                                        onClick={() => updateQuantity(quantity - 1)}
                                    >
                                        <Minus className="h-4 w-4" />
                                    </Button>
                                    <span className="px-4 py-2 min-w-[3rem] text-center">{quantity}</span>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-10 w-10"
                                        onClick={() => updateQuantity(quantity + 1)}
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <Button className="flex-1 h-12">
                                    <ShoppingCart className="h-4 w-4 mr-2" />
                                    Thêm vào giỏ hàng
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-12 w-12 bg-transparent"
                                    onClick={() => setIsWishlisted(!isWishlisted)}
                                >
                                    <Heart className={`h-4 w-4 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
                                </Button>
                                <Button variant="outline" size="icon" className="h-12 w-12 bg-transparent">
                                    <Share2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Brand and Categories */}
                        <div className="space-y-4">
                            <div>
                                <span className="text-sm font-medium text-gray-700">Thương hiệu: </span>
                                <span className="font-semibold">Valentino</span>
                                <div className="mt-2">
                                    <div className="text-2xl font-bold tracking-wider">VALENTINO</div>
                                </div>
                            </div>

                            <div>
                                <span className="text-sm font-medium text-gray-700 block mb-2">Danh mục:</span>
                                <div className="flex gap-2">
                                    <Badge variant="secondary" className="flex items-center gap-1">
                                        <Tag className="h-3 w-3" />
                                        Nước hoa nam
                                    </Badge>
                                    <Badge variant="secondary" className="flex items-center gap-1">
                                        <Tag className="h-3 w-3" />
                                        Nước hoa chiếc
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        {/* Features */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t">
                            <div className="flex items-center gap-2 text-sm">
                                <Truck className="h-4 w-4 text-green-600" />
                                <span>Miễn phí vận chuyển</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Shield className="h-4 w-4 text-blue-600" />
                                <span>Bảo hành chính hãng</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <RotateCcw className="h-4 w-4 text-orange-600" />
                                <span>Đổi trả 30 ngày</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product Details Tabs */}
                <Card className="mb-16">
                    <Tabs defaultValue="description" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="description">Mô tả sản phẩm</TabsTrigger>
                            <TabsTrigger value="specifications">Thông số kỹ thuật</TabsTrigger>
                            <TabsTrigger value="reviews">Đánh giá ({reviews.length})</TabsTrigger>
                        </TabsList>

                        <TabsContent value="description" className="p-6">
                            <div className="prose max-w-none">
                                <h3 className="text-lg font-semibold mb-4">Chi tiết sản phẩm</h3>
                                <p className="text-gray-600 leading-relaxed mb-4">
                                    A Luxury Perfume Every Ever là một tác phẩm nghệ thuật nước hoa đỉnh cao từ thương hiệu Valentino. Với
                                    hương thơm tinh tế và sang trọng, sản phẩm này mang đến trải nghiệm khứu giác độc đáo và đẳng cấp.
                                </p>
                                <p className="text-gray-600 leading-relaxed mb-4">
                                    Hương đầu: Bergamot, Cam ngọt, Hạt tiêu hồng
                                    <br />
                                    Hương giữa: Hoa nhài, Hoa hồng Bulgaria, Gỗ tuyết tùng
                                    <br />
                                    Hương cuối: Xạ hương, Gỗ đàn hương, Vani
                                </p>
                                <p className="text-gray-600 leading-relaxed">
                                    Độ lưu hương: 8-10 giờ
                                    <br />
                                    Độ tỏa hương: Trung bình đến mạnh
                                    <br />
                                    Phù hợp: Nam giới, sử dụng hàng ngày và dịp đặc biệt
                                </p>
                            </div>
                        </TabsContent>

                        <TabsContent value="specifications" className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="font-semibold mb-3">Thông tin cơ bản</h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Thương hiệu:</span>
                                            <span>Valentino</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Dung tích:</span>
                                            <span>100ml</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Nồng độ:</span>
                                            <span>Eau de Parfum</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Xuất xứ:</span>
                                            <span>Pháp</span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-3">Đặc điểm</h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Giới tính:</span>
                                            <span>Nam</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Phong cách:</span>
                                            <span>Sang trọng, Quyến rũ</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Thời gian sử dụng:</span>
                                            <span>Cả ngày</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Mùa phù hợp:</span>
                                            <span>Tất cả các mùa</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        {/* <TabsContent value="reviews" className="p-6">
                            <div className="space-y-6">
                                <div className="flex items-center gap-6 mb-6">
                                    <div className="text-center">
                                        <div className="text-3xl font-bold">4.8</div>
                                        <div className="flex items-center justify-center mt-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`h-4 w-4 ${i < 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                                                />
                                            ))}
                                        </div>
                                        <div className="text-sm text-gray-600 mt-1">124 đánh giá</div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="space-y-2">
                                            {[5, 4, 3, 2, 1].map((rating) => (
                                                <div key={rating} className="flex items-center gap-2">
                                                    <span className="text-sm w-3">{rating}</span>
                                                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                                                        <div
                                                            className="bg-yellow-400 h-2 rounded-full"
                                                            style={{ width: `${rating === 5 ? 70 : rating === 4 ? 20 : 5}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-sm text-gray-600 w-8">
                                                        {rating === 5 ? "87" : rating === 4 ? "25" : "6"}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {reviews.map((review) => (
                                        <div key={review.id} className="border-b pb-4 last:border-b-0">
                                            <div className="flex items-start gap-3">
                                                <Avatar className="w-10 h-10">
                                                    <AvatarImage src={review.avatar || "/placeholder.svg"} />
                                                    <AvatarFallback>{review.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="font-medium">{review.name}</span>
                                                        <div className="flex">
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star
                                                                    key={i}
                                                                    className={`h-3 w-3 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                                                        }`}
                                                                />
                                                            ))}
                                                        </div>
                                                        <span className="text-sm text-gray-500">{review.date}</span>
                                                    </div>
                                                    <p className="text-gray-600 text-sm">{review.comment}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </TabsContent> */}
                    </Tabs>
                </Card>

                {/* Related Products */}
                <Card>
                    <CardHeader>
                        <CardTitle>Sản phẩm liên quan</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedProducts.map((product) => (
                                <div key={product.id} className="group cursor-pointer">
                                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-3">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="font-medium text-sm line-clamp-2">{product.name}</h4>
                                        <div className="flex items-center gap-1">
                                            <div className="flex">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`h-3 w-3 ${i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-xs text-gray-500">({product.rating})</span>
                                        </div>
                                        <p className="font-semibold text-gray-900">VND {product.price.toLocaleString("vi-VN")} đ</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Footer */}
            <SiteFooter />
        </div>
    )
}
