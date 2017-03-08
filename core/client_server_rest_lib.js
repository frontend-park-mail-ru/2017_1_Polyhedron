
const URLPack = require('./url_pack');

const URL_ALIASES = {
    login: 'login',
    logout: 'logout',
    register: 'register',
    get_user: 'get_user',
    update: 'update'
};

const URL_MAP = {
    polyhedron: new URLPack('http://polyhedron-backend.herokuapp.com', [
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
            name: URL_ALIASES.get_user,
            url: '/api/user/getuser',
            method: 'GET'
        },
        {
            name: URL_ALIASES.update,
            url: '/api/user/update',
            method: 'POST'
        }
    ])
};


class ClientServerAPI {
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


    _fetchCORS(urlAlias, requestBody) {
        const url = this._urlPack.getAbsURL(urlAlias);


        let options = {
            body: requestBody ? JSON.stringify(requestBody) : '',
            method: this._urlPack.getMethod(urlAlias),
            mode: 'cors',
            credentials: 'include',
            headers: new Headers({
                'Content-type': 'application/json'
            })
        };

        return fetch(url,options);
    }
}

module.exports = ClientServerAPI;
