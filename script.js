document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("dataEntryForm");
    const dataTable = document.getElementById("dataTable").querySelector("tbody");
    const clearAllBtn = document.getElementById("clearAllBtn");
    let editIndex = -1; // To track if we are editing an entry

    // Load existing data from local storage
    loadData();

    form.addEventListener("submit", function(event) {
        event.preventDefault();

        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const phone = document.getElementById("phone").value;

        const dataEntry = { name, email, phone };

        if (editIndex === -1) {
            // Add new entry
            if (isDuplicateEntry(dataEntry)) {
                alert("Duplicate entry detected! Please use a unique name and email.");
                return;
            }
            saveData(dataEntry);
            addRowToTable(dataEntry);
            alert("Entry added successfully!");
        } else {
            // Edit existing entry
            editData(dataEntry);
            alert("Entry updated successfully!");
            editIndex = -1; // Reset index after editing
        }

        form.reset();
    });

    clearAllBtn.addEventListener("click", () => {
        if (confirm("Are you sure you want to clear all entries?")) {
            localStorage.removeItem("dataEntries");
            dataTable.innerHTML = ""; // Clear the table
            alert("All entries cleared!");
        }
    });

    function saveData(dataEntry) {
        let entries = JSON.parse(localStorage.getItem("dataEntries")) || [];
        entries.push(dataEntry);
        localStorage.setItem("dataEntries", JSON.stringify(entries));
    }

    function loadData() {
        const entries = JSON.parse(localStorage.getItem("dataEntries")) || [];
        entries.forEach(addRowToTable);
    }

    function addRowToTable(dataEntry) {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${dataEntry.name}</td>
            <td>${dataEntry.email}</td>
            <td>${dataEntry.phone}</td>
            <td>
                <button class="editBtn">Edit</button>
                <button class="deleteBtn">Delete</button>
            </td>
        `;
        dataTable.appendChild(row);

        // Add event listeners for edit and delete buttons
        row.querySelector(".editBtn").addEventListener("click", () => editEntry(dataEntry));
        row.querySelector(".deleteBtn").addEventListener("click", () => deleteEntry(dataEntry, row));
    }

    function isDuplicateEntry(dataEntry) {
        const entries = JSON.parse(localStorage.getItem("dataEntries")) || [];
        return entries.some(entry => entry.name === dataEntry.name && entry.email === dataEntry.email);
    }

    function editEntry(dataEntry) {
        editIndex = dataEntry; // Store the entry to edit
        document.getElementById("name").value = dataEntry.name;
        document.getElementById("email").value = dataEntry.email;
        document.getElementById("phone").value = dataEntry.phone;
    }

    function editData(updatedEntry) {
        let entries = JSON.parse(localStorage.getItem("dataEntries")) || [];
        const index = entries.findIndex(entry => entry.name === editIndex.name && entry.email === editIndex.email);
        if (index !== -1) {
            entries[index] = updatedEntry;
            localStorage.setItem("dataEntries", JSON.stringify(entries));
            refreshTable();
        }
    }

    function deleteEntry(dataEntry, row) {
        if (confirm("Are you sure you want to delete this entry?")) {
            let entries = JSON.parse(localStorage.getItem("dataEntries")) || [];
            entries = entries.filter(entry => entry.name !== dataEntry.name || entry.email !== dataEntry.email);
            localStorage.setItem("dataEntries", JSON.stringify(entries));
            row.remove(); // Remove the row from the table
            alert("Entry deleted successfully!");
        }
    }

    function refreshTable() {
        dataTable.innerHTML = ""; // Clear current table
        loadData(); // Reload data from local storage
    }
});
