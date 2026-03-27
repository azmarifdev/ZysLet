"use client";
import React, {useState, useEffect, useRef, useMemo} from "react";
import dynamic from "next/dynamic";

// Dynamically import JoditReact (SSG-safe) with a custom loading component
const JoditReact = dynamic(() => import("jodit-react"), {
    ssr: false,
    loading: () => (
        <div className="border  p-4 text-gray-500 rounded-lg border-stone-400 h-40">
            Loading...
        </div>
    ),
});

interface EditorProps {
    value: string;
    // eslint-disable-next-line no-unused-vars
    onChange: (value: string) => void;
    id?: string;
}

const TextEditor: React.FC<EditorProps> = ({value, onChange, id}) => {
    // Create a unique ID for each editor instance
    const uniqueId = useMemo(
        () => id || `editor-${Math.random().toString(36).substring(2, 9)}`,
        [id]
    );
    const editor = useRef(null); // Create ref for Jodit editor
    const [content, setContent] = useState(value || ""); // Local state for the editor content

    useEffect(() => {
        setContent(value); // Ensure that the content updates if the `value` prop changes
    }, [value]);

    // Handle content change and trigger onChange prop
    const handleEditorChange = (newContent: string) => {
        setContent(newContent);
        if (newContent !== value) onChange(newContent);
    };

    // Use useMemo to create a unique config object for each instance
    const config = useMemo(
        () => ({
            placeholder: "Type here...",
            readonly: false, // All options from Jodit documentation are valid here
            toolbarSticky: false,
            height: 200,
            toolbarAdaptive: false,
            toolbar: true, // Enable toolbar (or customize based on your needs)
            buttons: [
                "bold",
                "italic",
                "underline",
                "strikethrough",
                "|",
                "font",
                "fontsize",
                "|",
                "align",
                "|",
                "ul",
                "ol",
                "|",
                "link",
                "hr",
                "|",
                "undo",
                "redo",
                "|",
                "fullsize",
            ],
            showCharsCounter: false,
            showWordsCounter: false,
            showXPathInStatusbar: false,
            addNewLineDeltaShow: 0,
        }),
        []
    );

    return (
        <JoditReact
            ref={editor}
            id={uniqueId}
            value={content}
            config={config}
            onChange={handleEditorChange}
        />
    );
};

export default TextEditor;
