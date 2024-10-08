import express from "express";
import morgan from "morgan";
import { engine } from "express-handlebars";
import {join, dirname} from "path";
import {fileURLToPath} from "url";
import citasRoutes from './routes/citas.routes.js';
import medicosRoutes from "./routes/medicosRoutes.js"
import adminRoutes from "./routes/adminRoutes.js"
import cookieParser from "cookie-parser";

//Initialization
const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

//Settings
app.set("port", process.env.PORT || 4000);
app.set('views', join(__dirname, 'views'));
app.engine('.hbs', engine({
    defaultLayout: 'main',
    layoutsDir: join(app.get('views'), 'layouts'),
    partialsDir: join(app.get('views'), 'partials'),
    extname: '.hbs'
}));
app.set('view engine', '.hbs');

//Habilita utilizar cookies :D
app.use(cookieParser());

//Middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(express.static("public"))
//Routes
app.get("/", (req, res) => {
    res.render('login');
});

app.use(citasRoutes); /* localhost:4000/citas/add */
app.use(medicosRoutes); /* localhost:4000/medicos/add */
app.use(adminRoutes)

//Public Files
app.use(express.static(join(__dirname, 'public')));

//Run Server
app.listen(app.get("port"), () =>
console.log("Server on port", app.get("port")));
 
 