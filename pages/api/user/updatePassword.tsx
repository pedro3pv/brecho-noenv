import {getUserByEmailComplety, updatePasswordLogged} from "../../../lib/models/User";
import {verifyToken} from "../../../lib/jsonwebtoken";
import {NextApiRequest, NextApiResponse} from "next";

export default async function updatePassword(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { token, password } = req.body;

        try {

            const response = await verifyToken(token);

            const user = await getUserByEmailComplety(response.email);

            if (user) {
            await updatePasswordLogged(user.email, password);
            return res.status(200).json({ message: 'Password Changed successfully.' });
            }

            
        } catch (error) {
            console.log(error)
            res.status(400).json({ error: 'Invalid token.' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed.' });
    }
}