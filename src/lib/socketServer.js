const placemarks = [
    {
        id: 1,
        name: "Лобня",
        coords: [56.01353600, 37.48442058]
    },
    {
        id: 2,
        name: "Шереметьевская",
        coords: [55.98390723, 37.49849681]
    },
    {
        id: 3,
        name: "Хлебниково",
        coords: [55.97110594, 37.50433330]
    },
    {
        id: 4,
        name: "Водники",
        coords: [55.95348517, 37.51137141]
    },
    {
        id: 5,
        name: "Долгопрудный",
        coords: [55.93922860, 37.52046946]
    },
    {
        id: 6,
        name: "Новодачная",
        coords: [55.92477400, 37.52785090]
    },
    {
        id: 7,
        name: "Марк",
        coords: [55.90472132, 37.53849391]
    },
    {
        id: 8,
        name: "Лианозово",
        coords: [55.89748823, 37.55377177]
    },
    {
        id: 9,
        name: "Бескудниково",
        coords: [55.88292151, 37.56767634]
    },
    {
        id: 10,
        name: "Дегунино",
        coords: [55.86603267, 37.57299785]
    },
    {
        id: 11,
        name: "Окружная",
        coords: [55.84773615, 37.57437114]
    },
    {
        id: 12,
        name: "Тимирязевская",
        coords: [55.81955032, 37.57578734]
    },
    {
        id: 13,
        name: "Савёловский вкз.",
        coords: [55.79446290, 37.58818988]
    }
];


function getOptionsPlacemarks({ firstLetters }) {
    return placemarks.filter(item => item.name.startsWith(firstLetters));
}

function findPlacemark({ placemarkId }) {
    return placemarks.find(item => item.id == placemarkId);
}

function getIntermediatePlacemarks({ firstId, secondId }) {
    let id1 = 0, id2 = 0;

    if (firstId < secondId) {
        id1 = firstId;
        id2 = secondId;
    }
    else {
        id1 = secondId;
        id2 = firstId;
    }

    return placemarks.filter(item => ((item.id > id1) && (item.id < id2)));
}


export {
    getOptionsPlacemarks,
    getIntermediatePlacemarks,
    findPlacemark
}