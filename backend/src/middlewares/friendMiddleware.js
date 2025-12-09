// import Conversation from "../models/Conversation";
import Friend from '../models/Friend.js';


const pair = (a, b) => (a < b ? [a, b] : [b, a])

export const checkFriendship = async (req, res, next) => {
    try {
        const me = req.user._id.toString();
        const recipientId = req.body?.recipientId ?? null;
        const memberIds = req.body?.memberIds ?? [];
    
        if (!recipientId && memberIds.length === 0) {
          return res
            .status(400)
            .json({ message: "Cần cung cấp recipientId hoặc memberIds" });
        }
    
        if (recipientId) {
          const [userA, userB] = pair(me, recipientId);
    
          const isFriend = await Friend.findOne({ userA, userB });
    
          if (!isFriend) {
            return res.status(403).json({ message: "Bạn chưa kết bạn với người này" });
          }
    
          return next();
        }
    
        //todo: chat nhóm
        const isFriend = await Friend.findOne({userA, userB});
    } catch (error) {
        console.error("Lỗi xảy ra khi check friendship", error)
        return res.status(500).json({message})
    }
}