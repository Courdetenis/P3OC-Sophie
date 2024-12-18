const loginApi = "http://localhost:5678/api/users/login";

async function launchSubmit() {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const user = {
        email: email,
        password: password,
    };

    try {
        const response = await fetch(loginApi, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
        });

        if (response.ok) {
            const result = await response.json();
            sessionStorage.setItem("token", result.token); 
            window.location.href = "index.html"
        } else {
            if (!document.querySelector(".error-login")) {
                const errorBox = document.createElement("div")
                errorBox.className = "error-login"
                errorBox.innerHTML = '<p>E-Mail ou Mot de Passe incorrect.</p>'
                document.querySelector("form").prepend(errorBox)
            }

        }
    } catch (error) {
        alert("Erreur lors de la connexion");
    }
}

document.querySelector("#loginform").addEventListener("submit", launchSubmit);
