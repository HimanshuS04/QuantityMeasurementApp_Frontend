// js/main.js

document.addEventListener("DOMContentLoaded", () => {
    const authSection = document.getElementById("auth-section");
    const dashboardSection = document.getElementById("dashboard-section");
    const authMessageEl = document.getElementById("auth-message");
    const userEmailLabel = document.getElementById("user-email-label");
    const logoutButton = document.getElementById("logout-button");
    const globalMessage = document.getElementById("global-message");

    const typeCards = Array.from(document.querySelectorAll(".type-card"));
    const actionTabs = Array.from(document.querySelectorAll(".action-tab"));

    const comparisonPanel = document.getElementById("comparison-panel");
    const conversionPanel = document.getElementById("conversion-panel");
    const arithmeticPanel = document.getElementById("arithmetic-panel");

    const comparisonForm = document.getElementById("comparison-form");
    const conversionForm = document.getElementById("conversion-form");
    const arithmeticForm = document.getElementById("arithmetic-form");

    const comparisonResultValue = document.getElementById("comparison-result-value");
    const convertFromValueInput = document.getElementById("convert-from-value");
    const convertToValueInput = document.getElementById("convert-to-value");

    // History elements
    const loadMyHistoryButton = document.getElementById("load-my-history-button");
    const myHistoryContainer = document.getElementById("my-history-container");
    const adminHistorySection = document.getElementById("admin-history-section");
    const adminHistoryUserIdInput = document.getElementById("admin-history-user-id");
    const adminHistoryButton = document.getElementById("admin-history-button");
    const adminHistoryContainer = document.getElementById("admin-history-container");

    // Inputs and selects
    const compareFromValue = document.getElementById("compare-from-value");
    const compareToValue = document.getElementById("compare-to-value");
    const compareFromUnit = document.getElementById("compare-from-unit");
    const compareToUnit = document.getElementById("compare-to-unit");

    const convertFromUnit = document.getElementById("convert-from-unit");
    const convertToUnit = document.getElementById("convert-to-unit");

    const arithValue1 = document.getElementById("arith-value1");
    const arithValue2 = document.getElementById("arith-value2");
    const arithUnit1 = document.getElementById("arith-unit1");
    const arithUnit2 = document.getElementById("arith-unit2");
    const arithResultUnit = document.getElementById("arith-result-unit");
    const arithResultValue = document.getElementById("arith-result-value");

    // State
    let currentCategory = "Length";     // "Length", "Weight", "Volume", "Temperature"
    let currentAction = "Comparison";   // "Comparison", "Conversion", "Arithmetic"

    // ---------- Auth handling ----------

    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");

    function showDashboard() {
        authSection.classList.add("hidden");
        dashboardSection.classList.remove("hidden");
        userEmailLabel.textContent = getUserEmail() ? `Logged in as: ${getUserEmail()}` : "";
        refreshAdminVisibility();
    }

    function showAuth() {
        authSection.classList.remove("hidden");
        dashboardSection.classList.add("hidden");
    }

    function refreshAdminVisibility() {
        const isAdmin = isAdminToken();
        adminHistorySection.classList.toggle("hidden", !isAdmin);
    }

    // Decide initial view
    if (getToken()) {
        showDashboard();
    } else {
        showAuth();
    }

    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        authMessageEl.style.color = "#d32f2f";
        authMessageEl.textContent = "";
        const email = document.getElementById("login-email").value.trim();
        const password = document.getElementById("login-password").value;

        try {
            await login(email, password);
            userEmailLabel.textContent = `Logged in as: ${email}`;
            showDashboard();
        } catch (err) {
            authMessageEl.textContent = err.message || "Login failed.";
        }
    });

    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        authMessageEl.style.color = "#d32f2f";
        authMessageEl.textContent = "";
        const email = document.getElementById("register-email").value.trim();
        const password = document.getElementById("register-password").value;
        const confirm = document.getElementById("register-confirm-password").value;

        if (password !== confirm) {
            authMessageEl.textContent = "Password and confirm password do not match.";
            return;
        }

        try {
            await register(email, password);
            authMessageEl.style.color = "#2e7d32";
            authMessageEl.textContent = "Registration successful. Please login.";
        } catch (err) {
            authMessageEl.textContent = err.message || "Registration failed.";
        }
    });

    logoutButton.addEventListener("click", () => {
        clearToken();
        showAuth();
    });

    // ---------- Category & units ----------

    function getUnitsForCategory(category) {
        switch (category) {
            case "Length":
                return ["feet", "inch", "yard", "centimeter"];
            case "Weight":
                return ["kilogram", "gram", "pound"];
            case "Volume":
                return ["litre", "millilitre", "gallon"];
            case "Temperature":
                return ["celsius", "fahrenheit", "kelvin"];
            default:
                return [];
        }
    }

    function populateUnitSelect(selectElement, category) {
        const units = getUnitsForCategory(category);
        selectElement.innerHTML = "";
        units.forEach((u) => {
            const option = document.createElement("option");
            option.value = u;
            option.textContent = capitalizeFirst(u);
            selectElement.appendChild(option);
        });
    }

    function capitalizeFirst(str) {
        if (!str) return "";
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    function refreshUnitsForCurrentCategory() {
        populateUnitSelect(compareFromUnit, currentCategory);
        populateUnitSelect(compareToUnit, currentCategory);
        populateUnitSelect(convertFromUnit, currentCategory);
        populateUnitSelect(convertToUnit, currentCategory);
        populateUnitSelect(arithUnit1, currentCategory);
        populateUnitSelect(arithUnit2, currentCategory);
        populateUnitSelect(arithResultUnit, currentCategory);
    }

    refreshUnitsForCurrentCategory();

    typeCards.forEach((card) => {
        card.addEventListener("click", () => {
            typeCards.forEach((c) => c.classList.remove("active"));
            card.classList.add("active");
            currentCategory = card.dataset.category;
            refreshUnitsForCurrentCategory();
            clearResults();
        });
    });

    // ---------- Action tabs ----------

    function setAction(action) {
        currentAction = action;
        actionTabs.forEach((tab) => {
            tab.classList.toggle("active", tab.dataset.action === action);
        });

        comparisonPanel.classList.add("hidden");
        conversionPanel.classList.add("hidden");
        arithmeticPanel.classList.add("hidden");

        if (action === "Comparison") {
            comparisonPanel.classList.remove("hidden");
        } else if (action === "Conversion") {
            conversionPanel.classList.remove("hidden");
        } else if (action === "Arithmetic") {
            arithmeticPanel.classList.remove("hidden");
        }
        clearResults();
    }

    actionTabs.forEach((tab) => {
        tab.addEventListener("click", () => {
            setAction(tab.dataset.action);
        });
    });

    setAction("Comparison");

    function clearResults() {
        globalMessage.textContent = "";
        comparisonResultValue.textContent = "";
        convertToValueInput.value = "";
        arithResultValue.textContent = "";
    }

    // ---------- Comparison form ----------

    comparisonForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        clearResults();

        const token = getToken();
        if (!token) {
            globalMessage.textContent = "Please login first.";
            return;
        }

        const fromValue = parseFloat(compareFromValue.value);
        const toValue = parseFloat(compareToValue.value);
        if (Number.isNaN(fromValue) || Number.isNaN(toValue)) {
            globalMessage.textContent = "Enter valid numeric values.";
            return;
        }

        const fromUnit = compareFromUnit.value;
        const toUnit = compareToUnit.value;

        const firstDto = buildQuantityDto(currentCategory, fromUnit, fromValue);
        const secondDto = buildQuantityDto(currentCategory, toUnit, toValue);

        try {
            const response = await compareQuantities(firstDto, secondDto, token);
            comparisonResultValue.textContent = response.equal ? "True" : "False";
        } catch (err) {
            globalMessage.textContent = err.message || "Comparison failed.";
        }
    });

    // ---------- Conversion form ----------

    conversionForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        clearResults();

        const token = getToken();
        if (!token) {
            globalMessage.textContent = "Please login first.";
            return;
        }

        const fromValue = parseFloat(convertFromValueInput.value);
        if (Number.isNaN(fromValue)) {
            globalMessage.textContent = "Enter a valid numeric value.";
            return;
        }

        const fromUnit = convertFromUnit.value;
        const targetUnit = convertToUnit.value;

        const quantityDto = buildQuantityDto(currentCategory, fromUnit, fromValue);

        try {
            const response = await convertQuantity(quantityDto, targetUnit, token);
            if (response && response.result) {
                convertToValueInput.value = response.result.value;
            }
        } catch (err) {
            globalMessage.textContent = err.message || "Conversion failed.";
        }
    });

    // ---------- Arithmetic form (addition) ----------

    arithmeticForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        clearResults();

        const token = getToken();
        if (!token) {
            globalMessage.textContent = "Please login first.";
            return;
        }

        const v1 = parseFloat(arithValue1.value);
        const v2 = parseFloat(arithValue2.value);
        if (Number.isNaN(v1) || Number.isNaN(v2)) {
            globalMessage.textContent = "Enter valid numeric values.";
            return;
        }

        const unit1 = arithUnit1.value;
        const unit2 = arithUnit2.value;
        const resultUnit = arithResultUnit.value;

        const firstDto = buildQuantityDto(currentCategory, unit1, v1);
        const secondDto = buildQuantityDto(currentCategory, unit2, v2);

        try {
            // UC19: Arithmetic tab implements addition via /quantities/add
            const response = await addQuantities(firstDto, secondDto, resultUnit, token);
            if (response && response.result) {
                arithResultValue.textContent = response.result.value;
            }
        } catch (err) {
            // Temperature addition etc. will be blocked by backend as NotSupportedException
            globalMessage.textContent = err.message || "Arithmetic operation failed.";
        }
    });

    // ---------- History: User ----------

    loadMyHistoryButton.addEventListener("click", async () => {
        myHistoryContainer.innerHTML = "";
        const token = getToken();
        if (!token) {
            myHistoryContainer.textContent = "Please login first.";
            return;
        }

        try {
            const history = await fetchUserHistory(token);
            renderHistory(history || [], myHistoryContainer);
        } catch (err) {
            myHistoryContainer.textContent = err.message || "Failed to load history.";
        }
    });

    // ---------- History: Admin ----------

    adminHistoryButton.addEventListener("click", async () => {
        adminHistoryContainer.innerHTML = "";
        const token = getToken();
        if (!token) {
            adminHistoryContainer.textContent = "Please login first.";
            return;
        }

        const userId = adminHistoryUserIdInput.value.trim();
        if (!userId) {
            adminHistoryContainer.textContent = "Enter a user ID.";
            return;
        }

        try {
            const history = await fetchAdminHistory(token, userId);
            renderHistory(history || [], adminHistoryContainer);
        } catch (err) {
            adminHistoryContainer.textContent = err.message || "Failed to load admin history.";
        }
    });

    function renderHistory(history, container) {
        if (!Array.isArray(history) || history.length === 0) {
            container.textContent = "No history available.";
            return;
        }

        const table = document.createElement("table");
        table.className = "history-table";

        const thead = document.createElement("thead");
        thead.innerHTML = `
            <tr>
                <th>Category</th>
                <th>Operation</th>
                <th>First</th>
                <th>Second</th>
                <th>Result</th>
            </tr>`;
        table.appendChild(thead);

        const tbody = document.createElement("tbody");

        history.forEach((op) => {
            const tr = document.createElement("tr");

            const categoryText = op.category ?? "";
            const firstText = `${op.firstValue} ${op.firstUnit}`;
            const secondText = op.secondValue != null
                ? `${op.secondValue} ${op.secondUnit || ""}`
                : "";
            const resultText = op.resultValue != null
                ? `${op.resultValue} ${op.resultUnit || ""}`
                : "";

            tr.innerHTML = `
                <td>${categoryText}</td>
                <td>${op.operationType || ""}</td>
                <td>${firstText}</td>
                <td>${secondText}</td>
                <td>${resultText}</td>
            `;

            tbody.appendChild(tr);
        });

        table.appendChild(tbody);
        container.innerHTML = "";
        container.appendChild(table);
    }
    
});
