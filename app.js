window.addEventListener("DOMContentLoaded", () => {
    fillDayAndYearOptions();
    setEventListeners();
    displayEmployeePayrollData();
});

function fillDayAndYearOptions() {
    const day = document.querySelector("#day");
    const year = document.querySelector("#year");
    const currentYear = new Date().getFullYear();

    day.innerHTML = "";
    for (let i = 1; i <= 31; i++) {
        day.innerHTML += `<option value="${i}">${i}</option>`;
    }

    year.innerHTML = "";
    for (let i = currentYear; i >= currentYear - 5; i--) {
        year.innerHTML += `<option value="${i}">${i}</option>`;
    }
}

function setEventListeners() {
    const name = document.querySelector("#name");
    const nameError = document.querySelector("#nameError");
    const salary = document.querySelector("#salary");
    const salaryOutput = document.querySelector("#salaryOutput");
    const form = document.querySelector("#employeeForm");

    salaryOutput.textContent = salary.value;

    salary.addEventListener("input", () => {
        salaryOutput.textContent = salary.value;
    });

    name.addEventListener("input", () => {
        if (name.value.length === 0) {
            nameError.textContent = "";
            return;
        }
        try {
            const employeePayrollData = new EmployeePayrollData();
            employeePayrollData.name = name.value;
            nameError.textContent = "";
        } catch (e) {
            nameError.textContent = e;
        }
    });

    form.addEventListener("submit", save);
    form.addEventListener("reset", resetForm);
}

function save(event) {
    event.preventDefault();

    try {
        const employeePayrollData = createEmployeePayroll();
        createAndUpdateStorage(employeePayrollData);
        showMessage("Employee payroll data saved successfully.", "success");
        resetForm();
        displayEmployeePayrollData();
    } catch (e) {
        showMessage(e, "error");
    }
}

function createEmployeePayroll() {
    const employeePayrollData = new EmployeePayrollData();

    try {
        employeePayrollData.name = getInputValueById("#name");
    } catch (e) {
        setTextValue("#nameError", e);
        throw e;
    }

    const profilePic = getSelectedValues("input[name='profile']").pop();
    if (!profilePic) throw "Please select a profile image.";
    employeePayrollData.profilePic = profilePic;

    const gender = getSelectedValues("input[name='gender']").pop();
    if (!gender) throw "Please select gender.";
    employeePayrollData.gender = gender;

    const departments = getSelectedValues("input[name='department']");
    if (departments.length === 0) {
        setTextValue("#departmentError", "Please select at least one department.");
        throw "Please select at least one department.";
    }
    setTextValue("#departmentError", "");
    employeePayrollData.department = departments;

    employeePayrollData.salary = getInputValueById("#salary");
    employeePayrollData.note = getInputValueById("#notes");

    const date = getStartDate();
    try {
        employeePayrollData.startDate = date;
        setTextValue("#dateError", "");
    } catch (e) {
        setTextValue("#dateError", e);
        throw e;
    }

    return employeePayrollData;
}

function getStartDate() {
    const day = getInputValueById("#day");
    const month = getInputValueById("#month");
    const year = getInputValueById("#year");
    return `${day} ${month} ${year}`;
}

function createAndUpdateStorage(employeePayrollData) {
    let employeePayrollList = JSON.parse(localStorage.getItem("EmployeePayrollList"));

    if (employeePayrollList !== undefined && employeePayrollList !== null) {
        employeePayrollList.push(employeePayrollData);
    } else {
        employeePayrollList = [employeePayrollData];
    }

    localStorage.setItem("EmployeePayrollList", JSON.stringify(employeePayrollList));
}

function displayEmployeePayrollData() {
    const employeePayrollList = JSON.parse(localStorage.getItem("EmployeePayrollList")) || [];
    const tableBody = document.querySelector("#employeeTableBody");
    tableBody.innerHTML = "";

    employeePayrollList.forEach(employee => {
        const date = employee._startDate || employee.startDate || "";
        tableBody.innerHTML += `
            <tr>
                <td>${employee._name || employee.name}</td>
                <td>${employee._gender || employee.gender}</td>
                <td>${(employee._department || employee.department || []).join(", ")}</td>
                <td>${employee._salary || employee.salary}</td>
                <td>${date}</td>
                <td>${employee._note || employee.note || ""}</td>
            </tr>
        `;
    });
}

function resetForm() {
    setValue("#name", "");
    unsetSelectedValues("input[name='profile']");
    unsetSelectedValues("input[name='gender']");
    unsetSelectedValues("input[name='department']");
    setValue("#salary", "400000");
    setTextValue("#salaryOutput", "400000");
    setValue("#notes", "");
    setValue("#day", "1");
    setValue("#month", "January");
    setValue("#year", new Date().getFullYear().toString());
    setTextValue("#nameError", "");
    setTextValue("#departmentError", "");
    setTextValue("#dateError", "");
}

function getInputValueById(id) {
    return document.querySelector(id).value;
}

function getSelectedValues(propertyValue) {
    const allItems = document.querySelectorAll(propertyValue);
    const selectedItems = [];
    allItems.forEach(item => {
        if (item.checked) selectedItems.push(item.value);
    });
    return selectedItems;
}

function unsetSelectedValues(propertyValue) {
    const allItems = document.querySelectorAll(propertyValue);
    allItems.forEach(item => {
        item.checked = false;
    });
}

function setTextValue(id, value) {
    const element = document.querySelector(id);
    element.textContent = value;
}

function setValue(id, value) {
    const element = document.querySelector(id);
    element.value = value;
}

function showMessage(message, type) {
    const messageBox = document.querySelector("#message");
    messageBox.textContent = message;
    messageBox.className = type === "success" ? "success-msg" : "error-msg";

    setTimeout(() => {
        messageBox.textContent = "";
        messageBox.className = "";
    }, 3000);
}
