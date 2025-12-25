/**
 * parkingEngine.js 
 * Логика поиска адреса, вывода данных ГИС и ссылки на Яндекс Карты
 */

// Инициализация будет вызвана после загрузки parkingData
// Не используем DOMContentLoaded, так как скрипт загружается динамически
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(initApp, 100);
    });
} else {
    // DOM уже загружен
    setTimeout(initApp, 100);
}

let searchTimeout = null;

function waitForParkingData(timeout = 5000) {
    return new Promise((resolve, reject) => {
        if (window.parkingData) return resolve(true);
        const interval = setInterval(() => {
            if (window.parkingData) {
                clearInterval(interval);
                clearTimeout(to);
                resolve(true);
            }
        }, 100);
        const to = setTimeout(() => {
            clearInterval(interval);
            reject(new Error('timeout'));
        }, timeout);
    });
}

async function initApp() {
    // Дождёмся загрузки parkingData (до 5 секунд)
    if (typeof parkingData === 'undefined' && !window.parkingData) {
        try {
            await waitForParkingData(5000);
        } catch (e) {
            console.error('❌ parkingData не загружен!');
            return;
        }
    }

    // Утилита: получить объект parkingData из любой области (const/let на глобальном скрипте не попадает в window)
    function getParkingData() {
        if (typeof parkingData !== 'undefined') return parkingData;
        if (window && window.parkingData) return window.parkingData;
        return null;
    }
    const addrInput = document.getElementById('objAddress');
    const districtSelect = document.getElementById('districtSelect');
    const ttkPosSelect = document.getElementById('ttkPos');
    const metroAccessSelect = document.getElementById('metroAccess');
    const rnsYearSelect = document.getElementById('rnsYear');

    if (!addrInput) {
        console.error("Критическая ошибка: Поле поиска не найдено.");
        return;
    }

    // 1. Заполняем список районов из parkingData.js
    initDistrictSelect(districtSelect);

    // 2. Инициализация селектора ТТК (html-использование)
    if (ttkPosSelect) {
        ttkPosSelect.innerHTML = '';
        const placeholder = document.createElement('option');
        placeholder.value = '';
        placeholder.text = 'Выберите положение...';
        placeholder.disabled = true;
        placeholder.selected = true;
        ttkPosSelect.appendChild(placeholder);

        // Используем только данные из parkingData.ttk_positions
        const PD = (typeof parkingData !== 'undefined') ? parkingData : (window && window.parkingData ? window.parkingData : null);
        if (PD && Array.isArray(PD.ttk_positions) && PD.ttk_positions.length) {
            PD.ttk_positions.forEach(o => {
                const el = document.createElement('option');
                el.value = o.value;
                el.text = o.label || o.text || o.value;
                ttkPosSelect.appendChild(el);
            });
        } else {
            console.warn('parkingData.ttk_positions не найден или пуст — опции ТТК не добавлены. Добавьте данные в parkingData.js');
        }
        ttkPosSelect.addEventListener('change', () => {
            console.log('ttkPos изменён:', ttkPosSelect.value);
            if (typeof calculate === 'function') calculate();
        });
    }

    // 3. Инициализация селектора доступа к метро/МЦК/МЦД
    if (metroAccessSelect) {
        metroAccessSelect.innerHTML = '';
        const placeholder = document.createElement('option');
        placeholder.value = '';
        placeholder.text = 'Выберите доступность...';
        placeholder.disabled = true;
        placeholder.selected = true;
        metroAccessSelect.appendChild(placeholder);

        const PD2 = (typeof parkingData !== 'undefined') ? parkingData : (window && window.parkingData ? window.parkingData : null);
        if (PD2 && PD2.infrastructure && Array.isArray(PD2.infrastructure.metro)) {
            PD2.infrastructure.metro.forEach((item, idx) => {
                const el = document.createElement('option');
                el.value = String(idx);
                el.text = item.label;
                metroAccessSelect.appendChild(el);
            });
        } else {
            console.warn('parkingData.infrastructure.metro не найден — опции доступа к метро не добавлены. Проверьте parkingData.js');
        }
        metroAccessSelect.addEventListener('change', () => {
            console.log('metroAccess изменён:', metroAccessSelect.value);
            if (typeof calculate === 'function') calculate();
        });
    }

    // 4. Инициализация селектора года РНС (используем ключи ev_share как пример доступных лет)
    if (rnsYearSelect) {
        rnsYearSelect.innerHTML = '';
        const placeholder = document.createElement('option');
        placeholder.value = '';
        placeholder.text = 'Выберите год...';
        placeholder.disabled = true;
        placeholder.selected = true;
        rnsYearSelect.appendChild(placeholder);

        const PD3 = (typeof parkingData !== 'undefined') ? parkingData : (window && window.parkingData ? window.parkingData : null);
        if (PD3 && PD3.ev_share) {
            Object.keys(PD3.ev_share).sort().forEach(year => {
                const el = document.createElement('option');
                el.value = year;
                el.text = year;
                rnsYearSelect.appendChild(el);
            });
        } else {
            console.warn('parkingData.ev_share не найден — опции года РНС не добавлены. Проверьте parkingData.js');
        }
        rnsYearSelect.addEventListener('change', () => {
            console.log('rnsYear изменён:', rnsYearSelect.value);
            if (typeof calculate === 'function') calculate();
        });
    }

    // 5. Автоматический поиск при вводе (с задержкой debounce)
    addrInput.addEventListener('input', (e) => {
        const value = e.target.value.trim();
        
        // Очищаем предыдущий таймер
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }
        
        // Если адрес достаточно длинный, запускаем поиск через 800мс после окончания ввода
        if (value.length >= 5) {
            searchTimeout = setTimeout(() => {
                handleAddressSearch(value);
            }, 800);
        } else if (value.length === 0) {
            // Очищаем результаты при очистке поля
            clearSearchResults();
        }
    });
    
    // Поиск по Enter (мгновенно)
    addrInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (searchTimeout) clearTimeout(searchTimeout);
            handleAddressSearch(addrInput.value.trim());
        }
    });
}

function initDistrictSelect(select) {
    console.log("🔧 Инициализация списка районов...");
    console.log("Select элемент:", select);
    console.log("parkingData доступен:", !!(typeof parkingData !== 'undefined' || (window && window.parkingData)));

    if (!select) {
        console.error("❌ Select элемент не найден!");
        return;
    }

    const PD = (typeof parkingData !== 'undefined') ? parkingData : (window && window.parkingData ? window.parkingData : null);
    if (!PD || !PD.districts) {
        console.error("❌ parkingData не загружен или не содержит districts!");
        return;
    }

    select.innerHTML = '<option value="" disabled selected>Выберите район или введите адрес выше...</option>';
    const sorted = Object.keys(PD.districts).sort();
    console.log(`📋 Найдено районов: ${sorted.length}`);
    
    sorted.forEach(name => {
        let opt = document.createElement('option');
        opt.value = name;
        opt.text = name;
        select.appendChild(opt);
    });
    
    console.log("✅ Список районов заполнен. Всего опций:", select.options.length);
    // Select всегда активен для ручного выбора
}

async function handleAddressSearch(rawAddress) {
    if (!rawAddress || rawAddress.length < 3) return;

    const fullAddrOutput = document.getElementById('fullAddressOutput');
    const addrInput = document.getElementById('objAddress');
    
    // Показываем индикатор поиска
    if (fullAddrOutput) fullAddrOutput.innerText = "Поиск адреса...";
    if (addrInput) addrInput.style.borderColor = "#10adff";

    try {
        // Поиск через Nominatim (OpenStreetMap)
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent('Москва, ' + rawAddress)}&format=json&addressdetails=1&accept-language=ru&limit=1`;
        const response = await fetch(url);
        const results = await response.json();

        if (results && results.length > 0) {
            const data = results[0];
            
            // 1. ЗАПОЛНЯЕМ СТРОКУ ПОЛНОГО АДРЕСА (ГИС)
            if (fullAddrOutput) {
                fullAddrOutput.innerText = data.display_name;
            }

            // 2. СОПОСТАВЛЯЕМ РАЙОН (улучшенная логика)
            matchDistrict(data.address, data.display_name);

            // 3. ОБНОВЛЯЕМ ССЫЛКУ НА ЯНДЕКС КАРТЫ
            showYandexLink(data.display_name);

            // 4. Визуальная обратная связь
            if (addrInput) addrInput.style.borderColor = "#28a745";

            // 5. ВЫЗОВ РАСЧЕТА
            if (typeof calculate === "function") calculate();

        } else {
            if (fullAddrOutput) fullAddrOutput.innerText = "Адрес не найден в базе ГИС. Проверьте правильность ввода.";
            if (addrInput) addrInput.style.borderColor = "#dc3545";
            clearSearchResults();
        }
    } catch (e) {
        console.error("Ошибка при поиске адреса:", e);
        if (fullAddrOutput) fullAddrOutput.innerText = "Ошибка соединения с сервером ГИС.";
        if (addrInput) addrInput.style.borderColor = "#dc3545";
        clearSearchResults();
    }
}

function clearSearchResults() {
    const fullAddrOutput = document.getElementById('fullAddressOutput');
    const yandexContainer = document.getElementById('yandexLinkContainer');
    const districtSelect = document.getElementById('districtSelect');
    
    if (fullAddrOutput) fullAddrOutput.innerText = "Ожидание ввода адреса...";
    if (yandexContainer) yandexContainer.innerHTML = "";
    if (districtSelect) {
        districtSelect.value = "";
        // Select остается активным для ручного выбора
    }
}

function matchDistrict(addressObj, fullName) {
    console.log("🔍 === ПОИСК РАЙОНА ===");
    console.log("Полный адрес от ГИС:", fullName);
    console.log("Детали адреса:", addressObj);
    
    const select = document.getElementById('districtSelect');
    if (!select) {
        console.error("❌ Select элемент не найден!");
        return;
    }

    const PD = (typeof parkingData !== 'undefined') ? parkingData : (window && window.parkingData ? window.parkingData : null);
    if (!PD || !PD.districts) {
        console.error("❌ parkingData не загружен или не содержит districts!");
        return;
    }

    const districtsList = Object.keys(PD.districts);
    console.log(`📋 Всего районов в списке: ${districtsList.length}`);
    
    // Функция очистки (убираем "район", "поселение", "город", "улица" и т.д.)
    const clean = (s) => {
        if (!s) return "";
        return s.toLowerCase()
            .replace(/район|поселение|город|москва|улица|ул\.|ул|проспект|пр\.|пр|переулок|пер\.|пер|площадь|пл\.|пл|бульвар|б-р|б-р\./g, "")
            .replace(/[^\w\s-]/g, "")
            .trim();
    };

    // Собираем части адреса для поиска (исключаем город и улицу)
    // Берем: suburb, city_district, district, quarter, neighbourhood
    const searchParts = [
        addressObj.suburb || "",
        addressObj.city_district || "",
        addressObj.district || "",
        addressObj.quarter || "",
        addressObj.neighbourhood || ""
    ].filter(p => p).map(clean);

    // Также извлекаем из полного адреса части между запятыми (исключая первые две - обычно город и улица)
    const fullNameParts = (fullName || "").split(",").map(s => clean(s.trim())).filter(s => s.length > 2);
    // Пропускаем первые 1-2 части (город, улица) и берем остальные
    const relevantParts = fullNameParts.slice(1);

    // Объединяем все части для поиска
    const searchString = [...searchParts, ...relevantParts].join(" ");

    console.log("🔎 Части адреса для поиска:", searchParts);
    console.log("🔎 Релевантные части из полного адреса:", relevantParts);
    console.log("🔎 Объединенная строка поиска:", searchString);

    // Сначала ищем прямое вхождение названия района в полный адрес от ГИС
    let found = districtsList.find(d => {
        const districtName = d.toLowerCase();
        const fullNameLower = (fullName || "").toLowerCase();
        // Проверяем вхождение названия района в полный адрес
        if (fullNameLower.includes(districtName)) {
            console.log(`✅ Найдено прямое совпадение: "${d}" в полном адресе`);
            return true;
        }
        // Также проверяем в деталях адреса
        const suburb = (addressObj.suburb || "").toLowerCase();
        const cityDistrict = (addressObj.city_district || "").toLowerCase();
        const district = (addressObj.district || "").toLowerCase();
        
        const foundInDetails = suburb.includes(districtName) || 
               cityDistrict.includes(districtName) || 
               district.includes(districtName);
        
        if (foundInDetails) {
            console.log(`✅ Найдено совпадение: "${d}" в деталях адреса`);
        }
        
        return foundInDetails;
    });

    // Если не нашли прямым поиском, используем более сложную логику
    if (!found) {
        console.log("🔎 Прямой поиск не дал результатов, используем сложную логику...");
        // Функция для сравнения названия района с поисковой строкой
        const matches = (districtName) => {
            const cleanDistrict = clean(districtName);
            if (cleanDistrict.length < 3) return false;
            
            // Точное совпадение
            if (searchString.includes(cleanDistrict) || cleanDistrict.includes(searchString.split(" ")[0])) {
                return true;
            }
            
            // Поиск по словам (если название района состоит из нескольких слов)
            const districtWords = cleanDistrict.split(/\s+/).filter(w => w.length > 2);
            const searchWords = searchString.split(/\s+/).filter(w => w.length > 2);
            
            // Если хотя бы одно слово района найдено в поисковой строке
            return districtWords.some(dw => searchWords.some(sw => sw.includes(dw) || dw.includes(sw)));
        };

        found = districtsList.find(d => {
            const matched = matches(d);
            if (matched) {
                console.log(`✅ Найдено совпадение через сложную логику: "${d}"`);
            }
            return matched;
        });
    }

    if (found) {
        console.log(`🎯 ВЫБРАН РАЙОН: "${found}"`);
        console.log("🔧 Устанавливаем значение в select...");
        console.log("Текущее значение select:", select.value);
        console.log("Опции в select:", Array.from(select.options).map(o => o.value));
        
        // Проверяем, есть ли такой option в select
        const optionExists = Array.from(select.options).some(opt => opt.value === found);
        console.log("Опция существует в select:", optionExists);
        
        if (optionExists) {
            select.value = found;
            console.log("✅ Значение установлено:", select.value);
            
            // Проверяем, что значение действительно установилось
            if (select.value === found) {
                console.log("✅ Подтверждение: значение успешно установлено!");
            } else {
                console.error("❌ ОШИБКА: значение не установилось! Текущее значение:", select.value);
            }
        } else {
            console.error(`❌ ОШИБКА: Опция "${found}" не найдена в select!`);
        }
        
        // Визуальная обратная связь
        select.style.borderColor = "#28a745";
        setTimeout(() => {
            select.style.borderColor = "";
        }, 2000);
    } else {
        console.warn("⚠ Район не удалось определить автоматически. Выберите вручную из списка.");
        console.log("📋 Доступные районы:", districtsList.slice(0, 10).join(", "), "...");
        select.style.borderColor = "#ffc107";
        setTimeout(() => {
            select.style.borderColor = "";
        }, 2000);
    }
    
    console.log("🔍 === КОНЕЦ ПОИСКА РАЙОНА ===");
}

function showYandexLink(address) {
    const container = document.getElementById('yandexLinkContainer');
    if (!container) return;

    // Ссылка на поиск Яндекса с учетом города Москва
    const url = `https://yandex.ru/maps/?text=${encodeURIComponent('Москва, ' + address)}`;

    container.innerHTML = `
        <div class="yandex-card">
            <span style="font-size: 0.9rem; color: #666;">Адрес подтвержден в ГИС</span>
            <a href="${url}" target="_blank" class="yandex-btn">
                <span>Проверить на Яндекс Картах</span>
            </a>
        </div>
    `;
}

// Заглушка функции расчета, чтобы не было ошибок
function calculate() {
    console.log("--- Триггер расчета сработал ---");
}