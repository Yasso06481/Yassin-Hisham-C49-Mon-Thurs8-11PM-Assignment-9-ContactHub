const modal = document.getElementById("modal");
const openBtn = document.getElementById("openBtn");
const closeBtn = document.getElementById("closeBtn");
const cancelBtn = document.getElementById("cancelBtn");
const SaveBtn = document.getElementById("SaveBtn");

const fullName = document.getElementById("fullName");
const phoneNumber = document.getElementById("phoneNumber");
const emailAddress = document.getElementById("emailAddress");
const address = document.getElementById("address");
const groupSelect = document.getElementById("groupSelect");
const notes = document.getElementById("notes");
const favoriteCheck = document.getElementById("favoriteCheck");
const emergencyCheck = document.getElementById("emergencyCheck");

const emptyState = document.getElementById("emptyState");
const contactsContainer = document.getElementById("contactsContainer");

let contactlist = JSON.parse(localStorage.getItem("contacts")) || [];
let editIndex = null;

displayContacts();

openBtn.addEventListener("click", () => {
  editIndex = null;
  document.querySelector("form").reset();
  document.querySelector("#modal h5").textContent = "Add New Contact";
  SaveBtn.textContent = "Save contact";
  modal.showModal();
});

closeBtn.addEventListener("click", () => {
  modal.close();
});

if (cancelBtn) {
  cancelBtn.addEventListener("click", () => {
    modal.close();
  });
}

function saveToLocalStorage() {
  localStorage.setItem("contacts", JSON.stringify(contactlist));
}

function createcontact() {
  if (!fullName.value.trim() || !phoneNumber.value.trim()) {
    alert("Please fill in required fields (Full Name and Phone Number).");
    return;
  }

  const contactobj = {
    fl: fullName.value.trim(),
    pn: phoneNumber.value.trim(),
    ea: emailAddress.value.trim(),
    a: address.value.trim(),
    gr: groupSelect.value,
    n: notes.value.trim(),
    fav: favoriteCheck.checked,
    eme: emergencyCheck.checked,
  };

  if (editIndex !== null) {
    contactlist[editIndex] = contactobj;
    editIndex = null;
  } else {
    contactlist.push(contactobj);
  }

  saveToLocalStorage();
  displayContacts();

  document.querySelector("form").reset();
  modal.close();
}

function deleteContact(index) {
  if (confirm("Are you sure you want to delete this contact?")) {
    contactlist.splice(index, 1);
    saveToLocalStorage();
    displayContacts();
  }
}

function editContact(index) {
  editIndex = index;
  const contact = contactlist[index];

  fullName.value = contact.fl;
  phoneNumber.value = contact.pn;
  emailAddress.value = contact.ea;
  address.value = contact.a;
  groupSelect.value = contact.gr;
  notes.value = contact.n;
  favoriteCheck.checked = contact.fav;
  emergencyCheck.checked = contact.eme;

  document.querySelector("#modal h5").textContent = "Edit Contact";
  SaveBtn.textContent = "Update Contact";

  modal.showModal();
}

function updateStats() {
  const totalCount = contactlist.length;
  const favCount = contactlist.filter((c) => c.fav).length;
  const emeCount = contactlist.filter((c) => c.eme).length;

  const infoCardsDivs = document.querySelectorAll(
    ".infocard .card-text-content div",
  );
  if (infoCardsDivs.length >= 3) {
    infoCardsDivs[0].textContent = totalCount;
    infoCardsDivs[1].textContent = favCount;
    infoCardsDivs[2].textContent = emeCount;
  }

  const allContactsSub = document.querySelector(".all span:nth-of-type(3)");
  if (allContactsSub) {
    allContactsSub.textContent = `Manage and organize your ${totalCount} contacts`;
  }
}

function displayContacts() {
  updateStats();

  if (contactlist.length > 0) {
    if (emptyState) emptyState.style.display = "none";
  } else {
    if (emptyState) emptyState.style.display = "block";
  }

  let existingList = document.getElementById("cardsList");
  if (!existingList) {
    existingList = document.createElement("div");
    existingList.id = "cardsList";
    existingList.className = "d-flex flex-column gap-3 mt-4";
    contactsContainer.appendChild(existingList);
  }
  existingList.innerHTML = "";

  contactlist.forEach((contact, index) => {
    const cardHTML = `
      <div class="card border-0 shadow-sm rounded-4 p-3">
        <div class="d-flex align-items-center justify-content-between flex-wrap gap-2">
          <div class="d-flex align-items-center gap-3">
            <div class="avatar-circle bg-primary text-white d-flex align-items-center justify-content-center rounded-circle" style="width: 45px; height: 45px; font-size: 18px; font-weight: bold;">
              ${contact.fl.charAt(0).toUpperCase()}
            </div>
            <div>
              <h6 class="fw-bold mb-0">${contact.fl}</h6>
              <small class="text-muted">${contact.pn} ${contact.ea ? "• " + contact.ea : ""}</small>
            </div>
          </div>
          <div class="d-flex gap-2 align-items-center">
            ${contact.fav ? '<span class="badge bg-warning text-dark">Favorite</span>' : ""}
            ${contact.eme ? '<span class="badge bg-danger">Emergency</span>' : ""}
            <span class="badge bg-light text-dark border">${contact.gr}</span>
            <button class="btn btn-sm btn-outline-primary ms-2" onclick="editContact(${index})">Edit</button>
            <button class="btn btn-sm btn-outline-danger" onclick="deleteContact(${index})">Delete</button>
          </div>
        </div>
        ${contact.a ? `<div class="mt-2 text-secondary small"><i class="bi bi-geo-alt"></i> ${contact.a}</div>` : ""}
        ${contact.n ? `<div class="mt-1 text-muted small"> ${contact.n}</div>` : ""}
      </div>
    `;
    existingList.innerHTML += cardHTML;
  });
}
