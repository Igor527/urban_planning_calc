/**
 * BlagoCalculator - расчёты благоустройства по СП 476 и Постановлению 2152-ПП
 * на основе Расположение ЖКХ г.Москвы от 29 сентября 2021 года N 01-01-14-194/21
 */

class BlagoCalculator {
    constructor(input = {}) {
        this.input = input;
        this.results = {};
        this.calculations = [];
    }

    /**
     * Нормативы накопления ТКО по категориям объектов
     * Источник: Расположение ЖКХ г.Москвы N 01-01-14-194/21
     */
    getTKONorms() {
        return {
            // I. Административные здания
            1: { name: 'Научно-исследовательские, проектные институты', unit: '1 сотрудник', norm: 1.129 },
            2: { name: 'Банки и финансовые учреждения', unit: '1 сотрудник', norm: 0.984 },
            3: { name: 'Отделения связи', unit: '1 сотрудник', norm: 4.826 },
            4: { name: 'Административные, офисные учреждения', unit: '1 сотрудник', norm: 1.252 },
            
            // II. Предприятия торговли
            5: { name: 'Продовольственные магазины', unit: '1 кв.м площади', norm: 0.41 },
            6: { name: 'Промтоварные магазины', unit: '1 кв.м площади', norm: 0.24 },
            7: { name: 'Павильоны', unit: '1 кв.м площади', norm: 0.676 },
            8: { name: 'Палатки, киоски', unit: '1 кв.м площади', norm: 0.82 },
            9: { name: 'Супермаркеты', unit: '1 кв.м площади', norm: 0.19 },
            10: { name: 'Рынки продовольственные', unit: '1 кв.м площади', norm: 0.335 },
            11: { name: 'Рынки промтоварные', unit: '1 кв.м площади', norm: 0.034 },
            
            // III. Предприятия транспортной инфраструктуры
            12: { name: 'Автомастерские, станции ТО', unit: '1 машино-место', norm: 1.972 },
            13: { name: 'Автозаправочные станции', unit: '1 пост', norm: 7.433 },
            14: { name: 'Автостоянки и парковки', unit: '1 машино-место', norm: 0.444 },
            15: { name: 'Гаражи, парковки закрытого типа', unit: '1 машино-место', norm: 0.27 },
            16: { name: 'Автомойки', unit: '1 машино-место', norm: 4.499 },
            17: { name: 'Железнодорожные и автовокзалы', unit: '1 пассажир', norm: 0.044 },
            
            // IV. Дошкольные и учебные учреждения
            18: { name: 'Дошкольные образовательные учреждения', unit: '1 место', norm: 0.342 },
            19: { name: 'Общеобразовательные учреждения', unit: '1 место', norm: 0.071 },
            20: { name: 'Высшие учебные заведения', unit: '1 место', norm: 0.101 },
            21: { name: 'Образовательные учреждения доп. образования', unit: '1 место', norm: 0.666 },
            22: { name: 'Детские дома, школы-интернаты', unit: '1 место', norm: 0.094 },
            
            // V. Культурно-развлекательные учреждения
            23: { name: 'Клубы, кинотеатры, театры, цирки', unit: '1 место', norm: 0.382 },
            24: { name: 'Библиотеки, архивы', unit: '1 место', norm: 0.06 },
            25: { name: 'Выставочные залы, музеи', unit: '1 кв.м площади', norm: 0.018 },
            26: { name: 'Спортивные арены, стадионы', unit: '1 место', norm: 0.072 },
            27: { name: 'Спортивные клубы, центры', unit: '1 место', norm: 0.118 },
            28: { name: 'Зоопарки, ботанические сады', unit: '1 кв.м площади', norm: 0.068 },
            29: { name: 'Пансионаты, дома отдыха', unit: '1 место', norm: 0.145 },
            
            // VI. Предприятия общественного питания
            30: { name: 'Кафе, рестораны, бары, столовые', unit: '1 место', norm: 0.73 },
            
            // VII. Предприятия службы быта
            31: { name: 'Мастерские по ремонту бытовой техники', unit: '1 кв.м площади', norm: 0.099 },
            32: { name: 'Мастерские по ремонту обуви, ключей', unit: '1 кв.м площади', norm: 0.206 },
            33: { name: 'Мастерские по ремонту одежды', unit: '1 кв.м площади', norm: 0.359 },
            34: { name: 'Химчистки и прачечные', unit: '1 кв.м площади', norm: 0.239 },
            35: { name: 'Парикмахерские, салоны красоты', unit: '1 место', norm: 1.798 },
            36: { name: 'Гостиницы', unit: '1 место', norm: 0.924 },
            37: { name: 'Общежития', unit: '1 место', norm: 0.033 },
            38: { name: 'Бани, сауны', unit: '1 место', norm: 0.942 },
            
            // VIII. Предприятия похоронных услуг
            39: { name: 'Кладбища', unit: '1 кв.м площади', norm: 0.031 },
            40: { name: 'Крематории', unit: '1 кв.м площади', norm: 0.01 },
            41: { name: 'Организации ритуальных услуг', unit: '1 кв.м площади', norm: 1.373 },
            
            // IX. Садоводческие кооперативы
            42: { name: 'Садоводческие кооперативы', unit: '1 участник', norm: 0.583 },
            43: { name: 'Предприятия иных отраслей', unit: '1 сотрудник', norm: 0.397 },
            
            // X. Домовладения
            44: { name: 'Жилые помещения в многоквартирных домах', unit: '1 кв.м площади', norm: 0.104 }
        };
    }

    /**
     * Расчёт числа жителей по площади квартир
     * Жители = ROUNDUP(S / 28)
     */
    calculatePopulation() {
        const S = this.input.areaFlats || 0;
        const S1_population = 28; // кв.м/чел
        const population = Math.ceil(S / S1_population);
        
        this.results.population = population;
        this.calculations.push({
            id: 'population',
            name: 'Численность жителей',
            formula: 'Население = ROUNDUP(S / 28)',
            unit: 'чел.',
            calculation: `ROUNDUP(${S} / 28)`,
            result: population
        });
        
        return population;
    }

    /**
     * Расчёт числа сотрудников НПКИ
     * Сотрудники НПКИ = ROUNDUP(НПКИ / 20)
     */
    calculateNPKIStaff() {
        const NPKI = this.input.areaNPKI || 0;
        const S1_npki = 20; // кв.м/чел
        const staff = Math.ceil(NPKI / S1_npki);
        
        this.results.npki_staff = staff;
        this.calculations.push({
            id: 'npki_staff',
            name: 'Численность сотрудников НПКИ',
            formula: 'Сотрудники = ROUNDUP(НПКИ / 20)',
            unit: 'чел.',
            calculation: `ROUNDUP(${NPKI} / 20)`,
            result: staff
        });
        
        return staff;
    }

    /**
     * Расчёт объёма ТКО по категориям
     */
    calculateTKO() {
        const norms = this.getTKONorms();
        let totalYearlyVolume = 0;
        const volumes = {};
        
        // Стандартные показатели из входных данных
        const categoryValues = {
            4: this.results.npki_staff || 0,   // Административные офисные учреждения - сотрудники НПКИ
            14: this.input.parkinPlaces || 0,  // Автостоянки - плоскостные парковки
            15: this.input.parkingPermaPlaces || 0, // Гаражи - постоянные стоянки
            44: this.input.areaFlats || 0      // Жилые помещения - площадь квартир
        };
        
        // Рассчитаем объёмы для всех категорий
        for (const [categoryId, norm] of Object.entries(norms)) {
            const value = categoryValues[categoryId] || 0;
            const volume = value > 0 ? value * norm.norm : 0;
            volumes[categoryId] = {
                name: norm.name,
                unit: norm.unit,
                norm: norm.norm,
                quantity: value,
                yearlyVolume: volume
            };
            totalYearlyVolume += volume;
        }
        
        // Ежедневный объём
        const dailyVolume = totalYearlyVolume / 365;
        
        // Число контейнеров
        const containerCapacity = this.input.containerCapacity || 1.1;
        const numberOfContainers = Math.ceil(totalYearlyVolume / containerCapacity);
        
        this.results.tko_volumes = volumes;
        this.results.tko_yearly = totalYearlyVolume;
        this.results.tko_daily = dailyVolume;
        this.results.containers_count = numberOfContainers;
        
        this.calculations.push({
            id: 'tko_total',
            name: 'Общий объём ТКО в год',
            formula: 'ТКО_год = сумма всех категорий × нормативы',
            unit: 'куб.м',
            calculation: `${totalYearlyVolume.toFixed(2)}`,
            result: Math.round(totalYearlyVolume * 100) / 100
        });
        
        this.calculations.push({
            id: 'tko_daily',
            name: 'Ежедневный объём ТКО',
            formula: 'ТКО_день = ТКО_год / 365',
            unit: 'куб.м',
            calculation: `${totalYearlyVolume.toFixed(2)} / 365`,
            result: Math.round(dailyVolume * 1000) / 1000
        });
        
        this.calculations.push({
            id: 'containers',
            name: 'Число контейнеров вместимостью 1,1 куб.м',
            formula: 'Контейнеры = ROUNDUP(ТКО_год / вместимость)',
            unit: 'шт.',
            calculation: `ROUNDUP(${totalYearlyVolume.toFixed(2)} / ${containerCapacity})`,
            result: numberOfContainers
        });
        
        return {
            yearly: totalYearlyVolume,
            daily: dailyVolume,
            containers: numberOfContainers
        };
    }

    /**
     * Расчёты придомовой территории по СП 476
     */
    calculateLandscapingSP476() {
        const population = this.results.population || this.calculatePopulation();
        const plotArea = this.input.plotArea || 0;
        
        // Нормативы по СП 476
        const norms_sp476 = {
            childPlayground: 0.4,      // кв.м/чел
            adultRest: 0.1,            // кв.м/чел
            greenArea: 3               // кв.м/чел
        };
        
        const childPlaygroundArea = Math.ceil(population * norms_sp476.childPlayground);
        const adultRestArea = Math.ceil(population * norms_sp476.adultRest);
        const greenArea = Math.ceil(population * norms_sp476.greenArea);
        
        this.results.sp476 = {
            childPlayground: childPlaygroundArea,
            adultRest: adultRestArea,
            greenArea: greenArea
        };
        
        this.calculations.push({
            id: 'sp476_child',
            name: 'Детские площадки (СП 476)',
            formula: 'S = население × 0.4 кв.м/чел',
            unit: 'кв.м',
            calculation: `${population} × 0.4`,
            result: childPlaygroundArea
        });
        
        this.calculations.push({
            id: 'sp476_adult',
            name: 'Площадки отдыха взрослых (СП 476)',
            formula: 'S = население × 0.1 кв.м/чел',
            unit: 'кв.м',
            calculation: `${population} × 0.1`,
            result: adultRestArea
        });
        
        this.calculations.push({
            id: 'sp476_green',
            name: 'Озелененные территории (СП 476)',
            formula: 'S = население × 3 кв.м/чел',
            unit: 'кв.м',
            calculation: `${population} × 3`,
            result: greenArea
        });
        
        return this.results.sp476;
    }

    /**
     * Расчёты элементов благоустройства для жилого микрорайона (СП 476)
     */
    calculateMicroDistrictAmenities() {
        const population = this.results.population || this.calculatePopulation();
        const plotArea = this.input.plotArea || 0;
        
        const amenities = {
            childPlayground: Math.ceil(population * 0.4),
            sportArea: Math.ceil(population * 0.5),
            adultRestArea: Math.ceil(population * 0.1),
            utilityArea: Math.ceil(population * 0.03),
            dogWalkArea: '400-600'  // диапазон
        };
        
        const greenArea25percent = Math.ceil(plotArea * 0.25);
        
        this.results.microDistrict = amenities;
        this.results.greenArea25percent = greenArea25percent;
        
        this.calculations.push({
            id: 'micro_child',
            name: 'Детские игровые площадки (микрорайон)',
            formula: 'S = население × 0.4 кв.м/чел',
            unit: 'кв.м',
            calculation: `${population} × 0.4`,
            result: amenities.childPlayground
        });
        
        this.calculations.push({
            id: 'micro_sport',
            name: 'Площадки для занятий физкультурой',
            formula: 'S = население × 0.5 кв.м/чел',
            unit: 'кв.м',
            calculation: `${population} × 0.5`,
            result: amenities.sportArea
        });
        
        this.calculations.push({
            id: 'micro_green25',
            name: 'Озелененная территория (25% участка)',
            formula: 'S = площадь участка × 25%',
            unit: 'кв.м',
            calculation: `${plotArea} × 0.25`,
            result: greenArea25percent
        });
        
        return this.results.microDistrict;
    }

    /**
     * Расчёты по Постановлению 2152-ПП
     */
    calculateLandscaping2152PP() {
        const S_flats = this.input.areaFlats || 0;
        const population = Math.ceil(S_flats / 33); // из постановления
        
        const childPlayground = Math.ceil(population * 0.5);
        const adultRest = Math.ceil(population * 0.1);
        const greenArea = Math.ceil(population * 5);
        const commonGreenArea = Math.ceil(population * 0.7);
        
        this.results.pp2152 = {
            childPlayground: childPlayground,
            adultRest: adultRest,
            greenArea: greenArea,
            commonGreenArea: commonGreenArea
        };
        
        this.calculations.push({
            id: 'pp2152_child',
            name: 'Детские площадки (Пост. 2152-ПП)',
            formula: 'S = población × 0.5 кв.м/чел (densidade ROUNDUP(S/33))',
            unit: 'кв.м',
            calculation: `${population} × 0.5`,
            result: childPlayground
        });
        
        this.calculations.push({
            id: 'pp2152_adult',
            name: 'Площадки отдыха взрослых (Пост. 2152-ПП)',
            formula: 'S = население × 0.1 кв.м/чел',
            unit: 'кв.м',
            calculation: `${population} × 0.1`,
            result: adultRest
        });
        
        this.calculations.push({
            id: 'pp2152_green',
            name: 'Озелененные территории ЖК (Пост. 2152-ПП)',
            formula: 'S = население × 5 кв.м/чел',
            unit: 'кв.м',
            calculation: `${population} × 5`,
            result: greenArea
        });
        
        return this.results.pp2152;
    }

    /**
     * Главная функция расчёта всех показателей благоустройства
     */
    calculate(inputData) {
        this.input = inputData || this.input;
        this.results = {};
        this.calculations = [];
        
        console.log("📊 === НАЧАЛО РАСЧЁТОВ БЛАГОУСТРОЙСТВА ===");
        
        // Основные показатели
        this.calculatePopulation();
        this.calculateNPKIStaff();
        
        // ТКО
        this.calculateTKO();
        
        // Придомовая территория
        this.calculateLandscapingSP476();
        this.calculateMicroDistrictAmenities();
        this.calculateLandscaping2152PP();
        
        console.log("📊 === КОНЕЦ РАСЧЁТОВ БЛАГОУСТРОЙСТВА ===");
        
        return this.results;
    }

    /**
     * Получить форматированный отчёт
     */
    getFormattedReport() {
        let report = "📋 ОТЧЁТ О РАСЧЁТЕ БЛАГОУСТРОЙСТВА\n";
        report += "====================================\n\n";
        
        for (const calc of this.calculations) {
            if (calc.formula) {
                report += `${calc.name}\n`;
                report += `Формула: ${calc.formula}\n`;
                report += `Расчёт: ${calc.calculation}\n`;
                report += `Результат: ${calc.result} ${calc.unit}\n`;
                report += "\n";
            }
        }
        
        return report;
    }

    /**
     * Получить все результаты в структурированном виде
     */
    getSummary() {
        return {
            population: this.results.population || 0,
            npki_staff: this.results.npki_staff || 0,
            tko: {
                yearly: Math.round(this.results.tko_yearly * 100) / 100,
                daily: Math.round(this.results.tko_daily * 1000) / 1000,
                containers: this.results.containers_count || 0
            },
            sp476: this.results.sp476 || {},
            microDistrict: this.results.microDistrict || {},
            greenArea25percent: this.results.greenArea25percent || 0,
            pp2152: this.results.pp2152 || {}
        };
    }
}

// Экспорт для использования в HTML
if (typeof window !== 'undefined') {
    window.BlagoCalculator = BlagoCalculator;
}
