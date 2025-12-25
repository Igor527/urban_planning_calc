/**
 * ParkingCalculatorCore.js
 * Универсальный движок расчета машино-мест по ПП №945-ПП.
 * Требует наличия объекта parkingData (из parkingData.js).
 */

class ParkingCalculator {
    constructor(inputData) {
        // Проверка наличия справочника
        if (typeof parkingData === 'undefined') {
            throw new Error("Критическая ошибка: Справочник parkingData не найден. Подключите parkingData.js перед инициализацией движка.");
        }
        
        this.db = parkingData;
        this.data = inputData; 
        /* inputData должен содержать:
           objectName, district, area_living, area_npki, 
           objectType (living_type), metro_points, bus_points, year
        */
    }

    /**
     * Основной расчетный метод. 
     * Возвращает объект с чистыми числами и коэффициентами.
     */
    calculate() {
        const d = this.data;
        const db = this.db;

        // 1. Коэффициент К3 (Урбанизация)
        const districtRow = db.districts[d.district];
        if (!districtRow) throw new Error(`Район "${d.district}" не найден в базе.`);
        const zoneK3 = districtRow[2]; // Например "Т3"
        const k3 = db.k3_values[zoneK3];

        // 2. Коэффициент К2 (Транспортная доступность + Тип жилья)
        // Логика: Сумма баллов / 100 (согласно вашей структуре весов)
        const k2_points = parseFloat(d.metro_points) + 
                          parseFloat(d.bus_points) + 
                          parseFloat(d.comfort_weight);
        const k2_final = k2_points / 50; // Коэффициент нормализации из вашего Excel

        // 3. Нормативы S1 и X2 (из parkingData)
        const s1 = db.s1_rates["living"].s1; // Обычно 80 для жилья
        const x2 = db.x2_rates["living"].x2;

        // 4. Формула основного хранения (Nк)
        // Nк = (S / S1) * K2 * K3
        const n_calc = Math.ceil((d.area_living / s1) * k2_final * k3);

        // 5. Приобъектные стоянки (П1)
        const p1_calc = Math.ceil(d.area_living / x2);

        // 6. Дополнительные требования (МГН и Электромобили)
        const mgn = Math.ceil(n_calc * 0.10);
        
        // Процент электромобилей зависит от года РНС
        let electroRate = 0.05;
        if (d.year == 2026) electroRate = 0.10;
        if (d.year >= 2027) electroRate = 0.15;
        const electro = Math.ceil(n_calc * electroRate);

        return {
            main_storage: {
                total: n_calc,
                mgn: mgn,
                electro: electro
            },
            visitor_parking: {
                total: p1_calc
            },
            coefficients: {
                k2: k2_final.toFixed(2),
                k3: k3,
                zone: zoneK3
            }
        };
    }

    /**
     * Метод для генерации готового HTML-блока (Виджет результата)
     */
    renderWidget() {
        const res = this.calculate();
        return `
            <div class="parking-result-widget" style="padding:1rem; border:1px solid #ddd; border-radius:10px;">
                <h4 style="margin-top:0;">${this.data.objectName || 'Расчет ММ'}</h4>
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <span style="font-size:0.8rem; color:#666;">Постоянное хранение</span>
                        <div style="font-size:1.8rem; font-weight:bold; color:#10adff;">${res.main_storage.total} ММ</div>
                    </div>
                    <div style="text-align:right;">
                        <span style="font-size:0.8rem; color:#666;">Приобъектные</span>
                        <div style="font-size:1.2rem; font-weight:bold;">${res.visitor_parking.total} ММ</div>
                    </div>
                </div>
                <hr style="margin:10px 0;">
                <div style="font-size:0.85rem; display:grid; grid-template-columns: 1fr 1fr;">
                    <div>♿ МГН: <b>${res.main_storage.mgn}</b></div>
                    <div>⚡ Электро: <b>${res.main_storage.electro}</b></div>
                </div>
            </div>
        `;
    }
}