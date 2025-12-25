const translations = {
    ru: {
        main_title: "Игорь Чевела",
        main_desc: "Инженерная автоматизация и расчеты ТЭП",
        t1: "Интерполяция стоянок",
        t2: "Расчет машиномест",
        bio_btn: "Обо мне",
        back: "← Назад",
        tg: "Telegram",
        welcome_title: "Добро пожаловать!",
        welcome_desc: "Это визитная страница, где вы можете найти ссылки на калькуляторы и другие разделы.",
        welcome_calc1: "Калькулятор интерполяции",
        welcome_calc2: "Парковочный калькулятор",
        welcome_new_section: "Новый раздел (в разработке)"
    },
    en: {
        main_title: "Igor Chevela",
        main_desc: "Engineering automation & TEP calculations",
        t1: "Parking Interpolation",
        t2: "Parking Calculator",
        bio_btn: "About Me",
        back: "← Back",
        tg: "Telegram",
        welcome_title: "Welcome!",
        welcome_desc: "This is a landing page where you can find links to calculators and other sections.",
        welcome_calc1: "Interpolation Calculator",
        welcome_calc2: "Parking Calculator",
        welcome_new_section: "New section (coming soon)"
    }
};

function applyLanguage() {
    const lang = localStorage.getItem('lang') || 'ru';
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            el.innerText = translations[lang][key];
        }
    });
    const langBtn = document.getElementById('langBtn');
    if (langBtn) langBtn.innerText = lang.toUpperCase();
}

window.toggleLang = function() {
    const newLang = (localStorage.getItem('lang') || 'ru') === 'ru' ? 'en' : 'ru';
    localStorage.setItem('lang', newLang);
    applyLanguage();
}

function applyTheme() {
    let mode = parseInt(localStorage.getItem('themeMode'));
    
    // Миграция только один раз: если был старый режим (0=auto, 1=light, 2=dark), конвертируем в новый (0=light, 1=dark)
    if (mode === 2) {
        mode = 1; // старый dark -> новый dark
        localStorage.setItem('themeMode', mode);
    } else if (mode === 1 && localStorage.getItem('themeModeMigrated') !== 'true') {
        // Если mode === 1 и это старый формат (light), конвертируем в новый (light = 0)
        mode = 0;
        localStorage.setItem('themeMode', mode);
        localStorage.setItem('themeModeMigrated', 'true');
    } else if (mode === 0 && localStorage.getItem('themeModeMigrated') !== 'true') {
        // Если mode === 0 и это старый формат (auto), устанавливаем dark
        mode = 1;
        localStorage.setItem('themeMode', mode);
        localStorage.setItem('themeModeMigrated', 'true');
    } else if (isNaN(mode)) {
        // Нет значения -> dark по умолчанию
        mode = 1;
        localStorage.setItem('themeMode', mode);
    }
    
    const modes = ["light", "dark"];
    const theme = modes[mode];
    
    // Устанавливаем data-theme на html элемент (для Pico CSS)
    document.documentElement.setAttribute('data-theme', theme);
    
    // Также устанавливаем класс на body для совместимости со style.css
    document.body.classList.remove('light-theme', 'dark-theme');
    document.body.classList.add(theme + '-theme');
    
    const btn = document.getElementById('themeBtn');
    if (btn) btn.innerText = theme.toUpperCase();
}

window.toggleTheme = function() {
    let mode = parseInt(localStorage.getItem('themeMode'));
    if (isNaN(mode)) mode = 1; // по умолчанию dark
    mode = (mode + 1) % 2; // Переключаем между light (0) и dark (1)
    localStorage.setItem('themeMode', mode);
    applyTheme();
}

function initializeHeaderFooter() {
    // Инициализация кнопок темы и языка после загрузки header
    applyTheme();
    applyLanguage();
}

document.addEventListener('DOMContentLoaded', () => {
    applyTheme();
    applyLanguage();
});