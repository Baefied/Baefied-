const q = document.getElementById("quality");
const qv = document.getElementById("qv");
q.oninput = () => qv.innerText = q.value;

function compress() {
  const file = document.getElementById("upload").files[0];
  if (!file) return alert("Please select an image");

  const quality = q.value / 100;
  const scale = parseFloat(document.getElementById("resolution").value);

  const img = new Image();
  img.src = URL.createObjectURL(file);

  img.onload = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = img.width * scale;
    canvas.height = img.height * scale;

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(blob => {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "baefied-compressed.jpg";
      link.textContent = "Download Compressed Image";

      const out = document.getElementById("output");
      out.innerHTML = "";
      out.appendChild(link);
    }, "image/jpeg", quality);
  };
}
