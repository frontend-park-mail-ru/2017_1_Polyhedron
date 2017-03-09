'use strict';


const PORT = 3000;
const SERVER_URL = `http://localhost:${PORT}`;
const HTTP_CODE_OK = 200;


let assert = require('assert');
let http = require('http');
let lib = require('../core/server.js');
let backendApi = require('../core/backend_rest_lib');


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

/*
describe('Backend testing', () => {
    let fetchInterface = new backendApi();
    fetchInterface.flush().then(console.log('DB flushed'));
    let registeredUser = {
        email: 'email',
        login: 'login',
        password: 'password'
    };
    let notRegisteredUser = {
        email: '_email',
        login: '_login',
        password: '_password'
    };
    let incompleteUser = {};

    let getStatusCodeTestGenerator = (logicFunc, extraThenFunc) => {
        let err = null;

        return (user, responseCode) => {
            return (done) => {
                logicFunc(user)
                    .then(result => {
                        try {
                            if (extraThenFunc) {
                                extraThenFunc(result);
                            }

                            assert.equal(result.status, responseCode);
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
            }
        }
    };

    let getRegisterTest = getStatusCodeTestGenerator((user) => {
        return fetchInterface.register(user.email, user.login, user.password);
    });

    let getLoginTest = getStatusCodeTestGenerator((user) => {
        return fetchInterface.login(user.email, user.password);
    });

    let getLogoutTest = getStatusCodeTestGenerator(() => {
        return fetchInterface.logout();
    });

    let getLeadersTest = getStatusCodeTestGenerator(() => {
        return fetchInterface.getLeaders();
    }, (result) => {
        console.log(result.status);
    });



    describe('/api/user/register for registeredUser', () => {
        it('should return 200', getRegisterTest(registeredUser, 200));
    });

    describe('/api/user/register for registeredUser again', () => {
        it('should return 409', getRegisterTest(registeredUser, 409));
    });

    describe('/api/user/register for incompleteUser', () => {
        it('should return 400', getRegisterTest(incompleteUser, 400));
    });


    describe('/api/user/login for registeredUser', () => {
        it('should return 200', getLoginTest(registeredUser, 200));
    });

    describe('/api/user/login for notRegisteredUser', () => {
        it('should return 403', getLoginTest(notRegisteredUser, 403));
    });

    describe('/api/user/login for incomplete user', () => {
        it('should return 400', getLoginTest(incompleteUser, 400));
    });


    describe('/api/user/logout second time', () => {
        it('should return 403', getLeadersTest(registeredUser, 200));
    });


    describe('/api/user/logout loggedIn user', () => {
        it('should return 200', getLogoutTest(registeredUser, 200));
    });

    describe('/api/user/logout second time', () => {
        it('should return 403', getLogoutTest(registeredUser, 403));
    });

});
*/