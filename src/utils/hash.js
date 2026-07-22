import { hash, compare, genSalt } from 'bcrypt';

// Helper reutilizable de hashing. Cualquier capa que necesite
// hashear o comparar contraseñas debe usar estas funciones.
//
// NOTA: en la versión original (utils.js) estas funciones no tenían
// "return", por lo que siempre devolvían undefined. Se corrigió acá.

export async function createHash(password) {
    const salt = await genSalt(10);
    return hash(password, salt);
}

export async function isValidPassword(password, hashedPassword) {
    return compare(password, hashedPassword);
}
