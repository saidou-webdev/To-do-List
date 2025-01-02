const form = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');

// Charger l'historique des tâches depuis le localStorage au démarrage
document.addEventListener('DOMContentLoaded', function () {
    loadTasks();
});

// Écouter l'événement de soumission du formulaire
form.addEventListener('submit', function (event) {
    event.preventDefault();

    const taskText = taskInput.value.trim();

    if (taskText !== '') {
        addTask(taskText);
        taskInput.value = ''; // Vider le champ de saisie après ajout
    }
});

// Fonction pour ajouter une tâche à la liste
function addTask(taskText) {
    const taskItem = document.createElement('li');
    const now = new Date();
    const formattedDate = now.toLocaleDateString();
    const formattedTime = now.toLocaleTimeString();
    const dateSpan = document.createElement('span');
    dateSpan.textContent = `[${formattedDate} ${formattedTime}]`;
    dateSpan.style.fontWeight = "bold";
    dateSpan.style.color = "#4caf50";

    const taskTextNode = document.createTextNode(taskText);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'supprimer';
    deleteButton.style.marginLeft = '10px';
    deleteButton.style.backgroundColor = '#ff4d4d';
    deleteButton.style.color = '#fff';
    deleteButton.style.border = 'none';
    deleteButton.style.borderRadius = '5px';
    deleteButton.style.cursor = 'pointer';

    // Bouton de modification
    const editButton = document.createElement('button');
    editButton.textContent = 'modifier';
    editButton.style.marginLeft = '10px';
    editButton.style.backgroundColor = '#4caf50';
    editButton.style.color = '#fff';
    editButton.style.border = 'none';
    editButton.style.borderRadius = '5px';
    editButton.style.cursor = 'pointer';

    // Gérer la modification d'une tâche
    editButton.addEventListener('click', function () {
        const newTaskText = prompt('Modifie la tâche:', taskText);
        if (newTaskText !== null && newTaskText.trim() !== '') {
            taskTextNode.textContent = newTaskText;
            updateTaskInLocalStorage();
        }
    });

    // Gérer la suppression d'une tâche
    deleteButton.addEventListener('click', function () {
        taskList.removeChild(taskItem);
        updateTaskInLocalStorage();
    });

    // Ajouter les éléments dans le li
    taskItem.appendChild(dateSpan);
    taskItem.appendChild(taskTextNode);
    taskItem.appendChild(editButton);
    taskItem.appendChild(deleteButton);

    // Ajouter la tâche à la liste
    taskList.appendChild(taskItem);

    // Mettre à jour l'historique dans le localStorage
    updateTaskInLocalStorage();
}

// Mettre à jour l'historique des tâches dans le localStorage
function updateTaskInLocalStorage() {
    const tasks = [];
    const taskItems = taskList.getElementsByTagName('li');

    for (let i = 0; i < taskItems.length; i++) {
        const taskText = taskItems[i].textContent.replace(/\[.*?\]/, '').trim();
        tasks.push(taskText);
    }

    localStorage.setItem('tasks', JSON.stringify(tasks));
}


