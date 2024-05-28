import Cryptr from 'cryptr';

if (!process.env.CRYPTO_TOKEN) {
    throw new Error('Invalid/Missing environment variable: "CRYPTO_TOKEN"');
}

const cryptr = new Cryptr(process.env.CRYPTO_TOKEN);

export function encrypt(text: string) {
    return cryptr.encrypt(text);
}

export function decrypt(encrypted: string) {
    try {
        return cryptr.decrypt(encrypted);
    } catch (err) {
        console.error(err);
        return null;
    }
}