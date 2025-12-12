document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("uploadForm");
  const statusBox = document.getElementById("status");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const fd = new FormData(form);

    statusBox.innerText = "Đang gửi...";

    try {
      const res = await fetch("/upload", {
        method: "POST",
        body: fd
      });

      const data = await res.json();   // ← KHÔNG bị lỗi JSON nữa

      if (data.status === "OK") {
        statusBox.innerText = "✔ Gửi thành công!";
      } else {
        statusBox.innerText = "❌ Lỗi: " + data.message;
      }

    } catch (err) {
      statusBox.innerText = "❌ Lỗi kết nối server!";
    }
  });
});
