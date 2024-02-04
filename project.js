const image = document.querySelector("#image");
    const userName = document.querySelector("#userName");
    const userId = document.querySelector("#id");
    const githubLink = document.querySelector("#githubLink");

    // visitGithub = function () {};

    /* const requestUrl = "https://api.github.com/users/prateekbisht23";
    const xhr = new XMLHttpRequest();
    xhr.open("get", requestUrl);
    xhr.onreadystatechange = function () {
      console.log(xhr.readyState);
      if (xhr.readyState === 4) {
        const data = JSON.parse(this.responseText);
        console.log(typeof data);
        console.log(data.login);

        image.setAttribute("src", data.avatar_url);
        userName.innerHTML = data.login;
        userId.innerHTML += data.id;
        githubLink.setAttribute("href", data.html_url);
      }
    };
    // userName.addEventListener("click", visitGithub);

    xhr.send(); */

    // let data;

    /* async function takeInformation() {

        const response = await fetch("https://api.github.com/users/prateekbisht23")
        data = await response.json();


        console.log(typeof data);
        // console.log(data.login);

    } */

    fetch('https://api.github.com/users/prateekbisht23')
    .then( (response) => {
        return response.json()
    } )
    .then( (data) => {
        image.setAttribute("src", data.avatar_url);
        userName.innerHTML = data.login;
        userId.innerHTML += data.id;
        githubLink.setAttribute("href", data.html_url);
    } )
    .catch( (error) => {
        console.log(`ERROR: ${error}`);
    } )


    // takeInformation();