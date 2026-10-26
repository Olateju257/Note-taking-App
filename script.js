const createNote = document.getElementById('create-note');
const addNote = document.getElementById('done');
const title = document.getElementById('title');
const note = document.getElementById('note');
const noteLists = document.querySelector('.con1');
const takeNote = document.querySelector('.con2');
const err = document.getElementById('error');
const unorderedList = document.getElementById('notes-list');
const goBack = document.getElementById('back');

const deleteIcon = `
<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
<path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
</svg>`;

let notes = [];

try {
  notes = JSON.parse(localStorage.getItem('noteItems')) || [];
}catch {
  notes = []; 
}

let editingId = null;

function saveNotes() {
  localStorage.setItem('noteItems',JSON.stringify(notes));
}

function showListScreen() {
  noteLists.style.display = 'flex';
  takeNote.style.display = 'none';
  createNote.style.display = 'flex';
}

function showEditorScreen() {
  noteLists.style.display = 'none';
  takeNote.style.display = 'flex';
  createNote.style.display = 'none';
}

function resetEditor() {
  title.value = '';
  note.value = '';
  err.style.display = 'none';
  editingId = null;
}

function renderNotes() {
  unorderedList.innerHTML = '';

  notes.forEach((n) => {
    const li = document.createElement('li');
    li.dataset.id = n.id;
    li.textContent = n.title;

    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = deleteIcon;
    deleteBtn.type = 'button';
    deleteBtn.className = 'delete';
    deleteBtn.setAttribute('id','delete-btn');

    li.appendChild(deleteBtn);
    unorderedList.appendChild(li);
  })
}

function addNotes() {
  const titleVal = title.value.trim();
  const noteVal = note.value.trim();

  if(titleVal === '' && noteVal === '') {
    err.style.display = 'flex';
    err.textContent = 'make a note';
    return;
  }

  if(titleVal === '') {
    err.style.display = 'flex';
    err.textContent = 'add a title';
    return;
  }

  if(editingId) {
    const existing = notes.find(n => n.id === editingId);
    if(existing) {
     existing.title = titleVal;
     existing.body = noteVal;
    }
  }else {
      notes.push({id: Date.now().toString(), title: titleVal, body: noteVal});
    }
  saveNotes();
  renderNotes();
  resetEditor();
  showListScreen();
}

createNote.addEventListener('click',()=>{
  resetEditor();
  showEditorScreen();
})

goBack.addEventListener('click',()=>{ 
  showListScreen();
  resetEditor();
})

addNote.addEventListener('click',addNotes);

unorderedList.addEventListener('click',(e)=>{
  const li = e.target.closest('li');
  if(!li) return;

  const id = li.dataset.id;

  if(e.target.closest('.delete')) {
    notes = notes.filter((n) => n.id !== id);
    saveNotes();
    renderNotes();
    return;
  }

  const clicked = notes.find((n) => n.id === id);
  if(!clicked) return;

  if(clicked) {
    editingId = clicked.id;
    title.value = clicked.title;
    note.value = clicked.body;
    err.style.display = 'none';
    showEditorScreen();
  }
})

renderNotes();
