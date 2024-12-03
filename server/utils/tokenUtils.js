const jwt = require("jsonwebtoken");

const signToken = (id, expiresIn) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn });
};

const setCookies = (res, accessToken, refreshToken) => {
  // Durée d'expiration en millisecondes
  const accessCookieExpires =
    parseInt(process.env.JWT_COOKIE_EXPIRES_IN, 10) * 1000;
  const refreshCookieExpires =
    parseInt(process.env.JWT_REFRESH_COOKIE_EXPIRES_IN, 10) * 1000;

  res.cookie("auth_token", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    expires: new Date(Date.now() + accessCookieExpires),
  });

  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    expires: new Date(Date.now() + refreshCookieExpires),
  });
};

const verifyToken = (token) => {
  try {
    jwt.verify(token, process.env.JWT_SECRET);
    return true;
  } catch (err) {
    return false;
  }
};

// Créer et envoyer les tokens
exports.createSendToken = async (user, res, statusCode = 200) => {
  const accessToken = signToken(user.id, process.env.JWT_EXPIRES_IN);
  let refreshToken = user.refreshToken;

  // Vérification ou régénération du refresh token
  if (!refreshToken || !verifyToken(refreshToken)) {
    refreshToken = signToken(user.id, process.env.JWT_REFRESH_EXPIRES_IN);
    user.refreshToken = refreshToken;
    await user.save();
  }

  setCookies(res, accessToken, refreshToken);

  res.status(statusCode).json({
    status: "success",
    token: accessToken,
    data: {
      user,
    },
  });
};
