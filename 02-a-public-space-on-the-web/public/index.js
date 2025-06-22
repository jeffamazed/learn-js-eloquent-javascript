const fileSelect = document.getElementById("file-select");
const fileContent = document.getElementById("file-content");
const form = document.getElementById("form");
const saveBtn = document.getElementById("save-btn");

let fileName;

function elt(type, props, ...children) {
  let dom = document.createElement(type);
  if (props) Object.assign(dom, props);
  for (let child of children) {
    if (typeof child !== "string") dom.appendChild(child);
    else dom.appendChild(document.createTextNode(child));
  }
  return dom;
}

async function populateFileSelect() {
  const res = await fetch("/");
  const text = await res.text();
  const fileList = text.split("\n").filter(Boolean);

  // first select option
  fileSelect.textContent = "";
  fileSelect.appendChild(
    elt("option", { value: "" }, "--- No file chosen ---"),
  );

  for (const file of fileList) {
    const option = elt("option", { value: file }, file);
    fileSelect.appendChild(option);
  }
}

// fetch content of a file
fileSelect.addEventListener("change", async (event) => {
  fileName = event.target.value;
  try {
    const res = await fetch(fileName);
    if (!res.ok) throw new Error(`Failed to fetch ${fileName}`);
    const text = await res.text();
    fileContent.value = text;
  } catch (err) {
    fileContent.value = `Error ${err.message}`;
  }
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!fileContent.value.trim() || !fileName) {
    saveBtn.textContent = "🚫 You can't save an empty file!";
    saveBtn.style.cursor = "not-allowed";
    setTimeout(() => {
      saveBtn.textContent = "Save";
      saveBtn.style.cursor = "pointer";
    }, 1000);
    return;
  }

  const res = await fetch(fileName, { method: "PUT", body: fileContent.value });

  if (res.ok) {
    saveBtn.textContent = "✅ Saved";
    setTimeout(() => {
      location.reload();
    }, 1500);
  }
});

populateFileSelect();