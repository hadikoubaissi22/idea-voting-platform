export const basicAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  // Header format: "Basic <base64string>"
  const auth = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
  const user = auth[0];
  const pass = auth[1];

  if (user === process.env.ADMIN_USER && pass === process.env.ADMIN_PASS) {
    next(); // Credentials match, proceed to the controller
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
};