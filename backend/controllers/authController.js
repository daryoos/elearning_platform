const userService = require("../services/userService");
const jwt = require("jsonwebtoken");

exports.register = async (req, res, next) => {
    try {
        const existingUser = await userService.getUserByEmail(req.body.email);
        if (existingUser) return res.status(400).json({ message: "Email already in use" });

        const newUser = await userService.createUser(req.body);

        const token = jwt.sign(
        {
            id: newUser.id,
            email: newUser.email,
            role: newUser.role,
        },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.status(200).json({ message: "User registered successfully",token, user: newUser });
    } catch (error) {
        next(error);
    }
};

exports.login = async (req, res, next) => {
    try {
        const user = await userService.loginUser(req.body);

        const token = jwt.sign(
          { id: user.id, email: user.email, role: user.role },
          process.env.JWT_SECRET,
          { expiresIn: "1d" }
        );
    
        res.json({ token, user });
    } catch (error) {
        next(error);
    }
}