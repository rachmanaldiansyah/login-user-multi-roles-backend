import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import db from "./config/Database.js";
import SequelizeStore from "connect-session-sequelize";
import userRoute from "./routes/userRoutes.js";
import productRoute from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";
dotenv.config();

const app = express();
const sessionStorage = SequelizeStore(session.Store);
const store = new sessionStorage({
  db: db
});

// meng-sinkronasi dengan database
// (async ()=> {
//  await db.sync();
// })();

app.use(
  session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
      secure: "auto",
    },
  })
);

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);
app.use(express.json());
app.use(userRoute);
app.use(productRoute);
app.use(authRoutes);

// membuat session-sequelize
// store.sync();

app.listen(process.env.APP_PORT, () => {
  console.log("Server berjalan...");
});
