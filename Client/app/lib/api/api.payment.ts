import { ApiService } from "./api.service";
import { ENDPOINTS } from "@/utils/api.endpoints";
import { DefaultDTO } from "@/types/dto";

export interface VNPayReturnParams {
  vnp_Amount?: string | null;
  vnp_BankCode?: string | null;
  vnp_BankTranNo?: string | null;
  vnp_CardType?: string | null;
  vnp_OrderInfo?: string | null;
  vnp_PayDate?: string | null;
  vnp_ResponseCode?: string | null;
  vnp_TmnCode?: string | null;
  vnp_TransactionNo?: string | null;
  vnp_TransactionStatus?: string | null;
  vnp_TxnRef?: string | null;
  vnp_SecureHash?: string | null;
}

export interface PaymentVerificationResponse extends DefaultDTO {
  metadata: {
    isValid: boolean;
    isSuccess: boolean;
    transactionData?: VNPayReturnParams;
  };
}

export const verifyVNPayPayment = async (params: VNPayReturnParams): Promise<PaymentVerificationResponse> => {
  return await ApiService.post<PaymentVerificationResponse>(ENDPOINTS.PAYMENT_VERIFY, params);
};

export const createVNPayPayment = async (totalPrice: number): Promise<DefaultDTO> => {
  return await ApiService.post<DefaultDTO>(ENDPOINTS.PAYMENT(totalPrice));
};
