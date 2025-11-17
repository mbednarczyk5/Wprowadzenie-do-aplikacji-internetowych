const KEY = "34387a03";
const DivMovies=document.getElementById("movies")
let moviesOnSite = new Set(); 
let deleteMode=false;
let moviesToDelete=new Set();
let randomMode=false;
document.getElementById("typeSelect").addEventListener("change", FilterForTypes);
document.getElementById("GenreSelect").addEventListener("change",FilterForGenre);
window.onload = function() {
    loadMoviesFromStorage();

};

const addFilm = document.getElementById("addFilmForm");
addFilm.addEventListener("submit",AddMovie);

const searchFilmDiv = document.getElementById("searchFilmBox");
searchFilmDiv.addEventListener("input", function(){
    const ActualString = searchFilmDiv.value.toLowerCase();
    DivMovies.innerHTML="";
    if (ActualString === ""){
        moviesOnSite.forEach(movie =>{
        const img = document.createElement('img');
        img.src=movie.img;
        setupImageClickHandler(img,movie.id)
        DivMovies.appendChild(img)
        return 
        })
        
    }
    else{
        moviesOnSite.forEach(movie => {
        if (movie.title.toLowerCase().startsWith(ActualString)){
            const img = document.createElement('img')
            img.src = movie.img;
            setupImageClickHandler(img, movie.id)
            DivMovies.appendChild(img);
        }

    })
    }
})
async function AddMovie(event){
    event.preventDefault();
    const title = document.getElementById("addFilmBox");
    const titleToAdd=encodeURIComponent(title.value);
    
        title.value="";
        const URL=`https://www.omdbapi.com/?t=${titleToAdd}&apikey=${KEY}`;
        try {
            const response= await fetch(URL);
            if (!response.ok){
                throw new Error("błąd")
            }
            const data = await response.json();
            
            if (data.Response === "False") {
                console.warn(`Film o tytule "${titleToAdd}" nie znaleziono w OMDb. Błąd: ${data.Error}`);
                title.value = ""; 
                return;
            }
            if (!Array.from(moviesOnSite).some(movie => movie.id === data.imdbID)){
                const img = document.createElement('img')
                img.src=data.Poster;
                setupImageClickHandler(img, data.imdbID);
                DivMovies.appendChild(img)
                moviesOnSite.add({id: data.imdbID, type: data.Type, img: data.Poster, genre: data.Genre, title: data.Title})
                saveMoviesToStorage();
            }
            else{
                console.log(`Site has already got a film ${titleToAdd}`);
            }
        }
        catch (error) {
            console.error("Wystąpił błąd podczas pobierania danych z OMDb:", error);
            title.value="";
            return null;
        }
    title.value="";
}

function ToggleDeleteMode(){
    if (!deleteMode){
        deleteMode=true;
        usun.style.background="red";
        const allImages = DivMovies.querySelectorAll('img');
        allImages.forEach(img => {
            img.classList.add('delete-mode');
            img.style.border = '2px solid transparent';
        });


    }
    else{
        removeSelectedMovies();
        location.reload();
        deleteMode=false;
        usun.textContent = "Usuń"
        usun.style.background="";
        const allImages = DivMovies.querySelectorAll('img');
        allImages.forEach(img => {
            img.classList.remove('delete-mode', 'selected-to-delete');
            img.style.border = '';
        });
        
        moviesToDelete.clear();
    }
}
function setupImageClickHandler(img, movieId) {
    img.addEventListener('click', function() {
        if (deleteMode) {
            if (moviesToDelete.has(movieId)) {
                moviesToDelete.delete(movieId);
                img.classList.remove('selected-to-delete');
                img.style.border = '2px solid transparent';
            } else {
                moviesToDelete.add(movieId);
                img.classList.add('selected-to-delete');
                img.style.border = '2px solid red';
            }
            console.log(`Zaznaczono do usunięcia: ${moviesToDelete.size} filmów`);
        } 
        
    });
}
function removeSelectedMovies() {
    if (!confirm(`Usunąć ${moviesToDelete.size} filmów?`)) return;

    moviesToDelete.forEach(id => {
        const img = Array.from(DivMovies.querySelectorAll("img")).find(i => i.src.includes(id));
        if (img) img.remove();
    });

    moviesOnSite = new Set(Array.from(moviesOnSite).filter(m => !moviesToDelete.has(m.id)));
    saveMoviesToStorage();
    moviesToDelete.clear();
}

function FilterForTypes(){ 
    select=document.getElementById("typeSelect")
    selected=select.value;
    DivMovies.innerHTML="";
    if (selected=="all"){
        Array.from(moviesOnSite).forEach(movie => {
                  const img=document.createElement('img');
                  img.src=movie.img;
                  setupImageClickHandler(img, movie.id);
                  DivMovies.appendChild(img)
        })
    }
    else {
        Array.from(moviesOnSite).forEach(movie => {
              if (movie.type==selected){
                  const img=document.createElement('img');
                  img.src=movie.img;
                  setupImageClickHandler(img, movie.id);
                  DivMovies.appendChild(img)
              }
        })
    }
}
function FilterForGenre(){
    const GENRE = document.getElementById("GenreSelect");
    const GENRE_VAL= GENRE.value;
     DivMovies.innerHTML="";
    if (GENRE_VAL=="all"){
        Array.from(moviesOnSite).forEach(movie => {
            const img=document.createElement('img')
            img.src=movie.img;
            setupImageClickHandler(img, movie.id);
            DivMovies.appendChild(img);
        })
    }
    else{
        Array.from(moviesOnSite).forEach(movie => {
            const GENRES=movie.genre.split(",").map(a => a.trim())
            if (GENRES.some(g => g===GENRE_VAL)){
                const img=document.createElement('img')
                img.src=movie.img;
                setupImageClickHandler(img, movie.id);
                DivMovies.appendChild(img);
            }
        })

    }
}
function Random(){
    if (!randomMode){
        randomMode=true
        const length=moviesOnSite.size;
        random=Math.floor(Math.random()*length)
        const randomFilm=document.getElementById('randomFilm')
        const img = document.createElement('img')
        img.src=Array.from(moviesOnSite)[random].img;
        randomFilm.appendChild(img)
        randomFilm.onclick = () => {
            randomFilm.innerHTML="";
            randomMode=false;
        }
    }
    
}


function saveMoviesToStorage() {
    const moviesArray = Array.from(moviesOnSite);
    localStorage.setItem('savedMovies', JSON.stringify(moviesArray));
}

function loadMoviesFromStorage() {
    const savedMovies = localStorage.getItem('savedMovies');
    if (savedMovies) {
        const moviesArray = JSON.parse(savedMovies);
        moviesOnSite = new Set(moviesArray);
        
    }
    Array.from(moviesOnSite).forEach(movie => {
            const img = document.createElement('img');
            img.src = movie.img;  
            DivMovies.appendChild(img)
            setupImageClickHandler(img, movie.id);
     });
}
