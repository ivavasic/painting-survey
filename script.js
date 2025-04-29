// Constants
const userAnswers = {}; // Stores answers for each page
const totalPages = 50;
// Content for each page initially empty
let pages = [];

// Constants for the 20 questions
const questions = [
    "Show me the painting depicting a single moment rather than a sequence of events.",
    "Show me the painting depicting a sequence of events rather than a single moment.",
    "Does the height of the painting exceed 100 cm ?",
    "Is the width of the painting greater than 50 cm? If yes, assign a higher rank for its suitability for wide displays.",
    "Does the painting's surface area (height x width) exceed 2000 cm²? If yes, increase its ranking for size prominence.",
    "Does the painting depict biblical events?",
    "Show me the paintings with an unknown artist/maker.",
    "Does the title of the painting directly reflect a significant historical, mythological, or biblical event? If yes, rank it higher.",
    "Does the painting include key historical figures or famous literary characters mentioned in its description? Rank accordingly.",
    "In which paintings the artist employs chiaroscuro or tenebrism to enhance the drama and focus within the painting?",
    "Does the height of the painting exceed 30 cm?",
    "Does the metadata describe specific techniques, such as glazing or impasto, that enhance the visual or textural quality of the painting?",
    "Does the metadata mention a specific workshop or studio? Rank accordingly.",
    "Is the painting's place of creation associated with the origin of its depicted theme or narrative?",
    "Are there markings, stencils, or inscriptions mentioned in the metadata that add historical or artistic value? Rank accordingly.",
    "Show me paintings related to Renaissance.",
    "Show me paintings depicting portraits.",
    "Show me paintings with animals and flowers.",
    "I want to see people in the paintings.",
    "Rank the paintings based on their use of color.",
];

// HttpClient helper
var HttpClient = function () {
    this.get = function (aUrl, aCallback) {
        var anHttpRequest = new XMLHttpRequest();
        anHttpRequest.onreadystatechange = function () {
            if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
                aCallback(anHttpRequest.responseText);
        };

        anHttpRequest.open("GET", aUrl, true);
        anHttpRequest.send(null);
    };
};

// Variables
let currentPage = 1;
let identificationPageVisited = false; // Track if the identification page has been visited
let consentPageVisited = false; // Track if the consent page has been visited

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
// DOM Elements for User Info
const identificationPage = document.getElementById("identificationPage");
const identificationForm = document.getElementById("identificationForm");
const userNameInput = document.getElementById("userName");
const userEmailInput = document.getElementById("userEmail");
const startButton = document.getElementById("startButton");
const consentPage = document.getElementById("consentPage");
const consentCheckbox = document.getElementById("consentCheckbox");
const agreeConsentButton = document.getElementById("agreeConsentButton");



// Event Listeners
continueButton.addEventListener("click", redirectToConsentPage);
agreeConsentButton.addEventListener("click", handleConsentAgreement);
startButton.addEventListener("click", collectUserInfo);
backButton.addEventListener("click", goToPreviousPage);
nextButton.addEventListener("click", goToNextPage);
submitButton.addEventListener("click", submitForm);




function redirectToConsentPage() {
    if (consentPageVisited) {
        // If already consented, go directly to identification page
        redirectToIdentificationPage();
    } else {
        welcomePage.style.display = "none";
        consentPage.style.display = "block";
    }
}


function handleConsentAgreement() {
    if (!consentCheckbox.checked) {
        alert("The form cannot be initiated without your consent.");
        return;
    }

    consentPageVisited = true; // Mark as visited
    consentPage.style.display = "none";

    // Now fetch the paintings only after consent
    fetch('paintings.json')
        .then(response => response.json())
        .then(data => {
            pages = data;
            console.log("Paintings loaded:", pages.length);
            redirectToIdentificationPage(); // Proceed only after loading paintings
        })
        .catch(error => {
            console.error("Failed to load paintings.json:", error);
            alert("Failed to load paintings. Please try again later.");
        });
}


// Functions
function redirectToIdentificationPage() {
    if (identificationPageVisited) {
        // If already filled, go directly to survey
        welcomePage.style.display = "none";
        surveyPage.style.display = "block";
        loadPage(currentPage);
    } else {
        welcomePage.style.display = "none";
        identificationPage.style.display = "block";

        document.getElementById("continueButton").textContent = "Resume";
    }
}



function collectUserInfo() {
    const userName = userNameInput.value.trim();
    const userEmail = userEmailInput.value.trim();

    // Reminder to fill out the form with an alert
    if (userName === "" || userEmail === "") {
        alert("Please fill out both your name and email address.");
        return;
    }

    // Save globally for later use for sending to the server
    window.userName = userName;
    window.userEmail = userEmail;

    // Generate a random user code IF not already
    if (!window.userCode) {
        window.userCode = generateUserCode();
    }

    // Collect start time
    window.startTime = new Date().toISOString();

    identificationPageVisited = true; // Mark as visited
    identificationPage.style.display = "none";
    surveyPage.style.display = "block";
    loadPage(currentPage); // ! Load the first page of the survey

}

function loadPage(pageNumber) {
    // Check if the page number is zero index
    if (pages.length === 0) {
        console.error("Pages not loaded yet!");
        return;
    }

    // Get the page data from the `pages` array
    const pageData = pages[pageNumber - 1];
    console.log(`Page Number: ${pageNumber}`); // Log the current page number
    console.log(pageData);

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
        // Hide next botton and exchange it with a submit button
        nextButton.style.display = "none";
        // Show submit button
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
    const formData = new FormData(form);

    // Store answers for the current page
    const answers = {};
    for (const entry of formData.entries()) {
        const key = entry[0];
        const value = entry[1];
        answers[key] = value;
    }
    userAnswers["page" + currentPage] = answers;
    console.log("Answers for Page " + currentPage + ":", answers);
}



function submitForm() {
    // Validate the current page
    const form = document.getElementById("evaluationForm");
    if (!form.reportValidity()) {
        return;
    }

    // Save current page answers in 'userAnswers' variable created in the 'saveAnswers' function
    saveAnswers();
    console.log("All collected answers:", userAnswers);

    // 3. Capture the end time
    const endTime = new Date().toISOString();

    const allPages = Object.keys(userAnswers); // Looks like: ["page1", "page2", "page3", ...]
    allPages.sort(function (a, b) {
        // Sort pages based on page number
        const pageNumberA = parseInt(a.replace("page", ""), 10);
        const pageNumberB = parseInt(b.replace("page", ""), 10);
        if (pageNumberA < pageNumberB) {
            return -1;
        } else if (pageNumberA > pageNumberB) {
            return 1;
        } else {
            return 0;
        }
    });

    // Generate random user code
    if (!window.userCode) {
        window.userCode = generateUserCode();
    }

    // Now when all pages are sorted from n to 1, we can iterate through them in reverse order and send the data to the server
    for (const pageName of allPages.reverse()) {
        const answers = userAnswers[pageName];
        const pageNumber = pageName.replace("page", "");

        let url = "https://script.google.com/macros/s/AKfycbyGuVgfCeUMccwRTKl4eNJprzTLwGRE0fzsdxthsoeyYAHMWBKixzkO6xZQnaXZwoLb8Q/exec?";

        // ➔ Add user's info
        url += "UserName=" + encodeURIComponent(window.userName);
        url += "&UserEmail=" + encodeURIComponent(window.userEmail);
        url += "&UserCode=" + encodeURIComponent(window.userCode);

        // ➔ Add page info
        url += "&Page=" + encodeURIComponent(pageNumber);

        for (const questionKey in answers) {
            const newKey = questionKey.replace("question", "Q");
            const value = answers[questionKey];
            url += "&" + encodeURIComponent(newKey) + "=" + encodeURIComponent(value);
        }

        // ➔ Add the start time and end time
        url += "&StartTime=" + encodeURIComponent(window.startTime);
        url += "&EndTime=" + encodeURIComponent(endTime);

        var client = new HttpClient();
        client.get(url, function (response) {
            console.log("Data sent successfully for page " + pageNumber);
        });
    }

    alert("All your responses have been submitted. Thank you!");
}

// Helper function to generate random user code
function generateUserCode() {
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
}
