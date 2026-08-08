/*
==========================================================
TIME WELL KEPT
Data Layer
----------------------------------------------------------
Responsible for loading and providing access to watches.json
==========================================================
*/

let watchDatabase = null;

/*
==========================================================
Load Database
==========================================================
*/

async function loadDatabase() {

    if (watchDatabase) {
        return watchDatabase;
    }

    try {

        const DATA_PATH = window.location.pathname.includes("/pages/")
    ? "../data/watches.json"
    : "data/watches.json";

const response = await fetch(DATA_PATH);

        if (!response.ok) {
            throw new Error(`Unable to load watches.json (${response.status})`);
        }

        watchDatabase = await response.json();

        console.log(
            `Loaded ${watchDatabase.collection.watchCount} watches successfully.`
        );

        return watchDatabase;

    } catch (error) {

        console.error("Database Load Failed:", error);

        return null;

    }

}

/*
==========================================================
Return Entire Collection
==========================================================
*/

async function getAllWatches() {

    const db = await loadDatabase();

    return db ? db.watches : [];

}

/*
==========================================================
Return Collection Information
==========================================================
*/

async function getCollectionInfo() {

    const db = await loadDatabase();

    return db ? db.collection : null;

}

/*
==========================================================
Find Watch By ID

Example:
getWatchById("TWK-020")
==========================================================
*/

async function getWatchById(id) {

    const watches = await getAllWatches();

    return watches.find(
        watch =>
            watch.catalogNumber.toUpperCase() === id.toUpperCase()
    );

}

/*
==========================================================
Featured Watches
==========================================================
*/

async function getFeaturedWatches() {

    const watches = await getAllWatches();

    return watches.filter(
        watch => watch.chapter.featured === true
    );

}

/*
==========================================================
Sort Chronologically
==========================================================
*/

async function getTimeline() {

    const watches = await getAllWatches();

    return [...watches].sort((a, b) => {

        if (a.acquisition.year === b.acquisition.year) {
            return a.chapter.number - b.chapter.number;
        }

        return a.acquisition.year - b.acquisition.year;

    });

}

/*
==========================================================
Statistics
==========================================================
*/

async function getStatistics() {

    const watches = await getAllWatches();

    const stats = {

        totalWatches: watches.length,

        brands: new Set(),

        countries: new Set(),

        automatic: 0,

        quartz: 0,

        mechanical: 0,

        chronographs: 0,

        gifts: 0,

        purchased: 0

    };

    watches.forEach(watch => {

        stats.brands.add(watch.identity.brand);

        stats.countries.add(watch.identity.countryOfOrigin);

        if (watch.analytics.isAutomatic)
            stats.automatic++;

        if (watch.analytics.isQuartz)
            stats.quartz++;

        if (watch.analytics.isMechanical)
            stats.mechanical++;

        if (watch.analytics.isChronograph)
            stats.chronographs++;

        if (watch.analytics.acquiredAsGift)
            stats.gifts++;
        else
            stats.purchased++;

    });

    return {

        totalWatches: stats.totalWatches,

        brands: stats.brands.size,

        countries: stats.countries.size,

        automatic: stats.automatic,

        quartz: stats.quartz,

        mechanical: stats.mechanical,

        chronographs: stats.chronographs,

        gifts: stats.gifts,

        purchased: stats.purchased

    };

}

/*
==========================================================
Expose Functions
==========================================================
*/

window.TimeWellKept = {

    loadDatabase,

    getAllWatches,

    getCollectionInfo,

    getWatchById,

    getFeaturedWatches,

    getTimeline,

    getStatistics

};