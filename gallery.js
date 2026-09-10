document.addEventListener("DOMContentLoaded", async () => {

  const albumsGrid = document.getElementById("albumsGrid");

  if (!albumsGrid) return;


  const searchInput = document.getElementById("albumSearch");
  const filterButtons = document.querySelectorAll(".gallery-filter");
  const emptyState = document.getElementById("galleryEmpty");

  let activeFilter = "all";
  let albums = [];


  /* =========================
     CHARGEMENT DES ALBUMS
  ========================== */

  try {

    const response = await fetch("content/photos.json");

    if (!response.ok) {
      throw new Error("Impossible de charger content/photos.json");
    }

    const data = await response.json();

    albums = data.albums || [];

  } catch (error) {

    console.error("Erreur lors du chargement des albums :", error);

    albumsGrid.innerHTML = `
      <p style="color: rgba(255,255,255,0.6);">
        Impossible de charger les albums pour le moment.
      </p>
    `;

    return;
  }


  /* =========================
     AFFICHAGE DES ALBUMS
  ========================== */

  function renderAlbums(albumsToRender) {

    albumsGrid.innerHTML = "";


    if (!albumsToRender.length) {

      emptyState.hidden = false;
      return;

    }


    emptyState.hidden = true;


    albumsToRender.forEach((album, index) => {

      const article = document.createElement("article");

      article.className = "album-card";

      article.style.setProperty(
        "--delay",
        `${index * 70}ms`
      );


      const photoCount =
        Array.isArray(album.photos)
          ? album.photos.length
          : 0;


      article.innerHTML = `

        <a
          href="album.html?id=${encodeURIComponent(album.id)}"
          class="album-card-link"
          aria-label="Voir l'album ${album.title || "Panenka"}"
        >

          <div class="album-cover">

            <img
              src="${album.cover || ""}"
              alt="${album.title || "Album Panenka"}"
              loading="lazy"
            >

            <div class="album-cover-overlay"></div>

            <div class="album-count">
              ${photoCount} photo${photoCount > 1 ? "s" : ""}
            </div>

            <div class="album-open">
              <span>Voir l'album</span>
              <span class="album-arrow" aria-hidden="true"></span>
            </div>

          </div>


          <div class="album-info">

            <div class="album-meta">

              ${
                album.date
                  ? `<span>${formatDate(album.date)}</span>`
                  : ""
              }

              ${
                album.competition
                  ? `<span>${album.competition}</span>`
                  : ""
              }

            </div>


            <h3>
              ${album.title || "Album Panenka"}
            </h3>


            ${
              album.location
                ? `
                  <p class="album-location">
                    ${album.location}
                  </p>
                `
                : ""
            }

          </div>

        </a>

      `;


      albumsGrid.appendChild(article);

    });

  }


  /* =========================
     FORMAT DE DATE
  ========================== */

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


  /* =========================
     NORMALISATION TEXTE
  ========================== */

  function normalizeText(value) {

    return String(value || "")
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  }


  /* =========================
     RECHERCHE + FILTRES
  ========================== */

  function filterAlbums() {

    const search =
      normalizeText(searchInput.value);


    const filteredAlbums = albums.filter(album => {

      const keywords =
        Array.isArray(album.keywords)
          ? album.keywords.map(keyword =>
              normalizeText(keyword)
            )
          : [];


      const searchableText = [
        album.title || "",
        album.location || "",
        album.competition || "",
        album.gender || "",
        album.category || "",
        ...keywords
      ]
        .map(item => normalizeText(item))
        .join(" ");


      const matchesSearch =
        searchableText.includes(search);


      let matchesFilter = true;


      if (activeFilter !== "all") {

        const normalizedFilter =
          normalizeText(activeFilter);


        const albumType =
          normalizeText(album.type);


        const albumCompetition =
          normalizeText(album.competition);


        const albumGender =
          normalizeText(album.gender);


        const albumCategory =
          normalizeText(album.category);


        matchesFilter =
          albumType === normalizedFilter ||
          albumCompetition === normalizedFilter ||
          albumGender === normalizedFilter ||
          albumCategory === normalizedFilter ||
          keywords.includes(normalizedFilter);

      }


      return matchesSearch && matchesFilter;

    });


    renderAlbums(filteredAlbums);

  }


  /* =========================
     RECHERCHE
  ========================== */

  if (searchInput) {

    searchInput.addEventListener(
      "input",
      filterAlbums
    );

  }


  /* =========================
     FILTRES
  ========================== */

  filterButtons.forEach(button => {

    button.addEventListener("click", () => {

      filterButtons.forEach(item =>
        item.classList.remove("active")
      );


      button.classList.add("active");


      activeFilter =
        button.dataset.filter || "all";


      filterAlbums();

    });

  });


  /* =========================
     PREMIER AFFICHAGE
  ========================== */

  renderAlbums(albums);

});