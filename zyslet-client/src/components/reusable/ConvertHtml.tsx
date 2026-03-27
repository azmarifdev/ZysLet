import React, { useState, useEffect, useMemo } from 'react';

interface ConvertHtmlProps {
    content: string;
}

const ConvertHtml: React.FC<ConvertHtmlProps> = ({ content }) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Memoize the content to prevent unnecessary re-renders
    const memoizedContent = useMemo(() => content, [content]);

    // Return null during server-side rendering to prevent hydration mismatch
    if (!isMounted) {
        return <p className="custom-reset prose whitespace-pre-wrap leading-tight"></p>;
    }

    return (
        <p
            className="custom-reset prose whitespace-pre-wrap leading-tight"
            dangerouslySetInnerHTML={{ __html: memoizedContent }}
        />
    );
};

export default ConvertHtml;
