import { useParams } from "react-router";
import { useEffect, useState } from "react";
import AddEditProduct from "@/components/dashboard/add-edit-product";
import { ApiService } from "@/lib/api";
import { ENDPOINTS } from "@/utils/api.endpoints";
import { ProductDTO } from "@/types/dto/product.dto";

export function meta() {
    return [
        { title: "Chỉnh sửa sản phẩm" },
        { name: "description", content: "Chỉnh sửa thông tin sản phẩm của bạn" },
    ]
}

export default function EditProductPage() {
  const params = useParams();
  const productId = params.id;
  const [productData, setProductData] = useState<ProductDTO | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await ApiService.get<ProductDTO>(ENDPOINTS.PRODUCT.FETCH_ONE(productId as string));
        setProductData(response);
      } catch (error) {
        console.error("Error fetching product data:", error);
        setProductData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [productId]);

  if (loading) return <div>Loading...</div>;
  return productData ? <AddEditProduct productToEdit={productData.metadata} /> : <div>Product not found</div>;
}
