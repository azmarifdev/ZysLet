import React from "react";

const NotFound = ({message}: {message: string}) => {
    return (
        <div className="text-gray  mt-20 text-3xl text-center">{message}</div>
    );
};

export default NotFound;
