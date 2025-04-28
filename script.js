// Constants
const userAnswers = {}; // Stores answers for each page
const totalPages = 2;
// Content for each page
const pages = [
    {
        heading: "Painting 1 of 50:",
        description:
            `Title: The Wedding Feast at Cana, <br>
            Artist/Maker: Lavinia Fontana (Italian, 1552 - 1614),
            Date: about 1575–1580,
            Medium: Oil on copper,
            Dimensions: Unframed: 47.3 x 36.2 cm (18 5/8 x 14 1/4 in.),
            Place: Italy (Place Created),
            Culture: Italian,
            Object Number: 2022.28,
            Mark(s): Verso: stencil 727DX,
            Department: Paintings,
            Classification: Painting,
            Object Type: Painting 
            
            <br><br>

            The Wedding Feast at Cana, a small painting intended for private devotion, depicts an episode from the life of Christ from the Gospel of John (2:1-11) in which Jesus, his mother Mary, and his disciples are invited to a wedding. When Mary notices that the wine has run out, Christ delivers a sign of his divinity by turning water into wine at her request. Here, Christ and Mary are seated at the center of the table, with the bridegroom on their right and the bride seated at the head of the table. Other guests, some standing and some seated, are assembled around the table. Behind them servants arrive with plates of food. Fontana shows the moment of the miracle, when Jesus raises his hand in benediction. The prominent golden jugs in the foreground are evidence of the miracle. A credenza with a rich display of silver plates occupies the wall on the left. An elegant exedra-shaped peristyle, accessed via a double semicircular staircase, part concave and part convex, appears in the upper part of the composition. The artist has painstakingly applied the paint in thin layers and added rich glazes, resulting in a polished, luminous, and highly detailed composition.`
    },
    {
        heading: "Painting 2 of 50",
        description:
            `Title: Portrait of Isabella of Portugal, 
            Artist/Maker: Workshop of Rogier van der Weyden (Netherlandish, 1399/1400 - 1464), 
            Date: about 1450, 
            Medium: Oil on panel, 
            Dimensions: Unframed: 46 × 37.1 cm (18 1/8 × 14 5/8 in.) Framed [Outer Dim]: 60.6 × 50.8 × 3.5 cm (23 7/8 × 20 × 1 3/8 in.), 
            Place: Netherlands (Place Created),
            Culture: Netherlandish, 
            Object Number: 78.PB.3, 
            Inscription(s): Upper left: "PERSICA / SIBYLLA / [.1.]A", 
            Mark(s): Verso: upper center, white rectangular label, printed in black: “NO. [printed in red:] 28517 / [printed in black:] PICTURE”; upper right, black stencil: “426YD”; upper right, unidentified red circular wax seal, 
            Previous Attribution: After Rogier van der Weyden (Netherlandish, 1399/1400 - 1464) Rogier van der Weyden (Netherlandish, 1399/1400 - 1464),
            Department: Paintings, 
            Classification: Painting, 
            Object Type: Painting
		
		    <br> <br>

		    Seated with her hands crossed in her lap, Isabella of Portugal, the duchess of Burgundy, conveys the poise and confidence of her noble position. Her sumptuous attire, heavily woven with gold thread, and her jeweled fingers and headdress reflect her aristocratic status. Oddly, the artist did not match the patterns of the sleeves, as would have been customary during this period., In fact, the duchess never actually sat for this portrait, which may account for the misunderstood representation of her clothing. Scholars believe that the artist copied Isabella's likeness from a lost portrait by Rogier van der Weyden. The tender, slightly mocking expression on the duchess's face and the elongated fingers reflect van der Weyden's concept of portraiture., The prominent inscription in the upper left corner of the panel, PERSICA SIBYLLA IA, suggests that the portrait was part of a series depicting sibyls. This identity strikingly contrasts with Duchess Isabella's costume. Scholars believe that someone other than the original artist added the inscription, as well as the brown background meant to simulate wood, some time after the portrait was painted.`

    },

];

// Constants for the questions
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
    redirectToIdentificationPage();
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

    if (userName === "" || userEmail === "") {
        alert("Please fill out both your name and email address.");
        return;
    }

    // Save globally
    window.userName = userName;
    window.userEmail = userEmail;

    // Generate a random user code if not already
    if (!window.userCode) {
        window.userCode = generateUserCode();
    }

    // Collect start time
    window.startTime = new Date().toISOString();

    identificationPageVisited = true; // Mark as visited
    identificationPage.style.display = "none";

    surveyPage.style.display = "block";
    loadPage(currentPage);
}





function loadPage(pageNumber) {
    // Get the page data from the `pages` array
    const pageData = pages[pageNumber - 1];
    console.log(`Page Number: ${pageNumber}`); // Log the current page number
    console.log(pageData); // For debugging purposes, you can remove this later

    // Update the page heading
    pageHeading.textContent = pageData.heading;

    // Update the painting description
    paintingDescription.innerHTML = pageData.description;

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

    // Update the navigation buttons
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
    // 1. Validate the current page
    const form = document.getElementById("evaluationForm");
    if (!form.reportValidity()) {
        return;
    }

    // 2. Save current page answers in 'userAnswers' variable created in the 'saveAnswers' function
    saveAnswers();
    console.log("All collected answers:", userAnswers);

    // 3. Capture the end time
    const endTime = new Date().toISOString();

    const allPages = Object.keys(userAnswers); // ["page1", "page2", "page3", ...]
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

        let url = "https://script.google.com/macros/s/AKfycbwWtJRYa3Bz7OpizA4LtBANOOwS9NQen1GS6vgORGW_oYsjjDS0qXXITtxWL25blHMrTQ/exec?";

        // ➔ Add user's info
        url += "UserName=" + encodeURIComponent(window.userName);
        url += "&UserEmail=" + encodeURIComponent(window.userEmail);
        url += "&UserCode=" + encodeURIComponent(window.userCode);

        // ➔ Then add page info
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
