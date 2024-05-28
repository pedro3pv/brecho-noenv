import {Db, MongoClient} from 'mongodb';
import clientPromise from '../../../lib/mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from '../../../lib/jsonwebtoken';
import { getUserByEmailComplety, updateUser, User } from '../../../lib/models/User';

type UpdateDetailsParams = {
    name: string;
    lastName: string;
    email: string;
    phone: number;
};
    
export default async function updateDetails(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        let parsedBody = JSON.parse(req.body);
        const token = parsedBody.token;
        delete parsedBody.token;
        const details : UpdateDetailsParams = parsedBody; 

        try {
            if (!token) {
                return res.status(400).json({ error: 'Token is missing' });
            }

            const tokenDescrypt = await verifyToken(token);

            const tryuser = await getUserByEmailComplety(tokenDescrypt.email);

            if (tryuser && await getUserByEmailComplety(details.email)){
                const user : User = {
                    _id: tryuser._id,
                    name: details.name,
                    lastName: details.lastName,
                    email: details.email,
                    phone: details.phone,
                    cpf: tryuser.cpf,
                    password: tryuser.password
                }
                await updateUser(user)
                return res.status(200).json({response:`updated!`});
                
            } else {
                return res.status(500).json({ error: 'Internal Server Error' })
            }
        }
        catch (error) {
            return res.status(400).json({ error: 'Internal Server Error'});
        }
    }
}