const toBoolean = (value) => value === "true";

export const getCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === "production";
  const secureFromEnv = process.env.COOKIE_SECURE;
  const secure =
    typeof secureFromEnv === "string" ? toBoolean(secureFromEnv) : isProduction;

  const sameSiteFromEnv = process.env.COOKIE_SAME_SITE;
  const sameSite = sameSiteFromEnv || (secure ? "None" : "Lax");

  return {
    httpOnly: true,
    secure,
    sameSite,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
};
