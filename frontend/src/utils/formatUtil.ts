/**
 * Formats a given date into a readable string.
 *
 * The formatted date string includes the year (YYYY), month (e.g. "January"),
 * day (D), hour (HH), and minute (MM), all in the "en-US" locale.
 *
 * @param date - The date object to format.
 * @returns A string representing the formatted date.
 */
export const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

/**
 * Formats number in a presentable way.
 *
 * Uses " " as thousands separator and "," as decimal separator.
 *
 * @param n - The number to format.
 * @returns The formatted number as a string.
 */
export const formatNumber = (n: number) => {
    return n.toLocaleString("no-NO");
};

/**
 * Formats a number as a currency string in US dollars.
 *
 * Uses "$" as currency symbol, "," as thousands separator, and no decimal places.
 *
 * @param value - The numeric value to be formatted.
 * @returns A string representing the formatted currency value in US dollars.
 */
export const formatCurrency = (value: number) => {
    return value.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
    });
};
