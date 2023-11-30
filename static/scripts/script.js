// Initial state - Landing Page
document.body.innerHTML = `
    <div class="container">
        <h1>
            Gen AI Notetaking 
            <span class="logo-container">
                <img src="${logoUrl}" alt="Gen AI Logo">
            </span>
        </h1>
        <button onclick="goToUpload()">Get Started</button>
    </div>
`;

function goToUpload() {
    // Change the state to the file upload page
    document.body.innerHTML = `
        <div class="container file-upload">
            <h1>File Upload</h1>
            <label for="file1">Choose Script:  </label>
            <input type="file" id="file1" accept=".txt" required><br>
            <label for="file2">Choose Slides:</label>
            <input type="file" id="file2" accept=".txt" required><br>
            <button onclick="generateAndDisplay()">Generate</button>
        </div>
    `;
}

function generateAndDisplay() {
    const file1 = document.getElementById('file1').files[0];
    const file2 = document.getElementById('file2').files[0];

    if (file1 && file2) {
        const formData = new FormData();
        formData.append('file1', file1);
        formData.append('file2', file2);

        fetch('/process', {
            method: 'POST',
            body: formData
        })
        .then(response => response.text())
        .then(data => {
            console.log('Received data from server:', data);

            // Create a container div for the generated content
            const container = document.createElement('div');
            container.className = 'container generated-notes';

            // Create and append the elements to the container
            const h1 = document.createElement('h1');
            h1.innerText = 'Generated Notes';
            container.appendChild(h1);

            const scrollableContainer = document.createElement('div');
            scrollableContainer.className = 'scrollable-container';

            const scrollableText = document.createElement('p');
            scrollableText.className = 'scrollable-text';
            scrollableText.innerText = data;
            scrollableContainer.appendChild(scrollableText);

            container.appendChild(scrollableContainer);

            const buttonContainer = document.createElement('div');
            buttonContainer.className = 'button-container';

            const downloadButton = document.createElement('button');
            downloadButton.innerText = 'Download';
            downloadButton.onclick = function () {
                downloadMergedFile(data);
            };

            const backButton = document.createElement('button');
            backButton.innerText = 'Back';
            backButton.onclick = goToUpload;

            buttonContainer.appendChild(downloadButton);
            buttonContainer.appendChild(backButton);

            container.appendChild(buttonContainer);

            // Append the container to the body
            document.body.innerHTML = ''; // Clear existing content
            document.body.appendChild(container);
        })
        .catch(error => console.error('Error:', error));
    } else {
        alert('Please upload both files.');
    }
}



function downloadMergedFile(content) {
    // Create a Blob with the combined content
    const blob = new Blob([content], { type: 'text/plain' });

    // Create a link element and trigger a download
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'merged_file.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
