import { NextApiRequest, NextApiResponse } from "next";
import { verifyToken } from "../../../lib/jsonwebtoken";
import { getUserByEmailComplety } from "../../../lib/models/User";
import { editProduct, getProductNotApproved, Product } from "../../../lib/models/Product";

export default async function approvedProduct(req: NextApiRequest, res: NextApiResponse) {

    if(req.method !== 'POST') {
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const json = JSON.parse(req.body)

    const descryptToken = await verifyToken(json.token);
    const productId = json.id

    const user = await getUserByEmailComplety(descryptToken.email)

    if (user){
    if (user.type == "admin"){
        if (productId){
            const product = await getProductNotApproved(productId)
            if (product){
            const updateProduct : Product = {
                name: product.name, 
                description: product.description,
                price: product.price,
                category: product.category,
                photo: product.photo,
                approved: true,
            }
            await editProduct(productId, updateProduct)
            return res.status(200).end("success")
        }
        }
    }
}
    return res.status(405).json({error: "internal error"})
}