import { 
    db, auth, collection, addDoc, getDocs, query, where, serverTimestamp, onAuthStateChanged 
} from "./firebase.js";

import { Timestamp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js"; // Firestore Timestamp

// Function to add grocery item
async function addItem(event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const expiry = document.getElementById("expiry").value; // Format: YYYY-MM-DD

    console.log("Adding item:", name, expiry);

    const user = auth.currentUser;
    if (!user) {
        console.error("User is not logged in. Cannot add item.");
        document.getElementById("status").innerText = "Please log in to add items.";
        return;
    }

    try {
        // Convert expiry date to Firestore Timestamp
        const expiryDateTimestamp = Timestamp.fromDate(new Date(expiry));

        // Add the grocery item to Firestore under the logged-in user's collection
        await addDoc(collection(db, "users", user.uid, "groceries"), {
            name: name,
            expiryDate: expiryDateTimestamp,  
            addedAt: serverTimestamp() // Server timestamp for when the item is added
        });

        document.getElementById("status").innerText = "Item added successfully!";
        event.target.reset(); // Reset the form
        getItems(); // Refresh the items list
    } catch (error) {
        console.error("Error adding item:", error);
        document.getElementById("status").innerText = "Error adding item. Check console for details.";
    }
}

// Function to fetch and display all grocery items
async function getItems() {
    const user = auth.currentUser;
    if (!user) {
        console.warn("User not logged in. Cannot fetch items.");
        return;
    }

    console.log("Fetching all items...");
    const itemsContainer = document.getElementById("items-list-body");

    if (!itemsContainer) return;

    itemsContainer.innerHTML = ""; // Clear previous entries

    try {
        const querySnapshot = await getDocs(collection(db, "users", user.uid, "groceries"));

        if (querySnapshot.empty) {
            itemsContainer.innerHTML = "<tr><td colspan='3'>No items available.</td></tr>";
            return;
        }

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const expiryDate = data.expiryDate.toDate();
            const status = getStatus(expiryDate);

            const itemRow = document.createElement("tr");
            itemRow.innerHTML = `
                <td>${data.name}</td>
                <td>${expiryDate.toISOString().split('T')[0]}</td>
                <td class="${status.class}">${status.text}</td>
            `;
            itemsContainer.appendChild(itemRow);
        });
    } catch (error) {
        console.error("Error fetching items:", error);
    }
}

// Function to fetch and display expired items
async function getExpiredItems() {
    const user = auth.currentUser;
    if (!user) {
        console.warn("User not logged in. Cannot fetch expired items.");
        return;
    }

    console.log("Fetching expired items...");
    const today = new Date();
    const expiredItemsContainer = document.getElementById("expired-items-list-body");

    if (!expiredItemsContainer) return;

    expiredItemsContainer.innerHTML = ""; // Clear previous entries

    try {
        const querySnapshot = await getDocs(collection(db, "users", user.uid, "groceries"));

        if (querySnapshot.empty) {
            expiredItemsContainer.innerHTML = "<tr><td colspan='3'>No expired items found.</td></tr>";
            return;
        }

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const expiryDate = data.expiryDate.toDate();

            if (expiryDate < today) {
                const expiredRow = document.createElement("tr");
                const status = getStatus(expiryDate);
                expiredRow.innerHTML = `
                    <td>${data.name}</td>
                    <td>${expiryDate.toISOString().split('T')[0]}</td>
                    <td class="${status.class}">${status.text}</td>
                `;
                expiredItemsContainer.appendChild(expiredRow);
            }
        });
    } catch (error) {
        console.error("Error fetching expired items:", error);
    }
}

// Function to determine the status of the item
function getStatus(expiryDate) {
    const today = new Date();
    const status = { text: "", class: "" };

    if (expiryDate > today) {
        status.text = "Fresh";
        status.class = "status-fresh";
    } else if (expiryDate.toISOString().split('T')[0] === today.toISOString().split('T')[0]) {
        status.text = "Expiring Today";
        status.class = "status-expiring";
    } else {
        status.text = "Expired";
        status.class = "status-expired";
    }

    return status;
}

// Ensure items are fetched on page load & check authentication
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("User logged in:", user.uid);
        if (document.getElementById("items-list-body")) getItems();
        if (document.getElementById("expired-items-list-body")) getExpiredItems();
    } else {
        console.log("No user logged in.");
        document.getElementById("status").innerText = "Please log in to manage groceries.";
    }
});

// Attach event listener to form
document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("add-item-form")) {
        document.getElementById("add-item-form").addEventListener("submit", addItem);
    }
});

