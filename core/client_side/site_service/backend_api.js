
import {URLPack} from './url_pack';

const fetch = require('fetch-cookie')(require('node-fetch'));

const URL_ALIASES = {
    login: 'login',
    logout: 'logout',
    register: 'register',
    getUser: 'getUser',
    update: 'update',
    leaders: 'leaders',
    isLoggedIn: 'isLoggedIn',
    flush: 'flush'
};

const API_URL = 'https://polyhedron-backend.herokuapp.com';

const URL_MAP = {
    register: '/api/user/registration',
    login: '/api/user/login',
    logout: '/api/user/logout',
    getUser: '/api/user/getuser',
    update: '/api/user/update',
    leaders: '/api/user/leaders/',
    isLoggedIn: '/api/user/islogin',
    flush: '/api/user/flush'
};

const METHOD_MAP = {
    GET: "GET",
    POST: "POST"
};


export class BackendAPI {
    constructor(rootURL, urlMap) {
        this._rootURL = rootURL || API_URL;
        this._urlMap = urlMap || URL_MAP;
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

    logout() {
        return this._fetchCORS(this._urlMap.logout, METHOD_MAP.GET);
    }

    getLeaders(leadersCountLimit) {
        return this._fetchCORS(this._urlMap.leaders + leadersCountLimit, METHOD_MAP.GET);
    }

    isLoggedIn() {
        return this._fetchCORS(this._urlMap.isLoggedIn, METHOD_MAP.POST);
    }

    flush() {
        return this._fetchCORS(this._urlMap.flush, METHOD_MAP.POST);
    }


    _fetchCORS(url, method, requestBody) {
        const absURL = this._rootURL + url;


        let options = {
            body: requestBody ? JSON.stringify(requestBody) : '',
            method: method,
            mode: 'cors',
            credentials: 'include',
            headers: {
                'Content-type': 'application/json'
            }
        };

        return fetch(absURL,options);
    }
}
