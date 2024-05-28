import jwt from 'jsonwebtoken';
import { getUserByEmailComplety } from './models/User';
import { error } from 'console';

if (!process.env.JWT_SECRET_TOKEN) {
    throw new Error('Invalid/Missing environment variable: "JWT_SECRET_TOKEN"');
}

const secretKey = process.env.JWT_SECRET_TOKEN;

export function signToken(payload: object) {
    return jwt.sign(payload, secretKey, { expiresIn: '7d' });
}

export function signTokenNoTime(payload: object) {
    return jwt.sign(payload, secretKey);
}

export async function verifyToken(token: string) {
    try {
        let parsedBody;

        const response = jwt.verify(token, secretKey);

        if (response != null) {
            if (typeof response === 'string') {
                parsedBody = JSON.parse(response);
            } else {
                parsedBody = response;
            }
        }
        const user = await getUserByEmailComplety(parsedBody.email)
        if (user?.type != "ban"){
            return parsedBody
        } else {
            throw error("Banido");
        }
    } catch (err) {
        return null;
    }
}

export async function verifyTokenAdmin(token: string) {
    try {
        let parsedBody;

        const response = jwt.verify(token, secretKey);

        if (response != null) {
            if (typeof response === 'string') {
                parsedBody = JSON.parse(response);
            } else {
                parsedBody = response;
            }
        }
        const user = await getUserByEmailComplety(parsedBody.email)
        if (user?.type == "admin"){
            return parsedBody
        } else {
            throw error("not admin");
        }
    } catch (err) {
        console.log(err)
        return null;
    }
}

