import {NextApiRequest, NextApiResponse} from 'next';
import {Db, MongoClient} from 'mongodb';
import bcrypt from 'bcrypt';
import clientPromise from '../../../lib/mongodb';
import {createUser, getUser, User} from "../../../lib/models/User";

export default async function register(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const User : User = JSON.parse(req.body)

    if (!User.password) {
        return res.status(400).json({ message: 'Password is required' });
    }

    if (!(await getUser(User.email))){
        const password = User.password

        const hashedPassword = await bcrypt.hash(password, 10);

        User.password = hashedPassword;

        const user = await createUser(User);

        return res.status(200).json({ message: 'Registered successfully' });
    } else {
        return res.status(400).json({ message: 'Email is already registered' });
    }

}