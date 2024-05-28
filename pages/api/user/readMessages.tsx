import { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from '../../../lib/jsonwebtoken';
import { getUserByEmailComplety, updateUser, User} from "../../../lib/models/User";
import { readMessagesProductIdAndBuyerId } from '../../../lib/models/Chat';
import { getProduct } from '../../../lib/models/Product';

export default async function readMessages(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === 'POST') {
        let parsedBody = JSON.parse(req.body);
        console.log(parsedBody)
        const token = parsedBody.token;
        delete parsedBody.token;

        try {
            const response = await verifyToken(token);

            const tryuser = await getUserByEmailComplety(response.email);
            if(tryuser) {
                if (parsedBody.buyerId){
                readMessagesProductIdAndBuyerId(parsedBody.productId,tryuser._id.toString(),parsedBody.buyerId)
                res.status(200).json({ status: 'Sucessefull'});
            } else {
                const product = await getProduct(parsedBody.productId)
                readMessagesProductIdAndBuyerId(parsedBody.productId,product?.idUser,tryuser._id.toString())
                res.status(200).json({ status: 'Sucessefull'});
            }
            }
        }
        catch (error) {
            res.status(400).json({ error: 'Internal Server Error'});
        }
    }
}
