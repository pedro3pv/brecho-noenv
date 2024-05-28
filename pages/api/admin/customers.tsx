import { NextApiRequest, NextApiResponse } from "next";
import { verifyToken } from "../../../lib/jsonwebtoken";
import { getAllUsers, getUserByEmailComplety } from "../../../lib/models/User";

export default async function customers(req: NextApiRequest, res: NextApiResponse) {

    if(req.method !== 'POST') {
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const response = await verifyToken(req.body.token);
    
    
    if(response != null){
        const user = await getUserByEmailComplety(response.email);
        if(user != null){
            if(user.type === 'admin'){
                const listUsers = await getAllUsers(Number(req.body.page))
                return res.status(200).json(listUsers)
            }
        }
    }
    return res.status(405).json({error: "internal error"})
}

