import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.json({ success: false, message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, "secretkey");
    req.user = decoded;
    req.userId = decoded.id; // kept for legacy usage
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid token" });
  }
};
