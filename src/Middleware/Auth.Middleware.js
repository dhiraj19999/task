import jwt from "jsonwebtoken";
const authenticate = (req, res, next) => {
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
    //console.log(req.cookies);
    if (!token) return res.status(401).json({ message: 'Access denied' });
    try {
      const verified = jwt.verify(token, process.env.JWT_SECRET);
      //console.log(verified);
      
      req.user = verified.userId;
      next();
    } catch (error) {
      res.status(400).json({ message: 'Invalid token' });
    }
  };

  export default authenticate;