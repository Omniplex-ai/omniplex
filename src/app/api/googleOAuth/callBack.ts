import { NextApiRequest, NextApiResponse } from "next";
import passport from "passport";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  passport.authenticate("google", { failureRedirect: "/" }, (err, user) => {
    if (err || !user) {
      return res.redirect("/login?error=true");
    }

    // Store user session
    req.body.user = user;

    return res.redirect("/dashboard");
  })(req, res);
};
