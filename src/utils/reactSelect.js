export const reactSelectCustomFilter = (option, rawInput) => {
    const words = rawInput.split(' ');

    return words.reduce(
        (acc, cur) => acc && option.label.toLowerCase().includes(cur.toLowerCase()),
        true
    );
};
