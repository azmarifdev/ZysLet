import React, { useState, useEffect } from 'react';

interface ConvertHtmlProps {
    content: string;
}

const ConvertHtml: React.FC<ConvertHtmlProps> = ({ content }) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Return empty wrapper during server-side rendering to prevent hydration mismatch
    if (!isMounted) {
        return <p className="custom-reset prose whitespace-pre-wrap"></p>;
    }

    return <p className="custom-reset prose whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: content }} />;
};

export default ConvertHtml;
