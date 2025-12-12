const send = document.getElementById('send');
const status = document.getElementById('status');
send.onclick = async () => {
  const name = document.getElementById('name').value.trim();
  const file = document.getElementById('file').files[0];
  const note = document.getElementById('note').value || '';
  if(!name){ alert('Vui lòng nhập tên'); return; }
  if(!file){ alert('Vui lòng chọn file'); return; }
  const fd = new FormData();
  fd.append('name', name);
  fd.append('note', note);
  fd.append('timestamp', new Date().toISOString());
  fd.append('file', file);
  status.innerText = 'Đang gửi...';
  try{
    const res = await fetch('/upload', { method: 'POST', body: fd });
    const j = await res.json();
    if(j.status === 'OK'){
      status.innerText = 'Gửi thành công! (' + j.filename + ')';
      document.getElementById('name').value = '';
      document.getElementById('file').value = '';
      document.getElementById('note').value = '';
    } else {
      status.innerText = 'Lỗi: ' + (j.error || 'Không rõ');
    }
  } catch(err){
    status.innerText = 'Lỗi mạng hoặc server: ' + err.message;
  }
};
