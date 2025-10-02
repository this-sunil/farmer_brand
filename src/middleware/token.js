import jwt from "jsonwebtoken";

export const verifyToken=async(req,res,next)=>{
    try {
        const authorization=req.headers.authorization;
        
        if(!authorization || !authorization.startsWith("Bearer ")){
            return res.status(404).json({
                status:false,
                msg:"No Token Provided"
            });
        }
        const token=authorization.split(" ")[1];
        const decode=jwt.verify(token,process.env.SECRET_KEY,{algorithms:"HS256"});
        req.user=decode;
        next();

    } catch (error) {
        return res.status(500).json({
            status:false,
            msg:"Internal Server Error"
        });
    }
};
export const generateToken=async(user)=>{
    const payload={
        "role":user.role,
    };
    const token=jwt.sign(payload,process.env.SECRET_KEY,{algorithm:"HS256"});
    return token;
};