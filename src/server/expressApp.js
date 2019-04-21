import * as express from "express";
import indexRouter from "./routes/index";
// import uploadRouter from "./routes/upload";

const app = express();

function initializeApp(app) {
    const port = "3000";
    app.set("port", port);
    //

    app.use("/", indexRouter);
    // app.use("/upload", uploadRouter);

    // catch 404 and forward to error handler
    app.use(function (req, res, next) {
        const err = new Error("error_notFound");
        err.status = 404;
        next(err);
    });

    // Express error handler
    app.use(function (err, req, res, next) {
        console.error(`Express ERROR: ${err.message}; request: ${req.path}`);

        err.status = err.status || 500;

        res.status(err.status).end();
    });
};


export {
    initializeApp,
    app
}