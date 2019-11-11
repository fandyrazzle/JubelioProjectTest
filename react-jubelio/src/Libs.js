import axios from 'axios';

function UpdateDetailBarang(parseData){
    return new Promise((resolve)=>{   
      return axios({
        method: 'post',
        url: '/UpdateDetailBarang',
        data:parseData
      }).then((response)=>{        
        resolve(response.data);
      });
     });

}
function UpdateGambaBarang(parseData){
  return new Promise((resolve)=>{   
    return axios({
      method: 'post',
      url: '/UpdateNamaGambar',
      data:parseData
    }).then((response)=>{        
      resolve(response.data);
    });
   });
}
function SelectDetailBarang(parseData){
  return new Promise((resolve)=>{   
    return axios({
      method: 'post',
      url: '/AmbilDataDBPerBarang',
      data:parseData
    }).then((response)=>{        
      resolve(response.data);
    });
   });
}


export  {UpdateDetailBarang, SelectDetailBarang, UpdateGambaBarang};

//   {
//     NamaProduct: this.state.InputNamaProductState,
//     SKU: this.state.InputSKUState,
//     HargaProd: this.state.InputHargaProdState,
//     ProductNo: this.state.InputProductNoState,
//     IDProduct: this.props.IDProduct
//   }

    // console.log("aaaaa");
    // return axios({
    //     method: 'post',
    //     url: '/UpdateDetailBarang',
    //     data:parseData
    //   })
    //   .then((response)=>{return response.data;})
    //   .catch(
    //    (error) => {
    //     console.log(error);
    //   });