import searchFilter from "../types/searchFilter";
import addChannelParams from "../types/addChannelParams";
import { convertForChannelDb } from "../types/convertType";
import findSearchParams from "../types/findSearchParams";

export default function makeSearch<A, T>(
    obj: T,
    searchFilter: searchFilter<convertForChannelDb<A>>,
    channelData: addChannelParams<T>,
    searchParams?: findSearchParams
): boolean {
    let andRes = true;
    let orRes = true;
    if (!obj) return false;

    if (searchFilter.and) {
        const objectKeys = Object.keys(searchFilter.and);

        objectKeys.forEach((k) => {
            const key: keyof T = k as any;
            const field: any = searchFilter.and![key];

            if (channelData.properties[key].type == "string") {
                if (typeof field == "string") {
                    if (searchParams?.ignoreCase) {
                        if (
                            field.toLowerCase() !=
                            (obj[key] as string).toLowerCase()
                        ) {
                            andRes = false;
                        }
                        return;
                    }
                    if (field != obj[key]) {
                        andRes = false;
                    }
                    return;
                }
                let has = true;
                if (field.has) {
                    has = false;
                    field.has.forEach((prop: string) => {
                        if (has) return;
                        if (searchParams?.ignoreCase) {
                            if (
                                (obj[key] as string)
                                    .toLowerCase()
                                    .includes(prop.toLowerCase())
                            )
                                has = true;
                        } else if (
                            (obj[key] as string).includes(prop)
                        )
                            has = true;
                    });
                }

                let not = true;
                if (field.not) {
                    field.not.forEach((prop: string) => {
                        if (!not) return;
                        if (searchParams?.ignoreCase) {
                            if (
                                (obj[key] as string)
                                    .toLowerCase()
                                    .includes(prop.toLowerCase())
                            )
                                not = false;
                        } else if (
                            (obj[key] as string).includes(prop)
                        )
                            not = false;
                    });
                }

                if (!has || !not) andRes = false;
                return;
            }

            if (channelData.properties[key].type == "number") {
                if (typeof field == "number") {
                    if (field != obj[key]) andRes = false;
                    return;
                }

                let fromTo = true;
                if (
                    typeof field.from == "number" &&
                    typeof field.to == "number"
                ) {
                    if (
                        obj[key] < field.from ||
                        obj[key] > field.to ||
                        field.from > field.to
                    ) {
                        fromTo = false;
                    }
                }

                let or = true;
                if (field.or) {
                    or = false;
                    field.or.forEach((prop: number) => {
                        if (or) return;
                        if (prop == obj[key]) or = true;
                    });
                }

                if (!or || !fromTo) andRes = false;
                return;
            }

            if (channelData.properties[key].type == "boolean") {
                if (field !== obj[key]) andRes = false;
                return;
            }

            if (channelData.properties[key].type == "array") {
                let has = true;
                if (field.has) {
                    has = false;
                    field.has.forEach((prop: any) => {
                        if (has) return;
                        if ((obj[key] as any[]).includes(prop))
                            has = true;
                    });
                }

                let not = true;
                if (field.not) {
                    field.not.forEach((prop: any) => {
                        if (!not) return;
                        if ((obj[key] as any[]).includes(prop))
                            not = false;
                    });
                }

                if (!has || !not) andRes = false;
            }
        });
    }
    if (searchFilter.or) {
        const objectKeys = Object.keys(searchFilter.or);
        if (objectKeys.length > 0) {
            orRes = false;
        }
        objectKeys.forEach((k) => {
            const key: keyof T = k as any;

            if (typeof obj[key] == "undefined") return;
            const field: any = searchFilter.or![key];

            if (channelData.properties[key].type == "string") {
                if (typeof field == "string") {
                    if (searchParams?.ignoreCase) {
                        if (
                            field.toLowerCase() !=
                            (obj[key] as string).toLowerCase()
                        ) {
                            orRes = false;
                            return;
                        }
                        orRes = true;
                        return;
                    }
                    if (field != obj[key]) {
                        orRes = false;
                    } else {
                        orRes = true;
                    }
                    return;
                }

                let has = false;
                if (field.has) {
                    field.has.forEach((prop: string) => {
                        if (has) return;
                        if (searchParams?.ignoreCase) {
                            if (
                                (obj[key] as string)
                                    .toLowerCase()
                                    .includes(prop.toLowerCase())
                            )
                                has = true;
                        } else if (
                            (obj[key] as string).includes(prop)
                        )
                            has = true;
                    });
                }

                let not = false;
                if (field.not) {
                    not = true;
                    field.not.forEach((prop: string) => {
                        if (!not) return;
                        if (searchParams?.ignoreCase) {
                            if (
                                (obj[key] as string)
                                    .toLowerCase()
                                    .includes(prop.toLowerCase())
                            )
                                not = false;
                        } else if (
                            (obj[key] as string).includes(prop)
                        )
                            not = false;
                    });
                }

                if (has || not) orRes = true;
                return;
            }

            if (channelData.properties[key].type == "number") {
                if (typeof field == "number") {
                    if (field == obj[key]) orRes = true;
                    return;
                }

                let fromTo = false;
                if (
                    typeof field.from == "number" &&
                    typeof field.to == "number"
                ) {
                    if (
                        obj[key] > field.from &&
                        obj[key] <= field.to
                    ) {
                        fromTo = true;
                    }
                }

                let or = false;
                if (field.or) {
                    field.or.forEach((prop: number) => {
                        if (or) return;
                        if (prop == obj[key]) or = true;
                    });
                }
                if (or || fromTo) orRes = true;
                return;
            }

            if (channelData.properties[key].type == "boolean") {
                if (field == obj[key]) orRes = true;
                return;
            }

            if (channelData.properties[key].type == "array") {
                let has = false;
                if (field.has) {
                    field.has.forEach((prop: any) => {
                        if (has) return;
                        if ((obj[key] as any[]).includes(prop))
                            has = true;
                    });
                }

                let not = false;
                if (field.not) {
                    not = true;
                    field.not.forEach((prop: any) => {
                        if (!not) return;
                        if ((obj[key] as any[]).includes(prop))
                            not = false;
                    });
                }

                if (has || not) orRes = true;
                return;
            }
        });
    }
    return andRes && orRes;
}
