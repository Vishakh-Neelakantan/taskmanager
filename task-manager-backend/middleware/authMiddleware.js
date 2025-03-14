import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization");

    // console.log("JWT Secret Key:", process.env.JWT_SECRET);
    // console.log("Token received:", token);

    if (!token) {
        return res.status(401).json({ msg: "No token, authorization denied" });
    }

    try {
        const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
        console.log("Decoded JWT payload:", decoded);  // ✅ Debugging log
        req.user = { id: decoded.id }; // Attach user ID to request object
        next();
    } catch (err) {
        console.error("Invalid token:", err);
        res.status(401).json({ msg: "Invalid token" });
    }
};

export default authMiddleware;
