export function debounce<T extends (...args: any[]) => void>(
    fn: T,
    delayMs: number
) {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    return (...args: Parameters<T>) => {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            fn(...args);
        }, delayMs);
    };
}


