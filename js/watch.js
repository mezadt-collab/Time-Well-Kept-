/*
==========================================================
TIME WELL KEPT
watch.js
Version 6
Sprint 3
Part 1
==========================================================
*/

"use strict";

/*=========================================================
Application State
=========================================================*/

let currentWatch = null;

let timeline = [];

let currentIndex = -1;

/*=========================================================
Application Start
=========================================================*/

document.addEventListener(

    "DOMContentLoaded",

    initialiseWatchPage

);

/*=========================================================
Initialise
=========================================================*/

async function initialiseWatchPage(){

    showLoading();

    try{

        const params = new URLSearchParams(window.location.search);

        const id = params.get("id");

        if(!id){

            showError("No chapter specified.");

            return;

        }

        currentWatch = await TimeWellKept.getWatchById(id);

        if(!currentWatch){

            showError("Watch not found.");

            return;

        }

        timeline = await TimeWellKept.getTimeline();

        currentIndex = timeline.findIndex(

            watch => watch.catalogNumber === currentWatch.catalogNumber

        );

        renderWatch();



initialiseGallery();

initialiseGalleryImages();

initialiseRevealAnimation();

    }

    catch(error){

        console.error(error);

        showError("Unable to load chapter.");

    }

}

/*=========================================================
Helpers
=========================================================*/

function previousChapter(){

    if(currentIndex <= 0){

        return null;

    }

    return timeline[currentIndex-1];

}

function nextChapter(){

    if(currentIndex >= timeline.length-1){

        return null;

    }

    return timeline[currentIndex+1];

}

function heroImage(){

    return `../images/watches/${currentWatch.images.folder}/${currentWatch.images.hero}`;

}

function galleryImage(file){

    return `../images/watches/${currentWatch.images.folder}/${file}`;

}

function value(data){

    if(

        data === undefined ||

        data === null ||

        data === ""

    ){

        return "";

    }

    return data;

}

/*=========================================================
Loading
=========================================================*/

function showLoading(){

    document.getElementById("watch-page").innerHTML = `

        <section class="watch-loading">

            <div class="watch-container">

                <h2>Loading Chapter...</h2>

            </div>

        </section>

    `;

}

/*=========================================================
Error
=========================================================*/

function showError(message){

    document.getElementById("watch-page").innerHTML = `

        <section class="watch-error">

            <div class="watch-container">

                <h2>${message}</h2>

            </div>

        </section>

    `;

}

/*=========================================================
Render Engine

Part 2 Starts Here
=========================================================*/
/*=========================================================
Render Engine
Part 2
=========================================================*/

function renderWatch(){

    const page = document.getElementById("watch-page");

    page.innerHTML = `

        ${renderHero()}

        ${renderGallery()}

        ${renderStory()}

        ${renderMuseumPlaque()}

        ${renderCollectorReflection()}

        ${renderNavigation()}

    `;

}

/*=========================================================
Hero
=========================================================*/

function renderHero(){

    return `

<section class="watch-hero">



<div class="watch-container">
 

    <div class="watch-container">

        <span class="catalog-number">

            ${value(currentWatch.catalogNumber)}

        </span>

        <h1>

            ${value(currentWatch.identity.displayName)}

        </h1>

        <div class="watch-year">

            ${value(currentWatch.acquisition.year)}

        </div>

        <h2>

            ${value(currentWatch.chapter.title)}

        </h2>

       <img

    id="hero-image"

    class="watch-hero-image"

    src="${heroImage()}"

    alt="${value(currentWatch.identity.displayName)}"

>

        

        <blockquote class="museum-caption">

            "${value(currentWatch.museumPlaque.caption)}"

        </blockquote>

    </div>

</section>

    `;

}
/*==================================================
  IMAGE HELPERS
==================================================*/

function imageExists(src) {
    return new Promise(resolve => {

        const img = new Image();

        img.onload = () => resolve(true);

        img.onerror = () => resolve(false);

        img.src = src;

    });
}

/*=========================================================
Gallery
=========================================================*/

function renderGallery(){

    const images = currentWatch.images;

    if(!images || !images.gallery || images.gallery.length === 0){
        return "";
    }

    const gallery = images.gallery.filter(image => {
        return image.file !== images.hero;
    });

    if(gallery.length === 0){
        return "";
    }

    return `

<section class="watch-gallery">

    <div class="watch-container">

        <h2 class="section-title">
            Museum Gallery
        </h2>

        <p class="gallery-intro">
            Explore this watch in greater detail.
        </p>

        <div class="gallery-layout">

            <div class="gallery-main">

                <button
                    id="gallery-prev"
                    class="gallery-arrow"
                    aria-label="Previous Image"
                >
                    &#10094;
                </button>

                <img
                    id="gallery-main-image"
                    src="${galleryImage(gallery[0].file)}"
                    alt="${gallery[0].title}"
                >

                <button
                    id="gallery-next"
                    class="gallery-arrow"
                    aria-label="Next Image"
                >
                    &#10095;
                </button>

            </div>

            ${
                gallery.length > 1
                ? `

                <div class="gallery-thumbnails">

                    ${gallery.map((image,index) => `

                        <button
                            class="gallery-thumb ${index === 0 ? "active" : ""}"
                            data-image="${galleryImage(image.file)}"
                            data-title="${image.title}"
                        >

                            <img
                                src="${galleryImage(image.file)}"
                                alt="${image.title}"
                                loading="lazy"
                            >

                            <span>
                                ${image.title}
                            </span>

                        </button>

                    `).join("")}

                </div>

                `
                : ""
            }

        </div>

    </div>

</section>

    `;

}

/*=========================================================
Story
=========================================================*/

function renderStory(){

    const story = currentWatch.story;

    return `

<section class="watch-story">

    <div class="watch-container">

        ${storyBlock("",story.opening)}

        ${storyBlock("",story.background)}

        ${storyBlock("",story.acquisition)}

        ${storyBlock("",story.experience)}

        ${storyBlock(

            "Why It Matters",

            story.whyItMatters,

            true

        )}

        ${storyBlock(

            "Favourite Memory",

            story.favoriteMemory

        )}

        ${storyBlock(

            "Reflection",

            story.reflection

        )}

    </div>

</section>

    `;

}

function storyBlock(

    title,

    text,

    highlight=false

){

    return `

<div class="story-section ${highlight ? "highlight" : ""}">

    ${title ? `<h3>${title}</h3>` : ""}

    <p>

        ${value(text)}

    </p>

</div>

    `;

}

/*=========================================================
Museum Plaque

Part 3 Starts Here
=========================================================*/
/*=========================================================
Museum Plaque
=========================================================*/

function renderMuseumPlaque(){

    const spec = currentWatch.technicalSpecifications;

    return `

<section class="watch-details">

    <div class="watch-container">

        <h2 class="section-title">

            Museum Plaque

        </h2>

        <div class="detail-grid">

            ${detailCard("Brand",currentWatch.identity.brand)}

            ${detailCard("Collection",currentWatch.identity.collection)}

            ${detailCard("Reference",currentWatch.identity.reference)}

            ${detailCard("Movement",spec.movement)}

            ${detailCard("Case Diameter",spec.caseDiameter)}

            ${detailCard("Case Material",spec.caseMaterial)}

            ${detailCard("Crystal",spec.crystal)}

            ${detailCard("Dial",spec.dialColor)}

            ${detailCard("Bezel",spec.bezel)}

            ${detailCard("Water Resistance",spec.waterResistance)}

            ${detailCard("Original Strap",spec.originalStrap)}

            ${detailCard("Current Strap",spec.currentStrap)}

            ${detailCard("Lug Width",spec.lugWidth)}

            ${detailCard("Acquired",currentWatch.acquisition.year)}

            ${detailCard("Acquisition Type",currentWatch.acquisition.type)}

            ${detailCard("Country",currentWatch.acquisition.country)}

            ${detailCard("Condition",currentWatch.collectionNotes.currentCondition)}

            ${detailCard("Daily Wear",currentWatch.collectionNotes.dailyWear)}

            ${detailCard("Ownership",currentWatch.ownership.ownershipStatus)}

            ${detailCard("Future",currentWatch.ownership.futureDisposition)}

        </div>

    </div>

</section>

    `;

}

/*=========================================================
Detail Card
=========================================================*/

function detailCard(label,valueText){

    if(!valueText){

        return "";

    }

    return `

<div class="detail-card">

    <span>

        ${label}

    </span>

    <strong>

        ${value(valueText)}

    </strong>

</div>

    `;

}

/*=========================================================
Collector Reflection
=========================================================*/

function renderCollectorReflection(){

    const reflection = currentWatch.story.collectorReflection;

    if(!reflection){

        return "";

    }

    return `

<section class="collector-reflection">

    <div class="watch-container">

        <h2 class="section-title">

            Collector's Reflection

        </h2>

        <blockquote class="reflection-quote">

            ${reflection}

        </blockquote>

    </div>

</section>

    `;

}

/*=========================================================
Navigation
=========================================================*/

function renderNavigation(){

    const previous = previousChapter();

    const next = nextChapter();

    return `

<section class="chapter-navigation">

    <div class="watch-container">

        <div class="nav-grid">

            <div class="previous-chapter">

                ${previous ? `

                    <a href="watch.html?id=${previous.id}">

                        ← ${previous.identity.displayName}

                    </a>

                ` : ""}

            </div>

            <div class="next-chapter">

                ${next ? `

                    <a href="watch.html?id=${next.id}">

                        ${next.identity.displayName} →

                    </a>

                ` : ""}

            </div>

        </div>

    </div>

</section>

    `;

}

/*=========================================================
Interactions

Part 4 Starts Here
=========================================================*/
/*=========================================================
Hero Image Interaction
=========================================================*/



/*=========================================================
Gallery Interaction
=========================================================*/

function initialiseGallery(){

    const mainImage = document.getElementById("gallery-main-image");

    if(!mainImage){

        return;

    }

    const thumbnails = Array.from(document.querySelectorAll(".gallery-thumb"));

    const previous = document.getElementById("gallery-prev");

    const next = document.getElementById("gallery-next");

    let currentIndex = 0;
    let isAnimating = false;
   if(thumbnails.length <= 1){

    if(previous) previous.style.display = "none";

    if(next) next.style.display = "none";

}

    function showImage(index){
        console.log("showImage called:", index);

    currentIndex = index;
        if(isAnimating){

    return;

}

isAnimating = true;

        currentIndex = index;

        const thumbnail = thumbnails[currentIndex];

        const image = thumbnail.dataset.image;

        const title = thumbnail.dataset.title;

        mainImage.classList.add("fade-out");

        setTimeout(()=>{

            mainImage.src = image;

            mainImage.alt = title;

            mainImage.classList.remove("fade-out");

            mainImage.classList.add("fade-in");
            isAnimating = false;

        },180);

        thumbnails.forEach(button=>{

            button.classList.remove("active");

        });

        thumbnail.classList.add("active");

    }

    thumbnails.forEach((thumbnail,index)=>{

        thumbnail.addEventListener("click",()=>{

            showImage(index);

        });

    });

    if(previous){

        previous.addEventListener("click",()=>{

            const index =
                (currentIndex-1+thumbnails.length)%thumbnails.length;

            showImage(index);

        });

    }

  if(next){

    next.addEventListener("click",()=>{

        console.log("Current:", currentIndex);

        const index =
            (currentIndex+1)%thumbnails.length;

        console.log("Next:", index);

        showImage(index);

    });

}

    mainImage.addEventListener("transitionend",()=>{

        mainImage.classList.remove("fade-in");

    });

    mainImage.style.cursor="zoom-in";

    mainImage.addEventListener("click",()=>{

        openGalleryLightbox(mainImage.src);
        

    });
    showImage(0);

}/*==================================================
Gallery Image Cleanup
==================================================*/

function initialiseGalleryImages(){

    const hero=document.getElementById("gallery-main-image");

    const thumbs=document.querySelectorAll(".gallery-thumb");

    if(!hero || thumbs.length===0){

        return;

    }

    thumbs.forEach(button=>{

        const img=button.querySelector("img");

        if(!img){

            return;

        }

        img.onerror=()=>{

            button.remove();

        };

    });

    hero.onerror=()=>{

        const first=document.querySelector(".gallery-thumb img");

        if(first){

            hero.src=first.src;

            hero.alt=first.alt;

        }

    };

}

/*=========================================================
Gallery Lightbox
=========================================================*/

function openGalleryLightbox(image){

    let lightbox = document.getElementById("gallery-lightbox");

    if(!lightbox){

        lightbox = document.createElement("div");

        lightbox.id = "gallery-lightbox";

        lightbox.innerHTML = `

            <div class="gallery-lightbox-overlay">

                <button class="gallery-close">

                    ×

                </button>

                <img id="gallery-lightbox-image">

            </div>

        `;

        document.body.appendChild(lightbox);

        lightbox.addEventListener("click",(event)=>{

            if(

                event.target.id==="gallery-lightbox" ||

                event.target.classList.contains("gallery-lightbox-overlay")

            ){

                closeGalleryLightbox();

            }

        });

        lightbox.querySelector(".gallery-close")

            .addEventListener(

                "click",

                closeGalleryLightbox

            );

    }

    document.getElementById(

        "gallery-lightbox-image"

    ).src=image;

    lightbox.style.display="flex";

    document.body.style.overflow="hidden";

}

function closeGalleryLightbox(){

    const lightbox=document.getElementById("gallery-lightbox");

    if(!lightbox){

        return;

    }

    lightbox.style.display="none";

    document.body.style.overflow="";

}

document.addEventListener("keydown",(event)=>{

    if(event.key==="Escape"){

        closeGalleryLightbox();

    }

});

/*=========================================================
Animations

Part 5 Starts Here
=========================================================*/
/*=========================================================
Reveal Animation
=========================================================*/

function initialiseRevealAnimation(){

    const elements = document.querySelectorAll(

        ".story-section, .detail-card, .reflection-quote, .watch-gallery"

    );

    if(!elements.length){

        return;

    }

    const observer = new IntersectionObserver(

        entries=>{

            entries.forEach(entry=>{

                if(entry.isIntersecting){

                    entry.target.classList.add("visible");

                    observer.unobserve(entry.target);

                }

            });

        },

        {

            threshold:0.15,

            rootMargin:"0px 0px -40px 0px"

        }

    );

    elements.forEach(element=>{

        observer.observe(element);

    });

}

/*=========================================================
Image Fallback
=========================================================*/

function imageFallback(image){

    image.onerror = function(){

        this.style.display = "none";

    };

}

/*=========================================================
Gallery Image Fallback
=========================================================*/

function initialiseImageFallbacks(){

    document

        .querySelectorAll("img")

        .forEach(image=>{

            imageFallback(image);

        });

}

/*=========================================================
Smooth Scroll Utility
=========================================================*/

function scrollToTop(){

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

}

/*=========================================================
Page Ready
=========================================================*/

document.addEventListener(

    "DOMContentLoaded",

    ()=>{

        initialiseImageFallbacks();

    }

);

/*=========================================================
Future Sprint Hooks

Timeline
Search
Collection Map
Statistics
Wishlist

=========================================================*/

/*=========================================================
End of File
=========================================================*/