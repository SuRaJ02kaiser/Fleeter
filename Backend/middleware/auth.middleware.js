const jwt = require("jsonwebtoken");
require("dotenv").config();

const authMiddleware = (roles) => (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ error: "No token provided" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(!roles.includes(decoded.role)){
            return res.status(403).json({error: 'Access denied' });
        }
        req.user = decoded;
        next();
    } catch(err){
        res.status(401).json({error: 'Unauthorized, please login'});
    }
};


module.exports = authMiddleware;