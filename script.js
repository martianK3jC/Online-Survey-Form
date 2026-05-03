// Survey form: live preview, validation, responses table.

const form = document.getElementById("feedbackForm");
const fullnameEl = document.getElementById("fullname");
const emailEl = document.getElementById("email");
const ratingEl = document.getElementById("rating");
const feedbackEl = document.getElementById("feedback");
const submitBtn = document.getElementById("submitBtn");

const previewName = document.querySelector("#previewName");
const previewEmail = document.querySelector("#previewEmail");
const previewRating = document.querySelector("#previewRating");
const previewFeedback = document.querySelector("#previewFeedback");

const totalResponsesEl = document.getElementById("totalResponses");
const averageRatingEl = document.getElementById("averageRating");
const responsesBody = document.getElementById("responsesBody");

const errFullname = document.getElementById("error-fullname");
const errEmail = document.getElementById("error-email");
const errRating = document.getElementById("error-rating");
const errFeedback = document.getElementById("error-feedback");

const responses = [];

function setText(el, text) {
    el.textContent = text;
}

function ratingLabelFromSelect(selectEl) {
    const opt = selectEl.selectedOptions[0];
    return opt ? opt.textContent.trim() : "";
}

function updateLivePreview() {
    setText(previewName, fullnameEl.value.trim());
    setText(previewEmail, emailEl.value.trim());
    const lbl = ratingLabelFromSelect(ratingEl);
    setText(previewRating, lbl || "—");
    setText(previewFeedback, feedbackEl.value);
}

function updateSummary() {
    const n = responses.length;
    totalResponsesEl.textContent = String(n);
    if (n === 0) {
        averageRatingEl.textContent = "0";
        return;
    }
    const sum = responses.reduce((acc, r) => acc + r.ratingNum, 0);
    const avg = (sum / n).toFixed(1);
    averageRatingEl.textContent = avg;
}

function clearFieldError(inputEl, msgEl) {
    inputEl.classList.remove("input-invalid");
    setText(msgEl, "");
    inputEl.setAttribute("aria-invalid", "false");
}

function setFieldError(inputEl, msgEl, message) {
    inputEl.classList.add("input-invalid");
    setText(msgEl, message);
    inputEl.setAttribute("aria-invalid", "true");
}

function clearAllValidation() {
    clearFieldError(fullnameEl, errFullname);
    clearFieldError(emailEl, errEmail);
    clearFieldError(ratingEl, errRating);
    clearFieldError(feedbackEl, errFeedback);
}

function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function validateForm() {
    clearAllValidation();
    let ok = true;

    if (!fullnameEl.value.trim()) {
        setFieldError(fullnameEl, errFullname, "Please enter your full name.");
        ok = false;
    }
    const emailVal = emailEl.value.trim();
    if (!emailVal) {
        setFieldError(emailEl, errEmail, "Please enter your email.");
        ok = false;
    } else if (!isValidEmail(emailVal)) {
        setFieldError(emailEl, errEmail, "Please enter a valid email address.");
        ok = false;
    }
    if (!ratingEl.value) {
        setFieldError(ratingEl, errRating, "Please select a service rating.");
        ok = false;
    }
    if (!feedbackEl.value.trim()) {
        setFieldError(feedbackEl, errFeedback, "Please share your feedback.");
        ok = false;
    }

    return ok;
}

function appendResponseRow(entry) {
    const tr = document.createElement("tr");

    ["name", "email", "ratingLabel", "feedback"].forEach((key) => {
        const td = document.createElement("td");
        td.textContent = entry[key];
        tr.appendChild(td);
    });

    responsesBody.appendChild(tr);
}

function handleLiveInput(event) {
    const t = event.target;
    const id = t.getAttribute("id");
    const errMap = {
        fullname: errFullname,
        email: errEmail,
        rating: errRating,
        feedback: errFeedback,
    };
    const elMap = {
        fullname: fullnameEl,
        email: emailEl,
        rating: ratingEl,
        feedback: feedbackEl,
    };
    if (id && errMap[id] && elMap[id]) {
        if (t.classList.contains("input-invalid")) {
            clearFieldError(elMap[id], errMap[id]);
        }
    }
    updateLivePreview();
}

["input", "change"].forEach((type) => {
    form.addEventListener(type, handleLiveInput);
});

function handleSubmit(event) {
    event.preventDefault();

    submitBtn.disabled = true;
    submitBtn.setAttribute("aria-busy", "true");

    const valid = validateForm();
    if (!valid) {
        submitBtn.disabled = false;
        submitBtn.removeAttribute("aria-busy");
        return;
    }

    const name = fullnameEl.value.trim();
    const email = emailEl.value.trim();
    const ratingNum = Number(ratingEl.value);
    const ratingLabel = ratingLabelFromSelect(ratingEl);
    const feedback = feedbackEl.value.trim();

    const entry = { name, email, ratingNum, ratingLabel, feedback };
    responses.push(entry);

    appendResponseRow(entry);
    updateSummary();

    form.reset();
    updateLivePreview();
    clearAllValidation();

    submitBtn.disabled = false;
    submitBtn.removeAttribute("aria-busy");
}

form.addEventListener("submit", handleSubmit);

updateLivePreview();
updateSummary();
