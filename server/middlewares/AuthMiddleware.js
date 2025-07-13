import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  console.log("inside middleware");
  console.log(req.cookies);

  const token = req.cookies.jwt;
  if (!token) {
    return res.status(401).send("Not Authenticated !");
  }

  console.log({ token });

  jwt.verify(token, process.env.JWT_KEY, async (err, payload) => {
    if (err) return res.status(403).send("Token is not valid");
    req.userId = payload.userId;
    next();
  });
};
