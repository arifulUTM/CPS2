var audio = new Audio('assets/sentmessage.mp3');

var GROUP_NAME = "CPS2";
var GROUP_SUBTITLE = "Assignments, Quiz, Exams";

// ---------- EDIT YOUR DATA HERE ----------
// Date format: YYYY-MM-DD (item counts as upcoming until the end of that day).
var data = {
    assignments: {
        label: "Assignments",
        items: [
            { title: "Assignment 1", date: "2026-09-05" },
            { title: "Assignment 2", date: "2026-09-19" },
            { title: "Assignment 3", date: "2026-10-03" },
            { title: "Assignment 4", date: "2026-10-17" },
            { title: "Assignment 5", date: "2026-10-31" },
            { title: "Assignment 6", date: "2026-11-14" }
        ]
    },
    quiz: {
        label: "Quiz",
        items: [
            { title: "Quiz 1", date: "2026-09-12" },
            { title: "Quiz 2", date: "2026-10-10" },
            { title: "Quiz 3", date: "2026-11-07" }
        ]
    },
    exams: {
        label: "Exams",
        items: [
            { title: "Mid Term Exam", date: "2026-10-24" },
            { title: "Final Exam", date: "2026-12-12" }
        ]
    }
};
// ------------------------------------------

function startFunction() {
    setSubtitle();
    waitAndResponce("intro");
}

function setSubtitle() {
    document.getElementById("lastseen").innerText = GROUP_SUBTITLE;
}

function closeFullDP() {
    var x = document.getElementById("fullScreenDP");
    x.style.display = (x.style.display === 'flex') ? 'none' : 'flex';
}

function openFullScreenDP() {
    closeFullDP();
}

function isEnter(event) {
    if (event.keyCode == 13) {
        sendMsg();
    }
}

function pad(n) {
    return n < 10 ? "0" + n : n;
}

function timeNow() {
    var d = new Date();
    return d.getHours() + ":" + pad(d.getMinutes());
}

function formatDate(d) {
    return d.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
}

function buildSection(key) {
    var now = new Date();
    var section = data[key];

    var items = section.items.map(function (a) {
        var p = a.date.split("-");
        return { title: a.title, dueDate: new Date(+p[0], +p[1] - 1, +p[2], 23, 59, 59) };
    });

    var upcoming = items.filter(function (a) { return a.dueDate >= now; })
        .sort(function (a, b) { return a.dueDate - b.dueDate; });
    var previous = items.filter(function (a) { return a.dueDate < now; })
        .sort(function (a, b) { return b.dueDate - a.dueDate; });

    var html = "<span class='sk'><span class='bold'>CPS2 " + section.label + "</span><br>Today: " + formatDate(now) + "<br><br>";

    html += "<span class='bold'>Upcoming</span><br>";
    if (upcoming.length === 0) {
        html += "Nothing upcoming.<br>";
    } else {
        upcoming.forEach(function (a) {
            var days = Math.ceil((a.dueDate - now) / 86400000);
            var left = days <= 1 ? "today/tomorrow" : days + " days left";
            html += "&bull; " + a.title + "<br>&nbsp;&nbsp;" + formatDate(a.dueDate) + " (" + left + ")<br>";
        });
    }

    html += "<br><span class='bold'>Previous</span><br>";
    if (previous.length === 0) {
        html += "Nothing previous.<br>";
    } else {
        previous.forEach(function (a) {
            html += "&bull; " + a.title + "<br>&nbsp;&nbsp;" + formatDate(a.dueDate) + "<br>";
        });
    }
    return html + "</span>";
}

function sendMsg() {
    var input = document.getElementById("inputMSG");
    var ti = input.value;
    if (input.value == "") {
        return;
    }
    var myLI = document.createElement("li");
    var myDiv = document.createElement("div");
    var greendiv = document.createElement("div");
    var dateLabel = document.createElement("label");
    dateLabel.innerText = timeNow();
    myDiv.setAttribute("class", "sent");
    greendiv.setAttribute("class", "green");
    dateLabel.setAttribute("class", "dateLabel");
    greendiv.innerText = input.value;
    myDiv.appendChild(greendiv);
    myLI.appendChild(myDiv);
    greendiv.appendChild(dateLabel);
    document.getElementById("listUL").appendChild(myLI);
    var s = document.getElementById("chatting");
    s.scrollTop = s.scrollHeight;
    setTimeout(function () { waitAndResponce(ti) }, 1000);
    input.value = "";
    playSound();
}

function waitAndResponce(inputText) {
    document.getElementById("lastseen").innerText = "typing...";
    switch (inputText.toLowerCase().trim()) {
        case "intro":
            setTimeout(() => {
                sendTextMessage("Welcome to <span class='bold'>CPS2</span> 👋🏻<br><br><span class='sk'>Type:<br><span class='bold'>'assignments'</span> - upcoming &amp; previous assignments<br><span class='bold'>'quiz'</span> - upcoming &amp; previous quizzes<br><span class='bold'>'exams'</span> - upcoming &amp; previous exams<br><span class='bold'>'clear'</span> - to clear conversation</span>");
            }, 800);
            break;
        case "help":
            sendTextMessage("<span class='sk'>Send a keyword:<br><br><span class='bold'>'assignments'</span> - upcoming &amp; previous assignments<br><span class='bold'>'quiz'</span> - upcoming &amp; previous quizzes<br><span class='bold'>'exams'</span> - upcoming &amp; previous exams<br><span class='bold'>'clear'</span> - to clear conversation</span>");
            break;
        case "assignments":
        case "assignment":
            sendTextMessage(buildSection("assignments"));
            break;
        case "quiz":
        case "quizzes":
            sendTextMessage(buildSection("quiz"));
            break;
        case "exams":
        case "exam":
            sendTextMessage(buildSection("exams"));
            break;
        case "clear":
            clearChat();
            break;
        default:
            setTimeout(() => {
                sendTextMessage("Couldn't catch that...😢<br>Send 'help' to see the options.");
            }, 1000);
            break;
    }
}

function clearChat() {
    document.getElementById("listUL").innerHTML = "";
    waitAndResponce('intro');
}

function sendTextMessage(textToSend) {
    setTimeout(setSubtitle, 800);
    var myLI = document.createElement("li");
    var myDiv = document.createElement("div");
    var greendiv = document.createElement("div");
    var dateLabel = document.createElement("label");
    dateLabel.id = "sentlabel";
    dateLabel.innerText = timeNow();
    myDiv.setAttribute("class", "received");
    greendiv.setAttribute("class", "grey");
    greendiv.innerHTML = textToSend;
    myDiv.appendChild(greendiv);
    myLI.appendChild(myDiv);
    greendiv.appendChild(dateLabel);
    document.getElementById("listUL").appendChild(myLI);
    var s = document.getElementById("chatting");
    s.scrollTop = s.scrollHeight;
    playSound();
}

function playSound() {
    audio.play();
}
