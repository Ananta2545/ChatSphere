const User = require("../model/userModel");
const bcrypt = require("bcrypt");

module.exports.register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        // Check if all fields are provided
        if (!username || !email || !password) {
            return res.status(400).json({ msg: "All fields are required", status: false });
        }

        // Check if the username already exists
        const userNameCheck = await User.findOne({ username });
        if (userNameCheck) {
            return res.status(400).json({ msg: "Username already used", status: false });
        }

        // Check if the email already exists
        const emailCheck = await User.findOne({ email });
        if (emailCheck) {
            return res.status(400).json({ msg: "Email already used", status: false });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user with the hashed password
        const user = await User.create({
            username,
            email,
            password: hashedPassword, // Store hashed password in the password field
        });

        // Return the user without the password
        return res.status(201).json({ status: true, user: { ...user._doc, password: undefined } });
    } catch (err) {
        console.error("Registration error:", err); // Log the error for debugging
        return res.status(500).json({ msg: "Internal server error", status: false });
    }
};


module.exports.login = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        // Check if the username or email already exists
        const user1 = await User.findOne({ username });// checking whether the username is already in the database or not
        if (!user1) {// if username is not present then send this message as the error message
            return res.json({ msg: "Incorrect username or password", status: false });
        }

        const isPasswordValid = await bcrypt.compare(password, user1.password)// to compare the password from the frontend and from the data base 
        if (!isPasswordValid) {
            return res.json({ msg: "Incorrect Username or Password", status: false });
        }
        delete user1.password;
        return res.json({ status: true, user1 });
    } catch (err) {
        next(err);
    }
};

module.exports.setAvatar = async(req, res, next) => {
    try{
        const userId =  req.params.id;// fetching the id the user 
        const avatarImage = req.body.image;// similarly fetching the image of the user 
        const userData = await User.findByIdAndUpdate(userId,{
            isAvatarImage: true,
            avatarImage,
        }, {new: true});
        return res.json({isSet:userData.isAvatarImage, image:userData.avatarImage});
    }
    catch(error){
        console.log("Error setting avatar", error)
        next(error);
    }
}

module.exports.getAllUsers = async(req, res, next)=>{
    try{
        const users = await User.find({ _id: { $ne: req.params.id}}).select([ // this query finds all the user except the one with the provided id -- ne means not equal to and fetching all the below details
            "email",
            "username",
            "avatarImage",
            "_id",
        ]);
        return res.json(users);// returning the users
    }
    catch(error){
        next(error);
    }
}