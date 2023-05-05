const express = require("express");
const { log } = require("console");
const path = require("path");
const hbs = require("hbs");
const bcrypt = require("bcrypt");

// database connection and schema 
require("./db/connection");
const registrations = require("./models/model");

const app = express();
const port = process.env.PORT || 3000;

// all folder path 
const staticPath = path.join(__dirname, "../public");
const templatePath = path.join(__dirname, "../templates/views");
const partialPath = path.join(__dirname, "../templates/partials");

// connection with public folder and hbs folder 
app.use(express.static(staticPath));
app.set("view engine", "hbs");
app.set("views", templatePath);
hbs.registerPartials(partialPath);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.get('/', (req, res) => {
    res.render("index",{
        username:"My Account"
    });
});

app.get('/registration', (req, res) => {
    res.render("login");
})

app.post("/registration", async (req, res) => {
    try {
        const password = req.body.password;
        const createUser = new registrations({
            name: req.body.name,
            email: req.body.email,
            password: password,
            confirmpassword: req.body.cpassword
        });

        const token = await createUser.generateAuthToken();
        console.log(token);
        await createUser.save();
        res.status(201).render("login");

    } catch (e) {
        res.status(400).send("not create");
    }
});

app.get('/login', (req, res) => {
    res.render("login");
});

app.post('/login', async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        
        const useremail = await registrations.findOne({ email: email });
        
        const isMatch = await bcrypt.compare(password, useremail.password);

        const token = await useremail.generateAuthToken();
        console.log(token);
        
        if (isMatch) {
            const username = useremail.name;
            res.status(201).render("index",{
                username:username
            });
            
        } else {
            res.status(404).send("Invalid login");
        }

    } catch (e) {
        res.status(404).send(e);
    }
});

// detail 
app.get('/detail', (req, res) => {
    res.render("detail");
});

// cart 
app.get('/cart', (req, res) => {
    res.render("cart");
});

// checkout
app.get('/checkout', (req, res) => {
    res.render("checkout");
});

// contact 
app.get('/contact', (req, res) => {
    res.render("contact");
});

// oreder

app.get('/order', (req, res) => {
    res.render("order");
});

// shop 
app.get('/shop', (req, res) => {
    res.render("shop");
});

// shop2
app.get('/shop2', (req, res) => {
    res.render("shop2");
});

app.get('/*', (req, res) => {
    res.render("404", {
        errorcomment: "Opps page not found!"
    });
});

app.listen(port, () => {
    log(`serever listen at prot ${port}`);
});