
require('isomorphic-fetch');

const ROOT_URL = 'https://polyhedron-backend.herokuapp.com';

const RELATIVE_URL_MAP = {
    register: '/api/user/registration',
    login: '/api/user/login',
    logout: '/api/user/logout',
    getUser: '/api/user/getuser',
    update: '/api/user/update',
    leaders: '/api/user/leaders/',
    isLoggedIn: '/api/user/islogin'
};

const METHODS = {
    GET: "GET",
    POST: "POST"
};


export class BackendAPI {
    constructor(rootURL, urlMap) {
        this._rootURL = rootURL || ROOT_URL;
        this._urlMap = urlMap || RELATIVE_URL_MAP;
    }

    register(email, login, password) {
        return this._fetchCORS(this._urlMap.register, METHODS.POST, {
            'email': email,
            'login': login,
            'password': password
        });
    }

    login(email, password) {
        return this._fetchCORS(this._urlMap.login, METHODS.POST, {
            'email': email,
            'password': password
        });
    }

    getuser() {
        return this._fetchCORS(this._urlMap.getUser, METHODS.GET);
    }

    logout() {
        return this._fetchCORS(this._urlMap.logout, METHODS.GET);
    }

    getLeaders(leadersCountLimit) {
        return this._fetchCORS(this._urlMap.leaders + leadersCountLimit, METHODS.GET);
    }

    isLoggedIn() {
        return this._fetchCORS(this._urlMap.isLoggedIn, METHODS.POST);
    }

    _fetchCORS(url, method, requestBody) {
        const absURL = this._rootURL + url;

        let options = {
            method: method,
            mode: 'cors',
            credentials: 'include',
            headers: {
                'Content-type': 'application/json'
            }
        };
        if (method === METHODS.POST) {
            options.body = requestBody ? JSON.stringify(requestBody) : '';
        }

        return fetch(absURL,options);
    }
}
