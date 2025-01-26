document.getElementById("buttonInput").addEventListener("click", function() {
    const username = document.getElementById("textInput").value.trim();
    
    if (!username) {
        alert('Please enter a GitHub username');
        return;
    }
    
    // Navigate to profile page with the username
    window.location.href = "src/html/profile.html?username=" + encodeURIComponent(username);
});