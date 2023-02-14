window.onload = (event) => {
    fetch('../dist/src/data.json')
    
        .then(response => response.json())
        .then(data => {
          console.log(data)
  
          // Ordena os objetos pelo ID numérico em ordem crescente
          data.sort((a, b) => a.id - b.id);
  
          const tableBody = document.querySelector('#table-body');
          
          data.forEach(item => {
            const row = tableBody.insertRow();
            row.insertCell().innerHTML = item.id;
            row.insertCell().innerHTML = item.cpu;
            row.insertCell().innerHTML = item.clock;
            row.insertCell().innerHTML = item.core;
            row.insertCell().innerHTML = item.threads;
            row.insertCell().innerHTML = `R$ ${item.price.toLocaleString()}`;
          });
        })
        .catch(error => {
          console.error(error);
        });
  };
  
  