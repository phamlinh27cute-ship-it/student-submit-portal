document.addEventListener("DOMContentLoaded", () => {

    // ======= HỌC SINH NỘP BÀI =======
    const form = document.getElementById("uploadForm");
    const nameInput = document.getElementById("name");
    const fileInput = document.getElementById("file");
    const noteInput = document.getElementById("note");
    const statusBox = document.getElementById("status");

    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            if (!nameInput.value || !fileInput.files.length) {
                statusBox.textContent = "❌ Vui lòng nhập tên và chọn file!";
                return;
            }

            const fd = new FormData();
            fd.append("name", nameInput.value);
            fd.append("file", fileInput.files[0]);
            fd.append("note", noteInput.value || "");

            try {
                const res = await fetch("/upload", {
                    method: "POST",
                    body: fd
                });

                const data = await res.json();

                if (data.success) {
                    statusBox.style.color = "green";
                    statusBox.textContent = "✔ Upload thành công!";
                    form.reset(); // Reset form sau khi gửi
                } else {
                    statusBox.style.color = "red";
                    statusBox.textContent = "❌ Lỗi: " + data.message;
                }

            } catch (err) {
                statusBox.style.color = "red";
                statusBox.textContent = "❌ Lỗi kết nối server!";
                console.error(err);
            }
        });
    }

    // ======= ADMIN XEM BÀI NỘP =======
    const listBox = document.getElementById("list");

    if (listBox) {
        loadSubmissions();
    }

    async function loadSubmissions() {
        try {
            const res = await fetch("/submissions");
            const data = await res.json();

            listBox.innerHTML = "";

            if (data.length === 0) {
                listBox.innerHTML = "<p>Chưa có bài nộp nào.</p>";
                return;
            }

            data.forEach(item => {
                const div = document.createElement("div");
                div.classList.add("entry");

                div.innerHTML = `
                    <b>Học sinh:</b> ${item.name}<br>
                    <b>Ghi chú:</b> ${item.note || "Không có"}<br>
                    <b>Thời gian:</b> ${item.time}<br>
                    <a class="file-link" href="/uploads/${item.filename}" target="_blank">📄 Xem / Tải file</a>
                `;

                listBox.appendChild(div);
            });

        } catch (err) {
            listBox.innerHTML = "<p>❌ Lỗi tải danh sách bài nộp!</p>";
            console.error(err);
        }
    }

});
