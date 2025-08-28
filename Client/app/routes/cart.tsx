import { use, useEffect, useState } from "react"
import { Minus, Plus, Trash2, ShoppingCart, CreditCard, Truck, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import SiteHeader from "@/components/layout/client-header"
import SiteFooter from "@/components/layout/client-footer"
import { Cart } from "@/types/model/cart"
import { useAppDispatch, useAppSelector } from "@/redux/hook"
import { deleteFromCart, updateCart } from "@/redux/thunks/cart.thunk"
import { toast } from "sonner"


export default function Component() {

    const dispatch = useAppDispatch()

    const cart = useAppSelector((state) => state.cart)
    const [cartItems, setCartItems] = useState<Cart[]>([])
    useEffect(() => {
        setCartItems(cart.cartItems)
    }, [cart.status])

    const [selectedItems, setSelectedItems] = useState<Cart[]>([])
    const [address, setAddress] = useState("")
    const [paymentMethod, setPaymentMethod] = useState("cod")

    const updateQuantity = (id: string, newQuantity: number) => {
        if (newQuantity < 1) return

        const currentItem = cartItems.find(item => item.productId === id)
        if (!currentItem) return

        try {
            // Call API to update quantity
            dispatch(updateCart({ productId: id, quantity: newQuantity, old_quantity: currentItem.quantity }))
            setCartItems((items) => items.map((item) => (item.productId === id ? { ...item, quantity: newQuantity } : item)))
        } catch (err) {
            console.error(err)
        }

    }

    const removeItem = (id: string) => {

        const itemToRemove = cartItems.find(item => item.productId === id)
        if (!itemToRemove) return

        try {
            // Call API to remove item
            dispatch(deleteFromCart({ productId: id }))
            setCartItems((items) => items.filter((item) => item.productId !== id))
            setSelectedItems((selected) => {
                const newSelected = selected.filter(item => item.productId !== id)
                return newSelected
            })
        } catch (err) {
            console.error(err)
            toast.error("Failed to remove item from cart")
        }
    }

    const removeSelectedItems = () => {
        setSelectedItems([])
    }

    const toggleSelectItem = (id: string) => {
        setSelectedItems((selected) =>
            selected.some(item => item.productId === id)
                ? selected.filter(item => item.productId !== id)
                : [...selected, ...(cartItems.filter(item => item.productId === id))]
        )
    }


    const toggleSelectAll = () => {
        if (selectedItems.length === cartItems.length) {
            setSelectedItems([])
        } else {
            setSelectedItems(cartItems)
        }
    }

    const selectedCartItems = cartItems.filter(item => selectedItems.includes(item))
    const subtotal = selectedCartItems.reduce((sum, item) => sum + item.product_price * item.quantity, 0)
    const shipping = 0 // Free shipping
    const total = subtotal + shipping

    const isAllSelected = cartItems.length > 0 && selectedItems.length === cartItems.length
    const isIndeterminate = selectedItems.length > 0 && selectedItems.length < cartItems.length

    return (
        <div className="min-h-screen">
            {/* Header */}
            <SiteHeader />

            <div className="container mx-auto px-4 py-8 max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Shopping Cart */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <ShoppingCart className="h-5 w-5" />
                                    GIỎ HÀNG ({cartItems.length} sản phẩm)
                                </CardTitle>
                                {cartItems.length > 0 && (
                                    <div className="flex items-center gap-2 pt-2 h-8">
                                        <div
                                            className="flex items-center gap-2 cursor-pointer select-none"
                                            onClick={toggleSelectAll}
                                        >
                                            <Checkbox
                                                checked={isAllSelected}
                                                onCheckedChange={toggleSelectAll}
                                                className={isIndeterminate ? "indeterminate" : ""}
                                            />
                                            <span className="text-sm text-gray-600">
                                                Chọn tất cả ({selectedItems.length}/{cartItems.length})
                                            </span>
                                        </div>
                                        {selectedItems.length > 0 && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="ml-auto"
                                                onClick={() => {
                                                    removeSelectedItems()
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4 mr-1" />
                                                Xóa đã chọn
                                            </Button>
                                        )}
                                    </div>
                                )}
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {cartItems.length === 0 ? (
                                    <div className="text-center py-12">
                                        <ShoppingCart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                                        <p className="text-gray-500">Giỏ hàng của bạn đang trống</p>
                                        <Button className="mt-4">Tiếp tục mua sắm</Button>
                                    </div>
                                ) : (
                                    cartItems.map((item, index) => (
                                        <div key={item.productId}>
                                            <div className="flex items-center gap-4 py-4">
                                                <Checkbox
                                                    checked={selectedItems.includes(item)}
                                                    onCheckedChange={() => toggleSelectItem(item.productId)}
                                                />

                                                <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                    <img
                                                        src={item.product_thumb}
                                                        alt={item.product_name}
                                                        className="w-full h-full object-cover"
                                                        loading="lazy"
                                                    />
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-medium text-gray-900 truncate">{item.product_name}</h3>
                                                    <p className="text-lgtext-gray-900 mt-1">
                                                        <span className="font-semibold">VND</span> {item.product_price.toLocaleString("vi-VN")} đ
                                                    </p>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center border rounded-lg">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8"
                                                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                                        >
                                                            <Minus className="h-4 w-4" />
                                                        </Button>
                                                        <span className="px-3 py-1 min-w-[3rem] text-center">{item.quantity}</span>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8"
                                                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                                        >
                                                            <Plus className="h-4 w-4" />
                                                        </Button>
                                                    </div>

                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                        onClick={() => removeItem(item.productId)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                            {index < cartItems.length - 1 && <Separator />}
                                        </div>
                                    ))
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Order Summary */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>ĐƠN HÀNG</CardTitle>
                                {selectedItems.length > 0 && (
                                    <p className="text-sm text-gray-600">
                                        {selectedItems.length} sản phẩm được chọn
                                    </p>
                                )}
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {selectedItems.length === 0 ? (
                                    <div className="text-center py-4">
                                        <p className="text-gray-500">Chưa có sản phẩm nào được chọn</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Tạm tính:</span>
                                            <span>VND {subtotal.toLocaleString("vi-VN")} đ</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Phí vận chuyển:</span>
                                            <span className="text-green-600">Miễn phí</span>
                                        </div>
                                        <Separator />
                                        <div className="flex justify-between text-lg font-semibold">
                                            <span>Tổng:</span>
                                            <span>VND {total.toLocaleString("vi-VN")} đ</span>
                                        </div>
                                        <p className="text-sm text-gray-500">* Đơn hàng đã bao gồm thuế VAT</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Shipping Address */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Home className="h-5 w-5" />
                                    Địa chỉ giao hàng
                                    <span className="text-sm text-gray-500">(bắt buộc)</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Textarea
                                    placeholder="Vui lòng nhập địa chỉ giao hàng"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    className="min-h-[80px]"
                                />
                            </CardContent>
                        </Card>

                        {/* Payment Method */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CreditCard className="h-5 w-5" />
                                    Phương thức thanh toán
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                                    <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                                        <RadioGroupItem value="cod" id="cod" />
                                        <Label htmlFor="cod" className="flex-1 cursor-pointer">
                                            <div className="flex items-center gap-2">
                                                <Truck className="h-4 w-4" />
                                                <span>Thanh toán khi nhận hàng (COD)</span>
                                            </div>
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                                        <RadioGroupItem value="vnpay" id="vnpay" />
                                        <Label htmlFor="vnpay" className="flex-1 cursor-pointer">
                                            <div className="flex items-center gap-2">
                                                <CreditCard className="h-4 w-4" />
                                                <span>Thanh toán online VNPAY</span>
                                            </div>
                                        </Label>
                                    </div>
                                </RadioGroup>
                            </CardContent>
                        </Card>

                        {/* Checkout Button */}
                        <Button
                            className="w-full h-12 text-lg font-semibold"
                            disabled={selectedItems.length === 0 || !address.trim()}
                        >
                            {selectedItems.length === 0
                                ? "Chọn sản phẩm để đặt hàng"
                                : `Đặt hàng (${selectedItems.length} sản phẩm)`
                            }
                        </Button>

                        {/* Security Badge */}
                        <div className="text-center">
                            <div className="inline-flex items-center gap-2 text-sm text-gray-500 bg-gray-100 px-3 py-2 rounded-full">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                Thanh toán an toàn & bảo mật
                            </div>
                        </div>
                    </div>
                </div>

                {/* Continue Shopping */}
                <div className="mt-8 text-center">
                    <Button variant="outline" size="lg">
                        ← Tiếp tục mua sắm
                    </Button>
                </div>
            </div>

            {/* Footer */}
            <SiteFooter />
        </div>
    )
}
