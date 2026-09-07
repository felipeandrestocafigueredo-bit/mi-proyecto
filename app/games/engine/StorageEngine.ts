const StorageEngine = {
    _storageKey: "edu_platform_v1",

    get(key: string = ""): any {
        if (typeof window === "undefined") return null;
        try {
            const raw = window.localStorage.getItem(`${this._storageKey}_${key}`);
            return raw ? JSON.parse(raw) : null;
        } catch {
            return null;
        }
    },

    set(key: string = "", value: any): void {
        if (typeof window === "undefined") return;
        try {
            window.localStorage.setItem(`${this._storageKey}_${key}`, JSON.stringify(value));
        } catch {
            // noop
        }
    },

    remove(key: string = ""): void {
        if (typeof window === "undefined") return;
        try {
            window.localStorage.removeItem(`${this._storageKey}_${key}`);
        } catch {
            // noop
        }
    },
};

export default StorageEngine;
