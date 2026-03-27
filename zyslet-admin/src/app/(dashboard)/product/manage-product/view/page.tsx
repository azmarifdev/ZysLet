"use client";
import Loader from "@/components/reusable/Loader/Loader";
import ProductDetails from "./product-details";
import {useProductDetailsQuery} from "@/redux/api/productApi";
import {useSearchParams} from "next/navigation";

const DetailProductPage = () => {
    // Fetch product details using the productId from searchParams

    const id = useSearchParams().get("productId");

    const {data: productResponse, isLoading} = useProductDetailsQuery(id);

    if (isLoading) return <Loader />;

    const product = productResponse?.data;
    // console.log("product: ", product);

    return <ProductDetails product={product} />;
};

export default DetailProductPage;
