"use client";

import type { Route } from "../+types/root";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { ApiService } from "@/lib/api/api.service";
import { ENDPOINTS } from "@/utils/api.endpoints";
import { CreateOrderDTO } from "@/types/dto/order.dto";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { deleteFromCart } from "@/redux/thunks/cart.thunk";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import SiteHeader from "@/components/layout/client-header";
import SiteFooter from "@/components/layout/client-footer";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Đang xử lý thanh toán" },
    { name: "description", content: "Đang xử lý thông tin thanh toán của bạn" },
  ];
}

const CheckPaymentPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isProcessing, setIsProcessing] = useState(true);
  const [statusMessage, setStatusMessage] = useState("Đang xử lý thanh toán...");

  useEffect(() => {
    const processPayment = async () => {
      try {
        // Get VNPAY return parameters
        const vnpParams = {
          vnp_Amount: searchParams.get('vnp_Amount'),
          vnp_BankCode: searchParams.get('vnp_BankCode'),
          vnp_BankTranNo: searchParams.get('vnp_BankTranNo'),
          vnp_CardType: searchParams.get('vnp_CardType'),
          vnp_OrderInfo: searchParams.get('vnp_OrderInfo'), // This contains userId
          vnp_PayDate: searchParams.get('vnp_PayDate'),
          vnp_ResponseCode: searchParams.get('vnp_ResponseCode'),
          vnp_TmnCode: searchParams.get('vnp_TmnCode'),
          vnp_TransactionNo: searchParams.get('vnp_TransactionNo'),
          vnp_TransactionStatus: searchParams.get('vnp_TransactionStatus'),
          vnp_TxnRef: searchParams.get('vnp_TxnRef'),
          vnp_SecureHash: searchParams.get('vnp_SecureHash'),
        };

        // Check if we have all required parameters
        if (!vnpParams.vnp_ResponseCode || !vnpParams.vnp_TransactionStatus) {
          setStatusMessage("Thiếu thông tin thanh toán");
          setTimeout(() => {
            navigate("/order/failed?method=VNPAY");
          }, 2000);
          return;
        }

        setStatusMessage("Đang xác thực thanh toán...");

        // Check payment status
        // vnp_ResponseCode: 00 = Success, others = Failed
        // vnp_TransactionStatus: 00 = Success, others = Failed
        const isPaymentSuccessful = 
          vnpParams.vnp_ResponseCode === '00' && 
          vnpParams.vnp_TransactionStatus === '00';

        if (!isPaymentSuccessful) {
          // Payment failed
          setStatusMessage("Thanh toán thất bại");
          setTimeout(() => {
            navigate("/order/failed?method=VNPAY");
          }, 2000);
          return;
        }

        setStatusMessage("Thanh toán thành công, đang tạo đơn hàng...");

        // Get saved checkout data from localStorage
        const savedCheckoutData = localStorage.getItem('vnpayCheckoutData');
        if (!savedCheckoutData) {
          setStatusMessage("Không tìm thấy thông tin đơn hàng");
          setTimeout(() => {
            navigate("/order/failed?method=VNPAY");
          }, 2000);
          return;
        }

        const checkoutData = JSON.parse(savedCheckoutData);
        
        // Create order after successful payment
        const orderResponse = await ApiService.post<CreateOrderDTO>(ENDPOINTS.ORDER.CREATE, {
          item_products: checkoutData.item_products,
          addressId: checkoutData.addressId,
          paymentMethod: "VNPAY",
          vnpayData: vnpParams, // Include VNPAY transaction data
        });

        if (orderResponse.statusCode === 200 || orderResponse.statusCode === 201) {
          setStatusMessage("Đơn hàng được tạo thành công!");
          
          // Clear selected items from cart
          checkoutData.item_products.forEach((item: any) => {
            dispatch(deleteFromCart({ productId: item.productId }));
          });

          // Clear localStorage
          localStorage.removeItem('vnpayCheckoutData');
          localStorage.setItem('lastPaymentMethod', 'VNPAY');

          // Redirect to success page
          setTimeout(() => {
            navigate("/order/success?method=VNPAY");
          }, 1500);
        } else {
          throw new Error('Order creation failed');
        }

      } catch (error) {
        console.error('Payment processing error:', error);
        setStatusMessage("Có lỗi xảy ra khi xử lý đơn hàng");
        setTimeout(() => {
          navigate("/order/failed?method=VNPAY");
        }, 2000);
      } finally {
        setIsProcessing(false);
      }
    };

    // Start processing after a short delay
    const timer = setTimeout(() => {
      processPayment();
    }, 1000);

    return () => clearTimeout(timer);
  }, [searchParams, navigate, dispatch]);

  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader />
      
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="bg-white border-blue-200 border-2">
          <CardContent className="text-center py-12">
            <div className="flex justify-center mb-6">
              <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Đang xử lý thanh toán
            </h1>
            
            <p className="text-lg text-gray-600 mb-6">
              {statusMessage}
            </p>
            
            <div className="text-sm text-gray-500">
              Vui lòng không đóng trang này...
            </div>
          </CardContent>
        </Card>
      </main>

      <SiteFooter />
    </div>
  );
};

export default CheckPaymentPage;

// VNPAY Return URL Example:
// http://localhost:5173/check-payment?vnp_Amount=10000000&vnp_BankCode=NCB&vnp_BankTranNo=VNP15157712&vnp_CardType=ATM&vnp_OrderInfo=689471fc659ad34ec9a2cc6b&vnp_PayDate=20250904102459&vnp_ResponseCode=00&vnp_TmnCode=WEDL9C84&vnp_TransactionNo=15157712&vnp_TransactionStatus=00&vnp_TxnRef=202509041014012179&vnp_SecureHash=79ee8358ba922179a092b68419b3edcbff198a082c4a0ea325a3fb71c3f73b6b8da0809312f567d16dddf2e9730e947364ea25951bc1545e880d66461108d168

