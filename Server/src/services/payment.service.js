
const { VNPay, ignoreLogger, ProductCode, VnpLocale, dateFormat } = require('vnpay')
const dayjs = require('dayjs')
class PaymentService {
    static async vnpayMethod({ totalPrice, userId }) {
        const amountVnd = Math.round(Number(totalPrice));
        if (!Number.isFinite(amountVnd) || amountVnd <= 0) {
            throw new Error('Invalid amount');
        }

        const vnpay = new VNPay({
            tmnCode: 'WEDL9C84',
            secureSecret: 'V6KK3G8SKLXB5RYCI5E41PETQ67MHAGO',
            vnpayHost: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
            testMode: true,
            hashAlgorithm: 'SHA512',
            loggerFn: ignoreLogger
        })

        const vnpayResponse = await vnpay.buildPaymentUrl({
            vnp_Amount: amountVnd,
            vnp_IpAddr: '127.0.0.1',
            vnp_TxnRef: userId,
            vnp_OrderInfo: `${userId}`,
            vnp_OrderType: ProductCode.Other,
            vnp_ReturnUrl: 'http://localhost:5173/v1/api/check-payment',
            vnp_Locale: VnpLocale.VN,
            vnp_CreateDate: dateFormat(new Date()),
            vnp_ExpireDate: dateFormat(dayjs(new Date()).add(1, 'day').toDate())
        })

        return vnpayResponse
    }
}

module.exports = PaymentService