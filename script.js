document.addEventListener('DOMContentLoaded', function() {
    const entryText = document.getElementById('entry-text');
    const entryTags = document.getElementById('entry-tags');
    const saveEntryButton = document.getElementById('save-entry');
    const entryList = document.getElementById('entry-list');
    const filterTagsInput = document.getElementById('filter-tags');
    const filterButton = document.getElementById('filter-button');

    // Функція для отримання записів з локального сховища
    function getEntries() {
        const entries = localStorage.getItem('diaryEntries');
        return entries ? JSON.parse(entries) : [];
    }

    // Функція для збереження записів в локальне сховище
    function saveEntries(entries) {
        localStorage.setItem('diaryEntries', JSON.stringify(entries));
    }

    // Функція для відображення записів
    function displayEntries(entries) {
        entryList.innerHTML = ''; // Очистити список

        entries.forEach((entry, index) => {
            const entryDiv = document.createElement('div');
            entryDiv.classList.add('entry');
            entryDiv.innerHTML = `
                <p>${entry.text}</p>
                <p class="tags">Теги: ${entry.tags.join(', ')}</p>
                <button class="delete-entry" data-index="${index}">Видалити</button>
            `;
            entryList.appendChild(entryDiv);
        });

        // Додати обробники подій для видалення записів
        const deleteButtons = document.querySelectorAll('.delete-entry');
        deleteButtons.forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                deleteEntry(index);
            });
        });
    }

    // Функція для додавання нового запису
    function addEntry() {
        const text = entryText.value;
        const tags = entryTags.value.split(',').map(tag => tag.trim()).filter(tag => tag !== '');

        if (text) {
            const entries = getEntries();
            entries.push({ text: text, tags: tags });
            saveEntries(entries);
            displayEntries(entries);

            // Очистити поля вводу
            entryText.value = '';
            entryTags.value = '';
        } else {
            alert('Будь ласка, введіть текст запису.');
        }
    }

    // Функція для видалення запису
    function deleteEntry(index) {
        const entries = getEntries();
        entries.splice(index, 1);
        saveEntries(entries);
        displayEntries(entries);
    }

    // Функція для фільтрації записів за тегами
    function filterEntries() {
        const filterTags = filterTagsInput.value.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
        const entries = getEntries();

        if (filterTags.length > 0) {
            const filteredEntries = entries.filter(entry => {
                return filterTags.every(tag => entry.tags.includes(tag));
            });
            displayEntries(filteredEntries);
        } else {
            displayEntries(entries); // Показати всі записи, якщо фільтр порожній
        }
    }


    // Обробники подій
    saveEntryButton.addEventListener('click', addEntry);
    filterButton.addEventListener('click', filterEntries);

    // Завантажити та відобразити записи при завантаженні сторінки
    displayEntries(getEntries());
});
