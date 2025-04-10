const express = require("express");
const { register, login, getUserProfile } = require("../controllers/authController");
const { authMiddleware } = require("../middleware/authMiddleware");
const rateLimit = require("express-rate-limit");
const router = express.Router();


// ⚙️ إعدادات منع الهجمات
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 دقيقة
  max: 100, // 100 محاولة كحد أقصى
  message: {
    status: 429,
    message: "❌ لقد تجاوزت الحد المسموح من الطلبات، يرجى المحاولة لاحقاً"
  }
});

const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // ساعة واحدة
  max: 10, // 10 محاولات تسجيل دخول كحد أقصى
  message: {
    status: 429,
    message: "❌ الكثير من محاولات تسجيل الدخول، يرجى المحاولة لاحقاً"
  }
});



// 🔐 مسارات التوثيق
router.route("/register").post(apiLimiter, register);




//router.post("/login", 
//  authLimiter, // حماية خاصة لتسجيل الدخول
//  login
//);

//router.get("/user/profile", 
//  authMiddleware, // التحقق من صحة التوكن
//  getUserProfile
//);

module.exports = router;