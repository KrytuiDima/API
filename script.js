// Заміна початкового завантаження даних: завантажуємо обидва файли (data + results) перед ініціалізацією
Promise.all([
    fetch('js/jasu-data (1).json').then(resp => {
        if (!resp.ok) throw new Error(`HTTP error! status: ${resp.status}`);
        return resp.json();
    }),
    fetch('js/resolt.json').then(resp => {
        if (!resp.ok) {
            console.warn('Не вдалося завантажити js/resolt.json, повертаємо порожній масив');
            return [];
        }
        return resp.json();
    }).catch(err => {
        console.error('Помилка при завантаженні results:', err);
        return [];
    })
])
.then(([data, results]) => {
    const cardContainer = document.querySelector('#card-container');
    const regionFilter = document.querySelector('#region-filter');
    const searchInput = document.querySelector('#search-input');
    const recordCountSelect = document.querySelector('#record-count');
    const customCountInput = document.querySelector('#custom-count');
    const searchBySelect = document.querySelector('#search-by');
    const departmentFilter = document.querySelector('#department-filter');
    const filtersContainer = document.querySelector('.filters');

    // кеш результатів
    let resultsDataCache = results || [];

    // helper: нормалізоване порівняння імен для надійного матчингу
    function findParticipantResultByAuthor(author) {
        if (!author) return undefined;
        const a = author.toLowerCase().trim();
        return resultsDataCache.find(r => {
            const name = (r.name || r.author || '').toLowerCase().trim();
            if (!name) return false;
            // точна відповідність або часткова (contains)
            return name === a || name.includes(a) || a.includes(name);
        });
    }

    // Create modal structure
    const modal = document.createElement('div');
    modal.id = 'imageModal';
    modal.style.display = 'none';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0,0,0,0.8)';
    modal.style.zIndex = '1000';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.style.overflow = 'auto';

    const modalImage = document.createElement('img');
    modalImage.style.maxWidth = '90%';
    modalImage.style.maxHeight = '90%';
    modal.appendChild(modalImage);

    document.body.appendChild(modal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Theme toggle functionality
    const checkbox = document.getElementById('checkbox');
    const themeStyle = document.getElementById('theme-style');
    const themeText = document.getElementById('theme-text');
    let isLightTheme = true;
    let selectedSource = 'json';

    // Function to create the image source selector
    function createImageSourceSelector() {
        const selector = document.createElement('select');
        selector.id = 'image-source-selector';

        const jsonOption = document.createElement('option');
        jsonOption.value = 'json';
        jsonOption.textContent = 'JSON';

        const folderOption = document.createElement('option');
        folderOption.value = 'folder';
        folderOption.textContent = 'Folder';

        selector.appendChild(jsonOption);
        selector.appendChild(folderOption);

        selector.value = selectedSource;

        selector.addEventListener('change', function() {
            selectedSource = this.value;
            displayData(data.slice(0, 10));
        });

        selector.style.padding = '0.75rem 1rem';
        selector.style.fontSize = '1rem';
        selector.style.borderRadius = '2rem';
        selector.style.border = '1px solid #ccc';
        selector.style.backgroundColor = '#fff';
        selector.style.color = '#333';
        selector.style.outline = 'none';
        selector.style.transition = 'border-color 0.3s, box-shadow 0.3s';
        selector.style.margin = '0 0.5rem';

        selector.addEventListener('focus', function() {
            this.style.borderColor = '#7e57c2';
            this.style.boxShadow = '0 0 0 0.2rem rgba(126, 87, 194, 0.25)';
        });

        return selector;
    }

    const imageSourceSelector = createImageSourceSelector();
    filtersContainer.appendChild(imageSourceSelector);

    // Place filter
    const placeFilter = document.createElement('select');
    placeFilter.id = 'place-filter';

    const allPlacesOption = document.createElement('option');
    allPlacesOption.value = '';
    allPlacesOption.textContent = 'Всі місця';
    placeFilter.appendChild(allPlacesOption);

    const firstPlaceOption = document.createElement('option');
    firstPlaceOption.value = 'I';
    firstPlaceOption.textContent = 'I місце';
    placeFilter.appendChild(firstPlaceOption);

    const secondPlaceOption = document.createElement('option');
    secondPlaceOption.value = 'II';
    secondPlaceOption.textContent = 'II місце';
    placeFilter.appendChild(secondPlaceOption);

    const thirdPlaceOption = document.createElement('option');
    thirdPlaceOption.value = 'III';
    thirdPlaceOption.textContent = 'III місце';
    placeFilter.appendChild(thirdPlaceOption);

    filtersContainer.appendChild(placeFilter);

    checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
            themeStyle.href = 'css/darkstyle.css';
            themeText.textContent = 'Світла';
            isLightTheme = false;
        } else {
            themeStyle.href = 'css/style.css';
            themeText.textContent = 'Темна';
            isLightTheme = true;
        }
    });

    const displayData = (filteredData) => {
        console.log('Filtered Data:', filteredData);
        cardContainer.innerHTML = '';
        filteredData.forEach(item => {
            const card = document.createElement('div');
            card.className = 'card';

            let imageSrc = '';
            if (selectedSource === 'json') {
                imageSrc = 'https://jasu2025.eu/' + item.image;
            } else if (selectedSource === 'folder') {
                const id = item.id;
                imageSrc = item.image;
            }

            const thumbnailButton = document.createElement('img');
            thumbnailButton.src = imageSrc;
            thumbnailButton.className = 'card-thumbnail';
            thumbnailButton.style.width = '50px';
            thumbnailButton.style.height = '50px';
            thumbnailButton.style.borderRadius = '5px';
            thumbnailButton.style.cursor = 'pointer';
            thumbnailButton.addEventListener('click', () => {
                modalImage.src = imageSrc;
                modal.style.display = 'flex';
            });

            const descriptionContainer = document.createElement('div');
            descriptionContainer.className = 'description-container';
            descriptionContainer.innerHTML = `<p>${item.description}</p>`;
            descriptionContainer.style.display = 'none';

            const toggleButton = document.createElement('button');
            toggleButton.textContent = 'Розгорнути опис';
            toggleButton.className = 'card-button description-toggle';

            toggleButton.addEventListener('click', () => {
                if (descriptionContainer.style.display === 'none') {
                    descriptionContainer.style.display = 'block';
                    toggleButton.textContent = 'Згорнути опис';
                } else {
                    descriptionContainer.style.display = 'none';
                    toggleButton.textContent = 'Розгорнути опис';
                }
            });

            const resultsButton = document.createElement('button');
            resultsButton.textContent = 'Показати результати';
            resultsButton.className = 'card-button results-button';
            resultsButton.addEventListener('click', () => {
                const participantResult = findParticipantResultByAuthor(item.author);

                if (participantResult) {
                    const resultsModal = document.createElement('div');
                    resultsModal.id = 'resultsModal';
                    resultsModal.style.display = 'none';
                    resultsModal.style.position = 'fixed';
                    resultsModal.style.top = '0';
                    resultsModal.style.left = '0';
                    resultsModal.style.width = '100%';
                    resultsModal.style.height = '100%';
                    resultsModal.style.backgroundColor = 'rgba(0,0,0,0.8)';
                    resultsModal.style.zIndex = '1001';
                    resultsModal.style.justifyContent = 'center';
                    resultsModal.style.alignItems = 'center';
                    resultsModal.style.overflow = 'auto';

                    const resultsContent = document.createElement('div');
                    resultsContent.style.backgroundColor = 'white';
                    resultsContent.style.padding = '20px';
                    resultsContent.style.borderRadius = '5px';
                    resultsContent.style.maxWidth = '80%';
                    resultsContent.style.maxHeight = '80%';
                    resultsContent.style.overflow = 'auto';

                    resultsContent.innerHTML = `
                        <h3>Результати для ${participantResult.name ?? participantResult.author}</h3>
                        <p>Дистанційний: ${participantResult.scores?.remote ?? '—'}</p>
                        <p>Постер: ${participantResult.scores?.poster ?? '—'}</p>
                        <p>Конференція: ${participantResult.scores?.conference ?? '—'}</p>
                        <p>Всього: ${participantResult.total ?? '—'}</p>
                        <p>Місце: ${participantResult.place ?? participantResult.overall_rank ?? '—'}</p>
                    `;

                    const closeButton = document.createElement('button');
                    closeButton.textContent = 'Закрити';
                    closeButton.addEventListener('click', () => {
                        resultsModal.style.display = 'none';
                        document.body.removeChild(resultsModal);
                    });

                    resultsContent.appendChild(closeButton);
                    resultsModal.appendChild(resultsContent);
                    document.body.appendChild(resultsModal);

                    resultsModal.style.display = 'flex';

                    resultsModal.addEventListener('click', (e) => {
                        if (e.target === resultsModal) {
                            resultsModal.style.display = 'none';
                            document.body.removeChild(resultsModal);
                        }
                    });
                } else {
                    alert(`Результати для ${item.author} не знайдено.`);
                }
            });

            const titleContainer = document.createElement('div');
            titleContainer.style.height = '250px';
            titleContainer.style.width = '100%';
            titleContainer.style.overflow = 'hidden';
            titleContainer.innerHTML = `<h3>${item.title}</h3>`;

            const schoolContainer = document.createElement('div');
            schoolContainer.style.height = '150px';
            schoolContainer.style.width = '100%';
            schoolContainer.style.overflow = 'hidden';
            schoolContainer.innerHTML = `<p><strong>Школа:</strong> ${item.school}</p>`;

            const authorContainer = document.createElement('div');
            authorContainer.style.height = '50px';
            authorContainer.style.width = '100%';
            authorContainer.style.overflow = 'hidden';
            authorContainer.innerHTML = `<p><strong>Автор:</strong> ${item.author}</p>`;

            const departmentContainer = document.createElement('div');
            departmentContainer.style.height = '50px';
            departmentContainer.style.width = '100%';
            departmentContainer.style.overflow = 'hidden';
            departmentContainer.innerHTML = `<p><strong>Відділення:</strong> ${item.department}</p>`;

            const regionContainer = document.createElement('div');
            regionContainer.style.height = '70px';
            regionContainer.style.width = '100%';
            regionContainer.style.overflow = 'hidden';
            regionContainer.innerHTML = `<p><strong>Область:</strong> ${item.region}</p>`;

            const placeContainer = document.createElement('div');
            placeContainer.style.height = '70px';
            placeContainer.style.width = '100%';
            placeContainer.style.overflow = 'hidden';
            placeContainer.innerHTML = `<p><strong>Місце:</strong> Завантаження...</p>`;

            card.appendChild(titleContainer);
            card.appendChild(schoolContainer);
            card.appendChild(authorContainer);
            card.appendChild(departmentContainer);
            card.appendChild(regionContainer);
            card.appendChild(placeContainer);

            const cardButtons = document.createElement('div');
            cardButtons.className = 'card-buttons';

            cardButtons.appendChild(toggleButton);
            cardButtons.appendChild(resultsButton);

            const thumbnailContainer = document.createElement('div');
            thumbnailContainer.appendChild(thumbnailButton);
            cardButtons.appendChild(thumbnailContainer);

            card.appendChild(cardButtons);
            card.appendChild(descriptionContainer);
            cardContainer.appendChild(card);

            // Використовуємо кешовані результати для показу місця (через helper)
            const participantResult = findParticipantResultByAuthor(item.author);
            if (participantResult) {
                placeContainer.innerHTML = `<p><strong>Місце:</strong> ${participantResult.place ?? participantResult.overall_rank ?? 'Інформація відсутня'}</p>`;
            } else {
                placeContainer.innerHTML = `<p><strong>Місце:</strong> Інформація відсутня</p>`;
            }
        });
    };

    const regions = [...new Set(data.map(item => item.region))];
    regions.forEach(region => {
        const option = document.createElement('option');
        option.value = region;
        option.textContent = region;
        regionFilter.appendChild(option);
    });

    const departments = [...new Set(data.map(item => item.department))];
    departments.forEach(department => {
        const option = document.createElement('option');
        option.value = department;
        option.textContent = department;
        departmentFilter.appendChild(option);
    });

    const filterData = () => {
        const searchText = searchInput.value.toLowerCase();
        const selectedRegion = regionFilter.value;
        let recordCount = recordCountSelect.value;
        const searchBy = searchBySelect.value;
        const selectedDepartment = departmentFilter.value;
        const selectedPlace = placeFilter.value;

        if (recordCount === 'custom') {
            recordCount = parseInt(customCountInput.value) || data.length;
        } else {
            recordCount = parseInt(recordCount);
        }

        const filteredData = data.filter(item => {
            let matchesSearch = false;
            if (searchBy === 'title') {
                matchesSearch = item.title.toLowerCase().includes(searchText);
            } else if (searchBy === 'author') {
                matchesSearch = item.author.toLowerCase().includes(searchText);
            } else if (searchBy === 'school') {
                matchesSearch = item.school.toLowerCase().includes(searchText);
            } else {
                matchesSearch = true;
            }

            const matchesRegion = selectedRegion ? item.region === selectedRegion : true;
            const matchesDepartment = selectedDepartment ? item.department === selectedDepartment : true;

            // Перевіряємо місце через кешовані результати
            let matchesPlace = true;
            if (selectedPlace) {
                // використовуємо helper, щоб знайти результати для цього автора
                const participantResult = findParticipantResultByAuthor(item.author);
                matchesPlace = !!(participantResult && (participantResult.place === selectedPlace || participantResult.overall_rank === selectedPlace));
            }

            return matchesSearch && matchesRegion && matchesDepartment && matchesPlace;
        });

        console.log('Filtered Data before displayData:', filteredData);
        displayData(filteredData.slice(0, recordCount));
    };

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
    searchBySelect.addEventListener('change', () => {
        filterData();
    });
    departmentFilter.addEventListener('change', filterData);
    placeFilter.addEventListener('change', filterData);

    const searchByOptions = ['school'];
    searchByOptions.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option;
        optionElement.textContent = 'Пошук за школою';
        searchBySelect.appendChild(optionElement);
    });

    // Показуємо після того як обидва файли завантажено
    displayData(data.slice(0, 10));
})
.catch(error => console.error('Помилка завантаження даних:', error));

// Smoke effect
const canvas = document.getElementById("smoke");
const ctx = canvas.getContext("2d");
const toggle = document.getElementById("toggle");

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
});

const particles = [];
let effectEnabled = false;
let isLightTheme = true;

toggle.addEventListener("click", () => {
    effectEnabled = !effectEnabled;
    toggle.classList.toggle("active", effectEnabled);
    toggle.textContent = "Трейл: " + (effectEnabled ? "увімк." : "вимк.");
});

function spawnParticles(x, y, amount, sizeMultiplier = 1) {
    for (let i = 0; i < amount; i++) {
        particles.push({
            x,
            y,
            alpha: 0.1 + Math.random() * 0.1,
            radius: (3 + Math.random() * 3) * sizeMultiplier,
            dx: (Math.random() - 0.5) * 0.6 * sizeMultiplier,
            dy: (Math.random() - 0.5) * 0.6 * sizeMultiplier,
            life: 40
        });
    }
}

document.addEventListener("mousemove", (e) => {
    if (effectEnabled) {
        spawnParticles(e.clientX, e.clientY, 1);
    }
});

document.addEventListener("mousedown", (e) => {
    if (effectEnabled) {
        spawnParticles(e.clientX, e.clientY, 10, 1.5);
    }
});

function draw() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        ctx.beginPath();
        if (isLightTheme) {
            ctx.fillStyle = `rgba(100, 100, 150, ${p.alpha})`;
        } else {
            ctx.fillStyle = `rgba(200, 200, 255, ${p.alpha})`;
        }
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        p.x += p.dx;
        p.y += p.dy;
        p.alpha *= 0.96;
        p.life--;

        if (p.life <= 0 || p.alpha <= 0.01) {
            particles.splice(i, 1);
            i--;
        }
    }

    requestAnimationFrame(draw);
}

draw();

const checkbox = document.getElementById('checkbox');
checkbox.addEventListener('change', () => {
    isLightTheme = !checkbox.checked;
});