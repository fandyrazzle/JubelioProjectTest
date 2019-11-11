import React, { Component } from 'react';
import './App.css';
import Product from './Product';
import { observer } from "mobx-react";
import ProductStoreData from './ProductStoreData';

@observer
class App extends Component {
  componentDidMount() {
    fetch('/AmbilDataDB', {
        headers : { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }  
      })
    .then(res => res.json())
    .then((products2) => {
        ProductStoreData.products=products2;
    });
  }
  render(){
    return (
      <>
        {
          ProductStoreData.products.map((products, i) =>
            <Product key={"keyProduct"+i} iNum={i} IDProduct={products.ID} />
          )
        }        
      </>
    );
  }  
}

export default App;
