const http = require('http');
const HttpHashRouter = require('http-hash-router');
const Corsify = require('corsify');
const Boom = require('boom');
const sendBoom = require('send-boom');

var router = HttpHashRouter();

router.set('/health', function health (req, res) {
	res.end('OK');
});

router.set('/favorites', require('./endpoints/favorites')());

var cors = Corsify({
'Access-Control-Allow-Headers': 'X-Auth-Token, Content-Type, Auth-Checksum'
});

var server = http.createServer(cors(handler));
server.listen(4000);

function handler (req, res) {
	router(req, res, {}, onError);

	function onError (err, data) {
		if (!err) {
			err = Boom.internal('An unknown error occured');
		} else if (!err.isBoom) {
			if (err.statusCode) {
				err = new Boom(err.message, {
					statusCode: err.statusCode,
					data: err
				});
			} else if (err.isJoi) {
				err = new Boom(err.message, {
					statusCode: 400,
					data: err.details
				});
			} else {
				console.error('Uncaught non-boom error', err.stack || err);

				err = new Boom(err.message, {
					data: err
				});
			}
		}
		console.log(err);
		sendBoom(req, res, err);
	}
}
