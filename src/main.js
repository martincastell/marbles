require("file-loader?name=index.html!./index.html");

if (module.hot) {
  module.hot.accept();
}

var hello = document.getElementById("hello");
hello.innerHTML = "Hello World!";
