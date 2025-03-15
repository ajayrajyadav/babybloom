import bcrypt from 'bcrypt';

const storedHash = "$2b$10$/0.hqRZyv70ampugcmVIa.aWHwHT9779pJV2igTG565cgUGHhmsqu"; // The hash from your DB
const inputPassword = "password";

const match = await bcrypt.compare(inputPassword, storedHash);
console.log(match ? "✅ Password matches" : "❌ Password does NOT match");