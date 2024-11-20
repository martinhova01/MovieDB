export const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

export const formatNumber = (n: number) => {
    return n.toLocaleString("no-NO");
};

export const formatCurrency = (value: number) => {
    return value.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
    });
};
