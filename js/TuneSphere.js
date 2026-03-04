

let currentsong = new Audio();

let songs;

let currFolder;

function formatTime(totalSeconds) {
    if (isNaN(totalSeconds) || totalSeconds < 0) {
        return "00:00";
    }
    // Calculate minutes and seconds
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);

    // Pad with leading zeros if needed
    const formattedMinutes = String(minutes).padStart(2, '00');
    const formattedSeconds = String(seconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}




async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`http://127.0.0.1:5500/${folder}/`)
    let response = await a.text();
    //console.log(response)
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    // console.log(as);

    songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }

    


    //Play the firt song 



    //show all the songs in the playlist...............
    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]

    songUL.innerHTML = ""

    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li> <img class="invert" src="img/music.svg" alt>
                              <div class="info">
                              <div>
                              ${song.replaceAll("%20", " ")}
                              </div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert" src="img/play.svg" alt="">
                            </div></li>`;
    }


    // attach an event listener to each song.......

    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            // console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })

    return songs
}


const playMusic = (track, pause = false) => {
    // let audio = new Audio("/songs/" + track)
    currentsong.src = `/${currFolder}/` + track
    if (!pause) {
        currentsong.play();
        play.src = "img/pause.svg";
    }

    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}


async function displayAlbums() {

    let a = await fetch(`http://127.0.0.1:5500/songs/`)
    let response = await a.text();
    //console.log(response)

    let div = document.createElement("div")
    div.innerHTML = response;

    let anchors = div.getElementsByTagName("a")

    let cardContainer = document.querySelector(".cardContainer")

    let array = Array.from(anchors)
    //.forEach(async e => {
        for (let index = 0; index < array.length; index++) {
            const e = array[index];
            
       
        if (e.href.includes("/songs")) {
           let folder = e.href.split("/").slice(-1)[0];


            console.log(folder);
            
    //         //Get the meta data of the folder...............
    //        let a = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`)

    //         let response = await a.json();
    //        console.log(response);

    //         cardContainer.innerHTML = cardContainer.innerHTML + `
    // <div data-folder="${folder}" class="card">

    //     <div class="play">
    //         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width="60" height="60">
    //             <circle cx="320" cy="320" r="300" fill="red" />
    //             <path d="M187.2 100.9C174.8 94.1 159.8 94.4 147.6 101.6C135.4 108.8 128 121.9 128 136L128 504C128 518.1 135.5 531.2 147.6 538.4C159.7 545.6 174.8 545.9 187.2 539.1L523.2 355.1C536 348.1 544 334.6 544 320C544 305.4 536 291.9 523.2 284.9L187.2 100.9z"
    //                   fill="black" transform="translate(100,100) scale(0.7)" />
    //         </svg>
    //     </div>

    //     <img src="/songs/${folder}/cover.png" alt="">
    //     <h3>${response.title}</h3>
    //     <h5>${response.description}</h5>
    // </div>`



    try {
    let res = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`);

    if (!res.ok) {
        console.error("File not found:", res.status, res.statusText);
        continue; // skip this folder if info.json is missing
    }

    let response = await res.json();
    console.log(response);

    cardContainer.innerHTML += `
        <div data-folder="${folder}" class="card">
            <div class="play">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width="60" height="60">
                    <circle cx="320" cy="320" r="300" fill="red" />
                    <!-- Fixed valid path for play button -->
                    <path d="M187.2 100.9C174.8 94.1 159.8 94.4 147.6 101.6C135.4 108.8 128 121.9 128 136V504C128 518.1 135.5 531.2 147.6 538.4C159.7 545.6 174.8 545.9 187.2 539.1L523.2 355.1C536 348.1 544 334.6 544 320C544 305.4 536 291.9 523.2 284.9L187.2 100.9z"
                          fill="black" transform="translate(100,100) scale(0.7)" />
                </svg>
            </div>
            <img src="/songs/${folder}/cover.jpg" alt="">
            <h3>${response.title}</h3>
            <h5>${response.description}</h5>
        </div>`;
} catch (err) {
    console.error("Error reading info.json:", err);
}


        }
         
    }

    //  console.log(anchors);

    
   // Load the playlist whenever some one clicked..............

    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            console.log(item, item.currentTarget.dataset);

            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
            playMusic(songs[0])
  

        })
    }) 


}

async function main() {


    // Get the list of all the songs..............
    await getSongs("songs/ncs");
    // console.log(songs);
    playMusic(songs[0], true)

    // Display all the albums on the page ...............

    displayAlbums()



    //Attach an event listener to play , next and previous.............
    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play()
            play.src = "img/pause.svg"
        }
        else {
            currentsong.pause()
            play.src = "img/play.svg"
        }
    })

    //Listen for timeUpdate event....

    currentsong.addEventListener("timeupdate", () => {
        console.log(currentsong.currentTime, currentsong.duration)
        document.querySelector(".songtime").innerHTML = `${formatTime(currentsong.currentTime)}:/${formatTime(currentsong.duration)}`
        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%"
    })


    // Add an event listener on seekbar..............

    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentsong.currentTime = ((currentsong.duration) * percent) / 100


    })

    //ADD an event listener for hamburger..................

    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })

    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%";
    })



    // ADD an event listener on previous and next button.............

    previous.addEventListener("click", () => {
        //console.log("previous clicked")

        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        console.log(songs, index);
        if (index - 1 >= 0) {

            playMusic(songs[index - 1])

        }

        console.log(currentsong)
    })

    // for next....

    next.addEventListener("click", () => {
        //console.log("previous clicked")
        //console.log(currentsong.src.split("/").slice(-1)) [0];

        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        console.log(songs, index);
        if (index + 1 < songs.length) {

            playMusic(songs[index + 1])

        }

    })

    //Add an event to volume.............

    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log(e, e.target.value);
        currentsong.volume = parseInt(e.target.value) / 100;

    })

    


   // Load the playlist whenever some one clicked..............

    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            console.log(item, item.currentTarget.dataset);

            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);

        })
    }) 


    //ADD event listener to mute the track .................

    document.querySelector(".volume>img").addEventListener("click" , e=>{
         console.log(e.target);
         if(e.target.src.includes("volume.svg")){
            e.target.src = e.target.src.replace( "volume.svg" , "mute.svg")
            currentsong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
         }

         else{
            e.target.src = e.target.src.replace("mute.svg" , "volume.svg")
            currentsong.volume = 0.1;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
         }
         
    })

}
main()

