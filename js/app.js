// js/app.js

const recoveryDatabase = {

    "Boehmite": {
        "Hydroxamate": {
            recovery: 82,
            mechanism: "Chelation"
        },

        "Fatty Acid": {
            recovery: 74,
            mechanism: "Chemisorption"
        },

        "Amine": {
            recovery: 63,
            mechanism: "Electrostatic Attraction"
        },

        "Xanthate": {
            recovery: 22,
            mechanism: "Weak Adsorption"
        },

        "Sulfonate": {
            recovery: 48,
            mechanism: "Hydrogen Bonding"
        }
    },

    "Gibbsite": {
        "Hydroxamate": {
            recovery: 86,
            mechanism: "Chelation"
        },

        "Fatty Acid": {
            recovery: 79,
            mechanism: "Chemisorption"
        },

        "Amine": {
            recovery: 52,
            mechanism: "Electrostatic Attraction"
        },

        "Xanthate": {
            recovery: 18,
            mechanism: "Weak Adsorption"
        },

        "Sulfonate": {
            recovery: 41,
            mechanism: "Hydrogen Bonding"
        }
    },

    "Diaspore": {
        "Hydroxamate": {
            recovery: 77,
            mechanism: "Chelation"
        },

        "Fatty Acid": {
            recovery: 71,
            mechanism: "Chemisorption"
        },

        "Amine": {
            recovery: 61,
            mechanism: "Electrostatic Attraction"
        },

        "Xanthate": {
            recovery: 16,
            mechanism: "Weak Adsorption"
        },

        "Sulfonate": {
            recovery: 37,
            mechanism: "Hydrogen Bonding"
        }
    },

    "Kaolinite": {
        "Hydroxamate": {
            recovery: 33,
            mechanism: "Surface Complexation"
        },

        "Fatty Acid": {
            recovery: 29,
            mechanism: "Hydrogen Bonding"
        },

        "Amine": {
            recovery: 81,
            mechanism: "Electrostatic Attraction"
        },

        "Xanthate": {
            recovery: 12,
            mechanism: "Negligible Adsorption"
        },

        "Sulfonate": {
            recovery: 21,
            mechanism: "Weak Adsorption"
        }
    },

    "Quartz": {
        "Hydroxamate": {
            recovery: 24,
            mechanism: "Weak Adsorption"
        },

        "Fatty Acid": {
            recovery: 27,
            mechanism: "Hydrogen Bonding"
        },

        "Amine": {
            recovery: 89,
            mechanism: "Electrostatic Attraction"
        },

        "Xanthate": {
            recovery: 9,
            mechanism: "Negligible Adsorption"
        },

        "Sulfonate": {
            recovery: 16,
            mechanism: "Weak Adsorption"
        }
    },

    "Hematite": {
        "Hydroxamate": {
            recovery: 87,
            mechanism: "Chelation"
        },

        "Fatty Acid": {
            recovery: 83,
            mechanism: "Chemisorption"
        },

        "Amine": {
            recovery: 39,
            mechanism: "Electrostatic Attraction"
        },

        "Xanthate": {
            recovery: 26,
            mechanism: "Weak Adsorption"
        },

        "Sulfonate": {
            recovery: 44,
            mechanism: "Surface Complexation"
        }
    },

    "Galena": {
        "Hydroxamate": {
            recovery: 61,
            mechanism: "Surface Complexation"
        },

        "Fatty Acid": {
            recovery: 18,
            mechanism: "Weak Adsorption"
        },

        "Amine": {
            recovery: 22,
            mechanism: "Weak Adsorption"
        },

        "Xanthate": {
            recovery: 96,
            mechanism: "Chemisorption"
        },

        "Sulfonate": {
            recovery: 31,
            mechanism: "Weak Adsorption"
        }
    },

    "Chalcopyrite": {
        "Hydroxamate": {
            recovery: 72,
            mechanism: "Surface Complexation"
        },

        "Fatty Acid": {
            recovery: 21,
            mechanism: "Weak Adsorption"
        },

        "Amine": {
            recovery: 25,
            mechanism: "Weak Adsorption"
        },

        "Xanthate": {
            recovery: 98,
            mechanism: "Chemisorption"
        },

        "Sulfonate": {
            recovery: 34,
            mechanism: "Weak Adsorption"
        }
    }
};

function runSimulation() {

    const mineral =
        document.getElementById("mineral").value;

    const collector =
        document.getElementById("collector").value;

    const result =
        recoveryDatabase[mineral][collector];

    document.getElementById(
        "recovery"
    ).textContent =
        result.recovery + "%";

    document.getElementById(
        "mechanism"
    ).textContent =
        result.mechanism;
}

window.addEventListener(
    "DOMContentLoaded",
    runSimulation
);

function searchPapers(query) {

    query =
        query.toLowerCase();

    const cards =
        document.querySelectorAll(
            ".paper-card"
        );

    cards.forEach(card => {

        const text =
            card.textContent.toLowerCase();

        if (
            text.includes(query)
        ) {

            card.style.display =
                "block";

        } else {

            card.style.display =
                "none";
        }
    });
}

function saveFavorite(paperId) {

    let favorites =
        JSON.parse(
            localStorage.getItem(
                "favorites"
            )
        ) || [];

    if (
        !favorites.includes(
            paperId
        )
    ) {

        favorites.push(
            paperId
        );

        localStorage.setItem(
            "favorites",
            JSON.stringify(
                favorites
            )
        );
    }
}

function loadFavorites() {

    return JSON.parse(
        localStorage.getItem(
            "favorites"
        )
    ) || [];
}

function filterLiterature() {

    const mineral =
        document.getElementById(
            "literatureMineral"
        )?.value;

    const collector =
        document.getElementById(
            "literatureCollector"
        )?.value;

    console.log(
        mineral,
        collector
    );
}

function generateRecoveryCurve() {

    const points = [

        30,
        55,
        82,
        79,
        61

    ];

    console.log(
        points
    );

    return points;
}
