/*
==========================================================
TIME WELL KEPT
Collection
==========================================================
*/

async function renderCollection() {

    const container = document.getElementById("collection-grid");

    if (!container) return;

    const watches = await TimeWellKept.getAllWatches();

    container.innerHTML = "";

    watches.forEach((watch, index) => {

        const exhibit = document.createElement("article");

        exhibit.className = "collection-item";

        if (index % 2 !== 0) {
            exhibit.classList.add("reverse");
        }

      
        const heroImage = `images/watches/${watch.catalogNumber}/${watch.catalogNumber} hero.jpg`;

        const frontImage = `images/watches/${watch.catalogNumber}/${watch.catalogNumber} front.jpg`;

        console.log(heroImage);
console.log(frontImage);

        const preview =
            watch.story.preview ||
            watch.story.summary ||
            "";

        exhibit.innerHTML = `

    <div class="collection-image">

    <img
        class="front-image"
        src="${frontImage}"
        alt="${watch.identity.displayName}"
        loading="lazy"
        onerror="this.style.display='none';"
    >

    <img
        class="hero-image"
        src="${heroImage}"
        alt="${watch.identity.displayName}"
        loading="lazy"
    >

</div>

    <div class="collection-content">

        <span class="catalog-number">
            ${watch.catalogNumber}
        </span>

        <h3>
            ${watch.identity.displayName}
        </h3>

        <h4>
            ${watch.chapter.title}
        </h4>

        ${preview ? `<p>${preview}</p>` : ""}

        <a
    href="pages/watch.html?id=${watch.catalogNumber}"
    class="read-story"
    data-watch="${watch.catalogNumber}"
>
    Explore This Chapter →
</a>

    </div>

`;
        container.appendChild(exhibit);
        const link = exhibit.querySelector(".read-story");

link.addEventListener("click", () => {

   

    sessionStorage.setItem(
        "selectedWatch",
        watch.catalogNumber
    );

});

    });
    
   /*==================================================
Restore Previous Watch
==================================================*/

const selectedWatch = sessionStorage.getItem("selectedWatch");

if(selectedWatch){

    requestAnimationFrame(()=>{

        const link=document.querySelector(

            `.read-story[data-watch="${selectedWatch}"]`

        );

        if(!link){

            return;

        }

        const card=link.closest(".collection-item");

        if(!card){

            return;

        }

        card.scrollIntoView({

            behavior:"smooth",

            block:"center"

        });

        card.classList.add("collection-highlight");

        setTimeout(()=>{

            card.classList.remove("collection-highlight");

        },1800);

    });

}



}

/*=========================================================
END OF FILE
=========================================================*/



