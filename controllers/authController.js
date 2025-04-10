const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

dotenv.config();

// ─── تسجيل مستخدم جديد ───────────────────────────────────
exports.register = async (req, res) => {
    const { fullName, email,  password } = req.body;

    // ✅ التحقق من الحقول المطلوبة (بدون birthDate و nationalID)
    const requiredFields = ['fullName', 'email', 'password'];
    const missingFields = requiredFields.filter(field => !req.body[field]);


    if (missingFields.length > 0) {
        return res.status(400).json({ 
            message: `❌ الحقول التالية مطلوبة: ${missingFields.join(', ')}`
        });
    }


        const foundUser = await User.findOne({email}).exec();

        if(foundUser){
            return res.status(401).json({ message:"User already exists"});
        }


        const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/;

        if (!strongPasswordRegex.test(password)) {
            return res.status(400).json({
                message: "🔐 الباسورد لازم يحتوي على حرف كبير، صغير، رقم، ورمز خاص!"
            });
        }

            const hashpassword = await bcrypt.hash(password,15)

            const user = await User.create({
                full_name:fullName,
                email,
                password:hashpassword
            });

            const accessToken = jwt.sign({
                UserInfo:{
                    id:user._id,
                    name:user.full_name
                }
            },process.env.ACCESS_TOKEN_SECRET,{expiresIn:"15m"})

            const refreshToken = jwt.sign({
                UserInfo:{
                    id:user._id,
                    name:user.full_name
                }
            },process.env.REFRESH_TOKEN_SECRET,{expiresIn:"7d"});

            res.cookie("jwt",refreshToken,{
                httpOnly:true,
                secure:true,
                sameSite:"None",
                maxAge:1000*60*60*24*7
            })
            res.json({accessToken, fullName:user.full_name,email:user.email })

};

