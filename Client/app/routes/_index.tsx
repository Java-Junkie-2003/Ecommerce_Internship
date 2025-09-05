"use client";


import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, ArrowRight, Quote } from 'lucide-react'
import { Link } from "react-router"
import SiteHeader from "@/components/layout/client-header"
import SiteFooter from "@/components/layout/client-footer"
import type { Route } from "../+types/root";
import { useEffect, useState } from "react";
import { useAppDispatch } from "@/redux/hook";
import { fetchBrands } from "@/redux/thunks/brand.thunk";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Brand } from "@/types/model/brand";
import { FilteredProduct } from "@/types/model/product";
import { FilteredProductDTO } from "@/types/dto/product.dto";
import { ENDPOINTS } from "@/utils/api.endpoints";
import { ApiService } from "@/lib/api";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Trang chủ" },
    { name: "description", content: "Khám phá bộ sưu tập nước hoa cao cấp" },
  ];
}

const HomePage = () => {

  const dispatch = useAppDispatch()

  const [products, setProducts] = useState<FilteredProduct[]>([])

  useEffect(() => {
    const fetchProducts = async () => {
      // Fetch product data from API
      try {
        const response = await ApiService.get<FilteredProductDTO>(ENDPOINTS.PRODUCT.FILTER(
          undefined, // searchQuery
          undefined, // selectedCategory
          undefined, // selectedBrand
          undefined, // maxPrice
          undefined, // minPrice
          4,         // limit
          undefined, // sortBy
          1          // currentPage
        ))
        setProducts(response.metadata.products || [])
      } catch (error) {
        console.error("Error fetching products:", error)
      }
    }

    fetchProducts()
  }, [])

  const reduxBrands = useSelector((state: RootState) => state.brand)

  const [brands, setBrands] = useState<Brand[]>([])
  useEffect(() => {
    setBrands(reduxBrands.brands)
  }, [reduxBrands.status])

  const testimonials = [
    {
      quote: "Mùi hương tinh tế và sang trọng, tôi hoàn toàn bị chinh phục. Dịch vụ khách hàng cũng rất tuyệt vời!",
      author: "Nguyễn Thị Mai",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      quote: "Chất lượng sản phẩm vượt trội, mỗi lần sử dụng là một trải nghiệm đẳng cấp. Rất đáng tiền!",
      author: "Trần Văn Hùng",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      quote: "EW. đã giúp tôi tìm thấy mùi hương đặc trưng của mình. Tôi nhận được rất nhiều lời khen!",
      author: "Lê Thanh Thảo",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ]

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <SiteHeader />

      {/* Hero Section - Immersive & Dynamic */}
      <section className="relative h-[700px] md:h-[800px] overflow-hidden flex items-center justify-center text-white">
        <video
          src="/videos/hero-bg.mp4"
          autoPlay
          loop
          muted
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-center justify-center">
          <div className="text-center space-y-8 animate-slide-up max-w-4xl px-4">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight drop-shadow-lg leading-tight">
              E<span className="opacity-50">W</span>. <span className="font-light">The Essence of You.</span>
            </h1>
            <p className="text-lg md:text-2xl font-light tracking-wide drop-shadow-md opacity-90">
              Discover bespoke fragrances crafted for unforgettable moments.
            </p>
            <Button
              size="lg"
              className="mt-10 px-10 py-4 text-lg md:text-xl font-semibold bg-white text-gray-900 hover:bg-gray-100 transition-all duration-300 shadow-xl hover:shadow-2xl rounded-full group"
            >
              <Link to="/products" className="flex items-center gap-2">
                Explore Collections <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="py-20 bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <h2 className="text-center text-4xl font-bold text-gray-900 mb-12">Bộ Sưu Tập Nổi Bật</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link to="/products?category=nu" className="group block relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <img
                src="/images/landing/female.jpg"
                alt="Nước hoa nữ"
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors duration-300 flex items-center justify-center">
                <div className="text-center text-white space-y-2">
                  <h3 className="text-3xl font-bold drop-shadow-md">NƯỚC HOA NỮ</h3>
                  <p className="text-lg opacity-90">Quyến rũ & Tinh tế</p>
                  <Button variant="outline" className="mt-4 bg-transparent border-white hover:bg-white hover:text-gray-900">
                    Xem ngay
                  </Button>
                </div>
              </div>
            </Link>
            <Link to="/products?category=nam" className="group block relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <img
                src="/images/landing/male.jpg"
                alt="Nước hoa nam"
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors duration-300 flex items-center justify-center">
                <div className="text-center text-white space-y-2">
                  <h3 className="text-3xl font-bold drop-shadow-md">NƯỚC HOA NAM</h3>
                  <p className="text-lg opacity-90">Mạnh mẽ & Lịch lãm</p>
                  <Button variant="outline" className="mt-4 bg-transparent border-white hover:bg-white hover:text-gray-900">
                    Xem ngay
                  </Button>
                </div>
              </div>
            </Link>
            <Link to="/products?category=unisex" className="group block relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <img src="/images/landing/unisex.jpg" alt="Nước hoa unisex" className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors duration-300 flex items-center justify-center">
                <div className="text-center text-white space-y-2">
                  <h3 className="text-3xl font-bold drop-shadow-md">NƯỚC HOA UNISEX</h3>
                  <p className="text-lg opacity-90">Độc đáo & Phá cách</p>
                  <Button variant="outline" className="mt-4 bg-transparent border-white hover:bg-white hover:text-gray-900">
                    Xem ngay
                  </Button>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Our Story - Passion Section */}
      <section className="py-20 bg-white border-b border-gray-200">
        <div className="container max-w-7xl mx-auto px-4">
          <h2 className="text-center text-4xl font-bold text-gray-900 mb-12">Câu Chuyện Của Chúng Tôi</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h3 className="text-3xl font-semibold text-gray-900">Đam Mê Nước Hoa</h3>
              <p className="text-gray-700 text-lg leading-relaxed">
                EW. được sinh ra từ đam mê tìm kiếm và chia sẻ những mùi hương tuyệt vời nhất thế giới. Chúng tôi dành thời gian để tuyển chọn những chai nước hoa đẳng cấp từ các thương hiệu uy tín, mang đến cho khách hàng những trải nghiệm khứu giác đáng nhớ.
              </p>
              <img src="/images/story-1.jpg" alt="Cửa hàng nước hoa" className="rounded-lg shadow-md mt-6" />
            </div>
            <div className="space-y-6 lg:mt-16">
              <img
                src="/images/story-2.jpg"
                alt="Tư vấn khách hàng"
                className="rounded-lg shadow-md mb-6"
              />
              <h3 className="text-3xl font-semibold text-gray-900">Tận Tâm Phục Vụ</h3>
              <p className="text-gray-700 text-lg leading-relaxed">
                Với kiến thức sâu rộng về nước hoa và sự hiểu biết về từng thương hiệu, chúng tôi tự hào là người bạn đồng hành tin cậy, giúp bạn tìm ra mùi hương phù hợp nhất với phong cách và cá tính riêng của mình.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals Showcase */}
      <section className="py-16 bg-gray-100 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">SẢN PHẨM MỚI NHẤT</h2>
            <p className="text-gray-600 text-lg">Đừng bỏ lỡ những mùi hương vừa ra mắt.</p>
            <div className="w-32 h-1 bg-gray-900 mx-auto mt-6 rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => ( // Show first 4 as new arrivals
              <Link
                to={`/product/${product._id}`}
                key={product._id}
                className="group block"
              >
                <Card className="overflow-hidden rounded-2xl border border-gray-100 shadow-md hover:shadow-xl transition-shadow duration-300 group relative aspect-[3/4]">
                  {/* Ảnh nền */}
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${product.product_thumb || "/placeholder.svg"})`,
                    }}
                  />

                  {/* Overlay tối nhẹ để chữ nổi bật */}
                  <div className="absolute inset-0 bg-black/40 transition-all group-hover:bg-black/50" />

                  {/* Nội dung overlay */}
                  <CardContent className="relative z-10 flex flex-col justify-end h-full p-5 text-white text-center">
                    {/* Brand + Category */}
                    <div className="flex items-center justify-center gap-2 text-xs text-white/70 mb-2">
                      <span>{product.product_brand.brand_name || "No brand"}</span>
                      <span>•</span>
                      <span>{product.product_categories?.map(cat => cat.category_name).join(", ") || "No category"}</span>
                    </div>

                    {/* Tên sản phẩm */}
                    <h3 className="text-lg font-medium mb-2 line-clamp-2 tracking-wide">
                      {product.product_name}
                    </h3>

                    {/* Giá */}
                    <p className="text-xl font-semibold text-white mb-4">
                      {product.product_price}
                    </p>

                    {/* Nút CTA */}
                    <Button className="w-full rounded-full bg-white/10 hover:bg-white/20 text-white text-sm font-medium py-2.5 transition-colors">
                      Xem chi tiết
                    </Button>
                  </CardContent>
                </Card>
              </Link>

            ))}
          </div>
          <div className="text-center mt-12">
            <Button variant="outline" size="lg" className="px-8 py-3 text-lg font-semibold border-gray-400 text-gray-800 hover:bg-gray-200 transition-colors">
              <Link to="/products">Xem tất cả sản phẩm mới</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Brand Partners Carousel (using grid for simplicity, but can be a carousel) */}
      <section className="py-12 bg-white border-b border-gray-200 overflow-hidden">
        <div className="container mx-auto px-4">
          <h2 className="text-center text-3xl font-bold mb-10 text-gray-900">Đối Tác Thương Hiệu</h2>
          <div className="flex-nowrap inline-flex w-full">
            <div className="flex items-center justify-center md:justify-start [&_li]:mx-8 [&_img]:max-w-none animate-scroll-x">
              {brands.map((brand, index) => (
                <div key={index} className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity duration-300 transform hover:scale-105">
                  <img src={brand.brand_icon || "/placeholder.svg"} alt={brand.brand_name} className="object-contain h-30 w-auto" />
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center md:justify-start [&_li]:mx-8 [&_img]:max-w-none animate-scroll-x">
              {brands.map((brand, index) => (
                <div key={index} className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity duration-300 transform hover:scale-105">
                  <img src={brand.brand_icon || "/placeholder.svg"} alt={brand.brand_name} className="object-contain h-30 w-auto" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      {/* <section className="py-20 bg-gray-100 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <h2 className="text-center text-4xl font-bold text-gray-900 mb-12">Khách Hàng Nói Gì Về Chúng Tôi</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white p-6 rounded-xl shadow-md border border-gray-200 flex flex-col items-center text-center">
                <Quote className="h-10 w-10 text-gray-400 mb-4" />
                <p className="text-lg text-gray-700 italic mb-6">"{testimonial.quote}"</p>
                <img src={testimonial.avatar || "/placeholder.svg?height=40&width=40"} alt={testimonial.author} className="rounded-full h-10 w-10 mb-2" />
                <p className="font-semibold text-gray-900">{testimonial.author}</p>
              </Card>
            ))}
          </div>
        </div>
      </section> */}

      {/* Final Immersive CTA */}
      <section className="relative py-24 bg-gray-900 text-white text-center overflow-hidden">
        <img src="/images/ready-bg.jpg" alt="Final CTA Background" className="absolute inset-0 w-full h-full object-cover opacity-30" />
        <div className="relative z-10 container mx-auto px-4">
          <h2 className="text-5xl md:text-6xl font-bold mb-8 drop-shadow-lg leading-tight">
            Sẵn Sàng Để Khám Phá Mùi Hương Của Riêng Bạn?
          </h2>
          <p className="text-xl md:text-2xl mb-12 max-w-4xl mx-auto opacity-90 font-light">
            Đừng bỏ lỡ cơ hội sở hữu những chai nước hoa đẳng cấp, mang đến sự tự tin và quyến rũ cho bạn.
          </p>
          <Button
            size="lg"
            className="px-12 py-5 text-xl md:text-2xl font-bold bg-white text-gray-900 hover:bg-gray-100 transition-all duration-300 shadow-xl hover:shadow-2xl rounded-full group"
          >
            <Link to="/products" className="flex items-center gap-3">
              Bắt đầu mua sắm <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}

export default HomePage;