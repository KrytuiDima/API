fetch('js/table-data (1).json')
    .then(response => response.json())
    .then(data => {
        const cardContainer = document.querySelector('#card-container');
        const regionFilter = document.querySelector('#region-filter');
        const searchInput = document.querySelector('#search-input');
        const recordCountSelect = document.querySelector('#record-count');
        const customCountInput = document.querySelector('#custom-count');

        // Функція для відображення даних
        const displayData = (filteredData) => {
            cardContainer.innerHTML = '';
            filteredData.forEach(item => {
                const card = document.createElement('div');
                card.className = 'card';
                card.innerHTML = `
                    <h3>${item['Назва']}</h3>
                    <p><strong>№:</strong> ${item['№']}</p>
                    <p><strong>Відділення:</strong> ${item['Відділення']}</p>
                    <p><strong>Область:</strong> ${item['Область']}</p>
                    <a href="${item['Детальна інформація']}" target="_blank">Детальна інформація</a>
                    <a href="${item['Віртуальний постер']}" target="_blank">Віртуальний постер</a>
                `;
                cardContainer.appendChild(card);
            });
        };

        // Ініціалізація фільтра областей
        const regions = [...new Set(data.map(item => item['Область']))];
        regions.forEach(region => {
            const option = document.createElement('option');
            option.value = region;
            option.textContent = region;
            regionFilter.appendChild(option);
        });

        // Фільтрація та пошук
        const filterData = () => {
            const searchText = searchInput.value.toLowerCase();
            const selectedRegion = regionFilter.value;
            let recordCount = recordCountSelect.value;

            if (recordCount === 'custom') {
                recordCount = parseInt(customCountInput.value) || data.length;
            } else {
                recordCount = parseInt(recordCount);
            }

            const filteredData = data
                .filter(item => {
                    const matchesSearch = item['Назва'].toLowerCase().includes(searchText);
                    const matchesRegion = selectedRegion ? item['Область'] === selectedRegion : true;
                    return matchesSearch && matchesRegion;
                })
                .slice(0, recordCount);

            displayData(filteredData);
        };

        // Додати обробники подій
        searchInput.addEventListener('input', filterData);
        regionFilter.addEventListener('change', filterData);
        recordCountSelect.addEventListener('change', () => {
            if (recordCountSelect.value === 'custom') {
                customCountInput.style.display = 'inline-block';
            } else {
                customCountInput.style.display = 'none';
                filterData();
            }
        });
        customCountInput.addEventListener('input', filterData);

        // Відобразити всі дані спочатку
        displayData(data.slice(0, 10)); // За замовчуванням 10 записів
    })
    .catch(error => console.error('Помилка завантаження даних:', error));