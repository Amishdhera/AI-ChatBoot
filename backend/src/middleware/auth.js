import { auth } from "../config/firebase.js";

/**
 * Verifies the Firebase ID token sent as "Authorization: Bearer <token>".
 * On success attaches { uid, email, name } to req.user.
 * Returns 401 for any missing/invalid/expired token.
 */
export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const [scheme, token] = header.split(" ");

    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({
        success: false,
        error: "Missing or malformed Authorization header.",
      });
    }

    const decoded = await auth.verifyIdToken(token);
    req.user = {
      uid: decoded.uid,
      email: decoded.email,
      name: decoded.name || null,
    };
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: "Invalid or expired authentication token.",
    });
  }
}
