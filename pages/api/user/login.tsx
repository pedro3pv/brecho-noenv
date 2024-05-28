import {NextApiRequest, NextApiResponse} from 'next';
import bcrypt from 'bcrypt';
import {signToken} from "../../../lib/jsonwebtoken";
import {getUserByEmailComplety} from '../../../lib/models/User';

type User = {
    email: string;
    password: string;
};

export default async function login(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const parsedBody = JSON.parse(req.body);
    const {email, password}: User = parsedBody;

    const user = await getUserByEmailComplety(email)

    if (!user) {
        return res.status(400).json({error: 'User not found'});
    }

    if (user.type == "ban") {
        return res.status(400).json({error: 'User Banido'});
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {

        const token = signToken({email: user.email});
        return res.status(200).json({token:token});

    } else {
        return res.status(400).json({error: 'Invalid password'});
    }
}