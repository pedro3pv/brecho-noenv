import { NextApiRequest, NextApiResponse } from "next";
import { verifyToken } from "../../../lib/jsonwebtoken";
import { getUserByEmailComplety, getUserByIDComplety, updateUser, User } from "../../../lib/models/User";
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
            const tryuser = await getUserByIDComplety(product?.idUser);
            if (product){
            const user : User = {
                _id: tryuser?._id,
                name: tryuser?.name,
                lastName: tryuser?.lastName,
                email: tryuser?.email,
                phone: tryuser?.phone,
                cpf: tryuser?.cpf,
                password: tryuser?.password,
                type: "ban"
            }
            await updateUser(user)
            return res.status(200).end("success")
        }
        }
    }
}
    return res.status(405).json({error: "internal error"})
}