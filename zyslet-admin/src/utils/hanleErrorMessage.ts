export function handleErrorMessages(
    error: any
): error is {errorMessage: {message: string}[]} {
    return (
        error &&
        Array.isArray(error.errorMessage) &&
        typeof error.errorMessage[0]?.message === "string"
    );
}
