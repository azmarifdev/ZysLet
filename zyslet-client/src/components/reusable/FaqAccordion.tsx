'use client';

import React, { useState } from 'react';

interface FaqItem {
    question: string;
    answer: string;
}

interface FaqAccordionProps {
    faqs: FaqItem[];
}

const FaqAccordion: React.FC<FaqAccordionProps> = ({ faqs }) => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleFaq = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="space-y-4">
            {faqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                    <button
                        onClick={() => toggleFaq(index)}
                        className="flex justify-between items-center w-full p-5 text-left">
                        <span className="font-medium text-gray-900">{faq.question}</span>
                        <svg
                            className={`w-5 h-5 transition-transform duration-200 ${
                                openIndex === index ? 'transform rotate-180' : ''
                            }`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    <div
                        className={`transition-all duration-300 ease-in-out overflow-hidden ${
                            openIndex === index ? 'max-h-96' : 'max-h-0'
                        }`}>
                        <div className="p-5 pt-0 border-t border-gray-200">
                            <p className="text-gray-600">{faq.answer}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default FaqAccordion;
