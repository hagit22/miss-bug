import { loggerService } from "../services/logger.service.js";


export function logRequest(req, res, next) {
	loggerService.debug(` Request:\r\n ${req.method} :: ${req.url} :: ${JSON.stringify(req.body)} \r\n`)
	next()
}

export function logResponse(req, res, next) {
    res.on('finish', () => {
		loggerService.debug(` Response:  ${res.statusCode}\r\n`)
    });
    res.on('error', (error) => {
		loggerService.error(` Response:\r\n ${error.message}\r\n`)
    });
	next()
}

