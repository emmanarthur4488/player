//let's select all required tags or elements

const wrapper = document.querySelector(".wrapper"),
musicImg = wrapper.querySelector(".img-area img"),
musicName = wrapper.querySelector(".song-details .name"),
musicArtist = wrapper.querySelector(".song-details .artist"),
mainAudio = wrapper.querySelector("#main-audio"),
playPauseBtn = wrapper.querySelector(".play-pause"),
prevBtn = wrapper.querySelector("#prev"),
nextBtn = wrapper.querySelector("#next"),
progressArea = wrapper.querySelector(".progress-area"),
progressBar = wrapper.querySelector(".progress-bar"),
musicList = wrapper.querySelector(".music-list"),
showMoreBtn = wrapper.querySelector("#more-music"),
hideMusicBtn = musicList.querySelector("#close");


let musicIndex = Math.floor((Math.random() * allMusic.length) + 1);

window.addEventListener("load", ()=>{
    loadMusic(musicIndex); //calling load music function once wimdow loaded
    playingNow();
})

//load music function

function loadMusic(indexNumb){
    musicName.innerText = allMusic[indexNumb - 1].name;
    musicArtist.innerText = allMusic[indexNumb - 1].artist;
    musicImg.src = `images/${allMusic[indexNumb - 1].img}.jpg`;
    mainAudio.src = `songs/${allMusic[indexNumb - 1].scr}.mp3`;
}

//play music function
function playMusic(){
    wrapper.classList.add("paused");
    playPauseBtn.querySelector("i").innerText = "pause"
    mainAudio.play();
}

//next music function
function nextMusic(){
    //here we'll just increment of index by 1
    musicIndex++;
    //if musicIndex is greater than array length then musicIndex will be 1 so the first song will play
    musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}

//prev music function
function prevMusic(){
    //here we'll just decrement of index by 1
    musicIndex--;
    //if musicIndex is less than array length then musicIndex will be 1 so the first song will play
    musicIndex < 1 ? musicIndex = allMusic.length : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}

//pause music function
function pauseMusic(){
    wrapper.classList.remove("paused");
    playPauseBtn.querySelector("i").innerText = "play_arrow"
    mainAudio.pause();
}

//play or music button event
playPauseBtn.addEventListener("click", ()=>{
    const isMusicPaused = wrapper.classList.contains("paused");
    //if isMusicPaused is true call pauseMusic else call playMusic
    isMusicPaused ? pauseMusic() : playMusic();
    playingNow();
});

//next music btn event
nextBtn.addEventListener("click", ()=>{
    nextMusic(); //calling next music function
});

//prev music btn event
prevBtn.addEventListener("click", ()=>{
    prevMusic(); //calling next music function
});
//update progress baar width according to the music current time
mainAudio.addEventListener("timeupdate", (e)=>{
    const currentTime = e.target.currentTime;//getting current time of song
    const duration = e.target.duration;//getting total duration of song
    let progresswidth = (currentTime / duration) * 100
    progressBar.style.width = `${progresswidth}%`;

    let musicCurrentTime = wrapper.querySelector(".current"),
    musicDuration = wrapper.querySelector(".duration");
    

        
        mainAudio.addEventListener("loadeddata", ()=>{

        //update song total duration
        let audioDuration = mainAudio.duration;
        let totalMin = Math.floor(audioDuration / 60);
        let totalSec = Math.floor(audioDuration % 60);
        if(totalSec < 10){//adding 0 if sec is less than 10
            totalSec = `0${totalSec}`;
        }
        musicDuration.innerText = `${totalMin}:${totalSec}`;
        
    });
     //update playing song current time
     let currentMin = Math.floor(currentTime / 60);
     let currentSec = Math.floor(currentTime % 60);
     if(currentSec < 10){//adding 0 if sec is less than 10
         currentSec = `0${currentSec}`;
     }
     musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});

//let's update playing song current time according to the progress bar
progressArea.addEventListener("click", (e)=>{
    let progressWidthval = progressArea.clientWidth;//getting width of progess bar
    let clickedOffSetX = e.offsetX;//getting offset x value
    let songDuration = mainAudio.duration;//getting song total duration

    mainAudio.currentTime = (clickedOffSetX / progressWidthval) * songDuration;
    playMusic();
});
//let's work on repeat, shuffle song according to thne icon
const repeatBtn = wrapper.querySelector("#repeat-plist");
repeatBtn.addEventListener("click", ()=>{
    //first we get the innerText of the icon then we'll change accordingly
    let getText = repeatBtn.innerText; //getting innerText of icon
    //let's do different changes on different icon click using switch
    switch(getText){
        case "repeat": //if this icon is repeat then change it to repeat_one
            repeatBtn.innerText = "repeat_one";
            repeatBtn.setAttribute("title", "song looped");
            break;
        case "repeat_one"://if icon icon ic repeat_one then change it shuffle
            repeatBtn.innerText = "shuffle";
            repeatBtn.setAttribute("title", "playback shuffle");
            break;
        case "shuffle": //if icon icon is repeat_one then change it to shuffle
            repeatBtn.innerText = "repeat"; 
            repeatBtn.setAttribute("title", "playlist looped");
            break;   
    }
});

//above we just change the icon, now let's work on what to do
//after the song ended

mainAudio.addEventListener("ended", ()=>{
    let getText = repeatBtn.innerText
    switch(getText){
        case "repeat": //if this icon is repeat then change it to repeat_one
           nextMusic();
            break;
        case "repeat_one"://if icon icon ic repeat_one then change it shuffle
            mainAudio.currentTime = 0;
            loadMusic(indexNumb);
            playMusic();
            break;
        case "shuffle": //if icon icon is repeat_one then change it to shuffle
            let randIndex = Math.floor((Math.random() * allMusic.length) + 1);
            do{
                randIndex = Math.floor((Math.random() * allMusic.length) + 1);
            }while(musicIndex == randIndex);
            musicIndex = randIndex;
            loadMusic(musicIndex);
            playMusic();
            playingNow();
            break;   
    }
});

showMoreBtn.addEventListener("click", ()=>{
    musicList.classList.toggle("show");
});

hideMusicBtn.addEventListener("click", ()=>{
    showMoreBtn.click();
});

const ulTag = wrapper.querySelector("ul");
for (let i = 0; i < allMusic.length; i++){
    let liTag = `<li li-index="${i + 1}">
                    <div class="row">
                        <span>${allMusic[i].name}</span>
                        <p>${allMusic[i].artist}</p>
                    </div>
                    <audio class="${allMusic[i].scr}" src"songs/${allMusic[i].scr}.mp3"></audio>
                    <span id="${allMusic[i].scr}" class="audio-duration">3:40</span>
                </li>`;
    ulTag.insertAdjacentHTML("beforeend", liTag);

    let liAudioTagDuration = ulTag.querySelector(`#${allMusic[i].scr}`);
    let liAudioTag = ulTag.querySelector(`.${allMusic[i].scr}`);

    liAudioTag.addEventListener("loadeddata", ()=>{
        let audioDuration = liAudioTag.duration;
        let totalMin = math.floor(audioDuration / 60);
        let totalSec = math.floor(audioDuration % 60);
        if(totalSec < 10){//adding 0 if sec is less than 10
            totalSec = `0${totalSec}`;
        }
        liAudioDuration.innerText = `${totalMin}:${totalSec}`;
        liAudioDuration.setAttribute("t-duration", `${totalMin}:${totalSec}`);
    })
}

const allLiTags = ulTag.querySelectorAll("li");
console.log(allLiTags);
function playingNow(){
    for (let j = 0; j < allLiTags.length; j++) {
        let audioTag = allLiTags[j].querySelector(".audio-duration")

        if(allLiTags[j].classList.contains("playing")){
            allLiTags[j].classList.remove("playing");
            let adDuration = audioTag.getAttribute("t-duration");
            audioTag.innerText = adDuration;
        }

        if(allLiTags[j].getAttribute("li-index") == musicIndex){
            allLiTags[j].classList.add("playing");
            audioTag.innerText = "playing";
        }
    
        allLiTags[j].setAttribute("onclick", "clicked(this)");
    }
}

//let's play song on li click
function clicked(element){
    let getLiIndex = element.getAttribute("li-index");
    musicIndex = getLiIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}