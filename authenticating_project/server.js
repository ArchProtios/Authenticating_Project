import express from 'express';
import path from 'path';
import mongoose from 'mongoose';

const app = express()

app.use(express.static(path.join(path.resolve(), 'public')))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.set('view engine', 'ejs')

mongoose.connect("mongodb+srv://ArchProtios:Uttkarsh09@cluster0.u8roemx.mongodb.net/", {
    dbName: "AUTHENTICATING_PROJECT"
})

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
})

const userModel = mongoose.model("User", userSchema)

app.get('/', (req,res) => {
    res.render("register")

})

app.get('/register', (req,res) => {
    res.render("register") //dosent need register.ejs as we have aldready set view engine as EJS 
})

app.get('/login', (req,res) => {
    res.render("login") //dosent need login.ejs as we have aldready set view engine as EJS 
})

app.post('/register', async (req,res) => {
    // const { name, email, password } = req.body
    const obj = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    }
        const user = await userModel.create(obj)
        // res.json({ message: "User created successfully", user: user })
        res.redirect('/login')
    
})

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try { 
        const user = await userModel.findOne( email ); 
        if (!user) { 
            return res.redirect("/register"); 
        }
        const passMatch = password === user.password; 
        if (passMatch) {
            res.redirect("/logout");
        } else {
            res.send("Incorrect password.");
        }
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).send("An error occurred during login.");
    }
});


app.get('/logout', (req,res) => {
    // res.redirect("/") 
    res.render("logout")
})

app.listen(4009, () => {
    console.log("Server is conneted...")
})

