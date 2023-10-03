const todoInput = document.querySelector("#todo-creation");
const createBtn = document.querySelector("#create-todo-button");
const outputTodo = document.querySelector("#todos-output");
const outputUser = document.querySelector("#users-output");
const clearUserBtn = document.querySelector("#clear-current-user")
const searchTodoInput = document.querySelector("#todo-search");
const clearSearchBtn = document.querySelector("#clear-search-btn");
const scrollBtnUp = document.querySelector(".scroll-up");
const scrollBtnDown = document.querySelector(".scroll-down");
const addUserButton = document.querySelector("#add-user");
const closeModalButton = [...document.querySelectorAll(".close-modal-btn")]
const modal = document.querySelector(".modal");
const modalText = document.querySelector(".modal-text-content");
const storageTodos = JSON.parse(localStorage.getItem("todos"));
const userNameInput = document.querySelector("#userName");
const userEmailInput = document.querySelector("#userEmail");
const createUserBtn = document.querySelector("#create-user-btn");
const createUserContainer = document.querySelector(".create-users-form")
const deleteUserBtn = document.querySelector("#delete-user")



let todos = storageTodos && storageTodos.length !==0 ? storageTodos : [];
let users = [];
let currentUser = undefined;
let nextId = undefined;
let nextTodoId = undefined;

clearUserBtn.disabled = true;
deleteUserBtn.disabled = true;

renderTodos(todos);

createBtn.onclick = () => {
   if (todoInput.value && currentUser) {
      const todo = {
         userId: currentUser.id,
         id: nextTodoId,
         text: todoInput.value,
         done: false,
      } 

   todoInput.value = "";
   todos.push(todo);
   nextTodoId = nextTodoId + 1;
   renderTodos(
      currentUser ? todos.filter((todo) => todo.userId === currentUser.id) : todos
   );
   console.log(todos)
   }
   else if (!todoInput.value) {
      modalText.innerHTML="";
      modal.classList.remove("hidden");
      modalText.innerHTML = "Please enter the task"
   }
   else {
      modalText.innerHTML="";
      modal.classList.remove("hidden");
      modalText.innerHTML = "Please choose any user"
   }
}

function renderTodos (todosToRender) {
   outputTodo.innerHTML = "";
   todosToRender.forEach((todo, i) => {
      outputTodo.innerHTML += `
      <div class="todos-container">
         <div class="todo ${todo.done && "done"}">
         <label class="todo-text">
         <span>${i + 1}. </span>
            <span>${todo.text}</span>
            <input id="${todo.id}" type="checkbox" ${todo.done && "checked"} class="todo-checkbox">
         </label>
         </div>   
         <img id="${todo.id}" class="delete-button" src="icons/delete_todo.png"  width="24" height="24" alt="Press to Delete">
      </div>
      `
   });

   localStorage.setItem("todos", JSON.stringify(todos));

   const checkboxes = [...document.querySelectorAll(".todo-checkbox")];
   const  deleteBtn = [...document.querySelectorAll(".delete-button")];

   checkboxes.forEach((checkbox, i) => {
      checkbox.onchange = () => {
         const todo = todos.find((todo) => todo.id === +checkbox.id );
         changeTodo(todo.id, !todo.done);
      }
   });

   deleteBtn.forEach( (button, i) => {
      button.onclick = () => {
         const todo = todos.find((todo) => todo.id === +button.id );
         deleteTodo(todo.text);
      }
   }); 
}

function changeTodo (id, newDone) {
   todos = todos.map((todo) => {
      if (todo.id === id) {
         return todo = {...todo, done: newDone}
      }
      return todo;
   })
   renderTodos(
      currentUser ? todos.filter((todo) => todo.userId === currentUser.id) : todos
   );
}

function deleteTodo (text) {
   todos = todos.filter((todo) => todo.text !== text);
   renderTodos(
      currentUser ? todos.filter((todo) => todo.userId === currentUser.id) : todos
   );
}

// function getServerTodos () {
//    fetch('https://jsonplaceholder.typicode.com/todos')
//       .then(response => response.json())
//       .then(todoFromServer => {
//          todoFromServer.forEach((todo) => { 
//              todo.text = todo.title;
//              delete todo.title; 
//              todo.done = todo.completed;
//              delete todo.completed; 
//          });
//          console.log(todoFromServer);
      
//       todos = todoFromServer;
//       renderTodos(todos);
//       })
// }
async function getServerTodos() {
   const responseServer = await fetch('https://jsonplaceholder.typicode.com/todos');
   const response = await responseServer.json();
   const todoFromServer = response.map((todo) => { 
         todo.text = todo.title;
         delete todo.title; 
         todo.done = todo.completed;
         delete todo.completed; 
         return todo
      });
   todos = todoFromServer;
   nextTodoId = todoFromServer.length + 1;
   renderTodos(todos);
}

getServerTodos();

// function getServerUsers () {
//    fetch('https://jsonplaceholder.typicode.com/users')
//       .then(response => response.json())
//       .then(usersFromServer => {
//          console.log(usersFromServer);
//          users = usersFromServer;
//          renderUsers();
//       })
// }

async function getServerUsers () {
   const responseServer = await fetch('https://jsonplaceholder.typicode.com/users');
   const usersFromServer = await responseServer.json();
   users = usersFromServer;
   nextId = usersFromServer.length + 1;
   renderUsers();
}
 
getServerUsers();

function renderUsers () {
   outputUser.innerHTML = "";
   users.forEach((user) => {
   outputUser.innerHTML += `
      <button class="user-todos-button">${user.name}</button> 
   `
   })

   const userButtons = [...document.querySelectorAll(".user-todos-button")];

   userButtons.forEach((button, i) => {
   button.onclick = (event) => {
      currentUser = users[i];
      searchTodoInput.value = ""
      const currentTodos = todos.filter( (todo) => currentUser.id !== +todo.userId ? todos.userId : []);

      renderTodos(currentTodos);

      clearUserBtn.disabled = false;
      deleteUserBtn.disabled = false;
      deleteUserBtn.classList.add("clear-hover");

      userButtons.forEach((btn) => btn.classList.remove("active-user-button"));
      clearUserBtn.classList.add("clear-hover");
      event.target.classList.add("active-user-button");
      }  
   })
}

function createUsers () {
   userNameInput.value = "";
   userEmailInput.value= "";
  
      createUserBtn.onclick = () => {
      const user = {
         id: nextId,
         name: userNameInput.value,
         email: userEmailInput.value,
      }
      
      users.push(user);
      nextId = nextId + 1;
      currentUser = undefined;
      clearUserBtn.disabled = true;
      deleteUserBtn.disabled = true;
      clearUserBtn.classList.remove("clear-hover");
      deleteUserBtn.classList.remove("clear-hover");
      createUserContainer.classList.add("hidden");
      renderUsers(users)
      renderTodos(todos)
   }
}


function deleteUser () {
   users = users.filter((user) => currentUser.id !== +user.id)
   todos = todos.filter( (todo) => currentUser.id !== +todo.userId);
   currentUser = undefined;
   clearUserBtn.disabled = true;
   deleteUserBtn.disabled = true;
   clearUserBtn.classList.remove("clear-hover");
   deleteUserBtn.classList.remove("clear-hover");
   renderUsers(users)
   renderTodos(todos);
}
addUserButton.onclick = () => {
   createUserContainer.classList.remove("hidden");
   createUsers();
   userNameInput.value.innerHTML = "";
   userEmailInput.value.innerHTML = "";
}

deleteUserBtn.onclick = () => {
   deleteUser()
}

clearUserBtn.onclick = () => {
   currentUser = undefined;
   clearUserBtn.disabled = true;
   deleteUserBtn.disabled = true;
   searchTodoInput.value = "";
   clearUserBtn.classList.remove("clear-hover")
   deleteUserBtn.classList.remove("clear-hover");
   renderUsers(users);
   renderTodos (todos);   
}

searchTodoInput.oninput = (event) => {
   let searchedTodo = currentUser 
   ? todos.filter((todo) => todo.text.includes(event.target.value) && todo.userId === currentUser.id) 
   : todos.filter((todo) => todo.text.includes(event.target.value));
   renderTodos(searchedTodo);
}
clearSearchBtn.onclick = () => {
   searchTodoInput.value = "";
   renderTodos(
      currentUser ? todos.filter((todo) => todo.userId === currentUser.id) : todos
   );
}

scrollBtnUp.onclick = () => {
   todoInput.scrollIntoView({
      block: "start",
      inline: "nearest",
      behavior: "smooth"
   })
}
scrollBtnDown.onclick = () => {
   outputTodo.scrollIntoView({
      block: "end",
      inline: "nearest",
      behavior: "smooth"
   })
}

closeModalButton.forEach((button) => {
   button.onclick = () => {
      modal.classList.add("hidden");
      createUserContainer.classList.add("hidden");
   }
})


   