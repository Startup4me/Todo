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
const Cancel =document.querySelectorAll(".btn-cancel");
let isEditing =false;
let editingCard =null ;

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
  console.log("ui");
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

  //🔥 attach task object to the card
  taskCard.taskData =task;

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
  dateEl.className = "task-date";
  dateEl.textContent = `📆 ${task.date}`;

  const flag = document.createElement('span');
  flag.classList.add('flag',`priority-${task.priority}`);
  flag.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" viewBox="0 0 24 24" fill="currentColor">
<path d="M5.75 1C6.16421 1 6.5 1.33579 6.5 1.75V3.6L8.22067 3.25587C9.8712 2.92576 11.5821 3.08284 13.1449 3.70797L13.3486 3.78943C14.9097 4.41389 16.628 4.53051 18.2592 4.1227C19.0165 3.93339 19.75 4.50613 19.75 5.28669V12.6537C19.75 13.298 19.3115 13.8596 18.6864 14.0159L18.472 14.0695C16.7024 14.5119 14.8385 14.3854 13.1449 13.708C11.5821 13.0828 9.8712 12.9258 8.22067 13.2559L6.5 13.6V21.75C6.5 22.1642 6.16421 22.5 5.75 22.5C5.33579 22.5 5 22.1642 5 21.75V1.75C5 1.33579 5.33579 1 5.75 1Z"/>
</svg>`;  

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

   Cancel.forEach(btn=>{
    btn .addEventListener('click',()=>{
    if(isEditing){
       addBtnText.textContent ='Add Task';
      addBtnIcon.textContent ="➤";
    } 
    isEditing =false;
    collapseForm();   
  });
   });
  
 
 //Form submit-logic for edit and add functionality
 form.addEventListener("submit",(e)=>{
  e.preventDefault();
  if(isEditing && editingCard){ 
    //used dynamic saved  the object 
    const taskCard=editingCard;
    const task = editingCard.taskData; 
  // 🔥 get DOM elements from card
  const taskTitle = taskCard.querySelector(".task-title");
  let taskDesc  = taskCard.querySelector(".task-desc");
  const taskFooter = taskCard.querySelector(".task-footer");
  const dateEl = taskCard.querySelector(".task-date");
  const flag = taskCard.querySelector(".flag");
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
      taskDesc = null;
    
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
   showToast("💾 Task updated successfully!","edit"); 
}else{ 
  addTask(e); 

 } 
   collapseForm(); 
   saveTasks();   

   isEditing =false;
   editingCard=null;
   addBtnText.textContent ='Add Task';
   addBtnIcon.textContent ="➤";
  // form.onsubmit = addTask; //restore original submit handler

   //showToast('✅ Task updated successfully!');
 });

 //--- EDIT Button ---
 document.addEventListener('click',(e)=>{
  if(e.target.classList.contains("edit-btn")){
    const taskCard =e.target.closest(".task-card");
    startEdit(taskCard);
  }
 })
 function startEdit(taskCard){
  const task =taskCard.taskData;//🔥 now you get the object  
  console.log("hi");
  expandForm();
  
  isEditing =true; 
  editingCard =taskCard;
   
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
   

  };


  // --- DELETE BUTTON ---
    let active;
    let deleteMode = "single";
    let cardToDelete = null;
    let lastDeletedCard = null;

  
  const confirmModal = document.getElementById('confirmModal');
  const confirmTitle = document.getElementById('confirmTitle');
  const confirmDesc = document.getElementById('confirmDesc');
  const confirmYes =document.getElementById('confirmYes');

  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-btn')) {
      cardToDelete = e.target.closest('.task-card');
      confirmTitle.innerText="🗑️ Delete this task ?";
      confirmDesc.innerText="This action cannot be undone.";
      confirmYes.innerText="Delete"
      confirmModal.classList.add('show');
    }

    if (e.target.classList.contains('confirm-no')) { deleteMode ='single';//interesting error solve(when click no after delete all)
      confirmModal.classList.remove('show');  
    }
   if(e.target.classList.contains('confirm-yes')){
     confirmModal.classList.remove('show');
     // ----------------------------------
     // CASE 1: SINGLE DELETE
     // ----------------------------------
     if(deleteMode === "single" && cardToDelete){  
      const parent = cardToDelete.parentElement;

    lastDeletedCard = {
      task: {...cardToDelete.taskData},
      index: Array.from(parent.children).indexOf(cardToDelete),
    wasCompleted: parent.classList.contains("completed-container")
    };
    cardToDelete.remove();
    cardToDelete =null;
    showToast("🗑️ Task deleted successfully","warning",true);
   }else if(deleteMode ==='All'){
    //Clear UI
    active.innerHTML="";

    //Clear storage
    if(active=== todoContainer){
       localStorage.setItem("tasks",JSON.stringify([]));
    }else{localStorage.setItem("completedTasks",JSON.stringify([])); }
    deleteMode="single";
    showToast("🧹All tasks deleted","all");
   }
   }
   // UNDO DELETE
   if(e.target.classList.contains('undo-btn')){
    if (!lastDeletedCard) return;

    // Render card again so event listeners work
    renderTask(lastDeletedCard.task, lastDeletedCard.wasCompleted);

    const container =lastDeletedCard.wasCompleted
    ? document.querySelector('.completed-container')
    : document.querySelector('.todo-container');

    const newCard = container.lastElementChild;// the card that renderTask just appended
    
       if(lastDeletedCard.index >= container.children.length){
      container.appendChild(newCard);//append at end
    } else{
      container.insertBefore(newCard,container.children[lastDeletedCard.index]);

    };
    
   
      lastDeletedCard =null;
    toast.classList.remove("show");
     
   }
 saveTasks(); 
  });

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
  tasks.push({title,desc,date,priority, completed: false});
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
const titleArrow = document.querySelector('.title-with-arrow');
const arrowSvg =document.getElementById("arrowSvg");
const dropdownMenu = document.getElementById("dropdownMenu");
const completedContainer =document.querySelector('.completed-container');
document.addEventListener('click',(e)=>{
  const clickedInsideDropdown = dropdownMenu.contains(e.target);
  const clickedTitle = titleArrow.contains(e.target);
  // If clicked outside both → close dropdown
  if (!clickedInsideDropdown && !clickedTitle) {
    dropdownMenu.classList.remove("show");
    arrowSvg.innerHTML = `<polygon points="12,16 6,8 18,8" />`; // reset arrow down
  }
});
titleArrow.addEventListener('click', ()=>{
  dropdownMenu.classList.toggle("show");
  const isOpen = dropdownMenu.classList.contains("show");
 
arrowSvg.innerHTML = isOpen
?`<polygon points="12,8 6,16 18,16" />`// up arrow
:`<polygon points="12,16 6,8 18,8" />`;// down arrow
});

// ------------------------------------------------
// EVENT DELEGATION → Handle all dropdown items
// ------------------------------------------------
dropdownMenu.addEventListener('click',(e)=>{
  const item =e.target.closest('.dropdown-item');
  if(!item) return;// click outside item

  const value = item.id;

  //Close dropdown and reset arrow
  dropdownMenu.classList.remove("show");
  arrowSvg.innerHTML=`<polygon points="12,16 6,8 18,8" />`;
// Handle actions
if(value === "menuHome"){
  todoContainer.classList.remove("hidden");
  completedContainer.classList.add("hidden");
}
if(value === "menuFinished"){
  todoContainer.classList.add("hidden");
  completedContainer.classList.remove("hidden");
}

});
//====================
// THREE DOTS DROPDOWN
//====================
const dotBtn = document.getElementById("dotsBtn");
const moreOptionsDropdown = document.getElementById("moreOptionsDropdown");

//OPEN / CLOSE on click
dotBtn.addEventListener('click',(e)=>{
  moreOptionsDropdown.classList.toggle("show");
});
//close when clicking outside
document.addEventListener('click',(e)=>{
const clickedInsideMenu =moreOptionsDropdown.contains(e.target);
const clickedDots = dotBtn.contains(e.target);

if(!clickedDots && !clickedInsideMenu){
  moreOptionsDropdown.classList.remove("show");
}
});
//OPTION-> handle menu items
moreOptionsDropdown.addEventListener('click',(e)=>{
  const item = e.target.closest(".dropdown-item");
  if(!item) return;

  const value = item.id;
  //close dropdown after click
  moreOptionsDropdown.classList.remove("show");

  if(value === "menuAllDel"){
   active = todoContainer.classList.contains('hidden') ?completedContainer:todoContainer;
  confirmTitle.innerText=
  active === todoContainer
 ?"⚠️ Delete all tasks from To-do?"
 :"⚠️ Delete all tasks from Completed?"
 
  confirmDesc.innerText="All your tasks in this section will be removed permanently.";
  confirmYes.innerText="Delete All"
  confirmModal.classList.add('show');
  deleteMode='All';
  };

 if (value === "menuFeedback") {
    console.log("Feedback clicked");
  }

  if (value === "menuInvite") {
    const overlay=document.getElementById("overlay");
  overlay.style.display="flex";
}
});
  const modal=  document.querySelector(".modal");
  const url = "https://mytodo-5.vercel.app";
  const text = "A fast, clean and simple todo app. Organize your life in seconds.";
  const message = `${text}\n${url}`;
  modal.addEventListener('click',async(e)=>{
    const el =e.target;
    if(el.closest("#closeBtn")){
      overlay.style.display="none";

    }else if(el.closest('#twitter')){
     const tw ='https://twitter.com/intent/tweet?text=' + encodeURIComponent(message);
     window.open(tw,'_blank','noopener');

    }else if(el.closest('#facebook')){
    const fb = "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(url);
    window.open(fb, "_blank", "noopener");
    }
    else if(el.closest('#linkedin')){
    const li = "https://www.linkedin.com/sharing/share-offsite/?url=" + encodeURIComponent(url);
    window.open(li,"_blank","noopener"); 
    } 
    else if(el.closest('#telegram')){
    const t ='https://t.me/share/url?url=' +
    encodeURIComponent(message);
    window.open(t,'_blank','noopener');
    }
    else if(el.closest("#copyBox")){
      navigator.clipboard.writeText("https://mytodo-5.vercel.app");
      alert("Link copied!");
    }else if(el.closest("#more")){
  
      const shareData = {
        title: 'Join my Todo app',
        text: "A fast, clean and simple todo app. Organize your life in seconds.",
        url:"https://mytodo-5.vercel.app"
      };
      if (navigator.share){
        try{
          await navigator.share(shareData);
          showToast('shared','demo');
        }catch(err){
          //user cancelled or error
          console.warn('Share cancelled/failed',err); }
      }else{
      // if no native share, fallback to "More" action
      showToast('System share not availble.','demo');
      }
     
    }
  }) 

    // console.log("Invite clicked");

  


function showToast(message, type, includeUndo =false){
 const toastContainer = document.getElementById('toast');
  toastContainer.innerHTML="";// reset content before adding new message & undo
  const toast =document.createElement("div");
  toast.classList.add("toast-message",`toast-${type}`);  
  toast.innerText = message; 

  if(includeUndo){
    const undoBtn = document.createElement("span");
    undoBtn.classList.add("undo-btn");
    undoBtn.innerText="Undo";
    // undoBtn.onclick = undoDelete;
    toast.appendChild(undoBtn);
  }
  toastContainer.appendChild(toast);

  setTimeout(()=>{
  toast.remove();
  },4000);
}
// INIT APP
window.addEventListener('DOMContentLoaded',()=>{ 
  loadTasks();
})  
