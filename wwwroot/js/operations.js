// js/operations.js

// Map UI category label to backend enum string (JsonStringEnumConverter)
function mapCategoryLabelToEnum(categoryLabel) {
    switch (categoryLabel) {
        case "Length":
            return "Length";
        case "Weight":
            return "Weight";
        case "Volume":
            return "Volume";
        case "Temperature":
            return "Temperature";
        default:
            throw new Error(`Unsupported category: ${categoryLabel}`);
    }
}

function buildQuantityDto(categoryLabel, unit, value) {
    return {
        category: mapCategoryLabelToEnum(categoryLabel),
        unit: unit,
        value: value
    };
}

// Comparison
async function compareQuantities(firstDto, secondDto, token) {
    const body = { first: firstDto, second: secondDto };
    return await sendRequest("/quantities/compare", "POST", body, token);
}

// Conversion
async function convertQuantity(quantityDto, targetUnit, token) {
    const body = { quantity: quantityDto, targetUnit: targetUnit };
    return await sendRequest("/quantities/convert", "POST", body, token);
}

// Addition
async function addQuantities(firstDto, secondDto, resultUnit, token) {
    const body = { first: firstDto, second: secondDto, resultUnit: resultUnit };
    return await sendRequest("/quantities/add", "POST", body, token);
}

// Subtraction
async function subtractQuantities(firstDto, secondDto, resultUnit, token) {
    const body = { first: firstDto, second: secondDto, resultUnit: resultUnit };
    return await sendRequest("/quantities/subtract", "POST", body, token);
}

// Division
async function divideQuantities(firstDto, secondDto, token) {
    const body = { first: firstDto, second: secondDto };
    return await sendRequest("/quantities/divide", "POST", body, token);
}

// History: user-specific
async function fetchUserHistory(token) {
    return await sendRequest("/quantities/history/me", "GET", null, token);
}

// History: admin view for a specific userId
async function fetchAdminHistory(token, userId) {
    const path = `/quantities/history/user/${encodeURIComponent(userId)}`;
    return await sendRequest(path, "GET", null, token);
}