let todoList=[
  {
    item:'Make Todo App',
    dueDate:'27/9/2025'
  },
  {
    item:'Be Patience',
    dueDate:'27/9/2025'
  }
];
displayItems();

function addTodo(){
 let inputElement= document.getElementById("todo-input");
let todoItem= inputElement.value;
let dateElement=document.getElementById('todo-date');
let todoDate=dateElement.value;
todoList.push({item:todoItem ,dueDate:todoDate});
inputElement.value='';
dateElement.value='';
displayItems();
}

function displayItems(){
  let containerElement=document.querySelector('.todo-container');
  let newHtml=' ';
  for(let i=0;i<todoList.length;i++){
 let {item,dueDate}=todoList[i];
    newHtml+=`
  
    <span>${item}</span>
    <span>${dueDate}</span>
    <button onclick="todoList.splice(${i},1);
    displayItems(); ">Delete</button>

    `;
     }containerElement.innerHTML=newHtml;
}


console.log("Running Fine!");