"use client";

import {useState} from "react";
import Steps from "./components/Tabs";
import {BasicInformationSection} from "./components/BasicInformationSection";
import {SEOInformationSectionWrapper} from "./components/SeoSection";
import {ProductDetailsAndAttributesSection} from "./components/ProductDetailsAndAttributesSection";
import {MediaSection} from "./components/MediaSectionWithForm";
import {SpecificationsSection} from "./components/SpecificationsSection";
import {DescriptionBlocksSection} from "./components/DescriptionBlocks";

const ProductEdit = ({product}: {product: any}) => {
    const [activeTab, setActiveTab] = useState("general");

    return (
        <div className="max-w-5xl">
            <h1 className="text-2xl font-bold mb-6 text-gray-900">
                Update Product
            </h1>
            <Steps activeTab={activeTab} setActiveTab={setActiveTab} />

            {activeTab === "general" && (
                <BasicInformationSection
                    onNext={() => setActiveTab("details")}
                    product={product}
                />
            )}

            {activeTab === "details" && (
                <ProductDetailsAndAttributesSection
                    product={product}
                    onPrev={() => setActiveTab("general")}
                    onNext={() => setActiveTab("blocks")}
                />
            )}
            {activeTab === "blocks" && (
                <DescriptionBlocksSection
                    product={product}
                    onPrev={() => setActiveTab("details")}
                    onNext={() => setActiveTab("specifications")}
                />
            )}
            {activeTab === "specifications" && (
                <SpecificationsSection
                    product={product}
                    onPrev={() => setActiveTab("blocks")}
                    onNext={() => setActiveTab("media")}
                />
            )}
            {activeTab === "media" && (
                <MediaSection
                    existingImages={product.images}
                    existingThumbnail={product.thumbnail}
                    productId={product._id}
                    onPrev={() => setActiveTab("specifications")}
                    onNext={() => setActiveTab("seo")}
                />
            )}
            {activeTab === "seo" && (
                <SEOInformationSectionWrapper
                    product={product}
                    onPrev={() => setActiveTab("media")}
                />
            )}

            {/* Add other tab content here */}
        </div>
    );
};

export default ProductEdit;
