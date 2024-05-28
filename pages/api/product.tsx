import { NextApiRequest, NextApiResponse } from "next";
import { getProduct } from "../../lib/models/Product";

export default async function product(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const productId = req.body;
    
    const product = await getProduct(productId);

    if (product){
        return res.status(200).json(product);
    } else {
        return res.status(404).end("not found");
    }

    return res.status(405).end("internal error");
}