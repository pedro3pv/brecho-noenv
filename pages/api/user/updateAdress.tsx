import { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from '../../../lib/jsonwebtoken';
import { getUserByEmailComplety, updateUser, User} from "../../../lib/models/User";

export default async function updateAddress(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === 'POST') {
        let parsedBody = JSON.parse(req.body);
        const token = parsedBody.token;
        delete parsedBody.token;

        try {
            const response = await verifyToken(token);

            const tryuser = await getUserByEmailComplety(response.email);
            if(tryuser) {
                
                const user : User = {
                    _id: tryuser._id,
                    name: tryuser.name,
                    lastName: tryuser.lastName,
                    email: tryuser.email,
                    phone: tryuser.phone,
                    cpf: tryuser.cpf,
                    password: tryuser.password
                }      
                await updateUser(user)    
                return res.status(200).end(`updated!`);
                } else {
                    return res.status(500).json({ error: 'Internal Server Error' })
                }
            }
        catch (error) {
            res.status(400).json({ error: 'Internal Server Error'});
        }
    }
}
