import {NextApiRequest, NextApiResponse} from 'next';
import { verifyToken } from '../../../../lib/jsonwebtoken';
import { getUserByEmailComplety } from '../../../../lib/models/User';
import { deleteProduct, getProduct } from '../../../../lib/models/Product';

export default async function deleteProductDB(req: NextApiRequest, res: NextApiResponse) {

    if(req.method !== 'POST') {
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const request = JSON.parse(req.body);
    const response = await verifyToken(request.token);

    if(response != null){
        const user = await getUserByEmailComplety(response.email);
        if (user != null) {
            const productId = String(request.id)
            const product = await getProduct(productId)

            if(productId && product?.idUser.toString() == user._id.toString()) {
                const result = await deleteProduct(productId);
            } else {
                return res.status(405).json({ message: 'Internal Error' }); 
            }
            return res.status(200).json({ message: 'Product delete successfully' });
        }
    } else {
        return res.status(405).json({ message: 'Internal Error' });
    }
    
}