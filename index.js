console.log("start");
const runMapJS = () => {
  console.log("run");
  let locationsDataUrl =
    "https://digitalmarketing.blob.core.windows.net/13179/files/locations_(1).json";
  let countriesDataUrl =
    "https://digitalmarketing.blob.core.windows.net/13179/files/countries_(1).json";
  let citiesDropdownElement = document.getElementById("cities-dropdown");
  let countriesDropdownElement = document.getElementById("countries-dropdown");

  async function fetchLocationsJSON() {
    console.log("starting json fetch");
    const statesResponse = await fetch(locationsDataUrl);
    const countriesResponse = await fetch(countriesDataUrl);

    if (document.querySelector("#world-map")) {
      console.log("World Map");
      const countries = await countriesResponse.json();
      await checkCountries(countries);
    }
    const locations = await statesResponse.json();
    await checkStates(locations);
    return locations;
  }

  function checkStates(l) {
    let states = document.querySelectorAll("#STATES  g g");
    states.forEach((state) => {
      let stateInitials = state.getAttribute("data-name");
      let result = l.filter((location) => location.state === stateInitials);
      state.addEventListener("click", () => navigateToDropdown(stateInitials));
      if (result.length === 1) {
        let dataName = result[0].state;
        let fullName = result[0].fullStateName;
        let awardedCitiesList = result[0].awardedCities;
        let targetCitiesList = result[0].targetMarketCities;
        if (result[0].isOrange) {
          state.style.fill = "#ffb18f";
          if (document.querySelector("#world-map")) {
            if (targetCitiesList.length === 0) {
              makeTargetDropdown(
                dataName,
                fullName,
                ["City Information Coming Soon"],
                citiesDropdownElement
              );
            } else {
              makeTargetDropdown(
                dataName,
                fullName,
                targetCitiesList,
                citiesDropdownElement
              );
            }
          }
        }
        if (result[0].isBlue) {
          state.style.fill = "#a4d1f2";

          makeToolTipList(awardedCitiesList, state);
        }
      }
    });
  }

  function makeToolTipList(citiesList, element) {
    let tooltipContent = [
      "<div style='font-weight: bold;'>Uncle Sharkii Restaurants</div>",
    ];
    citiesList.map((c) => tooltipContent.push(c));
    element.setAttribute(
      "data-tippy-content",
      tooltipContent.map((c) => `<div>${c}</div>`).join("")
    );
    tippy(element, {
      followCursor: "initial",
      delay: 100,
      arrow: true,
    });
  }

  function checkCountries(c) {
    let countries = document.querySelectorAll("#WORLD .region");

    countries.forEach((country) => {
      let countryName = country.getAttribute("data-name");
      let result = c.filter((country) => country.country === countryName);
      country.addEventListener("click", () => navigateToDropdown(countryName));
      // country.addEventListener('click', () => navigateToDropdown(countryName));
      country.setAttribute("data-tippy-content", countryName);
      tippy(country, {
        followCursor: "initial",
        delay: 100,
        arrow: true,
      });

      if (result.length === 1) {
        let countryName = result[0].country;
        let countriesList = result[0].targetMarketcities;

        if (result[0].isOrange) {
          // console.log(result[0]);
          country.style.fill = "#ffb18f";
          makeTargetDropdown(
            countryName,
            countryName,
            countriesList,
            countriesDropdownElement
          );
        }
        if (result[0].isBlue) {
          country.style.fill = "#a4d1f2";
        }
      }
    });
  }

  function makeTargetDropdown(
    stateDataName,
    stateFullName,
    listOfCities,
    targetParentDiv
  ) {
    let targetCityDiv = document.createElement("div");
    let targetCityAtag = document.createElement("a");
    let titleWrapperDiv = document.createElement("div");
    let title = document.createElement("h4");
    let citiesListDiv = document.createElement("div");

    targetCityDiv.classList = "target-city";
    titleWrapperDiv.classList = "title-wrapper";
    citiesListDiv.classList = "cities-list";
    title.innerText = stateFullName;

    titleWrapperDiv.appendChild(title);
    listOfCities.map((city) => makeCity(city));
    targetCityDiv.setAttribute(
      `data-dropdown-name`,
      stateDataName.replace(/\s+/g, "")
    );
    targetCityDiv.setAttribute(
      `id`,
      `${stateDataName.replace(/\s+/g, "")}-dropdown`
    );
    targetCityAtag.setAttribute(
      `href`,
      `#${stateDataName.replace(/\s+/g, "")}-dropdown`
    );

    targetCityAtag.setAttribute(
      `id`,
      `${stateDataName.replace(/\s+/g, "")}-dropdown-button`
    );

    targetCityDiv.addEventListener("click", function (e) {
      let dataNameValue = e.currentTarget.getAttribute("data-dropdown-name");
      toggleTargetDropdown(dataNameValue);
    });

    targetCityDiv.appendChild(titleWrapperDiv);
    targetCityDiv.appendChild(citiesListDiv);
    targetCityDiv.appendChild(targetCityAtag);

    targetParentDiv.appendChild(targetCityDiv);

    function makeCity(c) {
      console.log("City:: ", c);
      let cityElement;

      if (typeof c === "string") {
        cityElement = document.createElement("span");
        cityElement.innerText = c;
      } else {
        cityElement = document.createElement("a");
        cityElement.setAttribute(
          "href",
          `https://www.unclesharkii.com/Available-Markets-${c.url}`
        );
        cityElement.innerText = c.name;
      }
      cityElement.classList = "city";
      citiesListDiv.appendChild(cityElement);
    }
  }

  function toggleTargetDropdown(dataName) {
    console.log("toggling target dropdown");
    console.log("dataName", dataName);
    let targetCity = document.querySelector(
      `div[data-dropdown-name="${dataName.replace(/\s+/g, "")}"]`
    );
    console.log("targetCity", targetCity);
    targetCity.classList.toggle("showing-cities");
  }

  function navigateToDropdown(dataName) {
    console.log("Navigating to dropdown");
    let button = document.querySelector(
      `#${dataName.replace(/\s+/g, "")}-dropdown-button`
    );

    button.click();
  }
  fetchLocationsJSON();
  console.log("finish loading");
};

runMapJS();
