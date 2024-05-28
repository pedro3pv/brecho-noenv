import { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from '../../../lib/jsonwebtoken';
import {getUserByIDComplety, saveResetPasswordToken, updatePassword} from "../../../lib/models/User";

export default async function resetPassword(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === 'POST') {
        const { token, password } = req.body;

        try {
            const response = await verifyToken(token);

            const user = await getUserByIDComplety(response._id);

            if (user) {
                if (user.resetPasswordToken == token){
            await updatePassword(token, password);
            await saveResetPasswordToken(user._id, '');
            res.status(200).json({ message: 'Password reset successfully.' });
        }
            }

            
        } catch (error) {
            res.status(400).json({ error: 'Invalid token.' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed.' });
    }
}