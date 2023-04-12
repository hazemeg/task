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
    showPopup('عفواً، لا يمكنك إضافة اكثر من 30 مهمة');
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
      if (!taskObject.completed && Date.now() - taskObject.timestamp >= 7 * 24 * 60 * 60 * 1000) {
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
    if (newTask !== null && newTask.trim() !== '') {
      taskObject.task = newTask.trim();
    }
  });

  taskText.textContent = taskObject.task;
  editButton.textContent = 'تعديل';
  editButton.addEventListener('click', function() {
    const popUp = document.createElement('div');
    popUp.classList.add('popup');
    const input = document.createElement('input');
    input.value = taskObject.task;
    input.maxLength = 25;
    const saveButton = document.createElement('button');
    saveButton.textContent = 'حفظ';
    saveButton.addEventListener('click', function(event) {
      event.preventDefault();
      const newTask = input.value.trim();
      if (newTask !== '') {
        taskObject.task = newTask;
        taskText.textContent = newTask;
        localStorage.setItem(key, JSON.stringify(taskObject));
        document.body.removeChild(popUp);
      }
    });
    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'إلغاء';
    cancelButton.addEventListener('click', function() {
      document.body.removeChild(popUp);
    });
    const closeButton = document.createElement('button');
    closeButton.textContent = '×';
    closeButton.addEventListener('click', function() {
      document.body.removeChild(popUp);
    });
    popUp.appendChild(input);
    popUp.appendChild(saveButton);
    popUp.appendChild(cancelButton);
    popUp.appendChild(closeButton);
    document.body.appendChild(popUp);
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

let userName = localStorage.getItem('userName');
if (userName) {
  const userNameElement = document.getElementById('user-name');
  userNameElement.textContent = ` ${userName}`;

  const newNameInput = document.getElementById('new-name-input');
  const changeNameButton = document.getElementById('change-name-button');
  changeNameButton.addEventListener('click', () => {
    const newName = newNameInput.value;
    if (newName) {
      localStorage.setItem('userName', newName);
      userNameElement.textContent = ` ${newName}`;
      $('#changeNameModal').modal('hide');
    }
  });
}





let userAge = localStorage.getItem('userAge');
let userGender = localStorage.getItem('userGender');

if (!userName) {
  userName = prompt('Please enter your first name:');
  localStorage.setItem('userName', userName);
  createWelcomeModal(userName);
} else {
  createWelcomeModal(userName);
}

if (!userAge) {
  userAge = prompt('Please enter your age:');
  localStorage.setItem('userAge', userAge);
}


if (!userName || !userAge) {
  userName = prompt('Please enter your name:');
  localStorage.setItem('userName', userName);

  userAge = prompt('Please enter your age:');
  localStorage.setItem('userAge', userAge);

  createWelcomeModal(userName);
}

function createWelcomeModal(userName) {
  const modal = document.createElement('div');
  modal.classList.add('modal', 'fade');
  modal.setAttribute('tabindex', '-1');
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-labelledby', 'exampleModalLongTitle');
  modal.setAttribute('aria-hidden', 'true');
  
  const modalDialog = document.createElement('div');
  modalDialog.classList.add('modal-dialog');
  modalDialog.setAttribute('role', 'document');
  
  const modalContent = document.createElement('div');
  modalContent.classList.add('modal-content');
  
  const modalHeader = document.createElement('div');
  modalHeader.classList.add('modal-header');
  
  const modalTitle = document.createElement('h5');
  modalTitle.classList.add('modal-title');
  modalTitle.setAttribute('id', 'exampleModalLongTitle');
  modalTitle.textContent = 'Welcome!';
  
  const closeButton = document.createElement('button');
  closeButton.classList.add('close');
  closeButton.setAttribute('type', 'button');
  closeButton.setAttribute('data-dismiss', 'modal');
  closeButton.setAttribute('aria-label', 'Close');
  
  const closeIcon = document.createElement('span');
  closeIcon.setAttribute('aria-hidden', 'true');
  closeIcon.innerHTML = '&times;';
  
  closeButton.appendChild(closeIcon);
  
  const modalBody = document.createElement('div');
  modalBody.classList.add('modal-body');
  modalBody.textContent = `Welcome to Daily Tasks, ${userName}!`;
  
  modalHeader.appendChild(modalTitle);
  modalHeader.appendChild(closeButton);
  
  modalContent.appendChild(modalHeader);
  modalContent.appendChild(modalBody);
  
  modalDialog.appendChild(modalContent);
  
  modal.appendChild(modalDialog);
  
  document.body.appendChild(modal);
  
  $(modal).modal('show');
}

        
// Get user name from somewhere and set it to the navigation bar
document.getElementById("user-name").innerHTML = userName;

// Update user's time spent every 5 minutes
let timeSpent = 0;
setInterval(() => {
  timeSpent += 1;
  const minutes = Math.floor(timeSpent / 60);
  const seconds = timeSpent % 60;
  let formattedTime;
  if (minutes < 1) {
    formattedTime = `${seconds} ثانية`;
  } else if (minutes >= 1 && minutes < 60) {
    formattedTime = `${minutes} دقيقة و ${seconds} ثانية`;
  } else {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    formattedTime = `${hours} ساعة و ${remainingMinutes} دقيقة`;
  }
  document.getElementById("time-spent").innerHTML = formattedTime;
}, 1000); // 5 minutes in milliseconds

// Show message every 5 minutes
setInterval(() => {
  const minutes = Math.floor(timeSpent / 60);
  const seconds = timeSpent % 60;
  let formattedTime;
  if (minutes < 1) {
    formattedTime = `${seconds} ثانية`;
  } else if (minutes >= 1 && minutes < 60) {
    formattedTime = `${minutes} دقيقة و ${seconds} ثانية`;
  } else {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    formattedTime = `${hours} ساعة و ${remainingMinutes} دقيقة`;
  }
  const message = `${userName}، لقد قضيت ${formattedTime} في الموقع!`;
  document.getElementById("myAlert").innerHTML = message;
  document.getElementById("myAlert").classList.add("show");
  setTimeout(() => {
    document.getElementById("myAlert").classList.remove("show");
  }, 3000);
},    60 * 1000); // 5 minutes in milliseconds



const toggleThemeBtn = document.getElementById("toggle-theme");
const themeText = document.getElementById("theme-text");
const notification = document.createElement("div");
notification.classList.add("notification");
document.body.appendChild(notification);

toggleThemeBtn.addEventListener("click", function () {
  document.body.classList.toggle("dark-mode");
  if (document.body.classList.contains("dark-mode")) {
    themeText.textContent = "light mode";
    notification.textContent = `${userName}، لقد تم التغيير إلى الوضع الداكن.` ;
  } else {
    themeText.textContent = "dark mode";
    notification.textContent = `${userName}، لقد تم التغيير إلى الوضع الفاتح.`;
  }
  notification.style.display = "block";
  setTimeout(function () {
    notification.style.display = "none";
  }, 5000);
});



taskInput.addEventListener('input', function(event) {
  const input = event.target;
  const maxLength = input.maxLength;
  const currentLength = input.value.length;
  
  if (currentLength > maxLength) {
    const popup = document.createElement('div');
    popup.textContent = `الحد الأقصى للأحرف هو ${maxLength}`;
    popup.classList.add('popup-message');
    document.body.appendChild(popup);

    setTimeout(function() {
      document.body.removeChild(popup);
    }, 8000);

    input.value = input.value.slice(0, maxLength);
  }
});

const charCount = document.getElementById('char-count');
const MAX_CHARS = 25;

taskInput.addEventListener('input', function() {
  const charLength = taskInput.value.length;
  const charsLeft = MAX_CHARS - charLength;
  if (charsLeft < 0) {
    taskInput.setCustomValidity(`يجب أن يكون عدد الأحرف ${MAX_CHARS} أو أقل يرجي حذف حرف واحد`);
  } else {
    taskInput.setCustomValidity('');
    charCount.innerText = `${charsLeft}`;
  }
});


function getTime() {
  const now = new Date();
  let hours = now.getHours();
  let minutes = now.getMinutes();
  let amOrPm = hours < 12 ? "صباحًا" : "مساءً";
  
  if (hours > 12) {
    hours -= 12;
  } else if (hours === 0) {
    hours = 12;
  }
  
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  
  const timeString = hours + ":" + minutes + amOrPm;
  return timeString;
}


