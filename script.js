let todoList=[];
displayItems();

function addTodo(){
 let inputElement= document.getElementById("todo-input");
let todoItem= inputElement.value;

todoList.push(todoItem);
inputElement.value='';
displayItems();
}

function displayItems(){
  let displayElement=document.getElementById("todo-item");
  displayElement.innerText='';
  for(let i=0;i<todoList.length;i++){
    displayElement.innerText=    displayElement.innerText+ "\n"+todoList[i];
  }
}


console.log("Running Fine!");