const Hapi = require('@hapi/hapi');
const fs = require("fs");
const axios =require('axios');
var parseString = require('xml2js').parseString;
const {Client} = require('pg');

// Init Server
const server = new Hapi.Server({
  port: 8080,
  host:'localhost'
});

const connectionString = 'postgres://postgres:123456@localhost:5432/jubelio';
const client = new Client({
    connectionString: connectionString
});
client.connect();
var headersElevenia = {headers: {
    'openapikey':'721407f393e84a28593374cc2b347a98',
    'Content-type': 'application/xml',
    'Accept-Charset': 'utf-8'
}};

const getPrdDetails = (nomorPrd) => {
    return new Promise((resolve, reject) => {
        axios.get('http://api.elevenia.co.id/rest/prodservices/product/details/'+nomorPrd, headersElevenia)
        .then(response => {
            return resolve(response)
        })
        .catch(error => {
            return reject(error.message)
        })
    })
}

server.route({
    method: 'GET',
    path:'/SimpanToDB',
    handler: function(request, reply) {
        axios.get('http://api.elevenia.co.id/rest/prodservices/product/listing?page=1', headersElevenia)
        .then((response) => {
            parseString(response.data, { explicitArray : false, ignoreAttrs : true},  function (err, result) {
                let i=1;
                console.log("###########################################");
                (async ()=>{
                    
                    for(var item in result.Products.product) {
                        let nomorPrd=result.Products.product[item].prdNo;     
                        await getPrdDetails(nomorPrd).then((response2) => {     
                            parseString(response2.data, { explicitArray : false, ignoreAttrs : true},  function (err2, result2) {
                                let idPrd=result2.Product.prdNo;
                                let namaPrd=result2.Product.prdNm;
                                let SKU=result2.Product.sellerPrdCd;
                                let Harga=result2.Product.selPrc;  
                                let Gambar=result2.Product.prdImage01;

                                client.query('insert into barang ("Product_No", "SKU", "Nama_Product",  "Harga", "Gambar") values ($1, $2, $3, $4, $5)',[idPrd, SKU, namaPrd, Harga, Gambar])
                                .catch(e => console.error(e.stack));
                                //console.log(i+ "$$" + idPrd + "$$" + namaPrd+ "$$"+SKU+ "$$"+Harga);
                            });              
                            i++;
                        });
                    }                    
                })();
            });
        });
        return "getJSON2()";
    }
});
server.route({
    method: 'GET',
    path:'/AmbilDataDB',
    handler: function(request, reply) {

        return (()=>{
            return new Promise( function(resolve) {
                client.query('select * from barang')
                .then(
                   ( results) => {
                    resolve(results.rows);
                })
                .catch(e => console.error(e.stack));
            });
        })();
    }
});
server.route({
    method: 'POST',
    path:'/AmbilDataDBPerBarang',
    handler: function(request, reply) {
        return (()=>{
            return new Promise((resolve, reject) => {
                var payload = request.payload; 
                client.query('select * from barang where "ID"=$1',[payload.IDProduct])
                .then((results) => {
                    if (results.rows.length>0){
                        resolve(results.rows)
                    }else{
                        resolve("404");
                    }                    
                })
                .catch(e => console.error(e.stack));
            })        
        })();
    }
});
server.route({  
    method: 'POST',
    path: '/UpdateDetailBarang',
    handler: function (request, reply) {
        var a="";
        return (()=>{
            return new Promise((resolve, reject) => {
                var payload = request.payload; 
                client.query('update barang set "Product_No"=$1, "SKU"=$2, "Nama_Product"=$3, "Harga"=$4 where "ID"=$5 RETURNING *',[payload.ProductNo, payload.SKU, payload.NamaProduct, payload.HargaProd, payload.IDProduct])
                .then((results) => {
                    resolve(results.rows[0].ID)
                })
                .catch(e => console.error(e.stack));
            })        
        })();
        
        
    }
})
server.route({  
    method: 'POST',
    path: '/UpdateNamaGambar',
    handler: function (request, reply) {
        var a="";
        return (()=>{
            return new Promise((resolve, reject) => {
                var payload = request.payload; 
                client.query('update barang set "Gambar"=$1 where "ID"=$2 RETURNING *',[payload.Gambar, payload.IDProduct])
                .then((results) => {
                    resolve(results.rows[0].ID)
                })
                .catch(e => console.error(e.stack));
            })        
        })();        
    }
})


server.route({
    method: 'POST',
    path: '/submit',
    handler: (request, h) => {

        const data = request.payload;
        if (data.file) {
            const name = data.file.hapi.filename;
            const path = __dirname + "/uploads/" + name;
            const file = fs.createWriteStream(path);

            file.on('error', (err) => console.error(err));

            data.file.pipe(file);

            data.file.on('end', (err) => { 
                const ret = {
                    filename: data.file.hapi.filename,
                    headers: data.file.hapi.headers
                }
                return JSON.stringify(ret);
            })
        }
        return 'ok';
    },
    options: {
        payload: {
            output: 'stream',
            parse: true,
            allow: 'multipart/form-data'
        }
    }
});
server.route({  
    method: 'GET',
    path: '/gambar/{nameGambar}',
    handler: (request, h) => {
      // h.file() expects the file path as parameter
      return h.file('./uploads/'+request.params.nameGambar)
    }
  })

// Home Route
server.route({
    method:'GET',
    path:'/',
    handler: (request, reply) => {
        console.log("This is Home");
        return('Hello World');
        
    }
});



const bootUpServer = async () => {    
    await server.register({
        plugin: require('inert')
    });
    await server.start();    
    console.log(`Server is running at ${server.info.uri}`);
    process.on('unhandledRejection', (err) => {       
        console.log(err); 
        process.exit(1);    
    })
}
bootUpServer();
//$$IMPORTANT--------------------------------------------------------------------------------------------------------------------------
/*function getJSON(){
    // To make the function blocking we manually create a Promise.
    return new Promise( function(resolve) {
        axios.get(
                // 'http://api.elevenia.co.id/rest/prodservices/product/listing?page=1',
                'http://api.elevenia.co.id/rest/prodservices/product/details/28022696',
                {
                    headers: {
                        'openapikey':'721407f393e84a28593374cc2b347a98',
                        'Content-type': 'application/xml',
                        'Accept-Charset': 'utf-8'
                    }
                }
            )
            .then((response) => {     
                    parseString(response.data, { explicitArray : false, ignoreAttrs : true},  function (err, result) {

                        resolve (result);
                    });
                }
            );
    });

}
function getDetailPrd(nomorPrd, i){
    // return new Promise( function(resolve) {}); 
        axios.get('http://api.elevenia.co.id/rest/prodservices/product/details/'+nomorPrd, headersElevenia)
        .then((response2) => {     
            parseString(response2.data, { explicitArray : false, ignoreAttrs : true},  function (err2, result2) {
                let idPrd=result2.Product.prdNo;
                let namaPrd=result2.Product.prdNm;
                let SKU=result2.Product.sellerPrdCd;
                let harga=result2.Product.selPrc;
                
                //console.log(i+ "$$" + idPrd + "$$" + namaPrd+ "$$"+SKU+ "$$"+harga);    
            });                        
        });
       
    
    //return caller;
    // console.log(i); 
}
function getJSONAsync(nomorPrd){
    axios.get('http://api.elevenia.co.id/rest/prodservices/product/details/'+nomorPrd, headersElevenia);
}*/

//Back Up Code###########################################################################################################################
// server.route({  
//     method: 'POST',
//     path: '/UpdateFotoBarang',
//     config: {
//         payload: {
//             output: "stream",
//             parse: true,
//             allow: "multipart/form-data",
//             // maxBytes: 2 * 1000 * 1000
//         }
//     },
//     handler: function (request, reply) {
//         var result = [];
//         // for(var i = 0; i < request.payload["file"].length; i++) {
//         //     result.push(request.payload["file"][i].hapi);
//         //     request.payload["file"][i].pipe(fs.createWriteStream(__dirname + "/uploads/" + request.payload["file"][i].hapi.filename))
//         // }        
//         result.push(request.payload["file"].hapi);
//         request.payload["file"].pipe(fs.createWriteStream(__dirname + "/uploads/" + request.payload["file"].hapi.filename))

//         //response(result);
//         return "Uploaded";
//     }
// })

// server.route({  
//     method: 'POST',
//     path: '/UpdateFotoBarang',
//     config: {
//         handler: (request, h) => {
//           const payload = request.payload

          
    
//           console.log(payload)
    
//           return 'Received your data'
//         },
//         payload: {
//           maxBytes: 209715200,
//           output: 'file',
//           parse: true
//         }
//     }
// })


// const handleFileUpload = file => {
//     return new Promise((resolve, reject) => {
//       const filename = file.hapi.filename
//       const data = file._data
//       fs.writeFile('./uploads/' + filename, data, err => {
//         if (err) {
//           reject(err)
//         }
//         resolve({ message: 'Upload successfully!' })
//       })
//     })
//   }


// Dynamic Route
// server.route({
//     method:'GET',
//     path:'/user/{name}',
//     handler: (request, reply) => {
//         reply('Hello, '+request.params.name);
//     }
// });


// Start Server
// server.start((err) => {
//     if(err){
//         throw err;
//     }
//     console.log("jancok");
//     console.log(`Server started at: ${server.info.uri}`);
// });

// var nama = "";
// for(var item in result.Products.product) {
//     nama = nama + result.Products.product[item].prdNm + "##**##";
//     client.query("insert into barang (ID, SKU, nama_product) values ($1, $2, $3)",[1001, 'John'])
//     .then(results => console.table(results.rows))
//     .catch(e => console.log(e))
//     .finally(() => client.end());
// }
//############################################################################################################################################################

// client.connect()
// .then(() => client.query("select * from barang"))
// .then(results => console.table(results.rows))
// .catch(e => console.log(e))
// .finally(() => client.end())

// const client = new Client({
//     user: "postgres",
//     password: "123456",
//     host: "localhost",
//     port: 5432,
//     database: "jubelio"
// })


// const options = {
//     hostname: 'http://api.elevenia.co.id/rest/cateservice/category',
//     method: 'GET',
//     headers:{"openapikey":"721407f393e84a28593374cc2b347a98"}
// }
// const req = http.request(options, res => {
//     console.log(`statusCode: ${res.statusCode}`)          
//     res.on('data', d => {
//       process.stdout.write(d)
//     })
// })

//     req.on('error', error => {
//     console.error(error)
// })

// request({
//     headers: {
//        'openapikey':'721407f393e84a28593374cc2b347a98'
//     },
//     url: 'http://api.elevenia.co.id/rest/cateservice/category',
//     method: 'GET'
//     }, function (err, res, body) {
//         console.log("====================================");
// });

// const method = 'GET'; // GET, POST, PUT, DELETE
// const uri = 'http://api.elevenia.co.id/rest/cateservice/category';

// const wreck = Wreck.defaults({
//     headers: { 'openapikey':'721407f393e84a28593374cc2b347a98' },
//     agents: {
//         https: new Https.Agent({ maxSockets: 100 }),
//         http: new Http.Agent({ maxSockets: 1000 }),
//         httpsAllowUnauthorized: new Https.Agent({ maxSockets: 100, rejectUnauthorized: false })
//     }
// });

// axios({
//     method: 'get',
//     url: 'http://api.elevenia.co.id/rest/cateservice/category',
//     headers:{ 'openapikey':'721407f393e84a28593374cc2b347a98' },
//   })
//     .then(res =>{
//         console.log( res.data);
//     })
//     .catch(err => console.error(err));
//#################################
// axios.get(
//     'http://api.elevenia.co.id/rest/cateservice/category',
//     {
//         headers: {
//             'openapikey':'721407f393e84a28593374cc2b347a98'
//         }
//     }
//   )
//   .then((response) => {
//       //var response = response.data;
//       console.log(response.data);
//     },
//     (error) => {
//       var status = error.response.status
//     }
//   );



            
        // a = ( async(returnValue)=>{
        //     var payload = request.payload; 
        //     await client.query('update barang set "Product_No"=$1, "SKU"=$2, "Nama_Product"=$3, "Harga"=$4 where "ID"=$5 RETURNING *',[payload.ProductNo, payload.SKU, payload.NamaProduct, payload.HargaProd, payload.IDProduct])
        //     .then((results) => {
        //         returnValue="jancok";
        //     })
        //     .catch(e => console.error(e.stack));
        // })();
        // (async ()=>{
            
        //     var payload = request.payload;   // <-- this is the important line
        //     await client.query('update barang set "Product_No"=$1, "SKU"=$2, "Nama_Product"=$3, "Harga"=$4 where "ID"=$5',[payload.ProductNo, payload.SKU, payload.NamaProduct, payload.HargaProd, payload.IDProduct])
        //     .then(
        //         ( results) => {
        //          a=results;
        //     })
        //     .catch(e => console.error(e.stack));
        // })();