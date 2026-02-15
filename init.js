console.log('НАЧАЛО init.js');

// Загрузить словари при загрузке страницы
function loadDictionaries() {
    console.log('loadDictionaries вызвана');
    const cardsList = document.getElementById('cardsList');
    const books = JSON.parse(localStorage.getItem('books')) || [];
    
    // Очистить существующий контент
    cardsList.innerHTML = '';
    
    if (books.length === 0) {
        cardsList.innerHTML = '<p style="color: white; text-align: center; grid-column: 1/-1;">Нет созданных словарей. Создайте свой первый словарь!</p>';
        return;
    }
    
    // Добавить каждый словарь в сетку
    books.forEach(book => {
        const cardItem = document.createElement('div');
        cardItem.className = 'card-item';
        cardItem.dataset.bookId = book.id;
        
        const wordCount = book.words.length;
        
        cardItem.innerHTML = `
            <button class="delete-btn" data-book-id="${book.id}">×</button>
            <div class="card-content">
                <h3>${book.name}</h3>
                <p>Слов: ${wordCount}</p>
            </div>
        `;
        
        // Обработчик клика на карточку (открыть словарь)
        const contentArea = cardItem.querySelector('.card-content');
        contentArea.addEventListener('click', function(e) {
            localStorage.setItem('selectedBookId', book.id);
            window.location.href = 'main.html';
        });
        
        // Обработчик клика на кнопку удаления
        const deleteBtn = cardItem.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            
            if (confirm(`Вы уверены? Словарь "${book.name}" будет удален безвозвратно.`)) {
                let books = JSON.parse(localStorage.getItem('books')) || [];
                books = books.filter(b => b.id !== book.id);
                localStorage.setItem('books', JSON.stringify(books));
                loadDictionaries();
            }
        });
        
        cardsList.appendChild(cardItem);
    });
}

// Инициализация обработчиков
function initializeHandlers() {
    // Hamburger меню
    const hamburger = document.getElementById('hamburger');
    const menu = document.getElementById('menu');
    const btnCreate = document.getElementById('btnCreate');
    const installBtn = document.getElementById('installBtn');

    console.log('initializeHandlers вызвана');
    console.log('hamburger найдена:', hamburger);
    console.log('menu найдена:', menu);

    // Hamburger toggle
    if (hamburger) {
        hamburger.addEventListener('click', function(e) {
            console.log('Клик по hamburger!');
            e.stopPropagation();
            hamburger.classList.toggle('active');
            if (menu) menu.classList.toggle('active');
            console.log('Класс active добавлен. hamburger.classList:', hamburger.classList);
        });
    } else {
        console.log('ОШИБКА: hamburger не найддена!');
    }

    // Закрыть меню при клике вне
    document.addEventListener('click', function(e) {
        if (menu && hamburger) {
            if (!menu.contains(e.target) && !hamburger.contains(e.target)) {
                menu.classList.remove('active');
                hamburger.classList.remove('active');
            }
        }
    });

    // Create button
    if (btnCreate) {
        btnCreate.addEventListener('click', function() {
            window.location.href = 'create_book.html';
        });
    }

    // Install button
    let deferredPrompt;

    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        if (installBtn) installBtn.style.display = 'block';
    });

    if (installBtn) {
        installBtn.addEventListener('click', async () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                deferredPrompt = null;
                installBtn.style.display = 'none';
            }
        });
    }
}

// Инициализация при загрузке
console.log('init.js загружен, document.readyState:', document.readyState);

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        console.log('DOMContentLoaded событие');
        loadDictionaries();
        initializeHandlers();
    });
} else {
    console.log('DOM уже готов, вызываем функции немедленно');
    loadDictionaries();
    initializeHandlers();
}

// Перезагружать словари при возвращении на страницу
window.addEventListener('pageshow', loadDictionaries);
