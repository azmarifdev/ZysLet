"use client";
import ProductEdit from "@/components/pages-component/products/edit-product/ProductEdit";
import Loader from "@/components/reusable/Loader/Loader";

import {useProductDetailsQuery} from "@/redux/api/productApi";
import {useSearchParams} from "next/navigation";

const ProductEditPage = () => {
    const id = useSearchParams().get("id");

    const {data: productResponse, isLoading} = useProductDetailsQuery(id);

    if (isLoading) return <Loader />;

    const product = productResponse?.data;

    return <ProductEdit product={product} />;
};

export default ProductEditPage;
