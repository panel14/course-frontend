
export default class SwapiService {

    _apiBase = 'http://localhost:8090/api/v1';
    _headerBase = {
        'Content-Type': 'application/json;charset=utf-8'
    }

    _apiUrls = {
        login: '/login',
        logout: '/logout',
        client: '/client',
        car: '/car',
        mechanic: '/mechanic',
        decor: '/mechanic/decor',
        detail: '/mechanic/detail',
        order: '/mechanic/order',
        taxi: '/mechanic/taxi'
    }

    //Request API
    async sendGetRequest(url) {
        const res = await fetch(`${this._apiBase}${url}`, {
            method: 'GET',
            headers: this._headerBase
        });

        if (res.status === 200)
            return await res.json();
        else
            throw new Error(await res.text());
    }

    async sendPostRequest(url, body, headers=this._headerBase, needJson=true) {
        const rawBody = (needJson) ? JSON.stringify(body) : body;

        const res = await fetch(`${this._apiBase}${url}`, {
            method: 'POST',
            headers: headers,
            body: rawBody
        });

        if (res.status === 200)
            return await res.json();
        else
            throw new Error(await res.text());
    }

    //User API
    loginUser = async(login, password) => {
        const userData = {
            login: login,
            password: password
        };
        return await this.sendPostRequest(this._apiUrls.login, userData);
    }

    logoutUser = async(token) => {
        const headers = {
            'Content-type': 'text/plain'
        };
        return await this.sendPostRequest(this._apiUrls.logout, token, headers, false)
    }

    //Client API
    getAvailableMechanics = async() => {
        const result = await this.sendGetRequest(`${this._apiUrls.client}/available-mechanics`);
        return [...result];
    }

    getClientInfo = async (userId) => {
        const fullUrl = `${this._apiUrls.client}/info?userId=${userId}`;
        return await this.sendPostRequest(fullUrl, userId);
    }

    createOrder = async(order) => {
        const url = `${this._apiUrls.client}/create-order`;
        return await this.sendPostRequest(url, order);
    }

    //Cars API
    getUsersCar = async(userId) => {
        const fullUrl = `${this._apiUrls.car}?userId=${userId}`;

        const result = await this.sendGetRequest(fullUrl);
        return [...result];
    }

    //Mechanic API
    getMechanicInfo = async (userId) => {
        const fullUrl = `${this._apiUrls.mechanic}/info?userId=${userId}`;

        return await this.sendGetRequest(fullUrl);
    }

    getGarageInfo = async (id) => {
        const fullUrl = `${this._apiUrls.mechanic}/garage?id=${id}`;

        return await this.sendGetRequest(fullUrl);
    }

    getGuildInfo = async (id) => {
        const fullUrl = `${this._apiUrls.mechanic}/guild?id=${id}`;

        return await this.sendGetRequest(fullUrl);
    }

    getAllGuilds = async () => {
        const fullUrl = `${this._apiUrls.mechanic}/guild-all`;

        return await this.sendGetRequest(fullUrl);
    }

    joinGuild = async (mechanicId, guildId) => {
        const fullUrl = `${this._apiUrls.mechanic}/join-guild?mechanicId=${mechanicId}&guildId=${guildId}`

        return await this.sendPostRequest(fullUrl, {});
    }

    leaveGuild = async (mechanicId) => {
        const fullUrl = `${this._apiUrls.mechanic}/leave-guild?mechanicId=${mechanicId}`

        return await this.sendPostRequest(fullUrl, {});
    }

    //Decor API
    getAllShops = async() => {
        const result = await this.sendGetRequest(`${this._apiUrls.decor}/shops`);
        return [...result];
    }

    buyDecor = async(mechanicId, productId) => {
        const fullUrl = `${this._apiUrls.decor}/buy?mechanicId=${mechanicId}&productId=${productId}`;
        return await this.sendPostRequest(fullUrl, {});
    }

    //Detail API
    getOwnDetails = async (mechanicId) => {
        const fullUrl = `${this._apiUrls.detail}/own?mechanicId=${mechanicId}`;
        return await this.sendGetRequest(fullUrl);
    }

    getAllDetails = async() => {
        const fullUrl = `${this._apiUrls.detail}/all`;
        return await this.sendGetRequest(fullUrl);
    }

    buyDetail = async(mechanicId, detailId) => {
        const fullUrl = `${this._apiUrls.detail}/buy?mechanicId=${mechanicId}&detailId=${detailId}`;
        return await this.sendPostRequest(fullUrl, {});
    }

    //Order API
    getAllOrders = async(mechanicId) => {
        const fullUrl = `${this._apiUrls.order}/current?mechanicId=${mechanicId}`;
        const result = await this.sendGetRequest(fullUrl);
        return [...result];
    }

    repairCar = async(repairOrder) => {
        const fullUrl = `${this._apiUrls.order}/repair`;
        return await this.sendPostRequest(fullUrl, repairOrder);
    }

    //Taxi API
    startWork = async(userId) => {
        return await this.sendPostRequest(`${this._apiUrls.taxi}/start`, userId);
    }

    stopWork = async(userId) => {
        return await this.sendPostRequest(`${this._apiUrls.taxi}/stop`, userId);
    }
}