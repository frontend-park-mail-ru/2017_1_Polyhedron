
const URLPack = require('./url_pack');
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

const URL_MAP = {
    polyhedron: new URLPack('https://polyhedron-backend.herokuapp.com', [
        {
            name: URL_ALIASES.register,
            url: '/api/user/registration',
            method: 'POST'
        },
        {
            name: URL_ALIASES.login,
            url: '/api/user/login',
            method: 'POST'
        },
        {
            name: URL_ALIASES.logout,
            url: '/api/user/logout',
            method: 'POST'
        },
        {
            name: URL_ALIASES.getUser,
            url: '/api/user/getuser',
            method: 'GET'
        },
        {
            name: URL_ALIASES.update,
            url: '/api/user/update',
            method: 'POST'
        },
        {
            name: URL_ALIASES.leaders,
            url: '/api/user/leaders',
            method: 'POST'
        },
        {
            name: URL_ALIASES.isLoggedIn,
            url: '/api/user/islogin',
            method: 'GET'
        },
        {
            name: URL_ALIASES.flush,
            url: '/api/user/flush',
            method: 'GET'
        }
    ])
};


class BackendAPI {
    constructor(urlPack) {
        this._urlPack = urlPack || URL_MAP.polyhedron;
    }

    register(email, login, password) {
        return this._fetchCORS(URL_ALIASES.register, {
            'email': email,
            'login': login,
            'password': password
        });
    }

    login(email, password) {
        return this._fetchCORS(URL_ALIASES.login, {
            'email': email,
            'password': password
        });
    }

    logout() {
        return this._fetchCORS(URL_ALIASES.logout);
    }

    getLeaders(leadersCountLimit) {
        return this._fetchCORS(URL_ALIASES.leaders, {
            'count': leadersCountLimit
        });
    }

    isLoggedIn() {
        return this._fetchCORS(URL_ALIASES.isLoggedIn);
    }

    flush() {
        return this._fetchCORS(URL_ALIASES.flush);
    }


    _fetchCORS(urlAlias, requestBody) {
        const url = this._urlPack.getAbsURL(urlAlias);


        let options = {
            body: requestBody ? JSON.stringify(requestBody) : '',
            method: this._urlPack.getMethod(urlAlias),
            mode: 'cors',
            credentials: 'include',
            headers: {
                'Content-type': 'application/json'
            }
        };

        return fetch(url,options);
    }
}

module.exports = BackendAPI;
