"use client";

import React, {useState} from "react";

// Define the proper types for our FAQ data structure
interface FaqItem {
    question: string;
    answer: React.ReactNode;
}

interface FaqSection {
    id: string;
    title: string;
    faqs: FaqItem[];
}

interface FaqSectionProps {
    sections: FaqSection[];
}

const FaqSection: React.FC<FaqSectionProps> = ({sections}) => {
    const [activeSection, setActiveSection] = useState<string>(
        sections[0]?.id || ""
    );
    const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

    const toggleItem = (id: string) => {
        setOpenItems((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    return (
        <>
            {/* Category tabs */}
            <div className="mb-10 overflow-x-auto scrollbar-hide">
                <div className="flex space-x-2 min-w-max">
                    {sections.map((section) => (
                        <button
                            key={section.id}
                            onClick={() => setActiveSection(section.id)}
                            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
                                activeSection === section.id
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}>
                            {section.title}
                        </button>
                    ))}
                </div>
            </div>

            {/* FAQ content */}
            <div className="space-y-12">
                {sections.map((section) => (
                    <div
                        key={section.id}
                        id={section.id}
                        className={
                            activeSection === section.id ? "block" : "hidden"
                        }>
                        <h2 className="text-2xl font-bold mb-6 text-gray-800">
                            {section.title}
                        </h2>
                        <div className="space-y-4">
                            {section.faqs.map((faq, index) => {
                                const faqId = `${section.id}-${index}`;
                                return (
                                    <div
                                        key={faqId}
                                        className="border border-gray-200 rounded-lg overflow-hidden transition-all duration-300">
                                        <button
                                            onClick={() => toggleItem(faqId)}
                                            className="w-full text-left p-5 flex justify-between items-center focus:outline-none bg-white hover:bg-gray-50">
                                            <h3 className="font-semibold text-lg text-gray-800">
                                                {faq.question}
                                            </h3>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className={`h-5 w-5 text-gray-500 transition-transform ${
                                                    openItems[faqId]
                                                        ? "transform rotate-180"
                                                        : ""
                                                }`}
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M19 9l-7 7-7-7"
                                                />
                                            </svg>
                                        </button>
                                        <div
                                            className={`overflow-hidden transition-all duration-300 ${
                                                openItems[faqId]
                                                    ? "max-h-[1000px] opacity-100"
                                                    : "max-h-0 opacity-0"
                                            }`}>
                                            <div className="p-5 bg-gray-50 text-gray-700 border-t border-gray-100">
                                                {faq.answer}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default FaqSection;
