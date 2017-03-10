'use strict';

let assert = require('assert');
let backendApi = require('../core/backend_api');

const HTTP_OK = 200;
const HTTP_CONFLICT = 409;
const HTTP_BAD_REQUEST = 400;
const HTTP_NOT_ALLOWED = 403;


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
                        if (extraThenFunc) {
                            extraThenFunc(result);
                        }
                        assert.equal(result.status, responseCode);
                        done();
                    })
                    .catch(e => {
                        if (e) {
                            err = e;
                        }
                    });

                if (err) {
                    throw err;
                }
            };
        };
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
    });


    describe('/api/user/register for registeredUser', () => {
        it('should return 200', getRegisterTest(registeredUser, HTTP_OK));
    });

    describe('/api/user/register for registeredUser again', () => {
        it('should return 409', getRegisterTest(registeredUser, HTTP_CONFLICT));
    });

    describe('/api/user/register for incompleteUser', () => {
        it('should return 400', getRegisterTest(incompleteUser, HTTP_BAD_REQUEST));
    });


    describe('/api/user/login for registeredUser', () => {
        it('should return 200', getLoginTest(registeredUser, HTTP_OK));
    });

    describe('/api/user/login for notRegisteredUser', () => {
        it('should return 403', getLoginTest(notRegisteredUser, HTTP_NOT_ALLOWED));
    });

    describe('/api/user/login for incomplete user', () => {
        it('should return 400', getLoginTest(incompleteUser, HTTP_BAD_REQUEST));
    });


    describe('/api/user/leaders second time', () => {
        it('should return 200', getLeadersTest(registeredUser, HTTP_OK));
    });


    describe('/api/user/logout loggedIn user', () => {
        it('should return 200', getLogoutTest(registeredUser, HTTP_OK));
    });

    describe('/api/user/logout second time', () => {
        it('should return 403', getLogoutTest(registeredUser, HTTP_NOT_ALLOWED));
    });

});
