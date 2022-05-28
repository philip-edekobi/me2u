import dotenv from "dotenv";

dotenv.config();

const cache: {[key: string]: string} = {};

export default function accessEnv(key: string, defaultValue: string): string{
    if(!(key in process.env) || typeof process.env[key] === "undefined") {
        if(defaultValue) return defaultValue;
        throw new Error(`${key} was not found in process.env`);
    }

    if(!(key in cache)){
        cache[key] = process.env[key] as string;
    }

    return cache[key];
}