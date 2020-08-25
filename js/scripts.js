/**
 *
 * Global Variables
 *
 */

const gallery = document.querySelector("#gallery");
const url =
  "https://randomuser.me/api/?results=12&inc=picture,name,email,location,cell,dob&nat=us";

/**
 * Fetch Url
 * Convert to JSON
 * Send Response to Display Employees Function
 */

fetch(url)
  .then((res) => res.json())
  .then((res) => res.results)
  .then(displayEmployees)
  .catch((err) => console.log(err));

/**
 * Take Fetch Response and Display 12 Users
 * Event Lisener for Each Card
 * Call Create Modal Function
 */

function displayEmployees(response) {
  let galleryData = "";
  // Set Employees to the Returned Response from API
  let employees = response;
  employees.forEach((employee) => {
    //Set Photo, Name, Email, and Location to Response Info
    const photo = employee.picture;
    const name = employee.name;
    const email = employee.email;
    const location = employee.location;

    galleryData += `
    <div class="card">
    <div class="card-img-container">
        <img class="card-img" src="${photo.large}" alt="profile picture">
    </div>
        <div class="card-info-container">
            <h3 id="name" class="card-name cap">${name.first} ${name.last}</h3>
            <p class="card-text">${email}</p>
            <p class="card-text cap">${location.city}</p>
        </div>
    </div>

        `;
  });
  //Set HTML Adjacent to Gallery Data
  gallery.insertAdjacentHTML("beforeend", galleryData);

  const card = document.querySelectorAll(".card");
  //Set Event Listener for Every Card Item on Display
  card.forEach((item, index) => {
    item.addEventListener("click", () => {
      createModal(employees, index);
    });
  });
}

/**
 * Take Response and Index from Display Employees Function
 * Create Modal Buttons
 * Modal Button Functionality
 */

function createModal(response, index) {
  //Set Employee to Response with Current Index
  const employee = response[index];
  const modalContainer = document.createElement("DIV");
  gallery.appendChild(modalContainer);
  modalContainer.classList.add("modal-container");
  //Set Modal Inner HTML with Response Index
  modalContainer.innerHTML = `   
  <div class="modal">
  <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
    <div class="modal-info-container">
      <img class="modal-img" src="${
        employee.picture.large
      }" alt="profile picture">
      <h3 id="name" class="modal-name cap">${employee.name.first} ${
    employee.name.last
  }</h3>
      <p class="modal-text">${employee.email}</p>
      <p class="modal-text cap">${employee.location.city}</p>
      <hr>
      <p class="modal-text">${phoneFormat(employee.cell)}</p>
      <p class="modal-text">${employee.location.street.number} ${
    employee.location.street.name
  }, ${employee.location.city}, ${employee.location.state} ${
    employee.location.postcode
  }</p>
      <p class="modal-text">Birthday: ${dobFormat(employee.dob.date)}</p>
    </div>
  </div>`;

  //Inner HTML for Modal Buttons
  const modalbtnContainer = document.createElement("DIV");
  modalContainer.appendChild(modalbtnContainer);
  modalbtnContainer.classList.add("modal-btn-container");
  modalbtnContainer.innerHTML = `
  <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
  <button type="button" id="modal-next" class="modal-next btn">Next</button>
  `;

  //Event Listener for Modal Close Button
  const modalClose = document.querySelector("#modal-close-btn");
  modalClose.addEventListener("click", () => {
    gallery.removeChild(modalContainer);
  });

  //Event Listener for Modal Next
  const modalNext = document.querySelector("#modal-next");
  modalNext.addEventListener("click", () => {
    gallery.removeChild(modalContainer);
    createModal(response, index + 1);
  });

  //Event Listener for Modal Previous
  const modalPrevious = document.querySelector("#modal-prev");
  modalPrevious.addEventListener("click", () => {
    gallery.removeChild(modalContainer);
    createModal(response, index - 1);
  });

  //If Index is 11, set disabled and change button color
  if (index === 11) {
    modalNext.setAttribute("disabled", true);
    modalNext.style.backgroundColor = "rgba(255, 255, 255, 1)";
    modalNext.style.color = "rgba(25, 25, 25, 1)";
  }

  //If Index is 0, set disabled and change button color
  if (index === 0) {
    modalPrevious.setAttribute("disabled", true);
    modalPrevious.style.backgroundColor = "rgba(255, 255, 255, 1)";
    modalPrevious.style.color = "rgba(25, 25, 25, 1)";
  }
}

/**
 * Create Search Bar
 * Event Lisener for Search Bar
 * Allow User to Search for Card Name
 */

function searchBar() {
  const search = document.querySelector(".search-container");

  //Set Search Inner HTML
  search.innerHTML = `
  <form action="#" method="get">
    <input type="search" id="search-input" class="search-input" placeholder="Search...">
    <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
  </form>
  `;

  //Search Event Lisener
  search.addEventListener("keyup", (e) => {
    const target = e.target.value.toUpperCase();
    console.log(target);
    const names = document.querySelectorAll("#name");
    names.forEach((name) => {
      const person = name.innerHTML.toUpperCase();
      if (person.indexOf(target) > -1) {
        name.closest(".card").style.display = "";
      } else {
        name.closest(".card").style.display = "none";
      }
    });
  });
}
//Call Function
searchBar();

/**
 *
 * Convert Phone Number to Correct Format
 */

function phoneFormat(phone) {
  //Replace Non Digit Characters
  phone = phone.replace(/[^\d]/g, "");
  //Check to see if phone length is 10
  if (phone.length == 10) {
    return phone.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
  }
  return null;
}

/**
 *
 * Convert DOB Number to Correct Format
 */

function dobFormat(date) {
  //Replace Non Digit Characters
  let birthday = date.replace(/[^\d]/g, "");
  //Convert Birthday to String
  birthday.toString();
  //Only Show First 8 Characters
  let removeTime = birthday.substr(0, 8);
  //Format 8 Characters
  return removeTime.replace(/(\d{4})(\d{2})(\d{2})/, "$2/$3/$1");
}
