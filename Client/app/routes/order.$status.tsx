"use client";

import type { Route } from "../+types/root";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, ShoppingBag, ArrowLeft, CreditCard, Truck, ArrowLeftIcon } from "lucide-react";
import { Link, useParams } from "react-router";
import SiteHeader from "@/components/layout/client-header";
import SiteFooter from "@/components/layout/client-footer";
import { useEffect, useState } from "react";

export function meta({ params }: Route.MetaArgs) {
    const status = params.status;
    let title = "Trạng thái đơn hàng";

    if (status === "success") {
        title = "Đặt hàng thành công";
    } else if (status === "failed") {
        title = "Thanh toán thất bại";
    }

    return [
        { title },
        { name: "description", content: "Trạng thái đơn hàng của bạn" },
    ];
}

const OrderStatusPage = () => {
    const params = useParams();
    const status = params.status;
    const [paymentMethod, setPaymentMethod] = useState<string>("");

    useEffect(() => {
        // Get payment method from URL search params or local storage
        const urlParams = new URLSearchParams(window.location.search);
        const method = urlParams.get("method") || localStorage.getItem("lastPaymentMethod") || "COD";
        setPaymentMethod(method);
    }, []);

    const getStatusContent = () => {
        switch (status?.toLowerCase()) {
            case "success":
                return {
                    icon: <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />,
                    title: "Đặt hàng thành công!",
                    description: paymentMethod === "VNPAY"
                        ? "Thanh toán VNPAY đã được xử lý thành công. Đơn hàng của bạn đã được xác nhận."
                        : "Đơn hàng của bạn đã được tạo thành công. Bạn sẽ thanh toán khi nhận hàng.",
                    bgColor: "bg-green-50",
                    borderColor: "border-green-200",
                    titleColor: "text-green-800",
                    descriptionColor: "text-green-600"
                };

            case "failed":
                return {
                    icon: <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />,
                    title: "Đặt hàng thất bại!",
                    description: "Thanh toán VNPAY không thành công. Đơn hàng chưa được tạo. Vui lòng thử lại hoặc chọn phương thức thanh toán khác.",
                    bgColor: "bg-red-50",
                    borderColor: "border-red-200",
                    titleColor: "text-red-800",
                    descriptionColor: "text-red-600"
                };

            default:
                return {
                    icon: <ShoppingBag className="w-16 h-16 text-gray-500 mx-auto mb-4" />,
                    title: "Đang xử lý...",
                    description: "Hệ thống đang xử lý thông tin đơn hàng của bạn.",
                    bgColor: "bg-gray-50",
                    borderColor: "border-gray-200",
                    titleColor: "text-gray-800",
                    descriptionColor: "text-gray-600"
                };
        }
    };

    const statusContent = getStatusContent();

    return (
        <div className="min-h-screen bg-gray-50">
            <SiteHeader />

            <main className="container mx-auto px-4 py-8 max-w-2xl">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Trạng thái đơn hàng
                    </h1>
                    <p className="text-gray-600">
                        Thông tin về tình trạng đơn hàng của bạn
                    </p>
                </div>

                <Card className={`${statusContent.bgColor} ${statusContent.borderColor} border-2`}>
                    <CardHeader>
                        <div className="text-center">
                            {statusContent.icon}
                            <CardTitle className={`text-2xl font-bold ${statusContent.titleColor}`}>
                                {statusContent.title}
                            </CardTitle>
                        </div>
                    </CardHeader>

                    <CardContent className="text-center space-y-6">
                        <p className={`text-lg ${statusContent.descriptionColor}`}>
                            {statusContent.description}
                        </p>

                        {status === "success" && (
                            <div className="bg-white rounded-lg p-4 border border-gray-200">
                                <div className="flex items-center justify-center gap-3 mb-3">
                                    {paymentMethod === "VNPAY" ? (
                                        <CreditCard className="w-5 h-5 text-blue-500" />
                                    ) : (
                                        <Truck className="w-5 h-5 text-orange-500" />
                                    )}
                                    <span className="font-semibold text-gray-700">
                                        Phương thức thanh toán: {paymentMethod === "VNPAY" ? "VNPAY" : "Thanh toán khi nhận hàng (COD)"}
                                    </span>
                                </div>

                                {paymentMethod === "COD" && (
                                    <p className="text-sm text-gray-600">
                                        Bạn sẽ thanh toán trực tiếp cho shipper khi nhận hàng
                                    </p>
                                )}

                                {paymentMethod === "VNPAY" && (
                                    <p className="text-sm text-gray-600">
                                        Thanh toán đã được xử lý thành công qua VNPAY
                                    </p>
                                )}
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            {status === "success" && (
                                <>
                                    <Button asChild
                                        variant="translucent"
                                        color="green"
                                    >
                                        <Link to="/orders/history">
                                            <ShoppingBag className="w-4 h-4 mr-2" />
                                            Xem đơn hàng
                                        </Link>
                                    </Button>
                                    <Button variant="outline" asChild>
                                        <Link to="/">
                                            Tiếp tục mua sắm
                                        </Link>
                                    </Button>
                                </>
                            )}

                            {status === "failed" && (
                                <>
                                    <Button variant="outline" asChild>
                                        <Link to="/cart">
                                            <ArrowLeftIcon className="w-4 h-4 mr-2" />
                                            Về giỏ hàng
                                        </Link>
                                    </Button>
                                </>
                            )}

                            {status !== "success" && status !== "failed" && (
                                <Button variant="outline" asChild>
                                    <Link to="/">
                                        <ArrowLeftIcon className="w-4 h-4 mr-2" />
                                        Về trang chủ
                                    </Link>
                                </Button>
                            )}
                        </div>

                        {/* Contact support section */}
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <p className="text-sm text-gray-500 mb-2">
                                Cần hỗ trợ? Liên hệ với chúng tôi
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </main>

            <SiteFooter />
        </div>
    );
};

export default OrderStatusPage;
