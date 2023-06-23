import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
  databaseURL:
    "https://playground-24a5e-default-rtdb.europe-west1.firebasedatabase.app/",
};
const app = initializeApp(appSettings)
const database = getDatabase(app)
const commentsnDB = ref(database, "commentsList")
const textarea = document.getElementById("textarea")
const buttonAdd = document.getElementById("btn_add")
const commentsList = document.getElementById("comments_list")
const sender = document.getElementById("sender")
const recipient = document.getElementById("recipient")

function CreateComment (sender, recipient, comment) {
    this.sender = sender
    this.recipient = recipient
    this.comment = comment
}
buttonAdd.addEventListener("click", addComment)

function addComment () {
    let endorsement = endorsementCreate()
    if (endorsement.comment !=="") {
     push(commentsnDB, endorsement);
     }
    }
function clearField () {
    textarea.value = ""
    sender.value = ""
    recipient.value = ""
}   
function endorsementCreate() {
    let comment = textarea.value
    let senderInfo = sender.value
    let recepientInfo = recipient.value
    let endorsement = new CreateComment (senderInfo, recepientInfo, comment)
    clearField()
    endorsement.sender = endorsement.sender || "Anonymous";
    endorsement.recipient = endorsement.recipient || "Anonymous";
    return endorsement
}
function clearCommentsListEl() {
  commentsList.innerHTML = "";
}
onValue(commentsnDB, function (snapshot) {
  if (snapshot.exists()) {
    let commentsArray = Object.entries(snapshot.val());
    clearCommentsListEl();
    for (let i=0; i<commentsArray.length;i++) {
        let currentItem = commentsArray[i]
        appendItemToCommentsListEl(currentItem);
    }
  } else {
    commentsList.innerHTML = "<li style='color: black; list-style-type: none;'>We're waiting for your comments..</li>";
  }
});

function appendItemToCommentsListEl(item) {
  let message = item[1].comment;
  let sender = item[1].sender;
  let recipient = item[1].recipient;
  let id = item[0];
  let newEl = document.createElement("li");
  let endorsementDiv = document.createElement("div");
  endorsementDiv.classList.add("endorsement");
  let senderEl = document.createElement("p");
  senderEl.classList.add("sender");
  senderEl.textContent = `From: ${sender}`;
  let recipientEl = document.createElement("p");
  recipientEl.classList.add("recipient");
  recipientEl.textContent = `To: ${recipient}`;
  let messageEl = document.createElement("p");
  messageEl.classList.add("message");
  messageEl.textContent = message;
  endorsementDiv.appendChild(recipientEl);
  endorsementDiv.appendChild(messageEl);
  endorsementDiv.appendChild(senderEl);
  newEl.appendChild(endorsementDiv);
  commentsList.append(newEl);
  newEl.addEventListener("dblclick", function () {
      let exactLocationOfItemInDB = ref(database, `commentsList/${item[0]}`)
      remove(exactLocationOfItemInDB)
  })
}

