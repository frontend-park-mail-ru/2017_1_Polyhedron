'use strict';


const PORT = 3000;
const SERVER_URL = `http://localhost:${PORT}`
const HTTP_CODE_OK = 200;


let assert = require('assert');
let http = require('http');
let lib = require('../server_lib.js');


function _getHtmlFilePath(filename) {
	return `${__dirname}/../static/html/${filename}`
}


let router = new lib.Router();
router.addPlainURL('/', new lib.BindedFile(_getHtmlFilePath('index.html')));


let staticServer = lib.getStaticServer(router);


describe('Static server testing', () => {
	before(() => staticServer.listen(PORT));

	describe('/', () => {
		it('should return 200', (done) => {
		    http.get(SERVER_URL, (result) => {
				assert.equal(HTTP_CODE_OK, result.statusCode);
				done();
			});
		});
	});

	after(() => staticServer.close());
});
