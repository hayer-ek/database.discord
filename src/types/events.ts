type events = {
    error: (msg: string) => unknown;
    connect: () => unknown;
};

export default events