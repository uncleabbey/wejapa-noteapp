const button = document.querySelector('.add-note-btn');
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
  let title = document.querySelector('#form-title');
  let body = document.querySelector('#form-body');
  const data = {
    title: title.value,
    content: body.value,
  };

  const addNote = async () => {
    const url = '/new';
    try {
      const res = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const result = await res.json();
      title.value = '';
      body.value = '';
      document.location.reload(true);
      console.log(result);
      return result;
    } catch (error) {
      console.log(error);
      return;
    }
  };
  return addNote();
};
const main = document.querySelector('.main');
const count = document.querySelector('.count');

let list = [];
const fetchList = async () => {
  const url = '/list';
  try {
    let result = await fetch(url);
    result = await result.json();
    return result.data;
  } catch (error) {
    console.log(error);
    return;
  }
};

const loadData = async () => {
  let res = await fetchList();
  count.innerText = res.length;
  res.map(({ id, title, content }) => {
    const article = document.createElement('article');
    const h2 = document.createElement('h2');
    const pBody = document.createElement('p');
    const link = document.createElement('a');
    link.href = `/notes/?id=${id}`;
    article.appendChild(link);
    link.appendChild(h2);
    h2.innerHTML = title;
    link.appendChild(pBody);
    pBody.innerHTML = content;
    main.appendChild(article);
  });
};
loadData();
