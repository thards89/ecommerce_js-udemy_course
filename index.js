const express = require("express");
const bodyParser = require('body-parser')
const cookieSession = require('cookie-session')
const authRouter = require('./routes/admin/auth')
const adminProductsRouter = require('./routes/admin/products')
const productsRouter = require('./routes/products')
const cartsRouter = require('./routes/carts')

const app = express();

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieSession({
    keys: ['khjhfdresrextcyub']
  })
)
app.use(authRouter)
app.use(adminProductsRouter)
app.use(productsRouter)
app.use(cartsRouter)


app.listen(3000, () => {
  console.log("Listening");
});

// Handcoded Parser
// app.post('/', (req, res) => {
//     req.on('data', data => {
//         const parsed = data.toString('utf8').split('&');
//         const formData = {}
//         for (let pair of parsed) {
//             const [key, value] = pair.split('=');
//             formData[key] = value;
//         }
//         console.log(formData);
//     });
//     res.send('Account created!!!')

// Hardcoded Middleware
// const bodyParser = (req, res, next) => {
//     if (req.method === "POST") {
//       req.on("data", (data) => {
//         const parsed = data.toString("utf8").split("&");
//         const formData = {};
//         for (let pair of parsed) {
//           const [key, value] = pair.split("=");
//           formData[key] = value;
//         }
//         req.body = formData;
//         next();
//       });
//     } else {
//       next();
//     }
//   };
  
//   app.post("/", bodyParser, (req, res) => {
//       console.log(req.body)
//       res.send('Account created')
//   });