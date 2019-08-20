const sendJSON = require('send-data/json');
const Promise = require('bluebird');
const DB = require('../db');

const jsonBody = Promise.promisify(require('body/json'));

module.exports = Favorites;

function Favorites (options) {
	return {
		GET: getController,
		POST: postController
	};

	function getController (req, res, opts, cb) {
		asyncGetController(req, res, opts)
			.catch(cb);
	}
	async function asyncGetController (req, res, opts, cb) {
		let existingData = await DB.get('favorites');
		existingData = JSON.parse(existingData);
		console.log(existingData);

		sendJSON(req, res, existingData);
	}

	function postController (req, res, opts, cb) {
		asyncPostController(req, res, opts)
			.catch(cb);
	}
	async function asyncPostController (req, res, opts, cb) {
		let data = await jsonBody(req, res);

		console.log('Setting favs to', data.favorites);

		await DB.put('favorites', JSON.stringify(data.favorites));
		sendJSON(req, res, {
			OK: true
		});
	}
}
