const form =document.querySelector('.task-form');
const placeholder =document.querySelector('.placeholder');
const taskDate= document.getElementById('task-date');
const customDateInput= document.getElementById('custom-date');
const Title=document.getElementById("task-title");

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
    taskDate.querySelector('option=="custom"').textContent="📆 custom";
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
  const desc =document.getElementById('task-desc').value.trim();
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
    // console.log("Hi");
    // console.log(new Date(customDateInput.value).toDateString());
  }

 
  //Create a task card
  const taskCard =document.createElement('div');
  taskCard.className='task-card hide';
  
  const taskHeader =document.createElement('div');
  taskHeader.className='task-header';

  const checkbox=document.createElement('input');
  checkbox.type='checkbox';

  const taskTitle=document.createElement('span');
  taskTitle.className='task-title';
  taskTitle.textContent=title;

  taskHeader.appendChild(checkbox);
  taskHeader.appendChild(taskTitle);

  const taskDesc =document.createElement('div');
  taskDesc.className='task-desc';
  taskDesc.textContent=desc
 
  const taskFooter = document.createElement('div');
  taskFooter.className='task-footer';

  const dateEl = document.createElement('span');
  dateEl.textContent = finalDate;

  const flag= document.createElement('span');
  flag.classList.add('flag');
  if(priority==='low') flag.classList.add('priority-low');
  if(priority==='medium') flag.classList.add('priority-medium');
    if(priority==='high') flag.classList.add('priority-high');
      if(priority==='urgent') flag.classList.add('priority-urgent');
      flag.textContent='⚑'

  
  taskFooter.appendChild(dateEl);
  taskFooter.appendChild(flag);

  taskCard.appendChild(taskHeader);
  if(desc) taskCard.appendChild(taskDesc);
  taskCard.appendChild(taskFooter);

  document.querySelector('.todo-container').appendChild(taskCard);

  setTimeout(()=>{
    taskCard.classList.remove('hide');
    taskCard.classList.add('slide-in');
  },10) 
 
  //Checkbox animation
  checkbox.addEventListener('change',()=>{
    if(checkbox.checked){
        // remove classes that would override the slide-out rule
    taskCard.classList.remove('slide-in');
  
      taskCard.classList.add('slide-out');
      setTimeout(()=> taskCard.remove(),450)//extra 100ms buffer
    }
  });

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
