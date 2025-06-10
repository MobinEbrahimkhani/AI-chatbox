const form = document.getElementById("chatForm");
const submit_button = document.getElementById("submit");

const voice_button = document.getElementById("voiceBtn");
const user_input = document.getElementById("user_input");

// Check browser support
const SpeechRecognition = window.Speechecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US"; 

    voice_button.addEventListener("click", () => {
        recognition.start();
    });

    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        user_input.value = transcript;
    };

    recognition.onerror = function(event) {
        console.error("Speech recognition error:", event.error);
    };
} else {
    voice_button.disabled = true;
    alert("Speech recognition not supported in this browser.");
}

function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US"; 
    window.speechSynthesis.speak(utterance);
}


form.addEventListener("submit", async function(event) {
    event.preventDefault();

    const user_input = document.getElementById("user_input").value;
    if (!user_input.trim()) return;

    const chatbox = document.getElementById("chatbox");
    chatbox.innerHTML += `<div class="user"><b>You:</b> ${user_input}</div>`;

    const loadingElement = document.createElement("div");
    loadingElement.className = "loading";
    loadingElement.innerHTML = "<b>AI:</b> Typing...";
    chatbox.appendChild(loadingElement);
    chatbox.scrollTop = chatbox.scrollHeight;

    // Disable the submit and voice button and change color to gray
    submit_button.disabled = true;
    submit_button.style.backgroundColor = "#cccccc";
    submit_button.style.cursor = "not-allowed";

    voice_button.disabled = true;
    voice_button.style.backgroundColor = "#cccccc";
    voice_button.style.cursor = "not-allowed";

    try {
        document.getElementById("user_input").value = "";
        const response = await fetch("/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt: user_input })
        });
        const data = await response.json();
        let result = "";
        const arData = data.response.split(" ");
        let i = 0;

        const st = setInterval(showWithDelay, 100);

        function showWithDelay() {
            result += arData[i] + " ";
            loadingElement.className = "bot";
            loadingElement.innerHTML = `<b>AI:</b> ${result}`;
            i += 1;

            if (i >= arData.length) {
                clearInterval(st);
                // Re-enable the submit and voice button and restore its color
                submit_button.disabled = false;
                submit_button.style.backgroundColor = "#007acc";
                submit_button.style.cursor = "pointer";
                
                voice_button.disabled = false;
                voice_button.style.backgroundColor = "#007acc";
                voice_button.style.cursor = "pointer";
            }
        }

    } catch (error) {
        loadingElement.className = "bot";
        loadingElement.innerHTML = `<b>AI:</b> Error: Could not fetch response.`;
        // Re-enable the submit button and restore its color even on error
        submit_button.disabled = false;
        submit_button.style.backgroundColor = "#007acc";
        submit_button.style.cursor = "pointer";
    }

    chatbox.scrollTop = chatbox.scrollHeight;
});
