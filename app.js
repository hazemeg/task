const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const incompleteTasks = document.getElementById('incomplete-tasks');
const completedTasks = document.getElementById('completed-tasks');
const popupContainer = document.getElementById('popup-container');
const popupMessage = document.getElementById('popup-message');
const popupClose = document.getElementById('popup-close');

taskForm.addEventListener('submit', function(event) {
  event.preventDefault();

  const task = taskInput.value.trim();

  if (task === '') {
    showPopup('عفواً، المهمة فارغة');
    return;
  }

  taskInput.value = '';

  if (localStorage.length >= 30) {
    showPopup('عفواً، لا يمكن إضافة المزيد من المهام');
    return;
  }

  const taskObject = {
    task: task,
    timestamp: Date.now(),
    completed: false
  };
  const key = 'task-' + Date.now();
  localStorage.setItem(key, JSON.stringify(taskObject));

  // إضافة المهمة إلى القائمة
  const taskElement = createTaskElement(taskObject, key);
  incompleteTasks.appendChild(taskElement);
});

function showPopup(message) {
  popupMessage.textContent = message;
  popupContainer.style.display = 'flex';
}

popupClose.addEventListener('click', function() {
  popupContainer.style.display = 'none';
});

// استرداد المهام المخزنة في localStorage
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  if (key.startsWith('task-')) {
    const taskObject = JSON.parse(localStorage.getItem(key));
    const taskElement = createTaskElement(taskObject, key);
    if (taskObject.completed) {
      completedTasks.appendChild(taskElement);
    } else {
      incompleteTasks.appendChild(taskElement);
    }
  }
}

// حذف المهام المنتهية تلقائياً بعد 24 ساعة
setInterval(function() {
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith('task-')) {
      const taskObject = JSON.parse(localStorage.getItem(key));
      if (!taskObject.completed && Date.now() - taskObject.timestamp >= 24 * 60 * 60 * 1000) {
        const taskElement = document.getElementById(key);
        if (taskElement) {
          taskElement.parentNode.removeChild(taskElement);
        }
        localStorage.removeItem(key);
      }
    }
  }
}, 60 * 1000); // يتم التحقق كل دقيقة من المهام المخزنة لحذف المهام التي انتهت صلاحيتها. يمكن تعديل هذه القيمة حسب الحاجة.

function createTaskElement(taskObject, key) {
  const taskElement = document.createElement('div');
  taskElement.classList.add('task');
  taskElement.id = key;
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = taskObject.completed;
  checkbox.addEventListener('click', function() {
    taskObject.completed = checkbox.checked;
    localStorage.setItem(key, JSON.stringify(taskObject));
    if (checkbox.checked) {
      taskElement.classList.add('completed');
      completedTasks.appendChild(taskElement);
    } else {
      taskElement.classList.remove('completed');
      incompleteTasks.appendChild(taskElement);
    }
  });
  const taskText = document.createElement('span');
  taskText.textContent = taskObject.task;
  const editButton = document.createElement('button');
  editButton.textContent = 'تعديل';
  editButton.addEventListener('click', function() {
    const newTask = prompt('أدخل اسم المهمة الجديد', taskObject.task);
    if (newTask !== null && newTask.trim() !== '') {
      taskObject.task = newTask.trim();
      taskText.textContent = newTask.trim();
      localStorage.setItem(key, JSON.stringify(taskObject));
    }
  });
  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'حذف';
  deleteButton.addEventListener('click', function() {
    taskElement.parentNode.removeChild(taskElement);
    localStorage.removeItem(key);
  });
  taskElement.appendChild(checkbox);
  taskElement.appendChild(taskText);
  taskElement.appendChild(editButton);
  taskElement.appendChild(deleteButton);
  return taskElement;
}

