import bcrypt from "bcrypt";

const password = "password"; // Change this if needed
const hash = await bcrypt.hash(password, 10);

console.log("Hashed Password:", hash);