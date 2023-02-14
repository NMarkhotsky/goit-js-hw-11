fetch(
  'https://pixabay.com/api/?key=33634172-69812b587cbe0ba586ff0443e&q=flowers'
)
  .then(response => response.json())
  .then(({ hits }) => console.log(hits));
