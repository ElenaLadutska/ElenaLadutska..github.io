import '../styles/reset.css';
import '../styles/index.css';

const paginationElement = document.getElementById('pagination');
const historyContainer = document.getElementById('list');

let currentPage = 1;
const ROWS = 15;

const showHistory = () => {
  const getInfoFromLS = JSON.parse(localStorage.getItem('history'));

  const paginationButton = (page) => {
    let button = document.createElement('button');
    button.innerText = page;
    button.className = 'btn'
  
    if (currentPage === page) {
      button.classList.add('active');
    };
  
    button.addEventListener('click', function() {
      currentPage = page;
      displayList(getInfoFromLS, historyContainer, ROWS, currentPage);
  
      let currentButton = document.querySelector('.page-numbers button.active');
      currentButton?.classList.remove('active');
  
      button.classList.add('active');
    });
  
    return button;
  };

  const displayList = (pagination, wrapper, rows, page) => {
    wrapper.innerHTML = '';
  
    page--;
  
    let start = rows * page;
    let end = start + rows;
    let paginatedItems = pagination.slice(start, end);
  
    for (let i = 0; i < paginatedItems.length; i++) {
      let item = paginatedItems[i];
  
      let itemElement = document.createElement('div');
      itemElement.classList.add('history-item');
  
      const icon = document.createElement('i');

      const { type  } = item;
      let className = 'fa-bed';

      if (type === 'flights' || type === 'cars') {
        className = type === 'cars' ? 'fa-car' : 'fa-plane-up';
      };
      
      icon.className = `fa-solid ${className}`;
      itemElement.appendChild(icon);
  
      for (let content in item) {
        const itemContent = document.createElement('span');
        if (content !== 'type') {
          itemContent.textContent = `${content}: ${item[content]}`;
        };
  
        const containerItems = Array.from(historyContainer.children);
        containerItems.forEach((elem, id) => elem.id = id++);
  
        itemElement.appendChild(itemContent);
        wrapper.appendChild(itemElement)
      };
      
      const removeHistotyItem = document.createElement('button');
      removeHistotyItem.className = 'btn remove';
      const iconTrash = document.createElement('i');
      iconTrash.className = "fa fa-times";

      removeHistotyItem.appendChild(iconTrash);
      itemElement.appendChild(removeHistotyItem);
  
      removeHistotyItem.addEventListener('click', event => {
        const clickedElementParent = event.target.parentElement;
        const id = clickedElementParent.id;
          
        clickedElementParent.remove();
        pagination.splice(id, 1);
            
        localStorage.setItem('history', JSON.stringify(pagination));

        displayList(pagination, historyContainer, ROWS, currentPage);
        setupPagination(pagination, paginationElement, ROWS)
      });
    };
  };
  
  const setupPagination = (items, wrapper, rows) => {
    wrapper.innerHTML = '';
  
    let pageCount = Math.ceil(items.length / rows);
  
    for (let i = 1; i < pageCount + 1; i++) {
      let button = paginationButton(i, items);
  
      wrapper.appendChild(button);
    };
  };

  displayList(getInfoFromLS, historyContainer, ROWS, currentPage);
  setupPagination(getInfoFromLS, paginationElement,ROWS)
};

window.addEventListener('load', showHistory);
