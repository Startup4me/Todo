const form =document.querySelector('.task-form');
const placeholder =document.querySelector('.placeholder');
const taskDate= document.getElementById('task-date');
const customDateInput= document.getElementById('custom-date');

//min date =today
const today =new Date().toISOString().split('T')[0];
customDateInput.min=today;


// expand/collapse form 
function expandForm(){
  placeholder.style.display='none';
  form.style.display='flex';
  document.getElementById('task-title').focus();
} 
function collapseForm(){
  form.reset();
  customDateInput.classList.add('hidden');
  taskDate.querySelector("option[value='custom']").textContent="📆 Custom";
  // console.log(taskDate);
  placeholder.style.display='block';
  form.style.display='none';
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
