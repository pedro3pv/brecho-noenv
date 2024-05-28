import {NextApiRequest, NextApiResponse} from 'next';
import { verifyTokenAdmin } from '../../../lib/jsonwebtoken';
import { getUserByEmailComplety } from '../../../lib/models/User';
import { deleteProduct } from '../../../lib/models/Product';

export default async function deleteProductAdminDB(req: NextApiRequest, res: NextApiResponse) {

    if(req.method !== 'POST') {
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const request = req.body;
    const response = await verifyTokenAdmin(request.token);

    if(response != null){
        const user = await getUserByEmailComplety(response.email);
        if (user != null) {
            const productId = String(request.id)

            if(productId) {
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