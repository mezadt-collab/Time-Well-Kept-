/*
==========================================================
TIME WELL KEPT
Timeline
==========================================================
*/

let journeyPages = [];

let currentPage = 0;

async function renderTimeline() {

  const container = document.getElementById("journey-content");

    if (!container) return;

    const watches = await TimeWellKept.getTimeline();

    container.innerHTML = "";

   /*==========================================================
BUILD JOURNEY PAGES
==========================================================*/

journeyPages = [];

// Intro page
journeyPages.push({

    type: "intro"

});

// Group watches by year
const grouped = {};

watches.forEach(watch => {

    const year = watch.acquisition.year;

    if (!grouped[year]) {

        grouped[year] = [];

    }

    grouped[year].push(watch);

});

// Create one page per year
Object.keys(grouped)
    .sort((a, b) => Number(a) - Number(b))
    .forEach(year => {

        journeyPages.push({

            type: "year",

            year: year,

            watches: grouped[year]

        });

});

// Ending page
journeyPages.push({

    type: "ending"

});

console.log(journeyPages);
showPage(0);

}
/*==========================================================
SHOW ONE PAGE
==========================================================*/

/*==========================================================
SHOW ONE PAGE
==========================================================*/

function showPage(index){

    const container = document.getElementById("journey-content");

    if(!container){

        return;

    }

    const page = journeyPages[index];

    if(!page){

        return;

    }

    currentPage = index;

    /*------------------------------------------
      INTRO PAGE
    ------------------------------------------*/

    if(page.type==="intro"){

        container.innerHTML = `

            <div class="journey-page journey-intro-page">

                <p class="chapter-number">

                    CHAPTER TWO

                </p>

                <h2 class="section-title">

                    The Collector's Journey

                </h2>
                <div class="editorial-divider"></div>

                <p class="journey-introduction">

                    Every collection begins with a single watch.

                    Over time, every watch becomes a memory,
                    a milestone and a chapter of life.

                </p>

            </div>

        `;

    }

    /*------------------------------------------
      YEAR PAGE
    ------------------------------------------*/

    else if(page.type==="year"){

        container.innerHTML = `

            <div class="journey-page">

                <h1 class="journey-year">

                    ${page.year}

                </h1>

                <div class="journey-watch-list">

                    ${page.watches.map(watch=>`

                        <p class="journey-watch">

                            ${watch.identity.displayName}

                        </p>

                    `).join("")}

                </div>

            </div>

        `;

    }

    /*------------------------------------------
      END PAGE
    ------------------------------------------*/

    else if(page.type==="ending"){

        container.innerHTML = `

            <div class="journey-page">

                <h2 class="section-title">

                    The Journey Continues...

                </h2>

                <p class="journey-introduction">

                    Every collection is unfinished.

                    The next chapter is yet to be written.

                </p>

            </div>

        `;

    }

    initialiseJourneyNavigation();

}
/*==========================================================
NEXT PAGE
==========================================================*/

function nextPage(){

    if(currentPage < journeyPages.length - 1){

        currentPage++;

        showPage(currentPage);

        initialiseJourneyNavigation();

    }

}
/*==========================================================
PREVIOUS PAGE
==========================================================*/

function previousPage(){

    if(currentPage > 0){

        currentPage--;

        showPage(currentPage);

        initialiseJourneyNavigation();

    }

}
/*==========================================================
INITIALISE NAVIGATION
==========================================================*/

/*==========================================================
INITIALISE NAVIGATION
==========================================================*/

function initialiseJourneyNavigation(){

    const next=document.getElementById("journey-next");

    const prev=document.getElementById("journey-prev");
    if(prev){

    prev.style.display = currentPage === 0 ? "none" : "flex";

}

if(next){

    next.style.display = currentPage === journeyPages.length - 1 ? "none" : "flex";

}

    const progress=document.getElementById("journey-progress");

    if(progress){

        if(currentPage===0){

            progress.textContent="";

        }else if(currentPage===journeyPages.length-1){

            progress.textContent="";

        }else{

            progress.textContent=`${currentPage} / ${journeyPages.length-2}`;

        }

    }

    if(prev){

        prev.disabled=currentPage===0;

        prev.onclick=()=>{

            previousPage();

        };

    }

    if(next){

        next.onclick=()=>{

            if(currentPage===0){

                showPage(1);

                return;

            }

            nextPage();

        };

    }

}