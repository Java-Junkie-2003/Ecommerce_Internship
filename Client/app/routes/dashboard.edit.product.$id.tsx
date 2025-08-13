import { useParams } from "react-router";
import AddEditProduct from "@/components/dashboard/add-edit-product";


// Mock data for a product to edit (in a real app, you'd fetch this based on ID)
const mockProductToEdit = {
  id: "PROD001",
  product_name: "Eternal Bloom (Edited)",
  product_thumb: "/placeholder.svg?height=100&width=100&text=Edited Bloom",
  product_description: "This is an edited description for the Eternal Bloom perfume, showcasing its updated details.",
  product_price: "99.99",
  product_type: "eau de parfum",
  product_attributes: {
    volume: "75ml",
    gender: "unisex",
    notes: ["rose", "jasmine", "sandalwood", "musk"],
  },
  product_ratingAverage: 4.8,
  product_brand_id: "brand2", // Dior
  category_id: "cat3", // Nước hoa unisex
  isDraft: false,
  isPublished: true,
};

export default function EditProductPage() {
  const params = useParams();
  const productId = params.id;

  // In a real application, you would fetch product data based on productId
  // For this example, we'll just use a static mockProductToEdit
  const productData = productId === "PROD001" ? mockProductToEdit : undefined;

  return <AddEditProduct productToEdit={productData} />
}
