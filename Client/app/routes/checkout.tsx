"use client"

import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "@/redux/hook"
import { ApiService } from "@/lib/api"
import { ENDPOINTS } from "@/utils/api.endpoints"
import { type Address, AddressType } from "@/types/model/address"
import type { AddressDTO, AddressCreateDTO, AddressUpdateDTO, AddressDeleteDTO } from "@/types/dto/address.dto"
import type { CheckoutDTO } from "@/types/dto/checkout.dto"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CreditCard, Home, Plus, Truck, ShoppingBag, MapPin, Shield, Minus, Package, Edit, Trash2 } from "lucide-react"
import { toast } from "sonner"

import SiteHeader from "@/components/layout/client-header"
import SiteFooter from "@/components/layout/client-footer"
import { O } from "node_modules/react-router/dist/development/route-data-DjzmHYNR.mjs"
import { CreateOrderDTO } from "@/types/dto/order.dto"
import { useNavigate } from "react-router"
import { deleteFromCart } from "@/redux/thunks/cart.thunk"
import { DefaultDTO } from "@/types/dto"
import { setSelectedCartItems } from "@/redux/slices/cart"

export function meta() {
    return [
        { title: "Thanh toán" },
        { name: "description", content: "Xem và quản lý giỏ hàng của bạn" },
    ]
}

export default function Checkout() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [checkout, setCheckout] = useState<CheckoutDTO | null>(null)
  const [address, setAddress] = useState<Address[] | null>(null)
  const [selectedAddress, setSelectedAddress] = useState<string>("")
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [newAddress, setNewAddress] = useState<Address>({
    address: "",
    address_type: AddressType.HOME,
  })
  const [paymentMethod, setPaymentMethod] = useState("COD")
  const [editingAddress, setEditingAddress] = useState<string | null>(null)
  const [editedAddress, setEditedAddress] = useState<Address>({
    address: "",
    address_type: AddressType.HOME,
  })
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [addressToDelete, setAddressToDelete] = useState<string | null>(null)

  const selectedCartItems = useAppSelector((state) => state.cart.selectedCartItem)
  const addressTypes = Object.values(AddressType)

  /** ---------------- FETCH & ADD ADDRESS ---------------- */
  const fetchAddresses = async () => {
    try {
      const response = await ApiService.get<AddressDTO>(ENDPOINTS.ADDRESS.FETCH_ALL)
      setAddress(response.metadata.addresses)
      if (response.metadata.addresses.length > 0) {
        setSelectedAddress(response.metadata.addresses[0]._id || "")
      }
    } catch (error) {
      console.error("Failed to fetch addresses:", error)
    }
  }

  const handleAddAddress = async () => {
    try {
      const response = await ApiService.post<AddressCreateDTO>(ENDPOINTS.ADDRESS.CREATE, {
        address: newAddress.address,
        addressType: newAddress.address_type,
      })
      setAddress(response.metadata.addresses)
      setNewAddress({ address: "", address_type: AddressType.HOME })
      setShowAddressForm(false)
      toast.success("Thêm địa chỉ thành công")
    } catch (error) {
      console.error("Failed to add address:", error)
      toast.error("Thêm địa chỉ thất bại")
    }
  }

  const handleUpdateAddress = async (id: string, updatedAddress: {
    address: string;
    address_type: AddressType;
  }) => {
    try {
      const response = await ApiService.put<AddressUpdateDTO>(ENDPOINTS.ADDRESS.UPDATE(id), { ...updatedAddress })
      setAddress(response.metadata.addresses)
      setEditingAddress(null)
      setEditedAddress({ address: "", address_type: AddressType.HOME })
      toast.success("Cập nhật địa chỉ thành công")
    } catch (error) {
      console.error("Failed to update address:", error)
      toast.error("Cập nhật địa chỉ thất bại")
    }
  }

  const startEditingAddress = (addr: Address) => {
    setEditingAddress(addr._id || "")
    setEditedAddress({
      address: addr.address,
      address_type: addr.address_type,
    })
  }

  const cancelEditingAddress = () => {
    setEditingAddress(null)
    setEditedAddress({ address: "", address_type: AddressType.HOME })
  }

  const openDeleteDialog = (addressId: string) => {
    setAddressToDelete(addressId)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (addressToDelete) {
      await handleDeleteAddress(addressToDelete)
      setDeleteDialogOpen(false)
      setAddressToDelete(null)
    }
  }

  const cancelDelete = () => {
    setDeleteDialogOpen(false)
    setAddressToDelete(null)
  }

  const handleDeleteAddress = async (id: string) => {
    try {
      const response = await ApiService.delete<AddressDeleteDTO>(ENDPOINTS.ADDRESS.DELETE(id))
      setAddress(response.statusCode === 200 ? address?.filter((addr) => addr._id !== id) || null : address)
      if (selectedAddress === id) {
        setSelectedAddress(address && address.length > 0 ? address[0]._id || "" : "")
      }
      toast.success("Xoá địa chỉ thành công")
    } catch (error) {
      console.error("Failed to delete address:", error)
      toast.error("Xoá địa chỉ thất bại")
    }
  }

  /** ---------------- CHECKOUT ---------------- */
  const checkoutResult = async () => {
    try {
      const response = await ApiService.post<CheckoutDTO>(ENDPOINTS.CHECKOUT, {
        item_products: selectedCartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      })
      setCheckout(response)
    } catch (error) {
      console.error("Checkout failed:", error)
    }
  }

  /** ---------------- HANDLE PURCHASE ---------------- */
  const handlePurchase = async () => {
    if (!selectedAddress) {
      toast.error("Vui lòng chọn địa chỉ giao hàng")
      return
    }
    if (!checkout) {
      toast.error("Không có sản phẩm để đặt hàng")
      return
    }
    try {
      if(paymentMethod === "VNPAY") {
        setLoading(true)
        
        // Save checkout data to localStorage before redirecting to VNPAY
        const checkoutData = {
          item_products: selectedCartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
          addressId: selectedAddress,
          payment_method: "VNPAY",
        };
        localStorage.setItem('vnpayCheckoutData', JSON.stringify(checkoutData));
        
        const response = await ApiService.post<DefaultDTO>(ENDPOINTS.PAYMENT(checkout.metadata.checkout_order?.totalCheckout || 0));

        if(response.statusCode !== 200 || response.status) {
          toast.error("Thanh toán thất bại. Vui lòng thử lại.")
          setLoading(false)
          return
        } else {
          // redirect to payment gateway
          window.location.href = response.metadata;
        }

      } else {
        setLoading(true)
        const response = await ApiService.post<CreateOrderDTO>(ENDPOINTS.ORDER.CREATE, {
          item_products: selectedCartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
          addressId: selectedAddress,
          payment_method: "COD",
        })
        toast.success("Đặt hàng thành công")
        // delete selected items in cart
        selectedCartItems.forEach(item => {
          dispatch(deleteFromCart({ productId: item.productId }))
        })
        dispatch(setSelectedCartItems([]))

        // delay 1s then navigate to order status page
        setTimeout(() => {
          navigate("/order/success?method=COD")
          setLoading(false)
        }, 1000);
      }
    }
    catch (error) {
      console.error("Purchase failed:", error)
      toast.error("Đặt hàng thất bại. Vui lòng thử lại.")
    }
  }

  useEffect(() => {
    if (selectedCartItems.length === 0) {
      navigate("/cart")
      return
    }
    fetchAddresses()
    checkoutResult()
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <SiteHeader />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Thanh toán</h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium">
                  1
                </div>
                <span>Giỏ hàng</span>
              </div>
              <div className="w-8 h-px bg-border"></div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium">
                  2
                </div>
                <span className="text-foreground font-medium">Thanh toán</span>
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

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Forms */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <ShoppingBag className="h-5 w-5 text-primary" />
                    Sản phẩm đã chọn
                    {checkout?.metadata?.item_products?.length && (
                      <Badge variant="secondary" className="ml-2">
                        {checkout.metadata.item_products.length} sản phẩm
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {checkout?.metadata?.item_products?.length === 0 ? (
                    <div className="text-center py-12">
                      <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Chưa có sản phẩm nào được chọn</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {selectedCartItems?.map((item, index) => (
                        <div key={index} className="flex items-center gap-4 p-4 bg-card rounded-lg border">
                          <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center overflow-hidden">
                            {item.product_thumb ? (
                              <img
                                src={item.product_thumb}
                                alt={item.product_name || 'Product'}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Package className="h-8 w-8 text-muted-foreground" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-card-foreground truncate">
                              {item.product_name || `Sản phẩm ${index + 1}`}
                            </h3>
                            <p className="text-sm text-muted-foreground">{item.product_price.toLocaleString()} đ</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 bg-muted rounded-md px-3 py-1">
                              {/* <Minus className="h-3 w-3 text-muted-foreground" /> */}
                              <span className="font-medium min-w-[2ch] text-center">{item.quantity}</span>
                              {/* <Plus className="h-3 w-3 text-muted-foreground" /> */}
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-primary">
                                {(item.product_price * item.quantity).toLocaleString()} đ
                              </p>
                              {/* <p className="text-xs text-muted-foreground">{item.product_price.toLocaleString()} đ/sp</p> */}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Shipping Address */}
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <MapPin className="h-5 w-5 text-primary" />
                    Địa chỉ giao hàng
                    <span className="text-sm font-normal text-destructive">*</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {address?.length ? (
                    <div className="space-y-4">
                      <RadioGroup value={selectedAddress} onValueChange={setSelectedAddress}>
                        {address.map((addr) => (
                          <div key={addr._id}>
                            {editingAddress === addr._id ? (
                              // Edit mode
                              <div className="p-4 border rounded-lg bg-muted/30 space-y-4">
                                <div className="space-y-2">
                                  <Label htmlFor={`edit-address-${addr._id}`}>Địa chỉ</Label>
                                  <Textarea
                                    id={`edit-address-${addr._id}`}
                                    placeholder="Nhập địa chỉ (số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố)"
                                    value={editedAddress.address}
                                    onChange={(e) => setEditedAddress({ ...editedAddress, address: e.target.value })}
                                    className="min-h-[80px]"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label>Loại địa chỉ</Label>
                                  <RadioGroup
                                    value={editedAddress.address_type}
                                    onValueChange={(value) =>
                                      setEditedAddress({ ...editedAddress, address_type: value as AddressType })
                                    }
                                    className="flex flex-wrap gap-4"
                                  >
                                    {addressTypes.map((type) => (
                                      <div key={type} className="flex items-center space-x-2">
                                        <RadioGroupItem value={type} id={`edit-${type}-${addr._id}`} />
                                        <Label htmlFor={`edit-${type}-${addr._id}`} className="text-sm">
                                          {type}
                                        </Label>
                                      </div>
                                    ))}
                                  </RadioGroup>
                                </div>

                                <div className="flex gap-2">
                                  <Button
                                    onClick={() => handleUpdateAddress(addr._id || "", {
                                      address: editedAddress.address,
                                      address_type: editedAddress.address_type,
                                    })}
                                    disabled={!editedAddress.address.trim()}
                                    className="flex-1"
                                    size="sm"
                                  >
                                    Lưu thay đổi
                                  </Button>
                                  <Button
                                    variant="outline"
                                    onClick={cancelEditingAddress}
                                    size="sm"
                                  >
                                    Hủy
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              // View mode
                              <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors group">
                                <RadioGroupItem value={addr._id || ""} id={addr._id} className="mt-1" />
                                <Label htmlFor={addr._id} className="flex-1 flex items-center cursor-pointer">
                                  <div className="flex items-center gap-2">
                                    <Home className="h-4 w-4 text-muted-foreground" />
                                    <Badge variant="outline" className="text-xs">
                                      {addr.address_type}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-foreground">{addr.address}</p>
                                </Label>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                                    onClick={() => startEditingAddress(addr)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                                    onClick={() => openDeleteDialog(addr._id || "")}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Chưa có địa chỉ nào</p>
                    </div>
                  )}

                  <Button
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={() => setShowAddressForm(!showAddressForm)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm địa chỉ mới
                  </Button>

                  {showAddressForm && (
                    <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
                      <div className="space-y-2">
                        <Label htmlFor="new-address">Địa chỉ</Label>
                        <Textarea
                          id="new-address"
                          placeholder="Nhập địa chỉ (số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố)"
                          value={newAddress?.address || ""}
                          onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                          className="min-h-[80px]"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Loại địa chỉ</Label>
                        <RadioGroup
                          value={newAddress?.address_type}
                          onValueChange={(value) =>
                            setNewAddress({ ...newAddress, address_type: value as AddressType })
                          }
                          className="flex flex-wrap gap-4"
                        >
                          {addressTypes.map((type) => (
                            <div key={type} className="flex items-center space-x-2">
                              <RadioGroupItem value={type} id={type} />
                              <Label htmlFor={type} className="text-sm">
                                {type}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>

                      <div className="flex gap-2">
                        <Button onClick={handleAddAddress} disabled={!newAddress?.address?.trim()} className="flex-1">
                          Lưu địa chỉ
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setShowAddressForm(false)
                            setNewAddress({ address: "", address_type: AddressType.HOME })
                          }}
                        >
                          Hủy
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <CreditCard className="h-5 w-5 text-primary" />
                    Phương thức thanh toán
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value="COD" id="COD" />
                      <Label htmlFor="COD" className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-3">
                          <Truck className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">Thanh toán khi nhận hàng (COD)</p>
                            <p className="text-sm text-muted-foreground">Thanh toán bằng tiền mặt khi nhận hàng</p>
                          </div>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value="VNPAY" id="VNPAY" />
                      <Label htmlFor="VNPAY" className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-3">
                          <CreditCard className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">Thanh toán online VNPAY</p>
                            <p className="text-sm text-muted-foreground">Thanh toán qua thẻ ATM, Visa, MasterCard</p>
                          </div>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-6">
                <Card className="border-0 shadow-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl">Tóm tắt đơn hàng</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {checkout?.metadata?.item_products?.length === 0 ? (
                      <p className="text-center text-muted-foreground py-4">Chưa có sản phẩm nào được chọn</p>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Tạm tính:</span>
                          <span className="font-medium">
                            {checkout?.metadata.item_products
                              .reduce((total, item) => total + item.price * item.quantity, 0)
                              .toLocaleString()}{" "}
                            đ
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Phí vận chuyển:</span>
                          <span className="font-medium">
                            {checkout?.metadata?.checkout_order?.feeShip.toLocaleString()} đ
                          </span>
                        </div>
                        <Separator />
                        <div className="flex justify-between text-lg font-semibold">
                          <span>Tổng cộng:</span>
                          <span className="text-primary">
                            {checkout?.metadata?.checkout_order?.totalCheckout.toLocaleString()} đ
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">* Giá đã bao gồm thuế VAT (nếu có)</p>
                      </div>
                    )}

                    <Separator />

                    <Button
                      className="w-full h-12 text-base font-semibold"
                      disabled={selectedCartItems.length === 0 || !selectedAddress}
                      size="lg"
                      onClick={() => {
                        handlePurchase()
                      }}
                    >
                      {selectedCartItems.length === 0
                        ? "Chọn sản phẩm để đặt hàng"
                        : `Đặt hàng (${selectedCartItems.length} sản phẩm)`}
                    </Button>

                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground bg-muted/50 px-4 py-3 rounded-lg">
                      <Shield className="h-4 w-4 text-primary" />
                      <span>Thanh toán an toàn & bảo mật</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Xác nhận xóa địa chỉ</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa địa chỉ này không? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={cancelDelete}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Xóa địa chỉ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
