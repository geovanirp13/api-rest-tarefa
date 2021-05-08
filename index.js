const express = require('express');
const app = express();

app.use(express.json());

let regions = require('./db/regioes.json');
let ufs = require('./db/estados.json');

//Trazendo as Regiões delimitando por paginação
app.get('/regions', (req, res) => {
  let page = parseInt(req.query.page, 10) || 1;
  let limit = parseInt(req.query.limit, 10) || 10;
  let startIndex = (page - 1) * limit;
  let slice = regions.sort((a,b) => a.id - b.id)
                     .slice(startIndex, startIndex + limit);

  let count = regions.length;

  let response = {
      _metadata: {
          pagination: {
              page,
              limit,
              count,
          }
      },
      data: slice
  };

  res.set('Pagination-Count', count)
      .set('Pagination-Page', page)
      .set('Pagination-Limit', limit)
      .send(response);
});

//Trazendo os Estados delimitando por paginação
app.get('/ufs', (req, res) => {
  let page = parseInt(req.query.page, 10) || 1;
  let limit = parseInt(req.query.limit, 10) || 10;
  let startIndex = (page - 1) * limit;
  let slice = ufs.sort((a,b) => a.id - b.id)
                 .slice(startIndex, startIndex + limit);

  let count = ufs.length;

  let response = {
      _metadata: {
          pagination: {
              page,
              limit,
              count,
          }
      },
      data: slice
  };

  res.set('Pagination-Count', count)
      .set('Pagination-Page', page)
      .set('Pagination-Limit', limit)
      .send(response);
});

//Trazendo a Região pelo ID
app.get('/regions/:id', (req, res) => {
  let region = regions.find(region => region.id == req.params.id)

  if (!region) {
    res.status(404).send({
      error: 'Entity not found',
    });
    return;
  }
  res.send(region);
});

//Trazendo o Estado pelo ID
app.get('/ufs/:id', (req, res) => {
  let uf = ufs.find(uf => uf.id == req.params.id)

  if (!uf) {
    res.status(404).send({
      error: 'Entity not found',
    });
    return;
  }
  res.send(uf);
});

//Trazendo os Estaodos por Região
app.get('/regions/:id/ufs', (req, res) => {
  let region = regions.find(region => region.id == req.params.id); 
  if (!region) {
      res.status(404).send();
      return; 
  }
  let uf = ufs.filter(uf => uf.id_region == req.params.id);
  res.status(200).send(uf); 
});

app.listen(3001, () => console.log('Listening on port 3001'));

