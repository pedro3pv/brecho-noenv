import { getUserByEmailComplety, saveResetPasswordToken } from "../../../lib/models/User";
import {signToken} from "../../../lib/jsonwebtoken";
import {NextApiRequest, NextApiResponse} from "next";
import sendRecoveryEmail from "../../../lib/models/Email";

async function _sendRecoveryEmail(_id: Object, email:string) {

    const token = signToken({ _id: _id })

    await saveResetPasswordToken(_id, token);

    sendRecoveryEmail(email,token)
}

export default async function resetPasswordRequest(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { email } = req.body;

        const user = await getUserByEmailComplety(email);

        if (user && user.type != 'ban') {
            await _sendRecoveryEmail(user._id, user.email);
            res.status(200).json({ message: 'Email de recuperação enviado.' });
        } else {
            res.status(400).json({ error: 'Email não encontrado.' });
        }
    } else {
        res.status(405).json({ error: 'Método não permitido.' });
    }
}