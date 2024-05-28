import {NextApiRequest, NextApiResponse} from 'next';
import { verifyToken } from '../../../../lib/jsonwebtoken';
import { getUserByEmailComplety } from '../../../../lib/models/User';
import { editProduct, getProduct, Product } from '../../../../lib/models/Product';

export default async function editProductDB(req: NextApiRequest, res: NextApiResponse) {

    if(req.method !== 'POST') {
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const request = req.body;
    const response = await verifyToken(request.token);

    if(response != null){
        const user = await getUserByEmailComplety(response.email);
        if (user != null) {
            const productId = request.id
            const existingProduct = await getProduct(productId);

            if(existingProduct) {
                const product : Product = {
                    _id: existingProduct._id,
                    idUser: existingProduct.idUser,
                    name: request.name,
                    description: request.description,
                    price: request.price,
                    category: request.category,
                    photo: request.photo,
                    approved: false
                } 
                const result = await editProduct(productId, product);
            } else {
                return res.status(405).json({ message: 'Internal Error' }); 
            }
            return res.status(200).json({ message: 'Product updated successfully' });
        }
    } else {
        return res.status(405).json({ message: 'Internal Error' });
    }
    
}