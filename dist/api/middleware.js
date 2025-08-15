import { config } from "../config.js";
import { NotFoundError, BadRequestError, UnauthorizedError, ForbiddenError, } from "../errors.js";
export function middlewareLogResponses(req, res, next) {
    res.on("finish", () => {
        if (res.statusCode >= 400) {
            console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${res.statusCode}`);
        }
    });
    next();
}
export function middlewareMetricsInc(req, _, next) {
    config.fileserverHits = config.fileserverHits + 1;
    next();
}
export function middlewareErrorHandler(err, req, res, next) {
    console.error("Something went wrong on our end");
    let statusCode;
    const errorMessage = err.message;
    if (err instanceof BadRequestError) {
        res.status(400);
    }
    else if (err instanceof UnauthorizedError) {
        res.status(401);
    }
    else if (err instanceof ForbiddenError) {
        res.status(403);
    }
    else if (err instanceof NotFoundError) {
        res.status(404);
    }
    res.json({
        error: errorMessage,
    });
}
