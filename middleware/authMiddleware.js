const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

exports.authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.header("Authorization");

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "❌ غير مصرح! التوكن مفقود أو غير صحيح." });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ message: "❌ التوكن غير صالح أو منتهي الصلاحية!" });
    }
};
