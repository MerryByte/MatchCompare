document.getElementById('pasteList1').addEventListener('input', function () {
    pasteData('list1');
    compareLists(); // Automatically compare lists after pasting data into list1
});

document.getElementById('pasteList2').addEventListener('input', function () {
    pasteData('list2');
    compareLists(); // Automatically compare lists after pasting data into list2
});

function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function pasteData(listId) {
    const pasteArea = document.getElementById(`paste${capitalizeFirstLetter(listId)}`);
    const tableBody = document.getElementById(listId).querySelector('tbody');

    if (!pasteArea || !pasteArea.value) {
        console.log(`No content to paste for ${listId}`);
        return;
    }

    const rows = pasteArea.value.split('\n').map(row => row.trim()).filter(row => row.length > 0);
    console.log(`Pasting ${rows.length} rows into ${listId}...`);

    rows.forEach(row => {
        const sanitizedRow = row.replace(/["\-\,]/g, '').replace(/\s+/g, ' ').trim();
        const parts = sanitizedRow.split(' ').map(cell => cell.trim()).filter(cell => cell.length > 0);

        const newRow = document.createElement('tr');

        if (listId === 'list1') {
            // If there's no item name, set it to empty
            const quantity = parts[0] || 1;
            const itemNumber = parts[1];
            const itemName = parts.slice(2).join(' ') || ''; // If no name, make it empty
            newRow.innerHTML = `
                <td><input type="number" value="${quantity}" placeholder="Quantity" /></td>
                <td><input type="text" value="${itemNumber}" placeholder="Item Number" /></td>
                <td><input type="text" value="${itemName}" placeholder="Item Name" /></td>
            `;
        } else if (listId === 'list2') {
            const quantity = parts[0] || 1; // Default quantity if missing
            const itemNumber = parts[1];
            const itemName = parts.slice(2).join(' ') || ''; // If no name, make it empty
            newRow.innerHTML = `
                <td><input type="number" value="${quantity}" placeholder="Quantity" /></td>
                <td><input type="text" value="${itemNumber}" placeholder="Item Number" /></td>
                <td><input type="text" value="${itemName}" placeholder="Item Name" /></td>
            `;
        }
        tableBody.appendChild(newRow);
    });

    pasteArea.value = '';
    console.log(`Pasted data into ${listId}`);
    compareLists(); // Trigger comparison after pasting data
}

function getTableData(tableId) {
    const table = document.getElementById(tableId);
    const rows = table.querySelectorAll('tbody tr');
    const data = [];

    rows.forEach(row => {
        if (tableId === 'list1') {
            const quantity = parseInt(row.cells[0].querySelector('input').value.trim(), 10) || 1;
            const itemNumber = row.cells[1].querySelector('input').value.trim();
            const itemName = row.cells[2].querySelector('input').value.trim() || ''; // Set empty if no name
            data.push({ quantity, itemNumber, itemName });
        } else if (tableId === 'list2') {
            const quantity = parseInt(row.cells[0].querySelector('input').value.trim(), 10) || 1;
            const itemNumber = row.cells[1].querySelector('input').value.trim();
            const itemName = row.cells[2].querySelector('input').value.trim() || ''; // Set empty if no name
            data.push({ quantity, itemNumber, itemName });
        }
    });

    return data;
}

function compareLists() {
    const list1Data = getTableData('list1');
    const list2Data = getTableData('list2');

    const duplicates = [];
    const list2Map = {};

    // Aggregate quantities by item number for list2
    list2Data.forEach(item => {
        const itemNumber = item.itemNumber;
        if (list2Map[itemNumber]) {
            list2Map[itemNumber].quantity += item.quantity;
        } else {
            list2Map[itemNumber] = { ...item };
        }
    });

    // Compare by itemNumber and add to duplicates if found
    list1Data.forEach(item1 => {
        if (list2Map[item1.itemNumber]) {
            duplicates.push({
                itemNumber: item1.itemNumber,
                itemName: item1.itemName,
                quantity: list2Map[item1.itemNumber].quantity
            });
        }
    });

    duplicates.sort((a, b) => a.itemNumber - b.itemNumber);
    displayResult(duplicates);
}

function displayResult(duplicates) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '';

    if (duplicates.length === 0) {
        resultDiv.textContent = 'No duplicates found.';
    } else {
        resultDiv.textContent = 'Duplicates found:';

        const table = document.createElement('table');
        table.classList.add('result-table');

        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr>
                <th>Total Quantity</th>
                <th>Item Number</th>
                <th>Item Name</th>
            </tr>
        `;
        table.appendChild(thead);

        const tbody = document.createElement('tbody');
        duplicates.forEach(dup => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${dup.quantity}</td>
                <td>${dup.itemNumber}</td>
                <td>${dup.itemName}</td>
            `;
            tbody.appendChild(row);
        });
        table.appendChild(tbody);
        resultDiv.appendChild(table);

        copyToClipboard(duplicates);
    }
}

document.getElementById('refreshBtn').addEventListener('click', function() {
    location.reload()
})

function copyToClipboard(duplicates) {
    const textToCopy = duplicates
        .map(dup => `${dup.quantity}\t${dup.itemNumber}\t${dup.itemName}`)
        .join('\n');

    navigator.clipboard.writeText(textToCopy).then(() => {
        console.log("Results copied to clipboard!");
    }).catch((err) => {
        console.error("Failed to copy to clipboard", err);
    });
}
