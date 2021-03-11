const router = require("express").Router();
const pool = require("../db");
const bcrypt = require("bcrypt");
const jwtGenerator = require("../utils/jwtGenerator");
const validInfo = require("../middleware/validInfo");
const authorization = require("../middleware/authorization")

//Registering

router.post('/register', validInfo, async (req, res) => {
    try {
			const { name, email, password } = req.body;

			const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

			//Check if user exists
			if(user.rows.length !== 0){
				return res.status(401).send("User already exists")
			}
			
			//Bcrypt user's password

			const saltRound = 10;
			const salt = await bcrypt.genSalt(saltRound);

			const bcryptPassword = await bcrypt.hash(password, salt)

			// Insert user inside the database

			const newUser = await pool.query("INSERT INTO users (name, email, password) VALUES($1, $2, $3) RETURNING *", [name, email, bcryptPassword]);


			// Generate jwt token

			const token = jwtGenerator(newUser.rows[0].id);

			return res.json({token})

    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error")    
    }
})

//login route

router.post("/login", validInfo, async (req, res) => {
	try {
		const { email, password } = req.body;

		//1. Check if user doesn´t exist

		const user = await pool.query("SELECT * FROM users WHERE email = $1", [email])

		if(user.rows.length === 0){
			return res.status(401).json('Password or email is incorrect')
		}

		//2. Check if incomming password equals database password

		const validPassword = await bcrypt.compare(password, user.rows[0].password)

		if(!validPassword){
			return res.status(401).json("Password or Email is incorrect")
		}

		//3. Give JWT token

		const token = jwtGenerator(user.rows[0].id);
		res.json({token})

	} catch {
		console.error(err.message)
		return res.status(500).send("Server error")
	}
});

router.get('/is-verify', authorization, async (req, res) => {
	try {
		res.json(true)
	} catch {
		console.error(err.message)
		return res.status(500).send("Server error")
	}
})

module.exports = router;