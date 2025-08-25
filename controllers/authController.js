import db from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Register
export const registerUser = async (req, res) => {
  const { full_name, email, passwords } = req.body;

  if (!full_name || !email || !passwords) {
     console.log("i am there 1");
    return res.status(400).json({ message: "All fields are required" });
   
  }

  try {
    const [existingUser] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

    if (existingUser.length > 0) {
       console.log("i am there 2");
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(passwords, 10);

    await db.query(
      "INSERT INTO users (full_name, email, passwords) VALUES (?, ?, ?)",
      [full_name, email, hashedPassword]
    );

    return res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
     console.log("i am there 3");
    console.error(err);
    return res.status(500).json({ message: "Database error" });
  }
};

// Login
export const loginUser = async (req, res) => {
  const { email, passwords } = req.body;

  try {
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

    if (rows.length === 0) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(passwords, user.passwords);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign({ id: user.id, email: user.email, full_name: user.full_name }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Database error" });
  }
};


// export const alljobs = async(req,res)=>{
//   const {user_id }= req.params;
//   console.log(user_id);
// if(!user_id){
//   return res.status(400).json({message:"there is error"});
// }
//  db.query("Select * from addjobs where user_id = ?",[user_id],(error,result)=>{

//   if(error){
//     return res.status(400).json({message:"data base error"})
//   }
//   console.log("Jobs fetched:", result);  
// return res.status(200).json(result);
// })

// }