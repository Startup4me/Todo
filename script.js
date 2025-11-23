// =====================
// GLOBAL SELECTORS
// =====================
const todoContainer = document.querySelector('.todo-container');
const form =document.querySelector('.task-form');
const placeholder =document.querySelector('.placeholder');
const fab =document.getElementById('addBtn');
const taskDate= document.getElementById('task-date');
const customDateInput= document.getElementById('custom-date');
const Title=document.getElementById("task-title");
const taskDescInput=document.getElementById("task-desc");
const taskPriority = document.getElementById("task-priority");
const Cancel =document.querySelector(".btn-cancel");
let isEditing =false;
const toast = document.getElementById('toast');
//min date =today
const today =new Date().toISOString().split('T')[0];
customDateInput.min=today;


// expand/collapse form 
function expandForm(){
  placeholder.style.display='none';
  form.style.display='flex';
 Title.focus();
} 
function collapseForm(){
  form.reset();
  customDateInput.classList.add('hidden');
  taskDate.querySelector("option[value='custom']").textContent="📆 Custom";
  // console.log(taskDate);
  placeholder.style.display='block';
  form.style.display='none';  

  //Manually trigger the input event to update button states (removes active from btn)
  Title.dispatchEvent(new Event('input'));
}
// Show custom date input when "Custom" is selected
taskDate.addEventListener('change',()=>{
  if(taskDate.value==='custom'){
    customDateInput.classList.remove('hidden');
    customDateInput.focus();
  }else{
    customDateInput.classList.add('hidden');
  }
});

//Update dropdown text when custom date is selected
customDateInput.addEventListener('input',()=>{
  const selectedDate = customDateInput.value;
  //YYYY-MM-DD
  if(selectedDate){
    const formattedDate= new Date(selectedDate).toDateString();
    // console.log(formattedDate);
    taskDate.querySelector('option[value="custom"]').textContent=`📆 ${formattedDate}`;
  }else{
    taskDate.querySelector('option[value ="custom"]').textContent="📆 custom";
 }
});
//Get weekend date helper
//getWeekendDate();
function getWeekendDate(){
  const now=new Date();
  const day=now.getDay();
  //console.log(now.getDate());
  if(day === 6) now.setDate(now.getDate()+1);
  else now.setDate(now.getDate()+(6-day));
  return now.toISOString().split('T')[0];
}
 

//Add task
function addTask(e){
  e.preventDefault();
  
  const title =Title.value.trim();
  const desc= taskDescInput.value.trim();
  const dateChoice =taskDate.value;
  const priority= document.getElementById('task-priority').value;

  let finalDate;
  if(dateChoice === 'today') finalDate ='Today';
  else if (dateChoice === 'tomorrow') {
    const tmr=new Date();
    tmr.setDate(tmr.getDate()+1);
    finalDate =tmr.toDateString();
  }else if(dateChoice === 'weekend'){
    finalDate= new Date(getWeekendDate()).toDateString();
  }else{
    finalDate=new Date(customDateInput.value).toDateString();
   
  }
 
  const flag= document.createElement('span');
  flag.classList.add('flag');
  if(priority==='low') flag.classList.add('priority-low');
  if(priority==='medium') flag.classList.add('priority-medium');
    if(priority==='high') flag.classList.add('priority-high');
      if(priority==='urgent') flag.classList.add('priority-urgent');
      flag.textContent='⚑'

  
  const newTask ={ title, desc, date: finalDate, priority, completed: false};
  renderTask(newTask);
  saveTasks();
  collapseForm();
} 

 const addBtnIcon =document.getElementById('add-btn-icon');
 const addBtnText=document.getElementById('add-btn');

 Title.addEventListener('input',() =>{
  if(Title.value.trim() !==''){
    addBtnIcon.classList.add('active');
    addBtnText.classList.add('active');
  }else{
    addBtnIcon.classList.remove('active');
     addBtnText.classList.remove('active');
  }
 });
//Clicking the floating button also opens the form
 fab.addEventListener('click',expandForm);
 
/*DEMO 🎈🎈🎈🎈🎈
window.addEventListener("DOMContentLoaded",()=>{
  document.querySelector(".todo-container").innerHTML=`    <div class="task-card">
      <div class="task-header">
        <input type="checkbox">
        <span class="task-title">Sample Task</span>
      </div>
      <div class="task-desc">Description for previewing the design of the card.</div>
      <div class="task-footer">
        <span>📅 Today</span>
        <span class="flag priority-medium">⚑</span>
      </div>
    </div>
  `;
})*/
// ====================
// RENDER TASK FUNCTION
// ====================
function renderTask(task,isCompleted=false){
 
  const container = isCompleted
  ? document.querySelector('.completed-container')
  :document.querySelector('.todo-container');

  const taskCard =document.createElement('div');
  taskCard.className ='task-card hide'; // IMPORTANT: start hidden

  const taskHeader = document.createElement('div');
  taskHeader.className ='task-header';

  const checkbox =document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = isCompleted;

  const taskTitle =document.createElement('span');
  taskTitle.className ='task-title';
  taskTitle.textContent = task.title;

  taskHeader.appendChild(checkbox);
  taskHeader.appendChild(taskTitle);

  taskCard.appendChild(taskHeader);
  if(task.desc){
  let taskDesc = document.createElement('div');
  taskDesc.className ='task-desc';
  taskDesc.textContent = task.desc;
  taskCard.appendChild(taskDesc);
}
  const taskFooter =document.createElement('div');
  taskFooter.className = 'task-footer';

  const dateEl = document.createElement('span');
  dateEl.textContent = `📆 ${task.date}`;

  const flag = document.createElement('span');
  flag.classList.add('flag',`priority-${task.priority}`);
  flag.textContent = '⚑';  

  taskFooter.appendChild(dateEl);
  taskFooter.appendChild(flag);
 
  taskCard.appendChild(taskFooter);

  // --- Edit & Delete button ---
 const actions = document.createElement('div');
 actions.className = 'task-actions';

 const editBtn = document.createElement('button');
 editBtn.className = 'task-btn edit-btn';
 editBtn.textContent = '✏️';  

 const delBtn =document.createElement('button');
 delBtn.className = 'task-btn delete-btn';
 delBtn.textContent ='🗑️';

 actions.appendChild(editBtn);
 actions.appendChild(delBtn);

 taskCard.appendChild(actions);
  // Append to container (still hidden)
  container.appendChild(taskCard);

  //--- EDIT Button ---
  editBtn.addEventListener('click',()=>{
  expandForm();
  isEditing =true;

 taskDesc = taskCard.querySelector(".task-desc");
  Title.value = task.title;
  taskDescInput.value =task.desc;
   // Restore correct date option
if (task.date === "Today") {
    taskDate.value = "today";
} 
else if (task.date === new Date(Date.now() + 86400000).toDateString()) {
    taskDate.value = "tomorrow";
} 
else if (task.date === new Date(getWeekendDate()).toDateString()) {
    taskDate.value = "weekend";
} 
else { 
    // It's a custom date
    taskDate.value = "custom";
    customDateInput.classList.remove('hidden');
    const d = new Date(task.date);
customDateInput.value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;

   
    console.log(customDateInput.value);
} 

  taskPriority.value = task.priority;

  // const addBtn = document.getElementById('add-btn');
  addBtnText.textContent ='Save';
  addBtnIcon.textContent ="💾"; 
   
  form.onsubmit = (e) => {
    e.preventDefault();

    task.title = Title.value.trim(); 
     task.desc = taskDescInput.value.trim();
    if(task.desc){
   
      if(taskDesc){
        taskDesc.textContent =task.desc; 
      }else{
        const newDesc = document.createElement('div');

   
        newDesc.className ='task-desc';
        newDesc.textContent =task.desc;
        taskCard.insertBefore(newDesc,taskFooter);
        taskDesc =newDesc;// update reference
      }
    }else{
      // If description is empty after edit -> remove element (optional) 
      if(taskDesc) taskDesc.remove();
    }
   
   task.priority = taskPriority.value;
     // update date properly
  if (taskDate.value === "custom") {
    task.date = new Date(customDateInput.value).toDateString();
  } else if (taskDate.value === "today") {
    task.date = "Today";
  } else if (taskDate.value === "tomorrow") {
    task.date = new Date(Date.now() + 86400000).toDateString();
  } else if (taskDate.value === "weekend") {
    task.date = new Date(getWeekendDate()).toDateString();
  }
   dateEl.textContent = `📆 ${task.date}`;
   taskTitle.textContent = task.title;
   flag.className= `flag priority-${task.priority}`;


   collapseForm(); 
   showToast("💾Task updated successfully!","edit");
   addBtnText.textContent ='Add Task';
   addBtnIcon.textContent ="➤";
   form.onsubmit = addTask; //restore original submit handler
   saveTasks();   
   //showToast('✅ Task updated successfully!');
  };
  });


  // --- DELETE BUTTON ---
    let cardToDelete = null;
    let lastDeletedCard = null;

  
  const confirmModal = document.getElementById('confirmModal');

  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-btn')) {
      cardToDelete = e.target.closest('.task-card');
      confirmModal.classList.add('show');
    }

    if (e.target.classList.contains('confirm-no')) {
      confirmModal.classList.remove('show');  
    }
   if(e.target.classList.contains('confirm-yes')){
     confirmModal.classList.remove('show');

     if(cardToDelete){ 
    lastDeletedCard = {
      node: cardToDelete.cloneNode(true),
      index: Array.from(todoContainer.children).indexOf(cardToDelete)
    };
    cardToDelete.remove();
    cardToDelete =null;
    showToast("🗑️ Task deleted successfully","warning",true);
   }
   }
  
   if(e.target.classList.contains('undo-btn')){
    if (!lastDeletedCard) return;
     if(lastDeletedCard.index >= todoContainer.children.length){
    todoContainer.appendChild(lastDeletedCard.node) }else{
      todoContainer.insertBefore(lastDeletedCard.node,todoContainer.children[lastDeletedCard.index]);
    }
      lastDeletedCard =null;
    toast.classList.remove("show");
    
   }
  });

   Cancel.addEventListener('click',()=>{
    if(isEditing){
       addBtnText.textContent ='Add Task';
      addBtnIcon.textContent ="➤";
    } 
    isEditing =false;
    collapseForm(); 
   })
  // Force reflow then animate in
  // (gives the browser a frame to apply the .hide state before we remove it)
  requestAnimationFrame(() => {
    // small delay to ensure CSS has applied .hide
    setTimeout(() => {
      taskCard.classList.remove('hide');
      taskCard.classList.add('slide-in');
      // remove the animation class after it finishes so future animations work
      setTimeout(() => taskCard.classList.remove('slide-in'), 350); // match CSS duration
    }, 10);
  });
    // Move card with exit/enter animation when checkbox toggled
  checkbox.addEventListener('change', () => {
    // target containers
    const fromContainer = checkbox.checked
      ? document.querySelector('.todo-container')
      : document.querySelector('.completed-container');

    const toContainer = checkbox.checked
      ? document.querySelector('.completed-container')
      : document.querySelector('.todo-container');

    // play exit animation
    taskCard.classList.remove('slide-in');
    taskCard.classList.add('slide-out');

    // after exit animation finishes, move and animate in
    setTimeout(() => {
      taskCard.classList.remove('slide-out');
      toContainer.appendChild(taskCard);

      // animate in
      taskCard.classList.add('slide-in');
      setTimeout(() => taskCard.classList.remove('slide-in'), 820); // match CSS duration

      // persist changes
      saveTasks(); 
    }, 550); // match CSS exit duration (slightly less than or equal to CSS)
  });

}
// ============
// LOCAL STORAGE HANDLER
// ============ 

function saveTasks(){ 
  const tasks = [];

document.querySelectorAll('.todo-container .task-card').forEach(card=>{
  const title = card.querySelector('.task-title').textContent;
  const desc = card.querySelector('.task-desc')?.textContent || '';
  let date = card.querySelector('.task-footer span:not(.flag)').textContent;

  date =date.replace("📆","").trim();// Remove emoji before saving
  

  const priorityClass =card.querySelector('.flag').classList[1];
  const priority = priorityClass.replace('priority-','');
  tasks.push({title,desc,date,priority, complete: false});
});

const completed =[];
document.querySelectorAll('.completed-container .task-card').forEach(card=>{
  const title = card.querySelector('.task-title').textContent;
  const desc = card.querySelector('.task-desc')?.textContent || '';
  let date = card.querySelector('.task-footer span:not(.flag)').textContent;

  date = date.replace("📆","").trim();// Remove emoji before saving
  
  const priorityClass = card.querySelector('.flag').classList[1];
  const priority = priorityClass.replace('priority-', '');
    completed.push({ title, desc, date, priority, completed: true });
});

localStorage.setItem('tasks', JSON.stringify(tasks));
localStorage.setItem('completedTasks',JSON.stringify(completed));

}

function loadTasks(){
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  const completed = JSON.parse(localStorage.getItem('completedTasks')) || [];
  tasks.forEach(t => renderTask(t));
  completed.forEach(t => renderTask(t, true));
} 

//====================
// SHOW/HIDE COMPLETED
//====================
const showCompletedBtn = document.getElementById('showCompletedBtn');
showCompletedBtn. addEventListener('click', ()=>{
  const completedContainer =document.querySelector('.completed-container');
  completedContainer.classList.toggle('show');
   
  // Change arrow direction  ▼ ↔ ▲
  const isShow =completedContainer.classList.contains('show');
 
if(isShow){
  showCompletedBtn.textContent="✅ Completed ▲";
  todoContainer.classList.add('hidden');
}else{
  showCompletedBtn.textContent="✅ Completed ▼";
   todoContainer.classList.remove('hidden');
}
});

function showToast(message, type, includeUndo =false){
  toast.textContent = message;

  if(includeUndo){
    const undoBtn = document.createElement("span");
    undoBtn.classList.add("undo-btn");
    undoBtn.innerText="Undo";
    undoBtn.onclick = undoDelete;
    toast.appendChild(undoBtn);
  }
 if(type === "warning") toast.classList.add("toast-warning");
 if(type === "edit") toast.classList.add("toast-edit");
  toast.classList.add("show");

  setTimeout(()=>{
    toast.classList.remove("show");
  },3000);
}
// INIT APP
window.addEventListener('DOMContentLoaded',()=>{
  loadTasks();
})  