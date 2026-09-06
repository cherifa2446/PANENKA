document.addEventListener("DOMContentLoaded", async () => {

  const params = new URLSearchParams(window.location.search);
  const albumId = params.get("id");

  if (!albumId) {
    window.location.href = "photos.html";
    return;
  }


  /* =============================
     CHARGER LES DONNÉES
  ============================== */

  let album;

  try {

    const response = await fetch("content/photos.json");

    if (!response.ok) {
      throw new Error("Impossible de charger content/photos.json");
    }

    const data = await response.json();

    const albums = data.albums || [];

    album = albums.find(
      item => item.id === albumId
    );

  } catch (error) {

    console.error(
      "Erreur lors du chargement de l'album :",
      error
    );

    window.location.href = "photos.html";
    return;
  }


  if (!album) {
    window.location.href = "photos.html";
    return;
  }


  const photos =
    Array.isArray(album.photos)
      ? album.photos
      : [];


  /* =============================
     INFORMATIONS DE L'ALBUM
  ============================== */

  document.title =
    `${album.title} | Panenka`;


  document.getElementById("albumTitle").textContent =
    album.title || "Album Panenka";


  document.getElementById("albumDate").textContent =
    album.date
      ? formatDate(album.date)
      : "—";


  document.getElementById("albumPhotoCount").textContent =
    `${photos.length} photo${photos.length > 1 ? "s" : ""}`;


  document.getElementById("albumDetails").innerHTML = `

    ${
      album.location
        ? `<span>${album.location}</span>`
        : ""
    }

    ${
      album.competition
        ? `<span>${album.competition}</span>`
        : ""
    }

  `;


  /* =============================
     FORMAT DATE
  ============================== */

  function formatDate(dateString) {

    const date = new Date(`${dateString}T00:00:00`);

    if (Number.isNaN(date.getTime())) {
      return dateString;
    }

    return date.toLocaleDateString("fr-CA", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });

  }


  /* =============================
     AFFICHER LES PHOTOS
  ============================== */

  const grid =
    document.getElementById("albumPhotoGrid");


  if (!photos.length) {

    grid.innerHTML = `
      <p style="color: rgba(255,255,255,0.55);">
        Aucune photo dans cet album pour le moment.
      </p>
    `;

    return;
  }


  photos.forEach((photo, index) => {

    const item =
      document.createElement("button");


    item.className =
      "album-photo-item";


    item.dataset.index =
      index;


    const image =
      photo.image || "";


    const alt =
      photo.alt ||
      `${album.title} - Photo ${index + 1}`;


    item.innerHTML = `

      <img
        src="${image}"
        alt="${alt}"
        loading="lazy"
      >

      <div class="album-photo-overlay">

        <div class="album-photo-view">

          <span>
            Voir la photo
          </span>

          <span>
            ↗
          </span>

        </div>

        <div class="album-photo-buy">
          Achat bientôt disponible
        </div>

      </div>

    `;


    grid.appendChild(item);

  });



  /* =============================
     LIGHTBOX
  ============================== */

  const lightbox =
    document.getElementById("photoLightbox");


  const lightboxImage =
    document.getElementById("lightboxImage");


  const lightboxCounter =
    document.getElementById("lightboxCounter");


  const closeButton =
    document.getElementById("lightboxClose");


  const prevButton =
    document.getElementById("lightboxPrev");


  const nextButton =
    document.getElementById("lightboxNext");


  let currentIndex = 0;



  function showPhoto(index) {

    currentIndex = index;


    const photo =
      photos[currentIndex];


    lightboxImage.src =
      photo.image || "";


    lightboxImage.alt =
      photo.alt ||
      `${album.title} - Photo ${currentIndex + 1}`;


    lightboxCounter.textContent =
      `${currentIndex + 1} / ${photos.length}`;

  }



  function openLightbox(index) {

    showPhoto(index);


    lightbox.classList.add("active");


    lightbox.setAttribute(
      "aria-hidden",
      "false"
    );


    document.body.style.overflow =
      "hidden";

  }



  function closeLightbox() {

    lightbox.classList.remove("active");


    lightbox.setAttribute(
      "aria-hidden",
      "true"
    );


    document.body.style.overflow =
      "";

  }



  grid.addEventListener("click", event => {

    const item =
      event.target.closest(".album-photo-item");


    if (!item) return;


    openLightbox(
      Number(item.dataset.index)
    );

  });



  nextButton.addEventListener("click", () => {

    const nextIndex =
      (currentIndex + 1) %
      photos.length;


    showPhoto(nextIndex);

  });



  prevButton.addEventListener("click", () => {

    const previousIndex =
      (
        currentIndex - 1 +
        photos.length
      ) %
      photos.length;


    showPhoto(previousIndex);

  });



  closeButton.addEventListener(
    "click",
    closeLightbox
  );



  lightbox.addEventListener("click", event => {

    if (event.target === lightbox) {
      closeLightbox();
    }

  });



  document.addEventListener("keydown", event => {

    if (
      !lightbox.classList.contains("active")
    ) {
      return;
    }


    if (event.key === "Escape") {
      closeLightbox();
    }


    if (event.key === "ArrowRight") {

      showPhoto(
        (currentIndex + 1) %
        photos.length
      );

    }


    if (event.key === "ArrowLeft") {

      showPhoto(
        (
          currentIndex - 1 +
          photos.length
        ) %
        photos.length
      );

    }

  });

});