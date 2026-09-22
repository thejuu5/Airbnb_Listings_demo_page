function MainModule(listingsID = "#listings") {
  const me = {};
  let allListings = [];


  const listingsElement = document.querySelector(listingsID);

  function parsePrice(priceStr) {
    return parseFloat(priceStr.replace(/[^0-9.]/g, "")) || 0;
  }

  function getListingCode(listing) {
    const plainDescription = listing.description.replace(/<[^>]*>/g, " ");
    const shortDescription = plainDescription.length > 200
  ? plainDescription.substring(0, 200) + "..."
  : plainDescription;

    let amenitiesList = [];
    try {
      amenitiesList = JSON.parse(listing.amenities);
    } catch (e) {
      amenitiesList = [];
    }
    const topAmenities = amenitiesList.slice(0, 5).join(", ");

    return `<div class="col-4">
  <div class="listing card">
    <img
  src="${listing.picture_url}"
  onerror="this.onerror=null; this.src='https://placehold.co/300x200?text=No+Image';"
  class="card-img-top"
  alt="${listing.name}"
/>
    <div class="card-body">
      <h5 class="card-title">${listing.name}</h5>
      <p><strong>Price:</strong> ${listing.price}</p>
      <p class="card-text">${shortDescription}</p>
      <p><strong>Amenities:</strong> ${topAmenities}</p>
      <div class="d-flex align-items-center mb-2">
        <img src="${listing.host_picture_url}" onerror="this.onerror=null; this.src='https://placehold.co/40x40?text=?';" width="40" height="40" class="rounded-circle me-2" alt="${listing.host_name}" />
        <span>Hosted by ${listing.host_name}</span>
      </div>
      <a href="${listing.listing_url}" target="_blank" class="btn btn-primary">View on Airbnb</a>
    </div>
  </div>
  </div>
  `;
}

  function redraw(listings) {
    listingsElement.innerHTML = "";
    // for (let i = 0; i < listings.length; i++) {
    //   listingsElement.innerHTML += getListingCode(listings[i]);
    // }

    // for (let listing of listings) {
    //   console.log("listing", listing );
    //   listingsElement.innerHTML += getListingCode(listing);
    // }

    listingsElement.innerHTML = listings.map(getListingCode).join("\n");
  }

   function sortListings(order) {
    let sorted = [...allListings];
    if (order === "lowToHigh") {
      sorted.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
    } else if (order === "highToLow") {
      sorted.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
    }
    redraw(sorted);
  }

  async function loadData() {
    const res = await fetch("./airbnb_sf_listings_500.json");
    const listings = await res.json();


    allListings = listings.slice(0, 50);
  me.redraw(allListings); 
  }

  me.redraw = redraw;
  me.loadData = loadData;
  me.sortListings = sortListings;

  return me;
}

const main = MainModule();


main.loadData();

document.querySelector("#sortSelect").addEventListener("change", (e) => {
  main.sortListings(e.target.value);
});