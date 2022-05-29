import bcrypt from "bcryptjs";
import config from "config";

export function hashPassword(password: string){
    const hash = bcrypt.hashSync(password, bcrypt.genSaltSync(12));
    return hash;
}
export const passwordCompareSync = (password: string, hash: string) => bcrypt.compareSync(password, hash);