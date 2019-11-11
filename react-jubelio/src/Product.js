import React, { Component } from 'react';
import axios from 'axios';
import { UpdateDetailBarang, SelectDetailBarang, UpdateGambaBarang} from './Libs';

class Product extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editing : false,
      SelectedFile:null,
      GambarState:'',
      NamaProductState: '',
      SKUState: '',
      HargaProdState: '',
      ProductNoState: '',
      InputNamaProductState: '',
      InputSKUState: '',
      InputHargaProdState: '',
      InputProductNoState: '',
      counter:0
    };
    this.edit = this.edit.bind(this);
    this.save = this.save.bind(this);
    this.cancel = this.cancel.bind(this);
    this.onChange = this.onChange.bind(this);    
    this.onChangeInputFile = this.onChangeInputFile.bind(this);
    this.fileUploadHandler = this.fileUploadHandler.bind(this);
  }
  componentDidMount(){
    this.LoadDataDBViewMode({IDProduct:this.props.IDProduct});
  }
  cancel() {
    this.setState({
        editing: false
    })
  };
  edit() {
    this.setState({
        editing: true
    })
  };
  save(){      
    UpdateDetailBarang({
      NamaProduct: this.state.InputNamaProductState,
      SKU: this.state.InputSKUState,
      HargaProd: this.state.InputHargaProdState,
      ProductNo: this.state.InputProductNoState,
      IDProduct: this.props.IDProduct
    });
    this.LoadDataDBViewMode({IDProduct:this.props.IDProduct});
  }
  LoadDataDBViewMode(){      
    const responDB = SelectDetailBarang({
      IDProduct: this.props.IDProduct
    });
    responDB.then((resultnya)=>{
      this.setState({
        NamaProductState : resultnya[0].Nama_Product,
        SKUState : resultnya[0].SKU,
        HargaProdState : resultnya[0].Harga,
        ProductNoState : resultnya[0].Product_No,
        GambarState : resultnya[0].Gambar,
        InputNamaProductState : resultnya[0].Nama_Product,
        InputSKUState : resultnya[0].SKU,
        InputHargaProdState : resultnya[0].Harga,
        InputProductNoState : resultnya[0].Product_No,
        editing:false
      })
    });      
  }

  onChange(e) {
    if (e.target.id === 'tBoxNamaProduct' + this.props.iNum) {
        this.setState({ InputNamaProductState: e.target.value });
    } else if (e.target.id === 'tBoxSKU' + this.props.iNum) {
        this.setState({ InputSKUState: e.target.value });
    } else if (e.target.id ==='tBoxHarga' + this.props.iNum) {
        this.setState({ InputHargaProdState: e.target.value });
    } else if (e.target.id === 'tBoxProductNo' + this.props.iNum) {
        this.setState({ InputProductNoState: e.target.value});    
    }
    console.log(e.target.value);
  }
  onChangeInputFile(e){
    this.setState({
      SelectedFile: e.target.files[0]
    })
  }
  fileUploadHandler(){
    const fd = new FormData();
    fd.append('file', this.state.SelectedFile);
    axios.post('/submit', fd).then(
      ()=>{
        UpdateGambaBarang({
          Gambar: 'http://localhost:8080/gambar/'+this.state.SelectedFile.name,
          IDProduct: this.props.IDProduct
        }).then(()=>{
          this.LoadDataDBViewMode({IDProduct:this.props.IDProduct});
        });
      }
    );
    
    
  }
  renderCardMode() {
    if (this.state.editing === false) 
      return (
        <div className="container">
          <div >
            <h4><b>Name : {this.state.NamaProductState}</b></h4>
          </div>
          <div >
            <p>SKU : {this.state.SKUState}</p>
          </div>
          <div >  
            <p>Harga : {this.state.HargaProdState}</p>
          </div>
          <div >      
            <p>Product No : {this.state.ProductNoState}</p>
          </div>
          <button onClick={this.edit}>Edit</button>
        </div>
      )
    else {
      return (
        <div className="container">
          <h4><b>Name : <input type="text" value={this.state.InputNamaProductState} id={'tBoxNamaProduct'+this.props.iNum} onChange={this.onChange.bind(this)} /></b></h4>
          <p>SKU : <input type="text" value={this.state.InputSKUState} id={'tBoxSKU'+this.props.iNum} onChange={this.onChange.bind(this)}/></p>
          <p>Harga : <input type="text" value={this.state.InputHargaProdState} id={'tBoxHarga'+this.props.iNum} onChange={this.onChange.bind(this)}/></p>
          <p>Product No : <input type="text" value={this.state.InputProductNoState} id={'tBoxProductNo'+this.props.iNum} onChange={this.onChange.bind(this)}/></p>  
          <button onClick={this.save}>Save</button> <button onClick={this.cancel}>Cancel</button>
        </div>
       ) 
    }
  }
  render() {

    return (        
      <>
        {
          <div className="card inline-block-class">
            <img src={this.state.GambarState} style={{"width":"100%"}} alt={"Foto Product ID"+this.props.IDProduct}/>
            <input type="file" onChange={this.onChangeInputFile}/><button onClick={this.fileUploadHandler}>Upload</button>
            {this.renderCardMode()}
          </div>
        }            
      </>
    );
  }
}

export default Product;
