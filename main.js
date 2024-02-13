
const search = document.getElementById("search");



// it will only shown when user enters inputs

const searchOpt = document.getElementById("searchOption")
searchOpt.style.display='none';

// it is preventing default keydown event;

const searchMovie = document.getElementById("search");
searchMovie.addEventListener('keydown', (event)=>{
    if(event.key=='Enter'){
        event.preventDefault();
    }
})

let debounceTime;
searchMovie.addEventListener("input", async function(){

    // whenever new input enters previously shown elment get deleted and on the basis of new input it will search
    const list = document.querySelectorAll(".movieElement");
    if(list){
        list.forEach(l=>{
            l.remove();
        })
    }

    let searchInput = searchMovie.value.trim();
    console.log(searchInput);
   

    if(!searchInput){
        searchOpt.style.display='none';

        // while there is empty search input, then it will as it is like just it was previously.

        const list = document.querySelectorAll(".movieElement");
        if(list){
            list.forEach(l=>{
                l.remove();
            })
        }

        
    
    }else{

       

    searchInput =searchInput.toLowerCase();
    
    let item = await fetch(`https://www.omdbapi.com/?t=${searchInput}&apikey=67a6d4ef`)
    
    
    item =await item.json();   
    if(item.Response=="False"){
        return;
    }
       
    
            
            clearTimeout(debounceTime);

            debounceTime= setTimeout(() => {

                const id=item.imdbID;
                const image = item.Poster;
                const title = item.Title;

                const newElement = ` <li class='movieElement' > <img id=${id} class='show' src="${image}"/> <h2 id=${id} class='show'>${title}</h2> <button id=${id} class='add-to-fav'>Favorite</button></li>`
                const moviesSearch = ` <li class='movieElement searching' > <p class='show' id=${id} >${title}</p>  </li>`
                searchOpt.style.display='block'
                // This is for body element which can shows image as well;
                document.querySelector(".movies").innerHTML += newElement ;
                // This is for search bar;
                document.querySelector(".showSearch").innerHTML+= moviesSearch;

            },)


            

        
}

});






let favArray = [];


async function addToFavourite(element){
    let movie= await fetch(`https://www.omdbapi.com/?i=${element}&apikey=67a6d4ef`);
    movie =await movie.json();

    console.log(movie)
    const res = favArray.find(e =>e.imdbID==element);

    if(res){
       return alert ('already added to favorite')
    
    }
    // const movie = movies.find(m=>m._id==element)
    favArray.push(movie);

    
    showFavorite();

}

// showing Favorite Element

async function showFavorite(){

    // getting favorite Movies List;

const favListEle = document.querySelectorAll(".favEle");

if(favListEle){
    favListEle.forEach(ele=>{
        ele.remove();
    })
}

// adding favorite Movies to HTML element;

favArray.forEach(ele => {

    const newFavoriteElement = `<div class= 'favEle' > <img class='show' id='${ele.imdbID}' src=${ele.Poster}/> <span class='show' id='${ele.imdbID}'> ${ele.Title} </span>  <button class='delete' id=${ele.imdbID} >Delete</button></div>` ;
    const newele= document.querySelector(".offcanvas-body").innerHTML+= newFavoriteElement;
    

})

}


// to delete from favorite
async function deleteFavoriteMovie(id){
    
    // getting index to delete

    const index = favArray.findIndex(m=>m._id==id);

    // deleting from array
    favArray.splice(index,1);

    showFavorite()
    
    
}

// getting HTML ELement which can shows movie information
const ElementToShowMovie = document.getElementById("showingInfo")
ElementToShowMovie.style.display='none';
async function showMovieInfo(id){
    //getting movies details;
    const movies = await fetch(`https://www.omdbapi.com/?i=${id}&apikey=67a6d4ef`);
    const movie = await movies.json();

    // finding movie from movies Data
    // const movie = await movies.find(m=>m.imdbID==id);

// hidden element comes to front to show detailed infromation about movie
    ElementToShowMovie.style.display='block';



    // detailed information of a movie

    const searchedMovie= `<div class='searchedMovie' >
    <h3>${movie.Title} </h3>
    <i class="fa-solid fa-star add-to-fav" id=${movie.imdbID}></i>
    <i class="fa-solid fa-xmark" ></i>
    <img height='100px'width='250px' src='${movie.Poster}'>
    <div>
    <a>Released: ${movie.Released} &nbsp; &nbsp; ${movie.Genre}</a>
    
    <a>Actors:${movie.Actors}</a>
    </div>
    
    <p>${movie.Plot}</P>

    
    </div>`


    // attached created searchedMovie element to html element which can show the details
    ElementToShowMovie.innerHTML=searchedMovie;


}



async function clickListener(e){
    // for preventing default actions
    e.preventDefault();

    const target = e.target 
    



    // for adding to favorite;
    if(target.classList.contains('add-to-fav')){

        const res= confirm ('Are you sure! You want to add to favorite')
        if(!res){
            return;
        }
        addToFavourite(target.id);
    }else



// showing movie infomation in detail
    if(target.classList.contains('show')){
        console.log("show")
        showMovieInfo(target.id);
        
        searchOpt.style.display='none';

        search.value='';
        const list = document.querySelectorAll(".movieElement");
        if(list){
            list.forEach(l=>{
                l.remove();
            })

        }

    } else 




    
    if(target.classList.contains('delete')){

        const res = confirm('Are you sure! You want to remove movie from favorite')
        if(!res){
            return;
        }
        
        deleteFavoriteMovie(target.id);
    }else

    // for hiding shown movie information

    if(target.classList.contains('fa-xmark')){

        ElementToShowMovie.style.display='none';

    }


}


// event listener on whole document;

document.addEventListener("click", clickListener);








