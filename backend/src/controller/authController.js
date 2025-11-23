import bcrypt from 'bcrypt';
import User from '../models/User.js';
import jwt from "jsonwebtoken";
import crypto from 'crypto';
import Session from '../models/Session.js';

const ACCESS_TOKEN_TTL = '30m';
const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000; //14 ngày

export const signUp = async (req, res) => {
    try {
        const {username, password, email, firstName, lastName} = req.body;

        if (!username || !password || !email || !firstName || !lastName) {
            return res.status(400).json({
                message: 
                    "Không thể thiếu username, password, email, firstName, lastName"
            })
        }

        //kiểm tra username tồn tại chưa
        const duplicate = await User.findOne({username});

        if (duplicate) {
            return res.status(409).json({message: "username đã tồn tại"});
        }

        //mã hóa password
        const  hashedPassword = await bcrypt.hash(password, 10);


        //tạo user mới

        await User.create({
            username,
            hashedPassword,
            email,
            displayName: `${firstName} ${lastName}`
        })

        //return
        return res.sendStatus(204);

    } catch (error) {
        console.error('Lỗi khi gọi signUp: ', error)
        return res.status(500).json({message: "Lỗi hệ thống"})
    }
};

export const signIn = async (req, res) => {

try {
    //lấy input
    const {username, password} = req.body;

    if (!username || !password) {
        return res.status(400).json({message: "Thiếu username hoặc password"});
    }
    //lấy hashedPassword trong db để so với password input
    const user = await User.findOne({username});

    if (!user) {
        return res.status(401).json({message: "username hoặc password không chính xác"});
    }

    //kiểm tra password
    const passswordCorrect = await bcrypt.compare(password, user.hashedPassword);

    if (!passswordCorrect) {
        return res.status(401).json({message: "username hoặc password không chính xác"});
    }

    //nếu khớp, tạo access token với JWT
    const accessToken = jwt.sign({userId: user._id},
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: ACCESS_TOKEN_TTL})

    //tạo refresh token
    const refreshToken = crypto.randomBytes(64).toString("hex");

    //tạo session mới để lưu refresh token
    await Session.create({
        userId: user._id,
        refreshToken,
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL)
    })

    //refresh token về trong cookie
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true, 
        secure: true,
        sameSite: 'none', //backend, frontend deploy riêng
        maxAge: REFRESH_TOKEN_TTL
    });

    return res.status(200).json({messsage: `User ${user.displayName} đã login`, accessToken})

    //trả access token về trong response
} catch (error) {
    console.error('Lỗi khi gọi signIp: ', error)
    return res.status(500).json({message: "Lỗi hệ thống"})
}

}