import {Db, MongoClient, ObjectId} from 'mongodb';
import clientPromise from '../mongodb';
import bcrypt from 'bcrypt';

export type User = {
    _id?: ObjectId;
    name:string;
    lastName:string;
    email: string;
    password: string;
    resetPasswordToken?: string,
    cpf: number;
    phone: number;
    registrationDate?: number;
    type?: string;
}

const client: MongoClient = await clientPromise;
const db: Db = client.db();

async function createUser(user: User) {
const existingUser = await db.collection('users').findOne({ email: user.email });
    if (existingUser) {
        return 'Email already in use';
    }

    return await db.collection('users').insertOne(user);
}

async function updatePasswordLogged(email: string, newPassword: string) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const result = await db.collection('users').updateOne(
        { email: email },
        { $set: { password: hashedPassword } }
    );

    return result;
}

async function deleteUser(token: string, password: string) {
    const user = await db.collection('users').findOne({ token: token });
    if (!user) {
        throw new Error('User not found');
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
        throw new Error('Invalid password');
    }
    const result = await db.collection('users').deleteOne({ token: token });
    return result;
}

async function saveResetPasswordToken(_id: object, token: string) {
    const user = await db.collection('users').findOne({_id: _id});
    if (!user) {
        throw new Error('User not found');
    }

    const result = await db.collection('users').updateOne(
        { _id: _id },
        { $set: { resetPasswordToken: token } }
    );
    return result
}

async function updatePassword(token: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.collection('users').updateOne(
        { resetPasswordToken: token },
        { $set: { password: hashedPassword } }
    );
    return result;
}

async function getUser(email: string) {
    return await db.collection('users').findOne({email: email}, {projection: {password: 0, token: 0, _id:0, resetPasswordToken: 0, registrationDate: 0}});
}

async function getUserByIDComplety(_id: string) {
    return await db.collection('users').findOne({_id: new ObjectId(_id)});
}

async function updateUser(user: User) {
    const result = await db.collection('users').updateOne(
        { _id: user._id },
        { $set: user }
    );
    return result;
}

async function getUserByEmailComplety(email: string) {
    return await db.collection('users').findOne({email: email});
}

async function getAllUsers(page:number){
    return await db.collection('users').find({}).skip(8*page).limit(8).toArray();
}

export { createUser, updatePassword, deleteUser, getUser, updateUser, getUserByEmailComplety, saveResetPasswordToken, updatePasswordLogged, getUserByIDComplety, getAllUsers};

export default createUser;