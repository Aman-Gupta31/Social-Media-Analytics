
// // Wait for the DOM to be fully loaded before executing the code
// document.addEventListener('DOMContentLoaded', () => {
//     // Get references to the HTML elements
//     const postIdInput = document.getElementById('postIdInput');
//     const textContentTextarea = document.getElementById('textContentTextarea');
//     const analysisResultDiv = document.getElementById('analysisResultDiv');

//     // Function to handle the creation of a new post
//     window.handleCreatePost = async () => {
//         // Retrieve values from input fields
//         const postId = postIdInput.value;
//         const textContent = textContentTextarea.value;

//         try {
//             // Send a POST request to create a new post
//             const response = await fetch('http://localhost:3001/api/v1/posts', {
//                 method: 'POST',
//                 body: JSON.stringify({
//                     id: postId,
//                     textContent
//                 }),
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//             });

//             // Parse the response JSON
//             const data = await response.json();

//             // Display success message and log the created post data
//             alert('Post created successfully!');
//             console.log('Created Post:', data);
//         } catch (error) {
//             // Display an error message if the post creation fails
//             alert('Failed to create post');
//             console.error('Error creating post:', error);
//         }
//     };

//     // Function to handle the retrieval of post analysis
//     window.handleGetAnalysis = async () => {
//         // Retrieve the post ID from the input field
//         const postId = postIdInput.value;

//         try {
//             // Send a GET request to retrieve post analysis
//             const response = await fetch(`http://localhost:3001/api/v1/posts/${postId}/analysis`);
//             const data = await response.json();

//             // Update the UI with the analysis result and log the data
//             setAnalysisResult(data);
//             console.log('Analysis Result:', data);
//         } catch (error) {
//             // Display an error message if analysis retrieval fails
//             alert('Failed to get analysis');
//             console.error('Error getting analysis:', error);
//         }
//     };

//     // Function to set the analysis result in the UI
//     function setAnalysisResult(result) {
//         analysisResultDiv.innerHTML = `<h2>Analysis Result</h2>
//       <p>Word Count: ${result.wordCount}</p>
//       <p>Average Word Length: ${result.averageWordLength}</p>`;
//     }
// });

document.addEventListener('DOMContentLoaded', () => {
    const postIdInput = document.getElementById('postIdInput');
    const textContentTextarea = document.getElementById('textContentTextarea');
    const analysisResultDiv = document.getElementById('analysisResultDiv');

    window.handleCreatePost = async () => {
        const postId = postIdInput.value;
        const textContent = textContentTextarea.value;

        try {
            const response = await fetch('http://localhost:3001/api/v1/posts', {
                method: 'POST',
                body: JSON.stringify({
                    id: postId,
                    textContent
                }),
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            const data = await response.json();

            alert('Post created successfully!');
            console.log('Created Post:', data);
        } catch (error) {
            alert('Failed to create post');
            console.error('Error creating post:', error);
        }
    };

    window.handleGetAnalysis = async () => {
        const postId = postIdInput.value;

        try {
            const response = await fetch(`http://localhost:3001/api/v1/posts/${postId}/analysis`);
            const data = await response.json();

            setAnalysisResult(data);
            console.log('Analysis Result:', data);
        } catch (error) {
            alert('Failed to get analysis');
            console.error('Error getting analysis:', error);
        }
    };

    function setAnalysisResult(result) {
        analysisResultDiv.innerHTML = `<h2>Analysis Result</h2>
      <p>Word Count: ${result.wordCount}</p>
      <p>Average Word Length: ${result.averageWordLength}</p>`;
    }
});

