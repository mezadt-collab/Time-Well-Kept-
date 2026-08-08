/*==========================================================
TIME WELL KEPT
CHAPTER FIVE - STATISTICS
==========================================================*/

async function renderStatistics(){

    const watches = await TimeWellKept.getAllWatches();

    if(!watches || watches.length===0){

        console.error("No watches loaded.");

        return;

    }

    console.log("1");
populateOverview(watches);

console.log("2");
await renderWorldMap(watches);

console.log("3");
populateCountryList(watches);

console.log("4");
populateMovementDistribution(watches);


console.log("5");
populateCategoryDistribution(watches);
populateWishlist();

}

/*==========================================================
COLLECTION OVERVIEW
==========================================================*/

function populateOverview(watches) {

    // Total watches
    document.getElementById("stat-total").textContent = watches.length;

    // Unique brands
    const brands = [...new Set(
        watches.map(w => w.identity.brand)
    )];

    document.getElementById("stat-brands").textContent = brands.length;

    // Unique countries
    const countries = [...new Set(
        watches
            .map(w => w.identity.countryOfOrigin)
            .filter(Boolean)
    )];

    document.getElementById("stat-countries").textContent = countries.length;

    // First watch year
    const years = watches
        .map(w => w.acquisition.year)
        .filter(Boolean);

    const firstYear = Math.min(...years);
    const latestYear = Math.max(...years);

    document.getElementById("stat-first-year").textContent = firstYear;
    document.getElementById("stat-latest-year").textContent = latestYear;

    document.getElementById("stat-years").textContent =
        latestYear - firstYear + 1;

}

/*==========================================================
BRAND DISTRIBUTION
==========================================================*/


/*==========================================================
MOVEMENT DISTRIBUTION
==========================================================*/

function populateMovementDistribution(watches){

    const container = document.getElementById("movement-distribution");

    if(!container) return;

    let quartz = 0;
    let automatic = 0;
    let mechanical = 0;

    watches.forEach(watch=>{

    switch(watch.analytics.movementType){

        case "Quartz":
        case "Quartz Digital":
        case "Quartz Chronograph":
        case "Swiss Quartz Chronograph":

            quartz++;
            break;

        case "Automatic":

            automatic++;
            break;

        case "Hand-Wound Mechanical":

            mechanical++;
            break;

    }

});

    const data = [

        {
            label:"Quartz",
            value:quartz
        },

        {
            label:"Mechanical",
            value:mechanical
        },

        {
            label:"Automatic",
            value:automatic
        }

    ];

    const max = Math.max(...data.map(d=>d.value));

    container.innerHTML = "";

    data.forEach(item=>{

        const row = document.createElement("div");

        row.className = "movement-row";

        row.innerHTML = `

            <div class="movement-header">

                <span class="movement-label">
                    ${item.label}
                </span>

                <span class="movement-value">
                    ${item.value}
                </span>

            </div>

            <div class="movement-track">

                <div
                    class="movement-fill"
                    style="width:${(item.value/max)*100}%">
                </div>

            </div>

        `;

        container.appendChild(row);

    });

}
/*==========================================================
COUNTRY DISTRIBUTION
==========================================================*/

function populateCountryList(watches){

    const container = document.getElementById("country-list");

    if(!container) return;

    container.innerHTML = "";

    const countries = {};

    watches.forEach(watch=>{

        const country = watch.identity.countryOfOrigin;
        const brand = watch.identity.brand;

        if(!countries[country]){

            countries[country]={};

        }

        countries[country][brand]=(countries[country][brand]||0)+1;

    });

    Object.entries(countries)

        .sort((a,b)=>a[0].localeCompare(b[0]))

        .forEach(([country,brands])=>{

            const card=document.createElement("div");

            card.className="country-card";

            let html=`
                <h4 class="country-title">
                    ${country}
                </h4>
            `;

            Object.entries(brands)

                .sort((a,b)=>b[1]-a[1])

                .forEach(([brand,count])=>{

                    html+=`
                        <div class="country-brand">

                            <span>${brand}</span>

                            <span class="country-count">${count}</span>

                        </div>
                    `;

                });

            card.innerHTML=html;

            container.appendChild(card);

        });

}

function populateCategoryDistribution(watches){

    const container = document.getElementById("category-distribution");

    if(!container) return;

    const categories = {};

    watches.forEach(watch=>{

        const category = watch.analytics.category;

        if(!category) return;

        categories[category] = (categories[category] || 0) + 1;

    });

    const data = Object.entries(categories)
        .map(([label,value])=>({label,value}))
        .sort((a,b)=>b.value-a.value);

    const max = Math.max(...data.map(d=>d.value));

    container.innerHTML = "";

    data.forEach(item=>{

        const row = document.createElement("div");

        row.className = "movement-row";

        row.innerHTML = `

            <div class="movement-header">

                <span class="movement-label">
                    ${item.label}
                </span>

                <span class="movement-value">
                    ${item.value}
                </span>

            </div>

            <div class="movement-track">

                <div
                    class="movement-fill"
                    style="width:${(item.value/max)*100}%">
                </div>

            </div>

        `;

        container.appendChild(row);

    });

}
/*==========================================================*
*WISHLIST*
*==========================================================*/

function populateWishlist(){

    const container =
        document.getElementById("wishlist-grid");

    if(!container) return;

    const wishlist = [

        {
            title: "Grand Seiko Snowflake",
            subtitle: "SBGA211",
            description:
                "The grail — a watch I'd love to mark a major milestone with.",
            status: "Grail",
            images: [
                "images/wishlist/grand-seiko/grand-seiko-snowflake.jpg"
            ]
        },

        {
            title: "Oris Big Crown Pointer Date Oxblood",
            subtitle: "01 754 7741 4068",
            description:
                "The oxblood dial and vintage character make this one particularly hard to resist.",
            status: "Considering",
            images: [
                "images/wishlist/oris/oris-big-crown-oxblood.jpg"
            ]
        },

        {
            title: "Seagull 1963",
            subtitle: "Mechanical Chronograph",
            description:
                "A mechanical chronograph with a character and history of its own.",
            status: "Considering",
            images: [
                "images/wishlist/seagull-1963/seagull-1963.jpg"
            ]
        },

        {
            title: "Christopher Ward C63 Sealander",
            subtitle: "C63-39ADA4-S00K0-B1",
            description:
                "A modern everyday watch that balances understated design with serious watchmaking.",
            status: "Considering",
            images: [
                "images/wishlist/christopher-ward/christopher-ward-c63-sealander.jpg"
            ]
        },

        {
            title: "Brew Watch",
            subtitle: "Any model",
            description:
                "Something completely different — playful, unconventional and unmistakably Brew.",
            status: "Open",
            images: [
                "images/wishlist/brew/brew-01.jpg",
                "images/wishlist/brew/brew-02.jpg"
            ]
        },

        {
            title: "Vintage Citizen / Seiko",
            subtitle: "Vintage",
            description:
                "The hunt matters as much as the watch — I'd love to discover the right vintage piece.",
            status: "On the Hunt",
            images: [
                "images/wishlist/vintage-citizen-seiko/vintage-citizen.jpg",
                "images/wishlist/vintage-citizen-seiko/vintage-seiko.jpg"
            ]
        },

        {
            title: "Longines",
            subtitle: "Any model",
            description:
                "A future step into a different level of Swiss watchmaking.",
            status: "Open",
            images: [
                "images/wishlist/longines/longines-01.jpg",
                "images/wishlist/longines/longines-02.jpg"
            ]
        },

        {
            title: "German Brand",
            subtitle: "To be decided",
            description:
                "A German watch will eventually find its place in the collection.",
            status: "Open",
            images: []
        }

    ];

    container.innerHTML = "";

    wishlist.forEach(item => {

        const plaque =
            document.createElement("article");

        plaque.className = "wishlist-plaque";

        const imageHTML = item.images.length
            ? `
                <div class="wishlist-images">
                    ${item.images.map(image => `
                        <img
                            src="${image}"
                            alt="${item.title}"
                            class="wishlist-image"
                        >
                    `).join("")}
                </div>
              `
            : `
                <div class="wishlist-placeholder">
                    <span>TO BE DISCOVERED</span>
                </div>
              `;

        plaque.innerHTML = `

            ${imageHTML}

            <div class="wishlist-content">

                <h3 class="wishlist-title">
                    ${item.title}
                </h3>

                <div class="wishlist-subtitle">
                    ${item.subtitle}
                </div>

                <p class="wishlist-description">
                    ${item.description}
                </p>

                

            </div>

        `;

        container.appendChild(plaque);

    });

}