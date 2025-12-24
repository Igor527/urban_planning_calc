/**
 * mainEngine.js
 * Основной расчётный движок для определения количества машиномест
 * согласно №945-ПП от 23.12.2015 с изменениями на 17 ноября 2025 года
 * 
 * Входные данные: площади, коэффициенты, район, год РНС
 * Выходные данные: Nп, Nг, Nв, Nк, итоговые расчёты с разбивкой по типам
 * 
 * ОЖИДАЕМЫЕ ВХОДНЫЕ ПАРАМЕТРЫ (inputData):
 * - areaFlats          : Суммарная площадь квартир
 * - areaNNP            : Нежилая наземная площадь
 * - districtName       : Название района (для определения K2)
 * - ttkStatus          : Расположение относительно ТТК ('inside'/'outside')
 * - metroDistance      : Расстояние до станции метро (м) (для определения K1)
 * - rnsYear            : Год выдачи РНС (влияет на % электромобилей)
 * 
 * ФАКТИЧЕСКИ РАЗМЕЩЕННЫЕ МЕСТА (inputData):
 * - fact_zu_mo         : Места остановки (на участке)
 * - fact_zu_guest_mgn  : Гостевые МГН (на участке)
 * - fact_zu_priob_mgn  : Приобъектные МГН (на участке)
 * - fact_uds_mo        : Места остановки (на УДС)
 * - fact_uds_guest     : Гостевые (на УДС)
 * - fact_uds_guest_mgn : Гостевые МГН (на УДС)
 * - fact_uds_priob     : Приобъектные (на УДС)
 * - fact_uds_priob_mgn : Приобъектные МГН (на УДС)
 */

class ParkingCalculator {
        /**
         * Получить отклонения по расчётам (разница между требуемым и фактическим, min/max)
         */
        getDeviations() {
            const res = this.results || {};
            const deviations = [];
            if (typeof res.N_required === 'number' && typeof res.factualPlaces === 'number') {
                deviations.push({
                    name: 'Отклонение от требуемого',
                    formula: 'Δ = фактическое - требуемое',
                    value: res.factualPlaces - res.N_required,
                    unit: 'м/м'
                });
            }
            if (typeof res.N_min === 'number' && typeof res.factualPlaces === 'number') {
                deviations.push({
                    name: 'Отклонение от минимума',
                    formula: 'Δ = фактическое - min',
                    value: res.factualPlaces - res.N_min,
                    unit: 'м/м'
                });
            }
            if (typeof res.N_max === 'number' && typeof res.factualPlaces === 'number') {
                deviations.push({
                    name: 'Отклонение от максимума',
                    formula: 'Δ = фактическое - max',
                    value: res.factualPlaces - res.N_max,
                    unit: 'м/м'
                });
            }
            return deviations;
        }
    /**
     * Инициализация калькулятора с входными параметрами
     * @param {Object} inputData - объект с входными параметрами
     */
    constructor(inputData = {}) {
        this.input = inputData;
        this.results = {}; // Объект для хранения результатов расчётов
        this.calculations = []; // Массив всех расчётов (для отчёта)
        
        console.log("🔧 ParkingCalculator инициализирован");
    }

    /**
     * Получить коэффициент K2 по названию района
     * @param {string} districtName - название района
     * @returns {Object} {k2_inside, k2_outside}
     */
    getDistrictCoefficients(districtName) {
        if (!window.parkingData || !window.parkingData.districts) {
            console.error("❌ parkingData.districts не доступен");
            return null;
        }
        
        const district = window.parkingData.districts[districtName];
        if (!district) {
            console.warn(`⚠ Район "${districtName}" не найден в базе`);
            return null;
        }
        
        return {
            k2_inside: district[0],
            k2_outside: district[1]
        };
    }

    /**
     * Получить % электромобилей по году РНС
     * @param {string|number} year - год
     * @returns {number} доля электромобилей (0.05, 0.10, 0.15 и т.д.)
     */
    getEVShare(year) {
        if (!window.parkingData || !window.parkingData.ev_share) {
            console.error("❌ parkingData.ev_share не доступен");
            return 0;
        }
        
        const yearNum = Number(year);
        
        // Если год больше 2027, используем значение для 2027 (максимальное известное)
        if (yearNum >= 2027) {
            return window.parkingData.ev_share["2027"] || 0.15;
        }
        
        return window.parkingData.ev_share[String(year)] || 0;
    }

    /**
     * Расчёт Nп (места постоянного размещения жителей)
     * Nп = (S_жилья / S1) × A × K1 × K2
     * где:
     *   S_жилья - суммарная площадь квартир
     *   S1 - удельное жилое обеспечение (28 кв.м/чел по умолчанию)
     *   A - целевой показатель автомобилизации (257 на 1000 жителей = 0.257)
     *   K1 - коэффициент пешей доступности рельсового каркаса
     *   K2 - коэффициент деловой активности территории
     */    calculateMGNPlaces(totalPlaces) {
        let enlarged = 0;
        
        if (totalPlaces <= 100) {
            enlarged = Math.ceil(totalPlaces * 0.05);
        } else if (totalPlaces <= 200) {
            enlarged = 5 + Math.ceil((totalPlaces - 100) * 0.03);
        } else if (totalPlaces <= 500) {
            enlarged = 8 + Math.ceil((totalPlaces - 200) * 0.02);
        } else {
            enlarged = 14 + Math.ceil((totalPlaces - 500) * 0.01);
        }
        
        // Всего МГН = 10% + увеличенные
        const total_mgn = Math.ceil(totalPlaces * 0.1);
        const regular_mgn = total_mgn - enlarged;
        
        return {
            total: total_mgn,
            enlarged: enlarged,
            regular: Math.max(0, regular_mgn),
            formula_input: totalPlaces
        };
    }

    /**
     * Расчёт Nп (места постоянного размещения жилецов)
     * Nп = (S_жилья / S1) × A × K1
     * где:
     *   S_жилья - суммарная площадь квартир
     *   S1 - удельное жилое обеспечение (33 кв.м/чел по умолчанию)
     *   A - целевой показатель автомобилизации (257 на 1000 жителей = 0.257)
     *   K1 - коэффициент пешей доступности рельсового каркаса
     *   K2 - НЕ применяется к Nп! (только к Nв и Nк_коммерция)
     */    calculateNp() {
        const S = this.input.areaFlats || 0; // площадь квартир
        const S1 = 33; // удельное жилое обеспечение (кв.м/чел) по умолчанию
        const A = 0.257; // целевой показатель автомобилизации на 1000 жителей
        const K1 = this.input.k1 || 1;
        // K2 НЕ применяется к Nп!
        
        const Np = (S / S1) * A * K1;
        const Np_rounded = Math.ceil(Np); // округление в большую сторону
        
        const record = {
            id: 'Np',
            name: 'Nп - Число мест постоянного размещения жилецов',
            formula: 'Nп = (areaFlats / S1) × A × K1',
            unit: 'шт.',
            calculation: `(${S} / ${S1}) × ${A} × ${K1}`,
            result: Np_rounded,
            exact_value: Np.toFixed(2)
        };
        
        this.results.Np = Np_rounded;
        this.calculations.push(record);
        
        console.log(`✅ Nп = ${Np_rounded} шт.`);
        return Np_rounded;
    }

    /**
     * Расчёт Nп с отклонениями (±10%)
     */
    calculateNpVariations() {
        const Np = this.results.Np;
        
        const Np_minus = Math.ceil(Np * 0.9);
        const Np_plus = Math.ceil(Np * 1.1);
        
        this.results.Np_minus_10 = Np_minus;
        this.results.Np_plus_10 = Np_plus;
        
        this.calculations.push({
            id: 'Np_variations',
            name: 'Nп с допустимыми отклонениями ±10%',
            unit: 'шт.',
            min_value: Np_minus,
            max_value: Np_plus,
            calculation: `Nп_min = ${Np} × 90% = ${Np_minus}; Nп_max = ${Np} × 110% = ${Np_plus}`
        });
        
        return { Np_minus, Np_plus };
    }

    /**
     * Расчёт Nг (места гостевой парковки)
     * Nг = Nп × 10%
     */
    calculateNg() {
        const Np = this.results.Np;
        if (!Np) {
            console.warn("⚠ Сначала вычислите Nп");
            return null;
        }
        
        const Ng = Math.ceil(Np * 0.1);
        
        const record = {
            id: 'Ng',
            name: 'Nг - Число мест гостевой парковки',
            formula: 'Nг = Nп × 10%',
            unit: 'шт.',
            calculation: `${Np} × 10%`,
            result: Ng
        };
        
        this.results.Ng = Ng;
        this.calculations.push(record);
        
        console.log(`✅ Nг = ${Ng} шт.`);
        return Ng;
    }

    /**
     * Расчёт Nв (места приобъектной парковки для коммерческих помещений)
     * Nв = X / X2 × K1 × K2
     * где:
     *   X - площадь ННП (нежилая наземная площадь)
     *   X2 - расчётный показатель на одно м/м (90 кв.м по умолчанию)
     *   K1, K2 - коэффициенты
     */
    calculateNv() {
        const X = this.input.areaNNP || 0; // нежилая наземная площадь
        const X2 = 90; // расчётный показатель на одно м/м
        const K1 = this.input.k1 || 1;
        const K2 = this.input.k2 || 0.9;
        
        if (X === 0) {
            this.results.Nv = 0;
            return 0;
        }
        
        const Nv = (X / X2) * K1 * K2;
        const Nv_rounded = Math.ceil(Nv);
        
        const record = {
            id: 'Nv',
            name: 'Nв - Число мест приобъектной парковки (коммерческие помещения)',
            formula: 'Nв = areaNNP / X2 × K1 × K2',
            unit: 'шт.',
            calculation: `(${X} / ${X2}) × ${K1} × ${K2}`,
            result: Nv_rounded,
            exact_value: Nv.toFixed(2)
        };
        
        this.results.Nv = Nv_rounded;
        this.calculations.push(record);
        
        console.log(`✅ Nв = ${Nv_rounded} шт.`);
        return Nv_rounded;
    }

    /**
     * Расчёт Nв с отклонениями (±30%)
     */
    calculateNvVariations() {
        const Nv = this.results.Nv;
        
        const Nv_minus = Math.ceil(Nv * 0.7);
        const Nv_plus = Math.ceil(Nv * 1.3);
        
        this.results.Nv_minus_30 = Nv_minus;
        this.results.Nv_plus_30 = Nv_plus;
        
        this.calculations.push({
            id: 'Nv_variations',
            name: 'Nв с допустимыми отклонениями ±30%',
            unit: 'шт.',
            min_value: Nv_minus,
            max_value: Nv_plus,
            calculation: `Nв_min = ${Nv} × 70% = ${Nv_minus}; Nв_max = ${Nv} × 130% = ${Nv_plus}`
        });
        
        return { Nv_minus, Nv_plus };
    }

    /**
     * Расчёт Nк (места остановки для жилого назначения)
     * Nк_жилье = ROUNDUP(S / S1)
     * БЕЗ ограничений - по точной формуле Excel
     */
    calculateNk_residential() {
        const S = this.input.areaFlats || 0;
        const S1 = 22100; // по Приложению 8 для жилья
        
        if (S === 0) {
            this.results.Nk_residential = 0;
            return 0;
        }
        
        const Nk = (S / S1);
        const Nk_rounded = Math.ceil(Nk);
        
        const record = {
            id: 'Nk_residential',
            name: 'Nк_жилье - Число мест остановки (жилое назначение)',
            formula: 'Nк = ROUNDUP(areaFlats / S1)',
            unit: 'шт.',
            calculation: `ROUNDUP(${S} / ${S1})`,
            result: Nk_rounded,
            exact_value: Nk.toFixed(2)
        };
        
        this.results.Nk_residential = Nk_rounded;
        this.calculations.push(record);
        
        console.log(`✅ Nк (жилье) = ${Nk_rounded} шт.`);
        return Nk_rounded;
    }

    /**
     * Расчёт Nк (места остановки для коммерческих помещений)
     * Nк_коммерция = IF(ROUNDUP(X/S1) > 4; 4; ROUNDUP(X/S1))
     * Ограничение: не более 4 м/м (не далее 150м от входной группы)
     * Формула Excel: =IF(ROUNDUP(D11/D40;0)>4;4;ROUNDUP(D11/D40;0))
     */
    calculateNk_commercial() {
        const X = this.input.areaNNP || 0;
        const S1 = 450; // по Приложению 8 для встроенно-пристроенной коммерции
        
        if (X === 0) {
            this.results.Nk_commercial = 0;
            return 0;
        }
        
        const Nk = (X / S1);
        const Nk_rounded = Math.ceil(Nk);
        // Ограничение ТОЛЬКО сверху: максимум 4 места
        const Nk_limited = Math.min(4, Nk_rounded);
        
        const record = {
            id: 'Nk_commercial',
            name: 'Nк_коммерция - Число мест остановки (встроенно-пристроенные помещения)',
            formula: 'Nк = IF(ROUNDUP(areaNNP/S1) > 4; 4; ROUNDUP(areaNNP/S1))',
            notes: 'Не более 4 м/м (не далее 150м от входной группы)',
            unit: 'шт.',
            calculation: `ROUNDUP(${X} / ${S1}) = ${Nk_rounded} → максимум 4 → ${Nk_limited}`,
            result: Nk_limited,
            exact_value: Nk.toFixed(2),
            calculated: Nk_rounded,
            after_limit: Nk_limited
        };
        
        this.results.Nk_commercial = Nk_limited;
        this.calculations.push(record);
        
        console.log(`✅ Nк (коммерция) = ${Nk_limited} шт. (расчётное ${Nk_rounded}, максимум 4)`);
        return Nk_limited;
    }

    /**
     * Расчёт общего числа мест (Nо - места остановки)
     */
    calculateNo_total() {
        const Nk_res = this.results.Nk_residential || 0;
        const Nk_com = this.results.Nk_commercial || 0;
        const No_total = Nk_res + Nk_com;
        
        this.results.No_total = No_total;
        this.calculations.push({
            id: 'No_total',
            name: 'Nо (всего) - Всего мест остановки',
            formula: 'Nо = Nк_жилье + Nк_коммерция',
            unit: 'шт.',
            calculation: `${Nk_res} + ${Nk_com}`,
            result: No_total
        });
        
        console.log(`✅ Nо (всего) = ${No_total} шт.`);
        return No_total;
    }

    /**
     * Расчёт итогового числа требуемых м/м и м/о
     * N_всего = Nп + Nг + Nв + Nо (без учёта фактических мест F)
     * с учётом электромобилей (10% по году РНС)
     * Примечание: фактические места (F) вычитаются в calculateTotalVariations
     */
    calculateTotal() {
        const Np = this.results.Np || 0;
        const Ng = this.results.Ng || 0;
        const Nv = this.results.Nv || 0;
        const No = this.results.No_total || 0;
        
        const N_total = Np + Ng + Nv + No;
        const ev_share = this.getEVShare(this.input.rnsYear) || 0;
        
        // N_ev = сумма ЭМ из каждой категории
        const P2_ev = Math.ceil(Np * ev_share);  // ЭМ из постоянных
        const G2_ev = Math.ceil(Ng * ev_share);  // ЭМ из гостевых
        const V2_ev = Math.ceil(Nv * ev_share);  // ЭМ из приобъектных
        const N_ev = P2_ev + G2_ev + V2_ev;
        
        this.results.N_total = N_total;
        this.results.N_ev = N_ev;
        
        this.calculations.push({
            id: 'N_total',
            name: 'N - Всего требуется машиномест и мест остановки',
            formula: 'N = Nп + Nг + Nв + Nо',
            unit: 'шт.',
            calculation: `${Np} + ${Ng} + ${Nv} + ${No}`,
            result: N_total
        });
        
        this.calculations.push({
            id: 'N_ev',
            name: 'N_ЭМ - Из них для электромобилей (по году РНС)',
            formula: `N_ЭМ = П2 + Г2 + В2 = (Nп×${(ev_share * 100).toFixed(0)}%) + (Nг×${(ev_share * 100).toFixed(0)}%) + (Nв×${(ev_share * 100).toFixed(0)}%)`,
            unit: 'шт.',
            calculation: `${P2_ev} + ${G2_ev} + ${V2_ev}`,
            result: N_ev
        });
        
        console.log(`✅ N (всего) = ${N_total} шт. (в том числе ${N_ev} шт. для электромобилей)`);
        return { N_total, N_ev };
    }

    /**
     * Расчёт итоговых вариантов с отклонениями И вычетом фактических мест
     * N_требуется = (Nп) + (Nг) + (Nв) + Nо - F_фактических
     * N_min = (Nп-10%) + (Nг-10%) + (Nв-30%) + Nо - F_фактических
     * N_max = (Nп+10%) + (Nг+10%) + (Nв+30%) + Nо - F_фактических
     * где F_фактических - уже размещённые места на УДС и участке
     */
    calculateTotalVariations() {
        const Np_min = this.results.Np_minus_10 || this.results.Np;
        const Np_max = this.results.Np_plus_10 || this.results.Np;
        const Ng_min = Math.ceil(Np_min * 0.1);
        const Ng_max = Math.ceil(Np_max * 0.1);
        const Nv_min = this.results.Nv_minus_30 || this.results.Nv;
        const Nv_max = this.results.Nv_plus_30 || this.results.Nv;
        const No = this.results.No_total || 0;
        
        // Сбор фактических мест из всех полей
        let F_actual = 0;
        const factFields = [
            'fact_zu_mo', 'fact_zu_guest_mgn', 'fact_zu_priob_mgn',
            'fact_uds_mo', 'fact_uds_guest', 'fact_uds_guest_mgn',
            'fact_uds_priob', 'fact_uds_priob_mgn'
        ];
        
        let hasDetailedFacts = false;
        for (const field of factFields) {
            if (this.input[field] !== undefined) {
                F_actual += Number(this.input[field]) || 0;
                hasDetailedFacts = true;
            }
        }
        
        // Если детальных полей нет, пробуем общее поле (обратная совместимость)
        if (!hasDetailedFacts && this.input.factualPlaces !== undefined) {
            F_actual = Number(this.input.factualPlaces) || 0;
        }
        
        const N_required = this.results.Np + this.results.Ng + this.results.Nv + No - F_actual;
        const N_min = Math.max(0, Np_min + Ng_min + Nv_min + No - F_actual);
        const N_max = Np_max + Ng_max + Nv_max + No - F_actual;
        
        const ev_share = this.getEVShare(this.input.rnsYear) || 0;
        
        // N_ev_required = как процент от N_required
        const N_ev_required = Math.ceil(N_required * ev_share);
        
        // N_ev_min = как процент от N_min
        const N_ev_min = Math.ceil(N_min * ev_share);
        
        // N_ev_max = как процент от N_max
        const N_ev_max = Math.ceil(N_max * ev_share);
        
        this.results.N_required = N_required;
        this.results.N_min = N_min;
        this.results.N_max = N_max;
        this.results.N_ev_required = N_ev_required;
        this.results.N_ev_min = N_ev_min;
        this.results.N_ev_max = N_ev_max;
        
        this.calculations.push({
            id: 'N_variations',
            name: 'N с допустимыми отклонениями',
            unit: 'шт.',
            required: { value: N_required, ev: N_ev_required },
            min: { value: N_min, ev: N_ev_min },
            max: { value: N_max, ev: N_ev_max }
        });
        
        console.log(`✅ N (требуется) = ${N_required} шт., N_min = ${N_min} шт., N_max = ${N_max} шт.`);
        return { N_required, N_min, N_max, N_ev_required, N_ev_min, N_ev_max };
    }

    /**
     * Расчёт разбивки по типам парковочных мест
     * ВАЖНО: значения уже включают вычет фактических мест (F)
     * Требуется разместить в подземной автостоянке: N = Nп + Nг + Nв + Nо - F
     * П1 - постоянные (без ЭМ) - не далее 1200м
     * П2 - постоянные (для ЭМ) - не далее 1200м
     * Г1 - гостевые (без МГН и ЭМ) - не далее 200м
     * Г2 - гостевые (для ЭМ) - не далее 200м
     * Г3 - гостевые (МГН) - не далее 100м по СП59
     * В1 - приобъектные (без МГН и ЭМ) - не далее 200м
     * В2 - приобъектные (для ЭМ) - не далее 200м
     * В3 - приобъектные (МГН) - не далее 50м по СП59
     * МО - места остановки - не далее 150м
     */
    calculateBreakdownByType(variant = 'required') {
        const ev_share = this.getEVShare(this.input.rnsYear) || 0;
        const mgn_share = 0.1; // 10% для МГН
        
        // Выбираем базовые значения в зависимости от варианта
        let Np, Ng, Nv;
        
        if (variant === 'min') {
            Np = this.results.Np_minus_10 || this.results.Np;
            Ng = Math.ceil(Np * 0.1);
            Nv = this.results.Nv_minus_30 || this.results.Nv;
        } else if (variant === 'max') {
            Np = this.results.Np_plus_10 || this.results.Np;
            Ng = Math.ceil(Np * 0.1);
            Nv = this.results.Nv_plus_30 || this.results.Nv;
        } else {
            Np = this.results.Np;
            Ng = this.results.Ng;
            Nv = this.results.Nv;
        }
        
        const No = this.results.No_total || 0;
        
        // Разбивка постоянных (П1, П2)
        const P2 = Math.ceil(Np * ev_share); // ЭМ
        const P1 = Np - P2; // Без ЭМ
        
        // Разбивка гостевых (Г1, Г2, Г3)
        const G_with_em = Math.ceil(Ng * ev_share);
        const G_without_em = Ng - G_with_em;
        
        // МГН для гостевых - вычисляем через формулу
        const Ng_mgn_data = this.calculateMGNPlaces(Ng);
        const G3 = Ng_mgn_data.enlarged;
        const G2_base = G_with_em; // ЭМ
        const G1_base = G_without_em - Ng_mgn_data.regular; // БЕЗ МГН и ЭМ
        
        // Убедимся что разбивка суммируется в Ng (используем остаток для точности)
        const G2 = G2_base;
        const G1 = Ng - G3 - G2;  // Остаток
        
        // Разбивка приобъектных (В1, В2, В3)
        const V_with_em = Math.ceil(Nv * ev_share);
        const V_without_em = Nv - V_with_em;
        
        // МГН для приобъектных - вычисляем через формулу
        const Nv_mgn_data = this.calculateMGNPlaces(Nv);
        const V3 = Nv_mgn_data.enlarged;
        const V2_base = V_with_em; // ЭМ
        const V1_base = V_without_em - Nv_mgn_data.regular; // БЕЗ МГН и ЭМ
        
        // Убедимся что разбивка суммируется в Nv (используем остаток для точности)
        const V2 = V2_base;
        const V1 = Nv - V3 - V2;  // Остаток
        
        // Места остановки
        const MO = No;
        
        const breakdown = {
            variant,
            П1: { name: 'П1 - Постоянные (без ЭМ)', value: P1 },
            П2: { name: 'П2 - Постоянные (ЭМ)', value: P2 },
            Г1: { name: 'Г1 - Гостевые (без МГН и ЭМ)', value: G1 },
            Г2: { name: 'Г2 - Гостевые (ЭМ)', value: G2 },
            Г3: { name: 'Г3 - Гостевые (МГН)', value: G3 },
            В1: { name: 'В1 - Приобъектные (без МГН и ЭМ)', value: V1 },
            В2: { name: 'В2 - Приобъектные (ЭМ)', value: V2 },
            В3: { name: 'В3 - Приобъектные (МГН)', value: V3 },
            МО: { name: 'МО - Места остановки', value: MO },
            total: P1 + P2 + G1 + G2 + G3 + V1 + V2 + V3 + MO
        };
        
        this.results[`breakdown_${variant}`] = breakdown;
        
        console.log(`✅ Разбивка по типам (${variant}): П1=${P1}, П2=${P2}, Г1=${G1}, Г2=${G2}, Г3=${G3}, В1=${V1}, В2=${V2}, В3=${V3}, МО=${MO}`);
        
        return breakdown;
    }

    /**
     * Получить все три варианта разбивки (требуется, минимум, максимум)
     */
    getAllBreakdowns() {
        const required = this.calculateBreakdownByType('required');
        const min = this.calculateBreakdownByType('min');
        const max = this.calculateBreakdownByType('max');
        
        this.results.all_breakdowns = { required, min, max };
        return { required, min, max };
    }

    /**
     * ОПЦИОНАЛЬНЫЕ РАСЧЁТЫ ДЛЯ СПЕЦИАЛЬНЫХ ОБЪЕКТОВ
     * (вычисляются только если переданы соответствующие входные данные)
     */

    /**
     * Расчёт мест остановки для общеобразовательной организации (школы)
     * Nк = S_школы / S1_школы
     * где S1_школы = 300 кв.м (по Приложению 8)
     * @param {number} schoolArea - площадь школы (кв.м)
     * @returns {number} количество мест остановки
     */
    calculateSchoolStops(schoolArea) {
        if (!schoolArea || schoolArea <= 0) {
            return 0;
        }
        
        const S1 = 300; // кв.м на одно место остановки
        const Nk = Math.ceil(schoolArea / S1);
        
        const record = {
            id: 'Nk_school',
            name: 'Nк (школа) - Число мест остановки (общеобразовательная организация)',
            formula: 'Nк = S / 300',
            unit: 'шт.',
            calculation: `${schoolArea} / ${S1}`,
            result: Nk,
            exact_value: (schoolArea / S1).toFixed(2)
        };
        
        this.results.Nk_school = Nk;
        this.calculations.push(record);
        
        console.log(`✅ Nк (школа) = ${Nk} шт.`);
        return Nk;
    }

    /**
     * Расчёт мест остановки для дошкольной организации (детский сад)
     * Nк = S_детсада / S1_детсада
     * где S1_детсада = 30 кв.м (по Приложению 8)
     * @param {number} preschoolArea - площадь детского сада (кв.м)
     * @returns {number} количество мест остановки
     */
    calculatePreschoolStops(preschoolArea) {
        if (!preschoolArea || preschoolArea <= 0) {
            return 0;
        }
        
        const S1 = 30; // кв.м на одно место остановки
        const Nk = Math.ceil(preschoolArea / S1);
        
        const record = {
            id: 'Nk_preschool',
            name: 'Nк (детсад) - Число мест остановки (дошкольная организация)',
            formula: 'Nк = S / 30',
            unit: 'шт.',
            calculation: `${preschoolArea} / ${S1}`,
            result: Nk,
            exact_value: (preschoolArea / S1).toFixed(2)
        };
        
        this.results.Nk_preschool = Nk;
        this.calculations.push(record);
        
        console.log(`✅ Nк (детсад) = ${Nk} шт.`);
        return Nk;
    }

    /**
     * Запустить полный расчёт
     * @param {Object} inputData - входные параметры
     * @returns {Object} результаты расчётов
     */
    calculate(inputData) {
        if (inputData) {
            this.input = inputData;
        }
        
        this.calculations = []; // Очистить предыдущие расчёты
        this.results = {};
        
        console.log("📊 === НАЧАЛО РАСЧЁТОВ ===");
        
        this.calculateNp();
        this.calculateNpVariations();
        this.calculateNg();
        this.calculateNv();
        this.calculateNvVariations();
        this.calculateNk_residential();
        this.calculateNk_commercial();
        this.calculateNo_total();
        this.calculateTotal();
        this.calculateTotalVariations();
        this.getAllBreakdowns();
        
        console.log("📊 === КОНЕЦ РАСЧЁТОВ ===");
        
        return this.results;
    }

    /**
     * Вывод результатов в формате "формула = цифры = результат"
     * @returns {string} форматированный отчёт
     */
    getFormattedReport() {
        let report = "📋 ОТЧЁТ О РАСЧЁТЕ МАШИНОМЕСТ\n";
        report += "================================\n\n";
        
        for (const calc of this.calculations) {
            if (calc.formula) {
                report += `${calc.name}\n`;
                report += `Формула: ${calc.formula}\n`;
                report += `Расчёт: ${calc.calculation}\n`;
                report += `Результат: ${calc.result} ${calc.unit}\n`;
                report += "\n";
            }
        }
        
        // Добавим секцию с отклонениями
        const deviations = this.getDeviations();
        if (deviations.length) {
            report += "ОТКЛОНЕНИЯ:\n";
            for (const dev of deviations) {
                report += `${dev.name}\nФормула: ${dev.formula}\nРезультат: ${dev.value} ${dev.unit}\n\n`;
            }
        }
        return report;
    }

    /**
     * Вывод результатов в формате таблицы
     * @returns {Array} массив объектов для HTML таблицы
     */
    getTableData() {
        const table = [];
        
        for (const calc of this.calculations) {
            if (calc.formula && calc.result !== undefined) {
                table.push({
                    наименование: calc.name,
                    формула: calc.formula,
                    ед_изм: calc.unit,
                    расчёт: calc.calculation,
                    результат: calc.result
                });
            }
        }
        
        return table;
    }

    /**
     * Вывести результаты в консоль (красиво)
     */
    printResults() {
        console.log("✅ === ИТОГОВЫЕ РЕЗУЛЬТАТЫ ===");
        console.log(`Nп (постоянные места): ${this.results.Np} шт.`);
        console.log(`Nг (гостевые места): ${this.results.Ng} шт.`);
        console.log(`Nв (приобъектные места): ${this.results.Nv} шт.`);
        console.log(`Nо (места остановки): ${this.results.No_total} шт.`);
        console.log(`-----`);
        console.log(`N (всего): ${this.results.N_total} шт. (в т.ч. ${this.results.N_ev} для ЭМ)`);
        console.log(`N (min): ${this.results.N_min} шт. (в т.ч. ${this.results.N_ev_min} для ЭМ)`);
        console.log(`N (max): ${this.results.N_max} шт. (в т.ч. ${this.results.N_ev_max} для ЭМ)`);
    }

    /**
     * Получить таблицу разбивки по типам для HTML
     * @param {string} variant - 'required', 'min' или 'max'
     * @returns {Array} массив объектов для таблицы
     */
    getBreakdownTableData(variant = 'required') {
        const breakdown = this.results[`breakdown_${variant}`];
        if (!breakdown) return [];
        
        const types = ['П1', 'П2', 'Г1', 'Г2', 'Г3', 'В1', 'В2', 'В3', 'МО'];
        const table = [];
        
        for (const type of types) {
            if (breakdown[type]) {
                table.push({
                    тип: type,
                    описание: breakdown[type].name,
                    количество: breakdown[type].value
                });
            }
        }
        
        table.push({
            тип: 'ИТОГО',
            описание: `Всего (вариант ${variant})`,
            количество: breakdown.total
        });
        
        return table;
    }

    /**
     * Получить все три таблицы разбивки
     * @returns {Object} три массива (required, min, max)
     */
    getAllBreakdownTables() {
        return {
            required: this.getBreakdownTableData('required'),
            min: this.getBreakdownTableData('min'),
            max: this.getBreakdownTableData('max')
        };
    }
}

// Экспортируем функцию в глобальный контекст
if (typeof window !== 'undefined') {
    window.ParkingCalculator = ParkingCalculator; // Для обратной совместимости
    
    /**
     * Основная функция расчёта машиномест
     * Принимает параметры в строгом порядке
     */
    window.calculateParking = function(
        areaFlats = 0,
        areaNNP = 0,
        districtName = '',
        ttkStatus = 'outside',
        metroDistance = 0,
        rnsYear = 2025,
        fact_zu_mo = 0,
        fact_zu_guest_mgn = 0,
        fact_zu_priob_mgn = 0,
        fact_uds_mo = 0,
        fact_uds_guest = 0,
        fact_uds_guest_mgn = 0,
        fact_uds_priob = 0,
        fact_uds_priob_mgn = 0
    ) {
        // 1. Расчёт коэффициента K1 (пешая доступность)
        let k1 = 1.0;
        if (window.parkingData && window.parkingData.infrastructure && window.parkingData.infrastructure.metro) {
            // < 1200 -> 0.75
            // 1200-2200 -> 0.9
            // > 2200 -> 1.0
            if (metroDistance < 1200) k1 = 0.75;
            else if (metroDistance <= 2200) k1 = 0.9;
            else k1 = 1.0;
        }

        // 2. Расчёт коэффициента K2 (район и ТТК)
        let k2 = 1.0;
        if (window.parkingData && window.parkingData.districts && districtName) {
            const district = window.parkingData.districts[districtName];
            if (district) {
                // Формат: [К2_Внутри_ТТК, К2_Снаружи_ТТК]
                if (ttkStatus === 'inside') {
                    k2 = district[0];
                } else {
                    k2 = district[1];
                }
            } else {
                console.warn(`Район "${districtName}" не найден, используется K2=1.0`);
            }
        }

        // Формируем объект входных данных
        const inputData = {
            areaFlats: Number(areaFlats) || 0,
            areaNNP: Number(areaNNP) || 0,
            k1: k1,
            k2: k2,
            districtName: districtName,
            ttkStatus: ttkStatus,
            metroDistance: Number(metroDistance) || 0,
            rnsYear: Number(rnsYear) || 2025,
            fact_zu_mo: Number(fact_zu_mo) || 0,
            fact_zu_guest_mgn: Number(fact_zu_guest_mgn) || 0,
            fact_zu_priob_mgn: Number(fact_zu_priob_mgn) || 0,
            fact_uds_mo: Number(fact_uds_mo) || 0,
            fact_uds_guest: Number(fact_uds_guest) || 0,
            fact_uds_guest_mgn: Number(fact_uds_guest_mgn) || 0,
            fact_uds_priob: Number(fact_uds_priob) || 0,
            fact_uds_priob_mgn: Number(fact_uds_priob_mgn) || 0
        };

        // Создаем экземпляр калькулятора и запускаем расчёт
        const calculator = new ParkingCalculator(inputData);
        const results = calculator.calculate();
        
        // Формируем расширенный ответ
        return {
            // 1. Список значений (результаты)
            values: results,
            
            // 2. Массив наименование-значение (для таблиц)
            tableData: calculator.getTableData(),
            
            // 3. Текстовый отчёт с формулами (f-строки)
            report: calculator.getFormattedReport(),
            
            // Дополнительно: разбивка по типам
            breakdowns: calculator.getAllBreakdownTables(),
            
            // Доступ к самому калькулятору если нужно
            calculatorInstance: calculator
        };
    };
}
