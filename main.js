let currentBook = null;
let currentWordIndex = 0;

// Инициализация обработчиков
function initializeHandlers() {
    // Переворот карточки
    const card = document.getElementById('card');
    if (card) {
        card.addEventListener('click', function() {
            this.classList.toggle('flipped');
        });
    }

    // Кнопки навигации
    const btnPrev = document.getElementById('btnPrev');
    if (btnPrev) {
        btnPrev.addEventListener('click', function() {
            if (currentWordIndex > 0) {
                displayWord(currentWordIndex - 1);
            }
        });
    }

    const btnNext = document.getElementById('btnNext');
    if (btnNext) {
        btnNext.addEventListener('click', function() {
            if (currentWordIndex < currentBook.words.length - 1) {
                displayWord(currentWordIndex + 1);
            }
        });
    }

    // Навигация клавишами (стрелки право/лево)
    document.addEventListener('keydown', function(e) {
        if (!currentBook) return;
        
        if (e.key === 'ArrowRight') {
            if (currentWordIndex < currentBook.words.length - 1) {
                document.getElementById('card').classList.remove('flipped');
                displayWord(currentWordIndex + 1);
            }
        } else if (e.key === 'ArrowLeft') {
            if (currentWordIndex > 0) {
                document.getElementById('card').classList.remove('flipped');
                displayWord(currentWordIndex - 1);
            }
        }
    });

    // Hamburger menu toggle
    const hamburger = document.getElementById('hamburger');
    const menu = document.getElementById('menu');
    
    if (hamburger && menu) {
        hamburger.addEventListener('click', function(e) {
            e.stopPropagation();
            hamburger.classList.toggle('active');
            menu.classList.toggle('active');
        });
    }

    // Закрыть меню при клике вне его
    document.addEventListener('click', function(e) {
        const menu = document.getElementById('menu');
        const hamburger = document.getElementById('hamburger');
        if (menu && hamburger && !menu.contains(e.target) && !hamburger.contains(e.target)) {
            menu.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });

    // Переменная для хранения события установки
    let deferredPrompt;

    // Слушать событие beforeinstallprompt
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        const btn = document.getElementById('installBtn');
        if (btn) btn.style.display = 'block';
    });

    // Обработчик кнопки установки
    const installBtn = document.getElementById('installBtn');
    if (installBtn) {
        installBtn.addEventListener('click', async () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                console.log(`Пользователь ответил: ${outcome}`);
                deferredPrompt = null;
                installBtn.style.display = 'none';
            }
        });
    }

    window.addEventListener('appinstalled', () => {
        console.log('PWA установлен');
        const btn = document.getElementById('installBtn');
        if (btn) btn.style.display = 'none';
    });
}

// Загрузить словарь при загрузке страницы
window.addEventListener('load', function() {
    const selectedBookId = localStorage.getItem('selectedBookId');
    const books = JSON.parse(localStorage.getItem('books')) || [];
    
    if (!selectedBookId) {
        alert('Словарь не найден');
        window.location.href = 'init.html';
        return;
    }
    
    currentBook = books.find(b => b.id == selectedBookId);
    
    if (!currentBook || currentBook.words.length === 0) {
        alert('Словарь пуст');
        window.location.href = 'init.html';
        return;
    }
    
    document.getElementById('bookTitle').textContent = currentBook.name;
    displayWord(0);
    initializeHandlers();
});

// Отобразить слово по индексу
function displayWord(index) {
    const word = currentBook.words[index];
    document.getElementById('frontText').textContent = word.front;
    document.getElementById('backText').textContent = word.back;
    document.getElementById('wordCounter').textContent = `${index + 1} / ${currentBook.words.length}`;
    currentWordIndex = index;
    
    // Обновить состояние кнопок
    updateButtonStates();
    
    // Сбосить эффект переворота
    document.getElementById('card').classList.remove('flipped');
}

// Обновить состояние кнопок
function updateButtonStates() {
    const btnPrev = document.getElementById('btnPrev');
    const btnNext = document.getElementById('btnNext');
    
    if (btnPrev) btnPrev.disabled = currentWordIndex === 0;
    if (btnNext) btnNext.disabled = currentWordIndex === currentBook.words.length - 1;
}