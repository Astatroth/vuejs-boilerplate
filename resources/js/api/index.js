export default class API {
    static get(url, payload, success, fail, done) {
        API.request('get', url, payload, success, fail, done);
    }

    static post(url, payload, success, fail, done) {
        API.request('post', url, payload, success, fail, done);
    }

    static request(method, url, payload, success, fail, done) {
        axios({
            method: method,
            url: url,
            data: payload
        })
        .then((response) => {
            if (Config.MODE === 'development') {
                console.log(response);
            }

            if (typeof success === 'function') {
                success(response);
            }
        })
        .catch((fail) => {
            if (Config.MODE === 'development') {
                console.log('fail', fail);
            }
        })
        .finally(() => {
            if (typeof done === 'function') {
                done();
            }
        })
    }
}