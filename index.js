document.getElementById("buttonInput").addEventListener("click", function() {
    var inputText = document.getElementById("textInput").value;

    window.location.href = "Project1.html?input=" + encodeURIComponent(inputText);
})