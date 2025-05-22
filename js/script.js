fetch('js/jasu-data (1).json')
    .then(response => response.json())
    .then(data => {
        const cardContainer = document.querySelector('#card-container');
        const regionFilter = document.querySelector('#region-filter');
        const searchInput = document.querySelector('#search-input');
        const recordCountSelect = document.querySelector('#record-count');
        const customCountInput = document.querySelector('#custom-count');
        const searchBySelect = document.querySelector('#search-by'); // Get the search-by select element
        const departmentFilter = document.querySelector('#department-filter');

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

        // Функція для відображення даних
        const displayData = (filteredData) => {
            cardContainer.innerHTML = '';
            filteredData.forEach(item => {
                const card = document.createElement('div');
                card.className = 'card';

                // Create show image button
                const showImageButton = document.createElement('button');
                showImageButton.textContent = 'Показати зображення';
                showImageButton.className = 'card-button show-image-button';
                showImageButton.addEventListener('click', () => {
                    modalImage.src = item.image;
                    modal.style.display = 'flex';
                });

                // Create the description container and initially hide it
                const descriptionContainer = document.createElement('div');
                descriptionContainer.className = 'description-container';
                descriptionContainer.innerHTML = `<p>${item.description}</p>`;
                descriptionContainer.style.display = 'none'; // Hide initially

                // Create the toggle button
                const toggleButton = document.createElement('button');
                toggleButton.textContent = 'Розгорнути опис';
                toggleButton.className = 'card-button description-toggle';

                // Add event listener to the button
                toggleButton.addEventListener('click', () => {
                    if (descriptionContainer.style.display === 'none') {
                        descriptionContainer.style.display = 'block';
                        toggleButton.textContent = 'Згорнути опис';
                    } else {
                        descriptionContainer.style.display = 'none';
                        toggleButton.textContent = 'Розгорнути опис';
                    }
                });

                // Create results button
                const resultsButton = document.createElement('button');
                resultsButton.textContent = 'Показати результати';
                resultsButton.className = 'card-button results-button';
                resultsButton.addEventListener('click', () => {
                    fetch('js/resolt.json')
                        .then(response => response.json())
                        .then(resultsData => {
                            const participantResult = resultsData.find(result => result.name === item.author);

                            if (participantResult) {
                                // Create a new modal for results
                                const resultsModal = document.createElement('div');
                                resultsModal.id = 'resultsModal';
                                resultsModal.style.display = 'none';
                                resultsModal.style.position = 'fixed';
                                resultsModal.style.top = '0';
                                resultsModal.style.left = '0';
                                resultsModal.style.width = '100%';
                                resultsModal.style.height = '100%';
                                resultsModal.style.backgroundColor = 'rgba(0,0,0,0.8)';
                                resultsModal.style.zIndex = '1001'; // Higher than imageModal
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
                                    <h3>Результати для ${participantResult.name}</h3>
                                    <p>Дистанційний: ${participantResult.scores.remote}</p>
                                    <p>Постер: ${participantResult.scores.poster}</p>
                                    <p>Конференція: ${participantResult.scores.conference}</p>
                                    <p>Всього: ${participantResult.total}</p>
                                    <p>Місце: ${participantResult.overall_rank}</p>
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
                        })
                        .catch(error => console.error('Помилка завантаження результатів:', error));
                });

                card.innerHTML = `
                    <h3>${item.title}</h3>
                    <p><strong>Школа:</strong> ${item.school}</p>
                    <p><strong>Автор:</strong> ${item.author}</p>
                    <p><strong>Відділення:</strong> ${item.department}</p>
                    <p><strong>Область:</strong> ${item.region}</p>
                `;

                // Create a container for the buttons
                const cardButtons = document.createElement('div');
                cardButtons.className = 'card-buttons';

                cardButtons.appendChild(showImageButton);
                cardButtons.appendChild(toggleButton);
                cardButtons.appendChild(resultsButton);

                card.appendChild(cardButtons);
                card.appendChild(descriptionContainer); // Add the description container to the card
                cardContainer.appendChild(card);
            });
        };

        // Ініціалізація фільтра областей
        const regions = [...new Set(data.map(item => item.region))];
        regions.forEach(region => {
            const option = document.createElement('option');
            option.value = region;
            option.textContent = region;
            regionFilter.appendChild(option);
        });

         // Ініціалізація фільтра відділень
         const departments = [...new Set(data.map(item => item.department))];
         departments.forEach(department => {
             const option = document.createElement('option');
             option.value = department;
             option.textContent = department;
             departmentFilter.appendChild(option);
         });

        // Фільтрація та пошук
        const filterData = () => {
            const searchText = searchInput.value.toLowerCase();
            const selectedRegion = regionFilter.value;
            let recordCount = recordCountSelect.value;
            const searchBy = searchBySelect.value; // Get the selected search criteria
            const selectedDepartment = departmentFilter.value;

            if (recordCount === 'custom') {
                recordCount = parseInt(customCountInput.value) || data.length;
            } else {
                recordCount = parseInt(recordCount);
            }

            const filteredData = data
                .filter(item => {
                    let matchesSearch = false;
                    if (searchBy === 'title') {
                        matchesSearch = item.title.toLowerCase().includes(searchText);
                    } else if (searchBy === 'author') {
                        matchesSearch = item.author.toLowerCase().includes(searchText);
                    }
                    const matchesRegion = selectedRegion ? item.region === selectedRegion : true;
                    const matchesDepartment = selectedDepartment ? item.department === selectedDepartment : true;
                    return matchesSearch && matchesRegion && matchesDepartment;
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
        searchBySelect.addEventListener('change', filterData); // Add event listener for search-by select
        departmentFilter.addEventListener('change', filterData);

        // Відобразити всі дані спочатку
        displayData(data.slice(0, 10)); // За замовчуванням 10 записів
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
let isLightTheme = true; // Track the current theme

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
        // Use different colors based on the theme
        if (isLightTheme) {
            ctx.fillStyle = `rgba(100, 100, 150, ${p.alpha})`; // Darker color for light theme
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

// Listen for theme changes and update the smoke color
const checkbox = document.getElementById('checkbox');
checkbox.addEventListener('change', () => {
    isLightTheme = !checkbox.checked; // Update the theme flag
});