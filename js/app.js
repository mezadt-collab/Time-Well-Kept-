document.addEventListener("DOMContentLoaded", async () => {

    console.log("Time Well Kept Started");

    await TimeWellKept.loadDatabase();

   await renderTimeline();

//initialiseHorizontalTimeline();

await renderCollection();
await renderStatistics();
});