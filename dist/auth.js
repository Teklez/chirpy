import bcrypt from "bcrypt";
export async function hashPassword(password) {
    const salt = bcrypt.genSaltSync(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
}
export async function checkPasswordHash(password, hash) {
    const isEqual = await bcrypt.compare(password, hash);
    return isEqual;
}
