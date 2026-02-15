// Инициализация обработчиков
function initializeHandlers() {
    const hamburger = document.getElementById('hamburger');
    const menu = document.getElementById('menu');
    const btnConfirmName = document.getElementById('btnConfirmName');
    const btnCancelModal = document.getElementById('btnCancelModal');
    const btnAddMore = document.getElementById('btnAddMore');
    const btnSave = document.getElementById('btnSave');
    const bookName = document.getElementById('bookName');
    const installBtn = document.getElementById('installBtn');

    // Hamburger toggle
    if (hamburger) {
        hamburger.addEventListener('click', function(e) {
            e.stopPropagation();
            hamburger.classList.toggle('active');
            if (menu) menu.classList.toggle('active');
        });
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

    // Confirm name
    if (btnConfirmName) {
        btnConfirmName.addEventListener('click', function() {
            const name = document.getElementById('bookName').value.trim();
            if (!name) {
                alert('Пожалуйста, введите название словаря');
                return;
            }
            document.getElementById('nameModal').classList.remove('active');
            document.getElementById('mainContent').style.display = 'flex';
            document.getElementById('displayBookName').textContent = name;
            localStorage.setItem('currentBookName', name);
        });
    }

    // Cancel modal
    if (btnCancelModal) {
        btnCancelModal.addEventListener('click', function() {
            window.location.href = 'init.html';
        });
    }

    // Add more words
    if (btnAddMore) {
        btnAddMore.addEventListener('click', function() {
            const pair = document.createElement('div');
            pair.className = 'word-pair';
            pair.innerHTML = `
                <div class="word-field">
                    <label>Лицевая сторона</label>
                    <input type="text" class="word-input front-side">
                </div>
                <div class="word-field">
                    <label>Обратная сторона</label>
                    <input type="text" class="word-input back-side">
                </div>
            `;
            document.getElementById('wordsContainer').appendChild(pair);
        });
    }

    // Save book
    if (btnSave) {
        btnSave.addEventListener('click', function() {
            const name = localStorage.getItem('currentBookName');
            const pairs = [];
            
            document.querySelectorAll('.word-pair').forEach(p => {
                const front = p.querySelector('.front-side').value.trim();
                const back = p.querySelector('.back-side').value.trim();
                if (front && back) pairs.push({ front, back });
            });
            
            if (!pairs.length) {
                alert('Добавьте хотя бы одну пару слов');
                return;
            }
            
            const book = {
                id: Date.now(),
                name: name,
                words: pairs,
                createdAt: new Date().toLocaleString('ru-RU')
            };
            
            let books = JSON.parse(localStorage.getItem('books')) || [];
            books.push(book);
            localStorage.setItem('books', JSON.stringify(books));
            
            alert('Словарь создан!');
            window.location.href = 'init.html';
        });
    }

    // Enter key
    if (bookName) {
        bookName.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') btnConfirmName.click();
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
window.addEventListener('load', initializeHandlers);
