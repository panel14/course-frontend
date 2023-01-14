export default class ItemsService {

    getClientSideBarItems = () => {
        return [
            {id: 0, item: 'Card'}
        ]
    }

    getMechanicSideBarItems = () => {
        return [
            {id: 0, item: 'Guild'},
            {id: 1, item: 'Details'},
            {id: 2, item: 'Garage'},
            {id: 3, item: 'Repair Kit'},
        ]
    }

    getClientItemValues = (clientInfo) => {
        const { card: { discount: value} } = clientInfo;
        return [
            { discount: value, needInfo: false }
        ];
    }

    getMechanicItemValues = (mechanicInfo) => {
        const { guildId, details, garageId, repairKit } = mechanicInfo;
        return [
            { guildId: guildId, needInfo: true },
            { details: details, needInfo: true },
            { garageId: garageId, needInfo: true },
            { repairKit: repairKit, needInfo: false }
        ]
    }

    parseGuildInfo = (guildInfo) => {
        let result = []
        const {id, memberCount, name} = guildInfo;
        result.push({id: id});
        result.push({memberCount: memberCount});
        result.push({name: name});

        return result;
    }

    parseOwnDetails = (detailsInfo) => {
        let result = []
        result.push({details: '-- see below --'});
        detailsInfo.forEach((detail) => {
            const { cost, name, level, status, type } = detail;
            result.push({name: name});
            result.push({cost: cost});
            result.push({type: [type,' ', status]});
            result.push({level: level});
            result.push({next: '--'})
        })

        return result;
    }

    parseGarageInfo = (garageInfo) => {
        let result = [];
        const { height, lightness, square, decors } = garageInfo;
        let id = 1;

        result.push({height: height});
        result.push({lightness: lightness});
        result.push({square: square});
        result.push({decors: '-- see below --'});

        decors.forEach((item) => {
            result.push({[id++]: item['name']});
        })

        return result;
    }

    parsers = {
        guildId: this.parseGuildInfo,
        details: this.parseOwnDetails,
        garageId: this.parseGarageInfo
    }

    carTableHeaders = ['ID', 'Марка', 'Имя', 'Стоимость', 'Корпус', 'Двигатель', 'Коробка передач', 'Колёса']
    detailsTableHeaders = ['ID', 'Тип', 'Статус', 'Имя', 'Уровень', 'Стоимость'];

    orderTableHeaders = ['ID', 'Id механика', 'Id клиента', 'Машина', 'Стоимость', 'Дата'];

    decorTableHeaders = ['ID', 'Стоимость', 'Количество', 'Имя'];

    createCarsTable = (carsInfo) => {
        if (carsInfo.length === 0)
            return [];

        let rows = [];

        carsInfo.forEach((car) => {
            const {id, mark, name, cost, ...details } = car;
            let curRow = [];
            curRow.push(id.toString());
            curRow.push(mark.toString());
            curRow.push(name.toString());
            curRow.push(cost.toString());

            const detailsArr = Object.entries(details);

            detailsArr.forEach((detail) => {
                const {cost: dCost, name: dName, status} = detail[1];
                const detailStr = `${dName}\n${status}\n$:${dCost}`
                curRow.push(detailStr);
            })
            rows.push(curRow);
        });

        return rows;
    }

    createDetailsTable = (detailsInfo) => {
        if (detailsInfo.length === 0)
            return [];

        let rows = [];

        detailsInfo.forEach((detail) => {
            const curRow = [];
            for (let param in detail) {
                curRow.push(detail[param]);
            }
            rows.push(curRow);
        })

        return rows;
    }

    createOrdersTable = (ordersInfo) => {
        if (ordersInfo.length === 0)
            return [];

        let rows = [];

        ordersInfo.forEach((order) => {
            const {id, carDto: {mark, name}, cost, clientDto:{id: cId}, mechanic:{id: mId}, date} = order
            let curRow = [];
            curRow.push(id.toString());
            curRow.push(mId.toString());
            curRow.push(cId.toString());
            curRow.push(`${mark} ${name}`);
            curRow.push(cost);
            curRow.push(date);

            rows.push(curRow);
        })

        return rows;
    }

    createDecorTable = (decorInfo) => {
        if (decorInfo.length === 0)
            return [];

        let rows = [];

        decorInfo.forEach((decorItem) => {
            const curRow = [];

            const {cost, id, count, decor: {name}} = decorItem;
            curRow.push(id.toString());
            curRow.push(cost.toString());
            curRow.push(count.toString());
            curRow.push(name.toString());

            rows.push(curRow);
        })

        return rows;
    }

    availableMechanicsTableHeaders = ['ID', 'Имя', 'Фамилия', 'Гильдия'];

    createAvailableMechanicsTable = (mechanics) => {
        if (mechanics.length === 0)
            return [];

        let rows = [];

        mechanics.forEach((item) => {
            let curRow = [];

            const {id, name, surname, guild: {name: gName}} = item;
            curRow.push(id.toString());
            curRow.push(name.toString());
            curRow.push(surname.toString());
            curRow.push(gName.toString());

            rows.push(curRow);
        })

        return rows;
    }


}