// Récupération des éléments DOM
const form = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const filterButtons = document.querySelectorAll('.filter-btn');
const searchInput = document.getElementById('search-input');
const categorySelect = document.getElementById('category-select');
const prioritySelect = document.getElementById('priority-select');
const dateInput = document.getElementById('date-input');

// Charger les tâches depuis le localStorage au démarrage
document.addEventListener('DOMContentLoaded', loadTasks);

// Soumission du formulaire pour ajouter une tâche
form.addEventListener('submit', function (event) {
    event.preventDefault();

    const taskText = taskInput.value.trim();
    const category = categorySelect.value || "Autre";
    const priority = prioritySelect.value || "Basse";
    const date = dateInput.value || "";

    if (taskText) {
        addTask(taskText, category, priority, date);
        taskInput.value = "";
        dateInput.value = "";
    } else {
        alert("Veuillez remplir le champ de texte.");
    }
});

// Fonction pour ajouter une tâche
function addTask(taskText, category, priority, date) {
    const taskItem = document.createElement('li');
    taskItem.classList.add('task-item');

    // Tâche : texte
    const taskTextNode = document.createElement('span');
    taskTextNode.textContent = taskText;
    taskTextNode.style.marginRight = '10px';

    // Tâche : catégorie
    const categorySpan = document.createElement('span');
    categorySpan.textContent = `(${category})`;
    categorySpan.style.fontStyle = 'italic';
    categorySpan.style.marginRight = '10px';

    // Tâche : priorité
    const prioritySpan = document.createElement('span');
    prioritySpan.textContent = `[Priorité: ${priority}]`;
    prioritySpan.style.color =
        priority === 'Haute' ? 'red' : priority === 'Moyenne' ? 'orange' : 'green';
    prioritySpan.style.marginRight = '10px';

    // Tâche : date
    const dateSpan = document.createElement('span');
    dateSpan.textContent = date ? `[Date: ${date}]` : '[Date: Non spécifiée]';
    dateSpan.style.fontWeight = 'bold';
    dateSpan.style.color = '#4caf50';
    dateSpan.style.marginRight = '10px';

    // Boutons d'action
    const buttonsContainer = document.createElement('div');
    buttonsContainer.style.display = 'flex';
    buttonsContainer.style.gap = '10px';

    // Bouton "Terminé"
    const completeButton = document.createElement('button');
    completeButton.textContent = 'Terminé';
    completeButton.classList.add('complete-btn');
    completeButton.addEventListener('click', function () {
        taskItem.classList.toggle('completed');
        updateTaskInLocalStorage();
    });

    // Bouton "Modifier"
    const editButton = document.createElement('button');
    editButton.textContent = 'Modifier';
    editButton.classList.add('edit-btn');
    editButton.addEventListener('click', function () {
        editTask(taskItem, taskTextNode, categorySpan, prioritySpan, dateSpan);
    });

    // Bouton "Supprimer"
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Supprimer';
    deleteButton.classList.add('delete-btn');
    deleteButton.addEventListener('click', function () {
        taskList.removeChild(taskItem);
        updateTaskInLocalStorage();
    });

    // Ajout des boutons au conteneur
    buttonsContainer.appendChild(completeButton);
    buttonsContainer.appendChild(editButton);
    buttonsContainer.appendChild(deleteButton);

    // Construction de la tâche
    taskItem.appendChild(taskTextNode);
    taskItem.appendChild(categorySpan);
    taskItem.appendChild(prioritySpan);
    taskItem.appendChild(dateSpan);
    taskItem.appendChild(buttonsContainer);

    // Ajout à la liste
    taskList.appendChild(taskItem);

    // Mettre à jour le localStorage
    updateTaskInLocalStorage();
}

// Fonction pour modifier une tâche
function editTask(taskItem, taskTextNode, categorySpan, prioritySpan, dateSpan) {
    const currentText = taskTextNode.textContent;
    const currentCategory = categorySpan.textContent.slice(1, -1);
    const currentPriority = prioritySpan.textContent.replace('Priorité: ', '').slice(1, -1);
    const currentDate = dateSpan.textContent.replace('[Date: ', '').replace(']', '');

    const editForm = document.createElement('div');
    editForm.classList.add('edit-form');
    editForm.style.display = 'flex';
    editForm.style.flexDirection = 'column';
    editForm.style.gap = '5px';

    const textInput = document.createElement('input');
    textInput.type = 'text';
    textInput.value = currentText;

    const categoryInput = document.createElement('select');
    ['Travail', 'Maison', 'Courses', 'Autre'].forEach(optionValue => {
        const option = document.createElement('option');
        option.value = optionValue;
        option.textContent = optionValue;
        if (optionValue === currentCategory) option.selected = true;
        categoryInput.appendChild(option);
    });

    const priorityInput = document.createElement('select');
    ['Basse', 'Moyenne', 'Haute'].forEach(optionValue => {
        const option = document.createElement('option');
        option.value = optionValue;
        option.textContent = optionValue;
        if (optionValue === currentPriority) option.selected = true;
        priorityInput.appendChild(option);
    });

    const dateInput = document.createElement('input');
    dateInput.type = 'date';
    dateInput.value = currentDate;

    const saveButton = document.createElement('button');
    saveButton.textContent = 'Enregistrer';
    saveButton.addEventListener('click', function () {
        taskTextNode.textContent = textInput.value;
        categorySpan.textContent = `(${categoryInput.value})`;
        prioritySpan.textContent = `[Priorité: ${priorityInput.value}]`;
        dateSpan.textContent = dateInput.value ? `[Date: ${dateInput.value}]` : '[Date: Non spécifiée]';

        prioritySpan.style.color =
            priorityInput.value === 'Haute' ? 'red' : priorityInput.value === 'Moyenne' ? 'orange' : 'green';

        taskItem.removeChild(editForm);
        updateTaskInLocalStorage();
    });

    editForm.appendChild(textInput);
    editForm.appendChild(categoryInput);
    editForm.appendChild(priorityInput);
    editForm.appendChild(dateInput);
    editForm.appendChild(saveButton);
    taskItem.appendChild(editForm);
}

// Fonction de mise à jour pour le localStorage
function updateTaskInLocalStorage() {
    const tasks = [];
    const taskItems = taskList.querySelectorAll('.task-item');

    taskItems.forEach(item => {
        const task = {
            text: item.querySelector('span:nth-child(1)').textContent,
            category: item.querySelector('span:nth-child(2)').textContent.slice(1, -1),
            priority: item.querySelector('span:nth-child(3)').textContent.replace('Priorité: ', '').slice(1, -1),
            date: item.querySelector('span:nth-child(4)').textContent.replace('[Date: ', '').replace(']', ''),
            completed: item.classList.contains('completed'),
        };
        tasks.push(task);
    });

    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Fonction de recherche
searchInput.addEventListener('input', function () {
    const query = searchInput.value.toLowerCase();
    const taskItems = taskList.querySelectorAll('.task-item');

    taskItems.forEach(item => {
        const text = item.querySelector('span:nth-child(1)').textContent.toLowerCase();
        item.style.display = text.includes(query) ? '' : 'none';
    });
});

// Filtres : terminée / non terminée / toutes
filterButtons.forEach(button => {
    button.addEventListener('click', function () {
        const filter = this.getAttribute('data-filter');
        const taskItems = taskList.querySelectorAll('.task-item');

        // Réinitialiser l'état actif des boutons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');

        taskItems.forEach(item => {
            if (filter === 'all') {
                // Afficher toutes les tâches
                item.style.display = '';
            } else if (filter === 'completed') {
                // Afficher uniquement les tâches terminées
                item.style.display = item.classList.contains('completed') ? '' : 'none';
            } else if (filter === 'uncompleted') {
                // Afficher uniquement les tâches non terminées
                item.style.display = !item.classList.contains('completed') ? '' : 'none';
            }
        });
    });
});

// Charger les tâches depuis le localStorage
function loadTasks() {
    const tasks = JSON.parse
}