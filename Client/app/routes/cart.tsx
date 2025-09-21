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
import { Address, AddressType } from "@/types/model/address"
import { ApiService } from "@/lib/api"
import { AddressCreateDTO, AddressDTO } from "@/types/dto/address.dto"
import { ENDPOINTS } from "@/utils/api.endpoints"
import { setSelectedCartItems } from "@/redux/slices/cart"
import { Link } from "react-router"
import { Route } from "../+types/root"
import { findInventory } from "@/redux/thunks/stock.thunk"

export function meta(meta: Route.MetaArgs) {
    return [
        { title: "Giỏ hàng" },
        { name: "description", content: "Xem và quản lý giỏ hàng của bạn" },
    ]
}

export default function Component() {

    const dispatch = useAppDispatch()

    const addressTypes = Object.values(AddressType)

    const cart = useAppSelector((state) => state.cart)
    const cartItems = cart.cartItems

    const selectedItems = useAppSelector((state) => state.cart.selectedCartItem)
    const setSelectedItems = (items: Cart[]) => {
        dispatch(setSelectedCartItems(items))
    }

    const updateQuantity = (id: string, newQuantity: number) => {
        if (newQuantity < 1) return

        const currentItem = cartItems.find(item => item.productId === id)
        if (!currentItem) return

        try {
            // check api before update
            dispatch(findInventory(id)).unwrap()
            .then((inventory) => {
                if(inventory.metadata.inven_stock < newQuantity) {
                    toast.error(`Chỉ còn ${inventory.metadata.inven_stock} sản phẩm trong kho`)
                    return
                } else {
                    dispatch(updateCart({ productId: id, quantity: newQuantity, old_quantity: currentItem.quantity }))
                }
            });

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
            // setCartItems((items) => items.filter((item) => item.productId !== id))
            const newSelected = selectedItems.filter(item => item.productId !== id)
            setSelectedItems(newSelected)
        } catch (err) {
            console.error(err)
            toast.error("Failed to remove item from cart")
        }
    }

    const removeSelectedItems = () => {
        setSelectedItems([])
    }

    const toggleSelectItem = (id: string) => {
        const isItemSelected = selectedItems.some(item => item.productId === id)
        if (isItemSelected) {
            const newSelected = selectedItems.filter(item => item.productId !== id)
            setSelectedItems(newSelected)
        } else {
            const itemToAdd = cartItems.find(item => item.productId === id)
            if (itemToAdd) {
                setSelectedItems([...selectedItems, itemToAdd])
            }
        }
    }


    const toggleSelectAll = () => {
        if (selectedItems.length === cartItems.length) {
            setSelectedItems([])
        } else {
            setSelectedItems(cartItems)
        }
    }

    const subtotal = selectedItems.reduce((sum, item) => sum + item.product_price * item.quantity, 0)
    const shipping = 30000
    const total = subtotal + shipping

    const isAllSelected = cartItems.length > 0 && selectedItems.length === cartItems.length
    const isIndeterminate = selectedItems.length > 0 && selectedItems.length < cartItems.length


    return (
        <div className="min-h-screen">
            {/* Header */}
            <SiteHeader />

            <div className="container mx-auto px-4 py-8 max-w-7xl">


                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground mb-2">Giỏ hàng</h1>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium">
                                1
                            </div>
                            <span className="text-foreground font-medium">Giỏ hàng</span>
                        </div>
                        <div className="w-8 h-px bg-border"></div>
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-xs font-medium">
                                2
                            </div>
                            <span>Thanh toán</span>
                        </div>
                        <div className="w-8 h-px bg-border"></div>
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-xs font-medium">
                                3
                            </div>
                            <span>Hoàn thành</span>
                        </div>
                    </div>
                </div>
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
                                    cartItems.map((item, index) => {
                                        // console.log("Selected cart items:", selectedItems.includes(item), selectedItems, item);
                                        return (
                                        <div key={item.productId}>
                                            <div className="flex items-center gap-4 py-4">
                                                <Checkbox
                                                    checked={selectedItems.find(sItem => sItem.productId === item.productId) !== undefined}
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
                                    )})
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-8">
                            <CardHeader>
                                <CardTitle>Tóm tắt đơn hàng</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between text-sm">
                                    <span>Số lượng sản phẩm:</span>
                                    <span>{selectedItems.length} sản phẩm</span>
                                </div>

                                <div className="flex justify-between text-sm">
                                    <span>Giá tạm tính:</span>
                                    <span>{subtotal.toLocaleString("vi-VN")} đ</span>
                                </div>

                                <div className="flex justify-between text-sm">
                                    <span>Phí vận chuyển:</span>
                                    <span>{shipping.toLocaleString("vi-VN")} đ</span>
                                </div>

                                <Separator />

                                <div className="flex justify-between font-semibold text-lg">
                                    <span>Tổng cộng:</span>
                                    <span className="text-red-600">{total.toLocaleString("vi-VN")} đ</span>
                                </div>

                                <Link to="/checkout">
                                    <Button
                                        className="w-full"
                                        size="lg"
                                        disabled={selectedItems.length === 0}
                                        onClick={() => {
                                            // Proceed to checkout with selectedItems

                                        }}
                                    >
                                        <CreditCard className="h-4 w-4 mr-2" />
                                        Thanh toán ({selectedItems.length})
                                    </Button>
                                </Link>

                                {/* <div className="text-xs text-gray-500 text-center">
                                    <Truck className="h-3 w-3 inline mr-1" />
                                    Miễn phí vận chuyển cho đơn hàng từ 500.000đ
                                </div> */}
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Continue Shopping */}
                {/* <div className="mt-8 text-center">
                    <Link to="/checkout">
                        <Button variant="outline" size="lg">
                            Tiếp tục thanh toán
                        </Button>
                    </Link>
                </div> */}
            </div>

            {/* Footer */}
            <SiteFooter />
        </div>
    )
}
