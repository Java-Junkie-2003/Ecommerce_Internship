import AddEditProduct from "@/components/dashboard/add-edit-product";

export function meta() {
    return [
        { title: "Thêm sản phẩm mới" },
        { name: "description", content: "Thêm sản phẩm mới vào cửa hàng của bạn" },
    ]
}

export default function AddProductPage() {
  return <AddEditProduct />
}
