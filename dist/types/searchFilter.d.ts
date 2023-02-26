type dataParams<T> = {
    [K in keyof T]?: T[K] extends string ? T[K] | {
        has?: T[K][];
        not?: T[K][];
        equals?: string;
    } : T[K] extends number ? T[K] | {
        from: number;
        to: number;
    } | {
        or: number[];
    } : T[K] extends boolean ? boolean : T[K] extends any[] ? {
        has?: number[] | string[] | boolean[];
        not?: number[] | string[] | boolean[];
    } : never;
};
type searchFilter<T> = {
    or?: dataParams<T>;
    and?: never;
} | {
    and?: dataParams<T>;
    or?: never;
};
export { dataParams };
export default searchFilter;
