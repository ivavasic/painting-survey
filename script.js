// Constants
const userAnswers = {}; // Stores answers for each page
const totalPages = 20;
// Content for each page initially empty
let pages = [];

// Constants for the 20 questions
const questions = [
    "The painting depicts a single moment rather than a sequence of events.",
    "The painting depicts a sequence of events rather than a single moment.",
    "The painting depicts a biblical event.",
    "The painting includes recognizable historical figures or well-known literary characters.",
    "The description of the painting suggests a dramatic scene with emphasis on a specific person, action, or object.",
    "The painting depicts interaction between people.",
    "The description indicates that the scene takes place indoors or in an architectural setting.",
    "The description includes references to nature, such as landscapes.",
    "The painting includes animals.",
    "The description suggests imaginative or symbolic elements rather than realistic ones.",
];

// HttpClient helper
class HttpClient {
    static get(url) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open("GET", url, true);
            xhr.onload = () => {
                if (xhr.status === 200) {
                    resolve(xhr.responseText);
                } else {
                    reject(new Error(`Request failed with status ${xhr.status}`));
                }
            };
            xhr.onerror = () => reject(new Error("Network error"));
            xhr.send();
        });
    }
}

// Variables
let currentPage = 1;
let identificationPageVisited = false; // Track if the identification page has been visited
let consentPageVisited = false; // Track if the consent page has been visited
window.userIP = "";
window.userProvidedCode = "";
window.userAge = "";
window.userGender = "";
window.userEducation = "";
window.userCountry = "";
window.userProfession = "";
window.userExperience = "";


// DOM Elements
const welcomePage = document.getElementById("welcomePage");
const surveyPage = document.getElementById("surveyPage");
const pageHeading = document.getElementById("pageHeading");
const paintingDescription = document.getElementById("paintingDescription");
const shortInstructions = document.getElementById("shortInstructions");
const myForm = document.getElementById("myForm");
const backButton = document.getElementById("backButton");
const nextButton = document.getElementById("nextButton");
const submitButton = document.getElementById("submitButton");

// DOM Elements for Consent
const startButton = document.getElementById("startButton");
const consentPage = document.getElementById("consentPage");
const consentCheckbox = document.getElementById("consentCheckbox");
const agreeConsentButton = document.getElementById("agreeConsentButton");

// DOM Elements for User Info
const identificationPage = document.getElementById("identificationPage");
const identificationForm = document.getElementById("identificationForm");
const userAge = document.getElementById("userAge");
const userGender = document.getElementById("userGender");
const userEducation = document.getElementById("userEducation");
const userCountry = document.getElementById("userCountry");
const userProfession = document.getElementById("userProfession");
const userExperience = document.getElementById("userExperience");

// DOM Element for the shared code
const userProvidedCode = document.getElementById("userProvidedCode");

// Google Script URL
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwZBI60bKjhaadpDD04TOrVq9T-SuF6IQXQxOm6GE0BWP4_T98VJQqwqOERh5KecKHecQ/exec";

// Event Listeners
continueButton.addEventListener("click", redirectToConsentPage);
agreeConsentButton.addEventListener("click", handleConsentAgreement);
startButton.addEventListener("click", collectUserInfo);
backButton.addEventListener("click", goToPreviousPage);
nextButton.addEventListener("click", goToNextPage);
submitButton.addEventListener("click", submitForm);

// Warn user before leaving the page
window.addEventListener("beforeunload", (event) => {
    if (currentPage <= totalPages) {
        event.preventDefault();
        event.returnValue = "Your responses are still being submitted. Are you sure you want to leave?";
    }
});

// Functions
function redirectToConsentPage() {
    if (consentPageVisited) {
        // If already consented, go directly to identification page
        redirectToIdentificationPage();
    } else {
        welcomePage.style.display = "none";
        consentPage.style.display = "block";
    }
}

// Function to fetch IP address and then redirect to identification page
function fetchUserIPAndRedirect(callback) {
    fetch("https://api.ipify.org?format=json")
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            window.userIP = data.ip;
            callback();
        })
        .catch(function (error) {
            console.error("IP fetch error:", error);
            window.userIP = "Unavailable";
            callback();
        });
}


function handleConsentAgreement() {
    if (!consentCheckbox.checked) {
        alert("The form cannot be initiated without your consent.");
        return;
    }

    consentPageVisited = true; // Mark as visited
    consentPage.style.display = "none";

    // Fetch the paintings only after consent
    fetch('paintings.json')
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            pages = data;
            fetchUserIPAndRedirect(redirectToIdentificationPage);
        })
        .catch(function (error) {
            console.error("Failed to load paintings.json:", error);
            alert("Failed to load paintings. Please try again later.");
        });
}

function redirectToIdentificationPage() {
    if (identificationPageVisited) {
        welcomePage.style.display = "none";
        surveyPage.style.display = "block";
        loadPage(currentPage);
    } else {
        welcomePage.style.display = "none";
        identificationPage.style.display = "block";

        document.getElementById("continueButton").textContent = "Resume";
    }
}

function generateRandomCode() {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
}

function collectUserInfo() {
    const userAgeValue = userAge.value.trim();
    const userGenderValue = userGender.value.trim();
    const userEducationValue = userEducation.value.trim();
    const userCountryValue = userCountry.value.trim();
    const userProfessionValue = userProfession.value.trim();
    const userExperienceValue = userExperience.value.trim();
    const userProvidedCodeValue = userProvidedCode.value.trim();

    // Reminder to fill out the form with an alert
    if (
        userAgeValue === "" ||
        userGenderValue === "" ||
        userEducationValue === "" ||
        userCountryValue === "" ||
        userProfessionValue === "" ||
        userExperienceValue === "" ||
        userProvidedCodeValue === ""
    ) {
        alert("Please fill out all the required fields.");
        return;
    }

    // Save globally for later use for sending to the server
    window.userAge = userAgeValue;
    window.userGender = userGenderValue;
    window.userEducation = userEducationValue;
    window.userCountry = userCountryValue;
    window.userProfession = userProfessionValue;
    window.userExperience = userExperienceValue;
    window.userProvidedCode = userProvidedCodeValue;

    // Generate and store the random code
    window.randomCode = generateRandomCode();

    // Collect start time
    window.startTime = new Date().toISOString();

    identificationPageVisited = true; // Mark as visited
    identificationPage.style.display = "none";
    surveyPage.style.display = "block";
    loadPage(currentPage); // Load the first page of the survey
}

function loadPage(pageNumber) {
    // Check if the page number is zero index
    if (pages.length === 0) {
        console.error("Pages not loaded yet!");
        return;
    }

    // Get the page data from the `pages` array
    const pageData = pages[pageNumber - 1];

    // Update the page heading
    pageHeading.textContent = pageData.heading;

    // Update the painting description
    paintingDescription.innerHTML = pageData.description.replace(/\n/g, "<br>");

    // Generate the form with questions
    generateForm();

    // Load saved answers (if any)
    const savedAnswers = userAnswers[`page${pageNumber}`];
    if (savedAnswers) {
        for (const [key, value] of Object.entries(savedAnswers)) {
            const radio = document.querySelector(`input[name="${key}"][value="${value}"]`);
            if (radio) {
                radio.checked = true;
            }
        }
    }

    updateNavigationButtons();

    // Scroll to top of the page
    window.scrollTo(0, 0);

}


function goToPreviousPage() {
    // Save answers before navigating
    saveAnswers();

    if (currentPage > 1) {
        currentPage--;
        loadPage(currentPage);
    } else if (currentPage === 1) {
        // Go back to the welcome page
        surveyPage.style.display = "none";
        welcomePage.style.display = "block";
        // Change the text of the start button into Resume
        document.getElementById("continueButton").textContent = "Resume";
    }
}


function goToNextPage() {
    // Proceede only if all questions are answered
    const form = document.getElementById("evaluationForm");

    // Use the form's built-in validation
    if (!form.reportValidity()) {
        return; // Stop if the form is not valid     
    }

    // Save answers before navigating
    saveAnswers();

    if (currentPage < totalPages) {
        currentPage++;
        loadPage(currentPage);
    } else {
        nextButton.style.display = "none";
        submitButton.style.display = "block";
    }
}

function updateNavigationButtons() {

    // Check if the current page is the last page
    if (currentPage === totalPages) {
        // Hide the next button and show the submit button on the last page
        nextButton.style.display = "none";
        submitButton.style.display = "block";
    } else {
        // Show the next button and hide the submit button for all other pages
        nextButton.style.display = "block";
        submitButton.style.display = "none";
    }
}


function generateForm() {
    const form = document.getElementById("evaluationForm");
    form.innerHTML = ""; // Clear any existing content

    // Loop through the questions array to generate the form
    questions.forEach((question, index) => {
        const questionNumber = index + 1;

        // Create a container for the question
        const questionContainer = document.createElement("div");
        questionContainer.classList.add("question-container");
        questionContainer.style.marginBottom = "20px";

        // Add the question text
        const questionText = document.createElement("p");
        questionText.textContent = `${questionNumber}. ${question}`;
        questionContainer.appendChild(questionText);

        // Add radio buttons for the question
        for (let i = 1; i <= 5; i++) {
            const label = document.createElement("label");
            label.style.marginRight = "10px";

            const radio = document.createElement("input");
            radio.type = "radio";
            radio.name = `question${questionNumber}`;
            radio.value = i;
            radio.required = true; // Make the question required

            label.appendChild(radio);
            label.appendChild(document.createTextNode(` ${i}`));
            questionContainer.appendChild(label);
        }

        // Append the question container to the form
        form.appendChild(questionContainer);
    });
}

// Save answers on any click
function saveAnswers() {
    const form = document.getElementById("evaluationForm");
    if (!form.reportValidity()) {
        console.warn("Form is incomplete. Answers not saved.");
        return;
    }

    const formData = new FormData(form);

    // Store answers for the current page
    const answers = {};
    for (const entry of formData.entries()) {
        const key = entry[0];
        const value = entry[1];
        answers[key] = value;
    }
    userAnswers["page" + currentPage] = answers;
}



function submitForm() {
    const form = document.getElementById("evaluationForm");
    if (!form.reportValidity()) return;

    saveAnswers();

    const endTime = new Date().toISOString();
    const pagesToSend = Object.keys(userAnswers).sort(function (a, b) {
        return parseInt(a.replace("page", "")) - parseInt(b.replace("page", ""));
    });

    submitFormSequentially(pagesToSend, endTime);
}


async function submitFormSequentially(pagesToSend, endTime) {
    const modalElement = document.getElementById("submissionModal");
    modalElement.style.display = "block"; // Show the modal

    for (let index = 0; index < pagesToSend.length; index++) {
        const pageName = pagesToSend[index];
        const answers = userAnswers[pageName];
        const pageNumber = pageName.replace("page", "");

        let url = `${GOOGLE_SCRIPT_URL}?UserProvidedCode=${encodeURIComponent(window.userProvidedCode)}`;
        url += "&UserAge=" + encodeURIComponent(window.userAge);
        url += "&UserGender=" + encodeURIComponent(window.userGender);
        url += "&UserEducation=" + encodeURIComponent(window.userEducation);
        url += "&UserCountry=" + encodeURIComponent(window.userCountry);
        url += "&UserProfession=" + encodeURIComponent(window.userProfession);
        url += "&UserExperience=" + encodeURIComponent(window.userExperience);
        url += "&RandomCode=" + encodeURIComponent(window.randomCode);
        url += "&UserIP=" + encodeURIComponent(window.userIP);
        url += "&Page=" + encodeURIComponent(pageNumber);
        url += "&StartTime=" + encodeURIComponent(window.startTime);
        url += "&EndTime=" + encodeURIComponent(endTime);

        for (const questionKey in answers) {
            const newKey = questionKey.replace("question", "Q");
            const value = answers[questionKey];
            url += "&" + encodeURIComponent(newKey) + "=" + encodeURIComponent(value);
        }

        try {
            const response = await fetch(url);
            if (response.ok) {
            } else {
                console.error(`❌ Failed to send data for page ${pageNumber}: ${response.statusText}`);
            }
        } catch (error) {
            console.error(`❌ Error sending data for page ${pageNumber}:`, error);
        }
    }

    modalElement.style.display = "none"; // Hide the modal
    alert("All your responses have been submitted. Thank you!");
}


