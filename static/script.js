const form = document.getElementById("chatForm");
const submitButton = document.getElementById("submit");

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

    // Disable the submit button and change color to gray
    submitButton.disabled = true;
    submitButton.style.backgroundColor = "#cccccc";
    submitButton.style.cursor = "not-allowed";

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
                // Re-enable the submit button and restore its color
                submitButton.disabled = false;
                submitButton.style.backgroundColor = "#007acc";
                submitButton.style.cursor = "pointer";
            }
        }

    } catch (error) {
        loadingElement.className = "bot";
        loadingElement.innerHTML = `<b>AI:</b> Error: Could not fetch response.`;
        // Re-enable the submit button and restore its color even on error
        submitButton.disabled = false;
        submitButton.style.backgroundColor = "#007acc";
        submitButton.style.cursor = "pointer";
    }

    chatbox.scrollTop = chatbox.scrollHeight;
});