import { NextApiRequest, NextApiResponse } from "next";
import passport from "passport";

export default (req: NextApiRequest, res: NextApiResponse) => {
  passport.authenticate("google", { scope: ["profile", "email"] })(req, res);
};
