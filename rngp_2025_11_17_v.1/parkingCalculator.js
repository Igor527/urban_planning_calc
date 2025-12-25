const parkingData = {
    infrastructure: {
        metro: [
            { max: 1200, label: "Менее 1200 м (15 мин. пешком)", value: 0.75 },
            { max: 2200, label: "1200–2200 м (до 30 мин. пешком)", value: 0.9 },
            { max: Infinity, label: "Более 2200 м (более 30 мин. пешком)", value: 1.0 }
        ],
    },
    districts: {
        "Академический": [0.7, 0.7],
        "Алексеевский": [0.5, 0.5],
        "Алтуфьевский": [0.9, 0.9],
        "Арбат": [0.2, 0.2],
        "Аэропорт": [0.5, 0.5],
        "Бабушкинский": [0.9, 0.9],
        "Басманный": [0.2, 0.5],
        "Беговой": [0.2, 0.5],
        "Бекасово": [0.9, 0.9],
        "Бескудниковский": [0.9, 0.9],
        "Бибирево": [0.9, 0.9],
        "Бирюлёво Восточное": [0.9, 0.9],
        "Бирюлёво Западное": [0.9, 0.9],
        "Богородское": [0.9, 0.9],
        "Братеево": [0.9, 0.9],
        "Бутово Северное": [0.9, 0.9],
        "Бутово Южное": [0.9, 0.9],
        "Бутырский": [0.5, 0.5],
        "Вешняки": [0.9, 0.9],
        "Внуково": [0.7, 0.7],
        "Войковский": [0.5, 0.5],
        "Вороново": [0.9, 0.9],
        "Восточное Дегунино": [0.9, 0.9],
        "Восточное Измайлово": [0.9, 0.9],
        "Восточный": [0.9, 0.9],
        "Выхино-Жулебино": [0.9, 0.9],
        "Гагаринский": [0.5, 0.5],
        "Головинский": [0.7, 0.7],
        "Гольяново": [0.9, 0.9],
        "Даниловский": [0.2, 0.5],
        "Дмитровский": [0.9, 0.9],
        "Донской": [0.2, 0.5],
        "Дорогомилово": [0.2, 0.5],
        "Замоскворечье": [0.2, 0.2],
        "Западное Дегунино": [0.9, 0.9],
        "Зюзино": [0.9, 0.9],
        "Зябликово": [0.9, 0.9],
        "Ивановское": [0.9, 0.9],
        "Измайлово": [0.9, 0.9],
        "Капотня": [0.9, 0.9],
        "Коммунарка": [0.7, 0.7],
        "Коньково": [0.7, 0.7],
        "Коптево": [0.9, 0.9],
        "Косино-Ухтомский": [0.9, 0.9],
        "Котловка": [0.9, 0.9],
        "Краснопахорский": [0.9, 0.9],
        "Красносельский": [0.2, 0.5],
        "Крылатское": [0.7, 0.7],
        "Крюково": [0.9, 0.9],
        "Кузьминки": [0.9, 0.9],
        "Кунцево": [0.7, 0.7],
        "Куркино": [0.9, 0.9],
        "Левобережный": [0.9, 0.9],
        "Лефортово": [0.2, 0.5],
        "Лианозово": [0.9, 0.9],
        "Ломоносовский": [0.9, 0.9],
        "Лосиноостровский": [0.9, 0.9],
        "Люблино": [0.9, 0.9],
        "Марфино": [0.9, 0.9],
        "Марьина Роща": [0.2, 0.5],
        "Марьино": [0.9, 0.9],
        "Матушкино": [0.7, 0.7],
        "Метрогородок": [0.7, 0.7],
        "Мещанский": [0.2, 0.5],
        "Митино": [0.9, 0.9],
        "Можайский": [0.7, 0.7],
        "Молжаниновский": [0.9, 0.9],
        "Москворечье-Сабурово": [0.7, 0.7],
        "Нагатино-Садовники": [0.5, 0.5],
        "Нагатинский Затон": [0.9, 0.9],
        "Нагорный": [0.7, 0.7],
        "Некрасовка": [0.9, 0.9],
        "Нижегородский": [0.7, 0.7],
        "Новогиреево": [0.9, 0.9],
        "Новокосино": [0.9, 0.9],
        "Ново-Переделкино": [0.9, 0.9],
        "Обручевский": [0.7, 0.7],
        "Орехово-Борисово Северное": [0.9, 0.9],
        "Орехово-Борисово Южное": [0.9, 0.9],
        "Останкинский": [0.5, 0.5],
        "Отрадное": [0.9, 0.9],
        "Очаково-Матвеевское": [0.7, 0.7],
        "Перово": [0.7, 0.7],
        "Печатники": [0.7, 0.7],
        "Покровское-Стрешнево": [0.7, 0.7],
        "Преображенское": [0.5, 0.5],
        "Пресненский": [0.2, 0.5],
        "Проспект Вернадского": [0.7, 0.7],
        "Раменки": [0.7, 0.7],
        "Ростокино": [0.7, 0.7],
        "Рязанский": [0.9, 0.9],
        "Савёлки": [0.9, 0.9],
        "Савёловский": [0.5, 0.5],
        "Свиблово": [0.7, 0.7],
        "Северное Измайлово": [0.9, 0.9],
        "Северное Медведково": [0.9, 0.9],
        "Северное Тушино": [0.9, 0.9],
        "Северный": [0.9, 0.9],
        "Силино": [0.7, 0.7],
        "Сокол": [0.5, 0.5],
        "Соколиная Гора": [0.5, 0.5],
        "Сокольники": [0.5, 0.5],
        "Солнцево": [0.9, 0.9],
        "Старое Крюково": [0.7, 0.7],
        "Строгино": [0.9, 0.9],
        "Таганский": [0.2, 0.2],
        "Тверской": [0.2, 0.2],
        "Текстильщики": [0.9, 0.9],
        "Тёплый Стан": [0.9, 0.9],
        "Тимирязевский": [0.7, 0.7],
        "Троицк": [0.7, 0.7],
        "Тропарёво-Никулино": [0.7, 0.7],
        "Филёвский Парк": [0.7, 0.7],
        "Фили-Давыдково": [0.9, 0.9],
        "Филимонковский": [0.9, 0.9],
        "Хамовники": [0.2, 0.5],
        "Ховрино": [0.9, 0.9],
        "Хорошёво-Мневники": [0.9, 0.9],
        "Хорошёвский": [0.5, 0.5],
        "Царицыно": [0.9, 0.9],
        "Черемушки": [0.7, 0.7],
        "Чертаново Северное": [0.9, 0.9],
        "Чертаново Центральное": [0.9, 0.9],
        "Чертаново Южное": [0.9, 0.9],
        "Щербинка": [0.7, 0.7],
        "Щукино": [0.7, 0.7],
        "Южное Медведково": [0.9, 0.9],
        "Южное Тушино": [0.9, 0.9],
        "Южнопортовый": [0.7, 0.7],
        "Якиманка": [0.2, 0.2],
        "Ярославский": [0.9, 0.9],
        "Ясенево": [0.9, 0.9]
    },
    mo_rates: {
        "living": { label: "Жилое назначение", s1: 22100, unit: "кв.м" },
        "commercial": { label: "Коммерция (1 этаж)", s1: 450, unit: "кв.м" },
        "kindergarten": { label: "Детские сады", s1: 30, unit: "чел." },
        "school": { label: "Школы", s1: 300, unit: "чел." },
    },
    ttk_positions: [
        { value: 'inside', label: 'Внутри ТТК' },
        { value: 'outside', label: 'Снаружи ТТК' }
    ],
    ev_share: { "2025": 0.05, "2026": 0.10, "2027": 0.15, "2028": 0.15 },
    living_norms: { "mkd": 33, "block": 50, "individual": 50 }
};

class ParkingCalculator {
    constructor(inputData = {}) {
        this.input = inputData;
        this.results = {};
    }

    getK1(metroDistance) {
        const distance = Number(metroDistance);
        for (const range of parkingData.infrastructure.metro) {
            if (distance <= range.max) {
                return { value: range.value, label: range.label };
            }
        }
        return { value: 1.0, label: "Более 2200 м (более 30 мин. пешком)" };
    }

    getEVShare(year) {
        const yearNum = Number(year);
        if (yearNum >= 2027) return 0.15;
        return parkingData.ev_share[String(year)] || 0;
    }

    calculateMGNPlaces(totalPlaces) {
        let enlarged = 0;
        if (totalPlaces <= 100) enlarged = Math.ceil(totalPlaces * 0.05);
        else if (totalPlaces <= 200) enlarged = 5 + Math.ceil((totalPlaces - 100) * 0.03);
        else if (totalPlaces <= 500) enlarged = 8 + Math.ceil((totalPlaces - 200) * 0.02);
        else enlarged = 14 + Math.ceil((totalPlaces - 500) * 0.01);
        const total_mgn = Math.ceil(totalPlaces * 0.1);
        return { total: total_mgn, enlarged: enlarged, regular: Math.max(0, total_mgn - enlarged) };
    }

    calculateNp() {
        if (!this.input.areaFlats) return 0;
        const S = this.input.areaFlats;
        const S1 = parkingData.living_norms.mkd;
        const A = 0.257;
        const K1 = this.input.k1 || 1;
        const Np = (S / S1) * A * K1;
        this.results.Np = Math.ceil(Np);
        this.results.Np_minus_10 = Math.ceil(this.results.Np * 0.9);
        this.results.Np_plus_10 = Math.floor(this.results.Np * 1.1);
        return this.results.Np;
    }

    calculateNv() {
        if (!this.input.areaNNP) return 0;
        const X = this.input.areaNNP;
        const X2 = 90;
        const K1 = this.input.k1 || 1;
        const K2 = this.input.k2 || 0.9;
        const Nv = (X / X2) * K1 * K2;
        this.results.Nv = Math.ceil(Nv);
        this.results.Nv_minus_30 = Math.ceil(this.results.Nv * 0.7);
        this.results.Nv_plus_30 = Math.floor(this.results.Nv * 1.3);
        return this.results.Nv;
    }

    calculateNk() {
        this.results.Nk_residential = this.input.areaFlats ? Math.ceil(this.input.areaFlats / parkingData.mo_rates.living.s1) : 0;
        // Коммерческие места: при ННП < 450 кв.м можно не предусматривать (0 мест), иначе по формуле но не более 4
        this.results.Nk_commercial = 0;
        if (this.input.areaNNP && this.input.areaNNP >= 450) {
            this.results.Nk_commercial = Math.min(4, Math.ceil(this.input.areaNNP / parkingData.mo_rates.commercial.s1));
        }
        // Школа: кол-во учащихся / нормативное количество на одно место (только для справки, не входит в общий расчет)
        this.results.Nk_school = this.input.schoolCapacity ? Math.ceil(this.input.schoolCapacity / parkingData.mo_rates.school.s1) : 0;
        // Детский сад: кол-во детей / нормативное количество на одно место (только для справки, не входит в общий расчет)
        this.results.Nk_preschool = this.input.kindergartenCapacity ? Math.ceil(this.input.kindergartenCapacity / parkingData.mo_rates.kindergarten.s1) : 0;
        // В общий расчет входят только места остановки для жилья и коммерции
        this.results.No_total = this.results.Nk_residential + this.results.Nk_commercial;
        return this.results.No_total;
    }

    calculateNg() {
        if (!this.results.Np) this.calculateNp();
        this.results.Ng = Math.ceil(this.results.Np * 0.1);
        this.results.Ng_minus_10 = Math.ceil(this.results.Ng * 0.9);
        this.results.Ng_plus_10 = Math.floor(this.results.Ng * 1.1);
        return this.results.Ng;
    }

    calculateTotal() {
        const Np = this.results.Np || 0;
        const Ng = this.results.Ng || 0;
        const Nv = this.results.Nv || 0;
        const No = this.results.No_total || 0;
        const ev_share = this.getEVShare(this.input.rnsYear);
        const N_total = Np + Ng + Nv + No;
        // Электромобили считаются от каждого вида отдельно (места остановки не включаются)
        const N_ev = Math.ceil(Np * ev_share) + Math.ceil(Ng * ev_share) + Math.ceil(Nv * ev_share);
        this.results.N_total = N_total;
        this.results.N_ev = N_ev;
    }

    calculateTotalVariations() {
        const F_actual = (
            this.input.fact_zu_mo +
            this.input.fact_zu_guest_mgn +
            this.input.fact_zu_priob_mgn +
            this.input.fact_uds_mo +
            this.input.fact_uds_guest +
            this.input.fact_uds_guest_mgn +
            this.input.fact_uds_priob +
            this.input.fact_uds_priob_mgn
        );

        this.results.N_required = (
            this.results.Np +
            this.results.Ng +
            this.results.Nv +
            this.results.No_total -
            F_actual
        );

        this.results.N_min = Math.max(0, (
            this.results.Np_minus_10 +
            this.results.Ng_minus_10 +
            this.results.Nv_minus_30 +
            this.results.No_total -
            F_actual
        ));

        this.results.N_max = (
            this.results.Np_plus_10 +
            this.results.Ng_plus_10 +
            this.results.Nv_plus_30 +
            this.results.No_total -
            F_actual
        );

        const ev_share = this.getEVShare(this.input.rnsYear);
        // Электромобили считаются от каждого вида отдельно
        this.results.N_ev_required = Math.ceil(this.results.Np * ev_share) + 
                                     Math.ceil(this.results.Ng * ev_share) + 
                                     Math.ceil(this.results.Nv * ev_share);
        this.results.N_ev_min = Math.ceil(this.results.Np_minus_10 * ev_share) + 
                                Math.ceil(this.results.Ng_minus_10 * ev_share) + 
                                Math.ceil(this.results.Nv_minus_30 * ev_share);
        this.results.N_ev_max = Math.ceil(this.results.Np_plus_10 * ev_share) + 
                                Math.ceil(this.results.Ng_plus_10 * ev_share) + 
                                Math.ceil(this.results.Nv_plus_30 * ev_share);
    }

    calculateBreakdown() {
        const ev_share = this.getEVShare(this.input.rnsYear);
        const Np = this.results.Np || 0;
        const Ng = this.results.Ng || 0;
        const Nv = this.results.Nv || 0;

        const P2 = Math.ceil(Np * ev_share);
        const P1 = Np - P2;
        const G2 = Math.ceil(Ng * ev_share);
        const G1 = Ng - G2;
        const V2 = Math.ceil(Nv * ev_share);
        const V1 = Nv - V2;

        const Ng_mgn = this.calculateMGNPlaces(Ng);
        const Nv_mgn = this.calculateMGNPlaces(Nv);

        this.results.breakdown = {
            П1: P1, "П(эм)": P2,
            Г1: G1, "Г(эм)": G2, "Г(мгн)": Ng_mgn.total,
            В1: V1, "В(эм)": V2, "В(мгн)": Nv_mgn.total,
            МО: this.results.No_total
        };
    }

    calculateParkingAreaRequired() {
        const sqmPerPlace = this.input.sqmPerPlace || 32; // кв.м на одно м.м по умолчанию
        const N_required = this.results.N_required || 0;
        const N_min = this.results.N_min || 0;
        const N_max = this.results.N_max || 0;
        
        this.results.parking_area_required = Math.ceil(N_required * sqmPerPlace);
        this.results.parking_area_min = Math.ceil(N_min * sqmPerPlace);
        this.results.parking_area_max = Math.ceil(N_max * sqmPerPlace);
        this.results.parking_area_2level = Math.ceil(this.results.parking_area_required / 2);
        
        return this.results.parking_area_required;
    }

    calculate() {
        const k1Info = this.getK1(this.input.metroDistance);
        this.input.k1 = k1Info.value;
        this.input.k1Label = k1Info.label;

        this.input.k2 = parkingData.districts[this.input.districtName] ?
            parkingData.districts[this.input.districtName][this.input.ttkStatus === 'inside' ? 0 : 1] : 0.9;

        this.calculateNp();
        this.calculateNv();
        this.calculateNk();
        this.calculateNg();
        this.calculateTotal();
        this.calculateTotalVariations();
        this.calculateBreakdown();
        this.calculateParkingAreaRequired();
        return this.results;
    }

    getFormattedReport() {
        const k1 = this.input.k1;
        const k1Label = this.input.k1Label;
        const k2 = this.input.k2;
        const ev_share = this.getEVShare(this.input.rnsYear);
        const sqmPerPlace = this.input.sqmPerPlace || 32;

        let report = `
            <h3>Расчёт стоянок по №945-ПП от 23.12.2015 с изменениями на 17 ноября 2025 года</h3>
            <table border="1" cellpadding="8">
                <tr><th>Наименование показателя</th><th>Обозначение</th><th>Значение</th></tr>
                <tr><td>Тип объекта</td><td>-</td><td>Многоквартирный дом (2.1.1, 2.5, 2.6)</td></tr>
                <tr><td>Год РНС</td><td>г.</td><td>${this.input.rnsYear}</td></tr>
                <tr><td>Площадь участка проектирования</td><td>кв.м</td><td>${this.input.plotArea || '-'}</td></tr>
                <tr><td>Суммарная поэтажная жилой части, кв.м (СПП жилой части)</td><td>S</td><td>${this.input.sppResidential || '-'}</td></tr>
                <tr><td>Площадь квартир, кв.м</td><td>Sоб.кв.</td><td>${this.input.areaFlats || '-'}</td></tr>
                <tr><td>Суммарная поэтажная площадь помещений общественного назначения, кв.м (СПП НПКИ)</td><td>X</td><td>${this.input.sppPublic || '-'}</td></tr>
                <tr><td>Общая площадь помещений общественного назначения (НПКИ), кв.м</td><td>Sнпки</td><td>${this.input.areaNPKI || '-'}</td></tr>
                <tr><td>Нежилая наземная площадь (ННП)</td><td>X</td><td>${this.input.areaNNP || '-'}</td></tr>
                <tr><td>Район города Москвы</td><td>-</td><td>${this.input.districtName}</td></tr>
                <tr><td>Место площадки относительно ТТК г.Москва</td><td>-</td><td>${this.input.ttkStatus === 'inside' ? 'Внутри ТТК' : 'Снаружи ТТК'}</td></tr>
                <tr><td>Доступность рельсового каркаса</td><td>-</td><td>${this.input.metroDistance} м (${k1Label})</td></tr>
                <tr><td>Коэффициент пешей доступности рельсового каркаса по табл. Приложения 5</td><td>К1</td><td>${k1}</td></tr>
                <tr><td>Уточняющий коэффициент деловой активности территории города Москвы для расчета числа мест приобъектной парковки по табл. Приложения 6</td><td>К2</td><td>${k2}</td></tr>
            </table>

            <h4>Расчета числа мест постоянного размещения транспортных средств жителей</h4>
            <table border="1" cellpadding="8">
                <tr><th>Наименование показателя</th><th>Обозначение</th><th>Значение</th></tr>
                <tr><td>Показатели расчета населения по типам жилой застройки</td><td>S1</td><td>33</td></tr>
                <tr><td>Целевой показатель уровня автомобилизации города Москвы — 257 транспортных средств на 1 000 жителей по Приложению 5</td><td>А</td><td>0,257</td></tr>
                <tr><td>Nп = (S/S1) × A × К1 = (${this.input.areaFlats} / 33) x 0,257 x ${k1}</td><td>Nп</td><td>${this.results.Np} (шт.)</td></tr>
                <tr><td>Nп-10% = Nп х 90% = ${this.results.Np} х 90%</td><td>-</td><td>${this.results.Np_minus_10} (шт.)</td></tr>
                <tr><td>Nп+10% = Nп х 110% = ${this.results.Np} х 110%</td><td>-</td><td>${this.results.Np_plus_10} (шт.)</td></tr>
            </table>

            <h4>Расчет числа мест гостевой парковки (допустимо отклонение 10%)</h4>
            <table border="1" cellpadding="8">
                <tr><th>Наименование показателя</th><th>Обозначение</th><th>Значение</th></tr>
                <tr><td>Nг = Nп х 10% = ${this.results.Np} х 10%</td><td>Nг</td><td>${this.results.Ng} (шт.)</td></tr>
                <tr><td>Nг-10% = Nг х 90% = ${this.results.Ng} х 90%</td><td>-</td><td>${this.results.Ng_minus_10} (шт.)</td></tr>
                <tr><td>Nг+10% = Nг х 110% = ${this.results.Ng} х 110%</td><td>-</td><td>${this.results.Ng_plus_10} (шт.)</td></tr>
            </table>

            <h4>Расчет числа мест приобъектной парковки встроенно-пристроенных коммерческих помещений (допустимо отклонение ±30%)</h4>
            <table border="1" cellpadding="8">
                <tr><th>Наименование показателя</th><th>Обозначение</th><th>Значение</th></tr>
                <tr><td>Расчетный показатель на одно парковочное место и машино-место в соответствии с примечанием 1 к Приложению 6, кв.м</td><td>X2</td><td>90</td></tr>
                <tr><td>Nв = X / Х2 x K1 x K2 = (${this.input.areaNNP} / 90) x ${k1} x ${k2}</td><td>Nв</td><td>${this.results.Nv} (шт.)</td></tr>
                <tr><td>Nв-30% = Nв х 70% = ${this.results.Nv} х 70%</td><td>-</td><td>${this.results.Nv_minus_30} (шт.)</td></tr>
                <tr><td>Nв+30% = Nв х 130% = ${this.results.Nv} х 130%</td><td>-</td><td>${this.results.Nv_plus_30} (шт.)</td></tr>
            </table>

            <h4>Расчет числа мест остановки (размер одного места не менее 6,0 х 3,6 метра или 2,5 х 6,5 метра в случае расположения вдоль проезжей части)</h4>
            <table border="1" cellpadding="8">
                <tr><th>Функциональное назначение объекта</th><th>Показатель S1</th><th>Значение S1</th><th>Количество мест</th></tr>
                <tr><td>Жилое назначение</td><td>кв.м на одно место остановки</td><td>22100</td><td>${this.results.Nk_residential} (шт.)</td></tr>
                <tr><td>Встроенно-пристроенные помещения коммерческого использования на первых этажах</td><td>кв.м на одно место остановки</td><td>450</td><td>${this.results.Nk_commercial} (шт.) ${this.input.areaNNP && this.input.areaNNP < 450 ? '- при площади коммерции менее 450 кв.м места остановки можно не предусматривать' : '- не далее 150 метров от входной группы (требуется не менее 1м/м и не более 4 м/м)'}</td></tr>
                <tr><td colspan="3">Всего требуется: Nк = (${this.results.Nk_residential} + ${this.results.Nk_commercial})</td><td><strong>${this.results.Nk_residential + this.results.Nk_commercial} (шт.)</strong></td></tr>
            </table>

            <h4>Итого, по расчёту</h4>
            <table border="1" cellpadding="8">
                <tr><th>№</th><th>Наименование показателя</th><th>Обозначение</th><th>Значение</th></tr>
                <tr><td>1.</td><td>% электромобилей (по году РНС)</td><td>%</td><td>${(ev_share * 100).toFixed(0)}</td></tr>
                <tr><td>2.</td><td>Всего требуется разместить стоянок и остановок (из которых ${(ev_share * 100).toFixed(0)}% - машиноместа с зарядными станциями для электромобилей, включая инфраструктуру для установки зарядного устройства)</td><td>N</td><td>${this.results.N_total} - всего; (${this.results.N_ev} - для электромобилей)</td></tr>
                <tr><td>3.</td><td>Всего требуется разместить стоянок и остановок с учётом отклонений в меньшую сторону без прохождения ГЗК (из которых ${(ev_share * 100).toFixed(0)}% - машиноместа с зарядными станциями для электромобилей, включая инфраструктуру для установки зарядного устройства)</td><td>N (допустимое отклонение)</td><td>${this.results.N_min} - всего; (${this.results.N_ev_min} - для электромобилей)</td></tr>
                <tr><td>4.</td><td>Всего требуется разместить стоянок и остановок с учётом отклонений в большую сторону без прохождения ГЗК (из которых ${(ev_share * 100).toFixed(0)}% - машиноместа с зарядными станциями для электромобилей, включая инфраструктуру для установки зарядного устройства)</td><td>N (допустимое отклонение)</td><td>${this.results.N_max} - всего; (${this.results.N_ev_max} - для электромобилей)</td></tr>
                <tr><td>5.</td><td>Площадь подземной автостоянки при обеспеченности ${sqmPerPlace} кв.м/м.м (минимальная площадь, требуется подтверждение АР)</td><td>S_стоянки</td><td>${this.results.parking_area_required}</td></tr>
                <tr><td>6.</td><td>То же, в два уровня</td><td>S_стоянки_2ур.</td><td>${this.results.parking_area_2level}</td></tr>
            </table>

            <h4>Расчет числа мест остановки для школы и детского сада:</h4>
            <table border="1" cellpadding="8">
                <tr><th>Функциональное назначение объекта</th><th>Расчетный показатель (кол-во учащихся)</th><th>Показатель S1 (чел.)</th><th>Количество мест</th></tr>
                <tr><td>Общеобразовательные организации</td><td>X2</td><td>300</td><td>${this.results.Nk_school || '-'} (шт.)</td></tr>
                <tr><td>Дошкольные образовательные организации</td><td>X2</td><td>30</td><td>${this.results.Nk_preschool || '-'} (шт.)</td></tr>
            </table>
        `;
        return report;
    }
}

if (typeof window !== 'undefined') {
    window.ParkingCalculator = ParkingCalculator;
    window.parkingData = parkingData;
}
