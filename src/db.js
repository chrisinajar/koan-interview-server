const Level = require('level');

const database = Level('data');

database.get('favorites')
	.catch(function (err) {
		database.put('favorites', '{}');
	});

module.exports = database;
