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
    return new Intl.NumberFormat("en-US", {
        useGrouping: true,
    })
        .format(n)
        .replace(/,/g, " ");
};
