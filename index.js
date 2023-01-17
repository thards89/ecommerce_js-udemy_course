const express = require("express");
const bodyParser = require('body-parser')
const usersRepo = require('./repositories/users')
const cookieSession = require('cookie-session')

const app = express();

app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieSession({
    keys: ['khjhfdresrextcyub']
  })
)


app.get("/signup", (req, res) => {
  res.send(`
    <div>
      Your id is: ${req.session.userId}
        <form method="POST">
            <input name="email" placeholder="email" />
            <input name="password" placeholder="password" />
            <input name="passwordConfirmation" placeholder="password confirmation" />
            <button>Sign Up</button>
        </form>
    </div>`);
});


app.post("/signup", async (req, res) => {
    const { email, password, passwordConfirmation } = req.body;

    const existingUser = await usersRepo.getOneBy({ email });
    if (existingUser)  {
      return res.send('Email in use');
    }

    if (password !== passwordConfirmation) {
      return res.send('Passwords must match')
    }

    const user = await usersRepo.create({ email, password })

    req.session.userId = user.id


    res.send('Account created')
});

app.get('/signout', (req, res) => {
  req.session = null;
  res.send('You are logged out')
})

app.get('/signin', (req, res) => {
  res.send(`
    <div>
      <form method="POST">
          <input name="email" placeholder="email" />
          <input name="password" placeholder="password" />
          <button>Sign In</button>
      </form>
  </div>`
  )
})

app.post('/signin', async (req, res) => {
 const { email, password } = req.body;

 const user = await usersRepo.getOneBy({ email })

if(!user) {
  return res.send('Email not found')
}

const validPassword = await usersRepo.comparePasswords(
  user.password,
  password
)

if(!validPassword) {
  return res.send('Invalid password')
}

req.session.uderId = user.id;

res.send('You are signed in!!!')

})

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