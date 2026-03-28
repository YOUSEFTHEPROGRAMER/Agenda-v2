// 1. إعدادات اللغات والترجمات
const LANGUAGES = [
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'zh', name: '中文', flag: '🇨🇳' }
];

// (ضع كائن translations الخاص بك هنا بنفس الشكل الذي كتبناه سابقاً)
const translations = {
    ar: { welcome: 'مرحباً بك', agendaTitle: 'جدول أعمال الملتقى' /* ... باقي الترجمات */ },
    en: { welcome: 'Welcome', agendaTitle: 'Event Agenda' /* ... باقي الترجمات */ }
    // ...
};

function t(key, lang) {
    const keys = key.split('.');
    let value = translations[lang];
    for (let k of keys) {
        if (value === undefined) return key;
        value = value[k];
    }
    return value || key;
}

// 2. دالة بناء قائمة اللغات (UI Logic)
function renderLanguageMenu(currentLangCode) {
    const dropdown = document.getElementById('lang-dropdown');
    const displayBtn = document.getElementById('current-lang-display');
    if (!dropdown || !displayBtn) return;

    // تحديث الزر الرئيسي (مثال: 🇸🇦 AR)
    const currentLang = LANGUAGES.find(l => l.code === currentLangCode) || LANGUAGES[0];
    displayBtn.textContent = `${currentLang.flag} ${currentLang.code.toUpperCase()}`;
    
    // تفريغ القائمة القديمة لإعادة بنائها
    dropdown.innerHTML = ''; 
    
    LANGUAGES.forEach(lang => {
        const isSelected = lang.code === currentLangCode;
        const btn = document.createElement('button');
        
        // تطبيق تصميم الـ Active والـ Hover زي كود الـ React بالضبط
        btn.className = `flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 text-start w-full
            ${isSelected 
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 text-white shadow-md' 
                : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/50'}`;
        
        btn.onclick = () => {
            setLanguage(lang.code);
        };

        // الـ ms-auto بتزق علامة الصح لآخر الكارت سواء كان الاتجاه RTL أو LTR
        btn.innerHTML = `
            <span class="text-lg leading-none">${lang.flag}</span>
            <span>${lang.name}</span>
            ${isSelected ? `<i data-lucide="check" class="w-4 h-4 ms-auto"></i>` : ''}
        `;
        
        dropdown.appendChild(btn);
    });

    // إعادة تفعيل أيقونات Lucide للأيقونات الجديدة اللي اتضافت
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// 3. دالة إغلاق وفتح القائمة المنسدلة
function toggleLangMenu(forceClose = false) {
    const langMenu = document.getElementById('lang-dropdown');
    const chevron = document.getElementById('lang-chevron');
    if (!langMenu || !chevron) return;

    if (forceClose || !langMenu.classList.contains('opacity-0')) {
        // قفل القائمة
        langMenu.classList.add('opacity-0', 'invisible', 'scale-95', '-translate-y-2');
        chevron.classList.remove('rotate-180');
    } else {
        // فتح القائمة
        langMenu.classList.remove('opacity-0', 'invisible', 'scale-95', '-translate-y-2');
        chevron.classList.add('rotate-180');
    }
}

// 4. دالة تطبيق اللغة على كامل الصفحة
function setLanguage(lang) {
    localStorage.setItem('appLang', lang);
    
    // تغيير اتجاه الصفحة
    const dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;

    // إعادة رسم قائمة اللغات لتعيين علامة الـ Check
    renderLanguageMenu(lang);

    // تطبيق الترجمات على الـ HTML
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const translatedText = t(key, lang);
        
        if (el.tagName === 'INPUT' && el.hasAttribute('placeholder')) {
            el.placeholder = translatedText;
        } else {
            el.innerHTML = translatedText.replace(/\n/g, '<br>');
        }
    });

    // إغلاق القائمة بعد الاختيار
    toggleLangMenu(true);
}

// 5. مشغلات الأحداث (Event Listeners) عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('appLang') || 'ar';
    setLanguage(savedLang);

    // ربط زر فتح القائمة
    const langBtn = document.getElementById('lang-toggle-btn');
    if (langBtn) {
        langBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // عشان القائمة ماتقفلش فوراً بسبب الدالة اللي تحت
            toggleLangMenu();
        });
    }

    // إغلاق القائمة لو المستخدم ضغط في أي مكان براس
    document.addEventListener('click', (e) => {
        const langContainer = document.getElementById('lang-switcher-container');
        if (langContainer && !langContainer.contains(e.target)) {
            toggleLangMenu(true);
        }
    });
});