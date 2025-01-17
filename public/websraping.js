document.getElementById("btn").addEventListener("click", async () => {
  const btn_cont = document.getElementById("btn_cont");
  const startEp = document.getElementById("startEp").value;
  const endEp = document.getElementById("endEp").value;
  btn_cont.innerHTML = "<li>Loading links...</li>"; // Feedback during loading

  try {
    if(endEp - startEp <= 10 & endEp - startEp >= 0 ){
      const response = await fetch(`/get-links?start=${startEp}&end=${endEp}`);
      const data = await response.json();
  
      btn_cont.innerHTML = "";
      
      data.links.forEach((link, index) => {
        let episodeNumber = Number(startEp) + index;
        const listItem = document.createElement("li");
        listItem.innerHTML = link
        ? `<a href="${link}" target="_blank">Ep. ${episodeNumber} <i class="fa-solid fa-download"></i></a>`
        : `Ep. ${episodeNumber} - No link found`;
        btn_cont.appendChild(listItem);
      });
    } else {
      btn_cont.innerHTML = '<div class="error"> Dont Request more than 10ep <i class="fa-solid fa-xmark"></i> </div>';
    }
  } catch (err) {
    console.error("Error:", err);
    btn_cont.innerHTML = "<li>Error fetching links</li>";
  }
});
