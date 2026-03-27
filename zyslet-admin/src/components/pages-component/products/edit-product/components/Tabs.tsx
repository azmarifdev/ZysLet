import {Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs";

type props = {
    activeTab: string;
    // eslint-disable-next-line no-unused-vars
    setActiveTab: (value: string) => void;
};

const Steps = ({activeTab, setActiveTab}: props) => {
    return (
        <div className="flex items-center justify-center mb-6">
            <Tabs
                value={activeTab}
                onValueChange={(value) => setActiveTab(value)}
                className=" !p-0.5">
                <TabsList
                    className="w-full p-1"
                    style={{
                        borderRadius: "6px",
                        border: "1px solid #D1D4D8",
                    }}>
                    <TabsTrigger
                        className="!w-32 h-8 p-2.5 rounded data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                        value="general">
                        General
                    </TabsTrigger>

                    <TabsTrigger
                        className="w-32 h-8 p-2.5 rounded data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                        value="details">
                        Product Details
                    </TabsTrigger>
                    <TabsTrigger
                        className="w-32 h-8 p-2.5 rounded data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                        value="blocks">
                        Product Blocks
                    </TabsTrigger>
                    <TabsTrigger
                        className="w-32 h-8 p-2.5 rounded data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                        value="specifications">
                        Specifications
                    </TabsTrigger>
                    <TabsTrigger
                        className="w-32 h-8 p-2.5 rounded data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                        value="media">
                        Media
                    </TabsTrigger>
                    <TabsTrigger
                        className="w-32 h-8 p-2.5 rounded data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                        value="seo">
                        SEO Info
                    </TabsTrigger>
                </TabsList>
            </Tabs>
        </div>
    );
};

export default Steps;
