import supabase from "./config.js";

const myFile = document.getElementById("myfile");
const uploadBtn = document.getElementById("uploadF");
const cards = document.getElementById("cards");
const edtFile = document.getElementById("edtFile");

let editingId = null;
let oldFileName = null;

// ------------------- UPLOAD IMAGE -------------------
uploadBtn.addEventListener("click", async () => {
  const file = myFile.files[0];
  if (!file) return alert("Please select a file!");

  const fileName = `${Date.now()}_${file.name}`;

  // Upload to storage
  const { data, error } = await supabase.storage.from("profiles").upload(fileName, file);
  if (error) return alert(error.message);

  // public url lega 
  const { data: urlData } = supabase.storage.from("profiles").getPublicUrl(fileName);
  if (!urlData?.publicUrl) return alert("Failed to get public URL.");

  // Insert krega database mein
  const { error: dbError } = await supabase.from("userPics").insert({
    image: urlData.publicUrl,
    file_name: fileName
  });
  if (dbError) return alert(dbError.message);

  myFile.value = "";
  showImages();
});

// ------------------- SHOW IMAGES -------------------
async function showImages() {
  cards.innerHTML = "";

  const { data, error } = await supabase.from("userPics").select("*").order("id", { ascending: false });
  if (error) return cards.innerHTML = `<p>Error: ${error.message}</p>`;

  if (!data || data.length === 0) return cards.innerHTML = "<p>No images uploaded yet.</p>";

  data.forEach(pic => {
    cards.innerHTML += `
      <div class="col-md-3 mb-3">
        <div class="card">
          <img src="${pic.image}" class="card-img-top" />
          <div class="card-body text-center">
            <button class="btn btn-sm btn-primary" onclick="startEdit(${pic.id}, '${pic.file_name}')">Edit</button>
            <button class="btn btn-sm btn-danger" onclick="deleteImg(${pic.id}, '${pic.file_name}')">Delete</button>
          </div>
        </div>
      </div>
    `;
  });
}

showImages();

// ------------------- START EDIT -------------------
window.startEdit = (id, fileName) => {
  editingId = id;
  oldFileName = fileName;
  edtFile.click();
};

// ------------------- EDIT IMAGE -------------------
edtFile.addEventListener("change", async (e) => {
  const newFile = e.target.files[0];
  if (!newFile) return;

  const newFileName = `${Date.now()}_${newFile.name}`;

  // Remove old file
  await supabase.storage.from("profiles").remove([oldFileName]);

  // Upload new file
  const { data, error } = await supabase.storage.from("profiles").upload(newFileName, newFile);
  if (error) return alert(error.message);

  // Get new public URL
  const { data: newURL } = supabase.storage.from("profiles").getPublicUrl(newFileName);

  // Update DB
  await supabase.from("userPics").update({ image: newURL.publicUrl, file_name: newFileName }).eq("id", editingId);

  showImages();
});

// --------- DELETE IMAGE -------------------
window.deleteImg = async (id, fileName) => {
  await supabase.storage.from("profiles").remove([fileName]);
  await supabase.from("userPics").delete().eq("id", id);
  showImages();
};
