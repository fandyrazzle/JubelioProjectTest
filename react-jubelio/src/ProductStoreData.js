import {observable} from 'mobx';

class ProductStoreData{
    @observable products=[];        
}
export default new ProductStoreData();
// const store = new ProductStoreData();
// export default store;