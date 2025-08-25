import jwt from "jsonwebtoken";

export const verifyJobToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Bearer token2

  if (!token) {
    return res.status(401).json({ message: "No job token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET2); // use another secret
    req.jobData = decoded; // attach decoded data to request
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired job token" });
  }
};
