const fetchData = async () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const id = urlParams.get('id');
  const url = `/list/note?id=${id}`;
  try {
    let result = await fetch(url);
    result = await result.json();
    return result.data;
  } catch (error) {
    console.log(error);
    return;
  }
};
const formTitle = document.querySelector('#form-title');
const formBody = document.querySelector('#form-body');

const loadData = async () => {
  let res = await fetchData();
  const title = document.querySelector('.note-title');
  const content = document.querySelector('.note-body');
  formTitle.value = res.title;
  formBody.value = res.content;

  title.innerHTML = res.title;
  content.innerHTML = res.content;
};
loadData();

const button = document.querySelector('.edit-note-btn');
const cancel = document.querySelector('.cancel');
const addForm = document.querySelector('.add-form');
const form = document.querySelector('#form');

//  display form
button.onclick = () => {
  addForm.style.display = 'block';
};

// close form display
cancel.onclick = (e) => {
  addForm.style.display = 'none';
};

// close form display
window.onclick = (e) => {
  if (e.target == addForm) {
    addForm.style.display = 'none';
  }
};

form.onsubmit = (e) => {
  e.preventDefault();

  const data = {
    title: formTitle.value,
    content: formBody.value,
  };
  console.log(data);

  const editNote = async () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id = urlParams.get('id');
    const url = `/edit/note?id=${id}`;
    try {
      const res = await fetch(url, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const result = await res.json();
      document.location.reload(true);
      console.log(result);
      return result;
    } catch (error) {
      console.log(error);
      return;
    }
  };
  return editNote();
};

const deleteButton = document.querySelector('.delete-btn');

deleteButton.onclick = () => {
  const deleteNote = async () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id = urlParams.get('id');
    const url = `/delete/note?id=${id}`;

    try {
      const res = await fetch(url, {
        method: 'DELETE',
      });
      const result = await res.json();
      console.log(result);
      window.location.assign(window.location.origin);
      return result;
    } catch (error) {
      console.log(error);
      return;
    }
  };
  deleteNote();
};

// console.log(window.location.origin);