/*
==========================================================
TIME WELL KEPT
watch.js
Version 7
Gallery stability + image orientation
==========================================================
*/

"use strict";

let currentWatch = null;
let timeline = [];
let currentIndex = -1;

document.addEventListener("DOMContentLoaded", initialiseWatchPage);

async function initialiseWatchPage(){
    showLoading();
    try{
        const params = new URLSearchParams(window.location.search);
        const id = params.get("id");
        if(!id){ showError("No chapter specified."); return; }
        currentWatch = await TimeWellKept.getWatchById(id);
        if(!currentWatch){ showError("Watch not found."); return; }
        timeline = await TimeWellKept.getTimeline();
        currentIndex = timeline.findIndex(watch => watch.catalogNumber === currentWatch.catalogNumber);
        const galleryItems = await loadGalleryItems();
renderWatch(galleryItems);
initialiseGallery(galleryItems);
initialiseGalleryImages();
initialiseRevealAnimation();
    }catch(error){ console.error(error); showError("Unable to load chapter."); }
}

function previousChapter(){ return currentIndex <= 0 ? null : timeline[currentIndex - 1]; }
function nextChapter(){ return currentIndex >= timeline.length - 1 ? null : timeline[currentIndex + 1]; }
function heroImage(){ return `../images/watches/${currentWatch.images.folder}/${currentWatch.images.hero}`; }
function galleryImage(file){ return `../images/watches/${currentWatch.images.folder}/${file}`; }
function value(data){ return data === undefined || data === null || data === "" ? "" : data; }

async function loadGalleryItems(){
    const images = currentWatch?.images;
    const folder = images?.folder;

    if(!folder) return [];

    try{
        const response = await fetch("../archive/gallery-manifest.json");

        if(!response.ok){
            throw new Error(`Gallery manifest failed: ${response.status}`);
        }

        const manifest = await response.json();
        const files = manifest[folder];

        if(!Array.isArray(files)){
            return [];
        }

        const excluded = new Set(
            [images.hero, images.cover, images.thumbnail]
                .filter(Boolean)
                .map(name => String(name).toLowerCase())
        );

        return files
            .filter(file => !excluded.has(String(file).toLowerCase()))
            .map((file,index) => ({
                file: file,
                title: galleryTitle(file,index)
            }));
    }
    catch(error){
        console.error("Unable to load gallery manifest:", error);

        return [];
    }
}

function galleryTitle(file,index){
    const name = String(file || "")
        .replace(/^.*?[\\/]/,"")
        .replace(/\.[^.]+$/,"")
        .replace(/[_-]+/g," ")
        .replace(/\s+/g," ")
        .trim();

    if(!name){
        return `Image ${index + 1}`;
    }

    return name.replace(
        /\b\w/g,
        letter => letter.toUpperCase()
    );
}

function showLoading(){ document.getElementById("watch-page").innerHTML=`<section class="watch-loading"><div class="watch-container"><h2>Loading Chapter...</h2></div></section>`; }
function showError(message){ document.getElementById("watch-page").innerHTML=`<section class="watch-error"><div class="watch-container"><h2>${message}</h2></div></section>`; }

function renderWatch(){
    document.getElementById("watch-page").innerHTML=`${renderHero()}${renderGallery()}${renderStory()}${renderMuseumPlaque()}${renderCollectorReflection()}${renderNavigation()}`;
}

function renderHero(){
return `<section class="watch-hero"><div class="watch-container"><div class="watch-container"><span class="catalog-number">${value(currentWatch.catalogNumber)}</span><h1>${value(currentWatch.identity.displayName)}</h1><div class="watch-year">${value(currentWatch.acquisition.year)}</div><h2>${value(currentWatch.chapter.title)}</h2><img id="hero-image" class="watch-hero-image" src="${heroImage()}" alt="${value(currentWatch.identity.displayName)}"><blockquote class="museum-caption">"${value(currentWatch.museumPlaque.caption)}"</blockquote></div></div></section>`;
}

function renderGallery(gallery){
    const gallery=getGalleryItems();
    if(!gallery.length) return "";
    return `<section class="watch-gallery"><div class="watch-container"><h2 class="section-title">Museum Gallery</h2><p class="gallery-intro">Explore this watch in greater detail.</p><div class="gallery-layout"><div class="gallery-main"><button id="gallery-prev" class="gallery-arrow" aria-label="Previous Image" type="button">&#10094;</button><img id="gallery-main-image" class="gallery-main-image" src="${galleryImage(gallery[0].file)}" alt="${gallery[0].title}" decoding="async"><button id="gallery-next" class="gallery-arrow" aria-label="Next Image" type="button">&#10095;</button></div>${gallery.length>1?`<div class="gallery-thumbnails">${gallery.map((image,index)=>`<button class="gallery-thumb ${index===0?"active":""}" data-index="${index}" type="button" aria-label="Show ${image.title}"><img src="${galleryImage(image.file)}" alt="${image.title}" loading="lazy" decoding="async"><span>${image.title}</span></button>`).join("")}</div>`:""}</div></div></section>`;
}

function renderStory(){
 const story=currentWatch.story;
 return `<section class="watch-story"><div class="watch-container">${storyBlock("",story.opening)}${storyBlock("",story.background)}${storyBlock("",story.acquisition)}${storyBlock("",story.experience)}${storyBlock("Why It Matters",story.whyItMatters,true)}${storyBlock("Favourite Memory",story.favoriteMemory)}${storyBlock("Reflection",story.reflection)}</div></section>`;
}
function storyBlock(title,text,highlight=false){ return `<div class="story-section ${highlight?"highlight":""}">${title?`<h3>${title}</h3>`:""}<p>${value(text)}</p></div>`; }

function renderMuseumPlaque(){
 const spec=currentWatch.technicalSpecifications;
 return `<section class="watch-details"><div class="watch-container"><h2 class="section-title">Museum Plaque</h2><div class="detail-grid">${detailCard("Brand",currentWatch.identity.brand)}${detailCard("Collection",currentWatch.identity.collection)}${detailCard("Reference",currentWatch.identity.reference)}${detailCard("Movement",spec.movement)}${detailCard("Case Diameter",spec.caseDiameter)}${detailCard("Case Material",spec.caseMaterial)}${detailCard("Crystal",spec.crystal)}${detailCard("Dial",spec.dialColor)}${detailCard("Bezel",spec.bezel)}${detailCard("Water Resistance",spec.waterResistance)}${detailCard("Original Strap",spec.originalStrap)}${detailCard("Current Strap",spec.currentStrap)}${detailCard("Lug Width",spec.lugWidth)}${detailCard("Acquired",currentWatch.acquisition.year)}${detailCard("Acquisition Type",currentWatch.acquisition.type)}${detailCard("Country",currentWatch.acquisition.country)}${detailCard("Condition",currentWatch.collectionNotes.currentCondition)}${detailCard("Daily Wear",currentWatch.collectionNotes.dailyWear)}${detailCard("Ownership",currentWatch.ownership.ownershipStatus)}${detailCard("Future",currentWatch.ownership.futureDisposition)}</div></div></section>`;
}
function detailCard(label,valueText){ if(!valueText)return ""; return `<div class="detail-card"><span>${label}</span><strong>${value(valueText)}</strong></div>`; }
function renderCollectorReflection(){ const reflection=currentWatch.story.collectorReflection; if(!reflection)return ""; return `<section class="collector-reflection"><div class="watch-container"><h2 class="section-title">Collector's Reflection</h2><blockquote class="reflection-quote">${reflection}</blockquote></div></section>`; }
function renderNavigation(){ const previous=previousChapter(); const next=nextChapter(); return `<section class="chapter-navigation"><div class="watch-container"><div class="nav-grid"><div class="previous-chapter">${previous?`<a href="watch.html?id=${previous.id}">← ${previous.identity.displayName}</a>`:""}</div><div class="next-chapter">${next?`<a href="watch.html?id=${next.id}">${next.identity.displayName} →</a>`:""}</div></div></div></section>`; }

function setActiveThumbnail(thumbnails,index){ thumbnails.forEach(button=>button.classList.toggle("active",Number(button.dataset.index)===index)); }

function initialiseGallery(items){
    const mainImage=document.getElementById("gallery-main-image");
    if(!mainImage)return;
    const thumbnails=Array.from(document.querySelectorAll(".gallery-thumb"));
    const previous=document.getElementById("gallery-prev");
    const next=document.getElementById("gallery-next");
  if(!Array.isArray(items) || !items.length){
    return;
}
    let galleryIndex=0;
    let fadeTimer=null;

    function showImage(index){
        if(!items.length)return;
        galleryIndex=(index+items.length)%items.length;
        const item=items[galleryIndex];
        setActiveThumbnail(thumbnails,galleryIndex);
        if(fadeTimer)clearTimeout(fadeTimer);
        mainImage.classList.remove("fade-in");
        mainImage.classList.add("fade-out");
        fadeTimer=setTimeout(()=>{
            mainImage.src=galleryImage(item.file);
            mainImage.alt=item.title;
            mainImage.classList.remove("fade-out");
            mainImage.classList.add("fade-in");
        },180);
    }

    thumbnails.forEach((thumbnail,index)=>thumbnail.addEventListener("click",()=>showImage(index)));
    if(previous)previous.addEventListener("click",()=>showImage(galleryIndex-1));
    if(next)next.addEventListener("click",()=>showImage(galleryIndex+1));
    if(thumbnails.length<=1){ if(previous)previous.style.display="none"; if(next)next.style.display="none"; }
    mainImage.addEventListener("transitionend",event=>{if(event.propertyName==="opacity")mainImage.classList.remove("fade-in");});
    mainImage.style.cursor="zoom-in";
    mainImage.addEventListener("click",()=>openGalleryLightbox(mainImage.src));
    showImage(0);
}

function initialiseGalleryImages(){
    const hero=document.getElementById("gallery-main-image");
    const thumbs=document.querySelectorAll(".gallery-thumb");
    if(!hero)return;
    hero.style.objectFit="contain";
    hero.style.transform="none";
    thumbs.forEach(button=>{const img=button.querySelector("img");if(img){img.style.objectFit="contain";img.style.transform="none";img.addEventListener("error",()=>button.remove(),{once:true});}});
}

function openGalleryLightbox(image){
    let lightbox=document.getElementById("gallery-lightbox");
    if(!lightbox){
        lightbox=document.createElement("div");
        lightbox.id="gallery-lightbox";
        lightbox.innerHTML=`<div class="gallery-lightbox-overlay"><button class="gallery-close" type="button" aria-label="Close">×</button><img id="gallery-lightbox-image" alt=""></div>`;
        document.body.appendChild(lightbox);
        lightbox.addEventListener("click",event=>{if(event.target===lightbox||event.target.classList.contains("gallery-lightbox-overlay"))lightbox.classList.remove("visible");});
        lightbox.querySelector(".gallery-close").addEventListener("click",()=>lightbox.classList.remove("visible"));
    }
    const imageElement=document.getElementById("gallery-lightbox-image");
    if(imageElement)imageElement.src=image;
    requestAnimationFrame(()=>lightbox.classList.add("visible"));
}

function initialiseRevealAnimation(){
 const elements=document.querySelectorAll(".story-section,.detail-card,.plaque-heading,.plaque-caption,.reflection-quote");
 if(!elements.length)return;
 const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("visible");observer.unobserve(entry.target);}}),{threshold:0.15});
 elements.forEach(element=>observer.observe(element));
}
