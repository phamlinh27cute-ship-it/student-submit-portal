document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("uploadForm");
    const nameInput = document.getElementById("name");
    const fileInput = document.getElementById("file");
    const messageBox = document.getElementById("message");
    const listBox = document.getElementById("list");

    // === Học sinh nộp bài ===
    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            const formData = new FormData();
            formData.append("name", nameInput.value);
            formData.append("file", fileInput.files[0]);

            let res = await fetch("/upload", {
                method: "POST",
                body: formData
            });

            let data = await res.json();

            if (messageBox) {
                messageBox.textContent = data.message;
            }
        });
    }

    // === Admin xem bài nộp ===
    if (listBox) {
        loadSubmissions();
    }

    async function loadSubmissions() {
        const res = await fetch("/submissions");
        const data = await res.json();

        listBox.innerHTML = "";

        data.forEach(item => {
            listBox.innerHTML += `
                <div class="entry">
                    <b>Học sinh:</b> ${item.name}<br>
                    <b>Thời gian:</b> ${item.time}<br>
                    <a href="/uploads/${item.filename}" target="_blank">
                        📄 Xem file
                    </a>
                </div>
            `;
        });
    }
});

