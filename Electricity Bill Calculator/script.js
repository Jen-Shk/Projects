document.addEventListener("DOMContentLoaded", () => {
    const electricityForm = document.querySelector("#electricityForm");

    electricityForm.addEventListener("submit", function(event) {
        event.preventDefault();

        // Get form elements
        const mcbAmphere = document.querySelector("#mcb-Amphere").value;
        const meterReading = document.querySelector("#meterReading").value.trim();
        const previousReading = document.querySelector("#previousReading").value.trim();
        const meterReadingError = document.querySelector("#meterReadingError");
        const previousReadingError = document.querySelector("#previousReadingError");

        // Reset error messages
        meterReadingError.textContent = "";
        previousReadingError.textContent = "";

        // Validate inputs
        if (meterReading === "") {
            meterReadingError.textContent = "Meter reading cannot be empty";
            return;
        }

        if (previousReading === "") {
            previousReadingError.textContent = "Previous reading cannot be empty";
            return;
        }

        const consumption = parseInt(meterReading) - parseInt(previousReading);
        if (consumption < 0) {
            previousReadingError.textContent = "Previous reading must be less than meter reading";
            return;
        }

        // Calculate total amount
        const totalAmount = calculateTotalBill(mcbAmphere, consumption);

        // Display total bill and unit
        document.querySelector("#totalUnit").textContent = `Total Unit consumed: ${consumption} KWh`;
        document.querySelector("#totalAmount").textContent = `Total Amount: NPR ${totalAmount}`;

    });
});

/**
 * Function to get service charge based on MCB Amphere
 */
function getServiceCharge(mcbAmphere, consumption) {
    const serviceChargeRates = {
        "5": [30, 50, 75, 100, 125, 150, 175],
        "15": [50, 75, 100, 125, 150, 175, 200],
        "30": [75, 100, 125, 150, 175, 200, 225],
        "60": [125, 150, 175, 200, 225, 250, 275]
    };

    return determineCharge(serviceChargeRates[mcbAmphere], consumption);
}

/**
 * Function to get energy charge based on MCB Amphere
 */
function getEnergyCharge(mcbAmphere, consumption) {
    const energyChargeRates = {
        "5": [3, 7, 8.5, 10, 11, 12, 13],
        "15": [4, 7, 8.5, 10, 11, 12, 13],
        "30": [5, 7, 8.5, 10, 11, 12, 13],
        "60": [6, 7, 8.5, 10, 11, 12, 13]
    };

    return determineCharge(energyChargeRates[mcbAmphere], consumption);
}

/**
 * Function to determine the appropriate charge based on consumption range
 */
function determineCharge(rateArray, consumption) {
    if (consumption <= 20) return rateArray[0];
    if (consumption <= 30) return rateArray[1];
    if (consumption <= 50) return rateArray[2];
    if (consumption <= 150) return rateArray[3];
    if (consumption <= 250) return rateArray[4];
    if (consumption <= 400) return rateArray[5];
    return rateArray[6]; // Above 400
}

/**
 * Function to calculate total electricity bill
 */
function calculateTotalBill(mcbAmphere, consumption) {
    const serviceCharge = getServiceCharge(mcbAmphere, consumption);
    const energyCharge = getEnergyCharge(mcbAmphere, consumption);

    return serviceCharge + (consumption * energyCharge);
}
