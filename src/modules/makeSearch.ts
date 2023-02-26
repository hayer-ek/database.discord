import searchFilter from "../types/searchFilter";
import addChannelParams from "../types/addChannelParams";

export default function makeSearch<T>(
    obj: T,
    searchFilter: searchFilter<T>,
    channelData: addChannelParams<T>
): boolean {
    let andRes = true;
    let orRes = true;
    if (!obj) return false;
    if (searchFilter.and) {
        Object.keys(searchFilter.and).forEach((k) => {
            const key: keyof T = k as any;
            const field: any = searchFilter.and![key];

            if (channelData.properties[key].type == "string") {
                if (field.equals) {
                    if (field.equals != obj[key]) {
                        andRes = false;
                    }
                    return;
                }
                let has = true;
                if (field.has) {
                    has = false;
                    field.has.forEach((prop: string) => {
                        if (has) return;
                        if ((obj[key] as string).includes(prop)) has = true;
                    });
                }

                let not = true;
                if (field.not) {
                    field.not.forEach((prop: string) => {
                        if (!not) return;
                        if ((obj[key] as string).includes(prop)) not = false;
                    });
                }

                if (!has || !not) andRes = false;
                return;
            }

            if (channelData.properties[key].type == "number") {
                let fromTo = true;
                if (field.from && field.to) {
                    if (obj[key] < field.from || obj[key] > field.to) {
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
                        if ((obj[key] as any[]).includes(prop)) has = true;
                    });
                }

                let not = true;
                if (field.not) {
                    field.not.forEach((prop: any) => {
                        if (!not) return;
                        if ((obj[key] as any[]).includes(prop)) not = false;
                    });
                }

                if (!has || !not) andRes = false;
            }
        });
    }
    if (searchFilter.or) {
        orRes = false;
        Object.keys(searchFilter.or).forEach((k) => {
            const key: keyof T = k as any;

            if (typeof obj[key] == "undefined") return;
            const field: any = searchFilter.or![key];

            if (channelData.properties[key].type == "string") {
                if (field.equals) {
                    if (field.equals != obj[key]) {
                        orRes = false;
                    }
                    return;
                }

                let has = false;
                if (field.has) {
                    field.has.forEach((prop: string) => {
                        if (has) return;
                        if ((obj[key] as string).includes(prop)) has = true;
                    });
                }

                let not = false;
                if (field.not) {
                    not = true;
                    field.not.forEach((prop: string) => {
                        if (!not) return;
                        if ((obj[key] as string).includes(prop)) not = false;
                    });
                }

                if (has || not) orRes = true;
                return;
            }

            if (channelData.properties[key].type == "number") {
                let fromTo = false;
                if (field.from && field.to) {
                    if (obj[key] > field.from && obj[key] <= field.to) {
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
                        if ((obj[key] as any[]).includes(prop)) has = true;
                    });
                }

                let not = false;
                if (field.not) {
                    not = true;
                    field.not.forEach((prop: any) => {
                        if (!not) return;
                        if ((obj[key] as any[]).includes(prop)) not = false;
                    });
                }

                if (has || not) orRes = true;
                return;
            }
        });
    }
    return andRes && orRes;
}
