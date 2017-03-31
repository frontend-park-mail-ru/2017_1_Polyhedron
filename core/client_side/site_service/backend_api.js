
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

const METHOD_MAP = {
    GET: "GET",
    POST: "POST"
};


export class BackendAPI {
    constructor(rootURL, urlMap) {
        this._rootURL = rootURL || ROOT_URL;
        this._urlMap = urlMap || RELATIVE_URL_MAP;
    }

    register(email, login, password) {
        return this._fetchCORS(this._urlMap.register, METHOD_MAP.POST, {
            'email': email,
            'login': login,
            'password': password
        });
    }

    login(email, password) {
        return this._fetchCORS(this._urlMap.login, METHOD_MAP.POST, {
            'email': email,
            'password': password
        });
    }

    getuser() {
        return this._fetchCORS(this._urlMap.getUser, METHOD_MAP.GET);
    }

    logout() {
        return this._fetchCORS(this._urlMap.logout, METHOD_MAP.GET);
    }

    getLeaders(leadersCountLimit) {
        return this._fetchCORS(this._urlMap.leaders + leadersCountLimit, METHOD_MAP.GET);
    }

    isLoggedIn() {
        return this._fetchCORS(this._urlMap.isLoggedIn, METHOD_MAP.POST);
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
        if (method === METHOD_MAP.POST) {
            options.body = requestBody ? JSON.stringify(requestBody) : '';
        }

        return fetch(absURL,options);
    }
}
