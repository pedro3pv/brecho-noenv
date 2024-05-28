import {NextApiRequest, NextApiResponse} from 'next';
import { addProduct, Product } from '../../../../lib/models/Product';
import { verifyToken } from '../../../../lib/jsonwebtoken';
import { getUserByEmailComplety } from '../../../../lib/models/User';

export default async function addProductDB(req: NextApiRequest, res: NextApiResponse) {
    
    if(req.method !== 'POST') {
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
    const request = req.body;
    const response = await verifyToken(request.token.toString());

    if(response != null){
        const user = await getUserByEmailComplety(response.email);

    if (user != null && request.name != "" && request.description != "" && request.price > 0 && request.category != null && request.photo.length > 0){    
        const product : Product = {
            idUser: user._id,
            name: request.name,  
            description: request.description,
            price: request.price,
            category:  request.category,
            photo: request.photo,
            approved: false,
        }
    const result = await addProduct(product); 
    return res.status(200).json({ message: 'Product register successfully' });
        } else {
            return res.status(405).json({ message: 'Internal Error' });
        }
    } else {
        return res.status(405).json({ message: 'Internal Error' });
}
} 