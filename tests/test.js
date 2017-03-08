'use strict';


const PORT = 3000;
const SERVER_URL = `http://localhost:${PORT}`;
const HTTP_CODE_OK = 200;


let assert = require('assert');
let http = require('http');
let lib = require('../core/server.js');
let backendApi = require('../core/client_server_rest_lib');


function _getHtmlFilePath(filename) {
	return `${__dirname}/../html/${filename}`;
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


describe('Backend testing', () => {
    let fetchInterface = new backendApi();
    fetchInterface.flush().then(console.log('ok'));
    let goodUser = {
        email: 'email',
        login: 'login',
        password: 'password'
    };
    let badUser = {
        email: '_email',
        login: '_login',
        password: '_password'
    };

    describe('/api/user/register for good user', () => {
        it('should return 200', done => {
            let err = null;
            fetchInterface.register(goodUser.email, goodUser.login, goodUser.password)
                .then(result => {
                    try {
                        assert.equal(result.status, 200);
                        done();
                    } catch (e) {
                        err = e;
                    }
                })
                .catch(e => {
                    if (e) {
                        err = e;
                    }
                });

            if (err) {
                throw err;
            }
        });
    });

    describe('/api/user/login for bad user', () => {
        it('should return 403', done => {
            let err = null;
            fetchInterface.login(badUser.email, badUser.password)
                .then(result => {
                    try {
                        assert.equal(result.status, 403);
                        done();
                    } catch (e) {
                        err = e;
                    }
                })
                .catch(e => {
                    if (e) {
                        err = e;
                    }
                });

            if (err) {
                throw err;
            }
        });
    });

    describe('/api/user/login for good user', () => {
        it('should return 200', done => {
            let err = null;
            fetchInterface.login(goodUser.email, goodUser.password)
                .then(result => {
                    try {
                        assert.equal(result.status, 200);
                        done();
                    } catch (e) {
                        err = e;
                    }

                })
                .catch(e => {
                    if (e) {
                        err = e;
                    }
                });

            if (err) {
                throw err;
            }
        });
    });

    describe('/api/user/logout first time', () => {
        it('should return 200', done => {
            let err = null;
            fetchInterface.logout()
                .then(result => {
                    try {
                        assert.equal(result.status, 200);
                        done();
                    } catch (e) {
                        err = e;
                    }
                })
                .catch(e => {
                    if (e) {
                        err = e;
                    }
                });

            if (err) {
                throw err;
            }
        });
    });

    describe('/api/user/logout second time', () => {
        it('should return 403', done => {
            let err = null;
            fetchInterface.logout()
                .then(result => {
                    try {
                        assert.equal(result.status, 403);
                        done();
                    } catch (e) {
                        err = e;
                    }
                })
                .catch(e => {
                    if (e) {
                        err = e;
                    };
                });

            if (err) {
                throw err;
            }
        });
    });
});
