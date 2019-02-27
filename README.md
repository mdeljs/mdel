# mdel
[![npm package](https://img.shields.io/npm/v/mdel.svg?style=flat-square)](https://www.npmjs.org/package/mdel)

数据管理器

## 安装

* 安装：`npm install mdel --save`
* 下载：
  [开发版](https://github.com/yujingwyh/mdel/blob/master/umd/mdel.js) 
  [压缩版](https://github.com/yujingwyh/mdel/blob/master/umd/mdel.min.js)

## 使用

```javascript
import {Model} from 'mdel';

class UserModel extends Model{
    constructor(){
        super({
            uid:0
        });
    }
    login(){
        this.update({
            uid:1
        })
    }
}

const userStore = new UserModel();
const unSubscribe = userStore.subscribe(()=>{
    const prevUid = userStore.data.uid;

    return ()=>{
        if(prevUid === 0 && userStore.data.uid > 0){
          console.log('您已登录');
        }
    }
});
userStore.login();
unSubscribe();

```

* es5
```javascript
var Model = mdel.Model;
var userStore = createUserStore();

const unSubscribe = userStore.subscribe(()=>{
    const prevUid = userStore.data.uid;
          
    return ()=>{
        if(prevUid === 0 && userStore.data.uid > 0){
            console.log('您已登录');
        }
    }
});

userStore.login();
unSubscribe();

function createUserStore() {
  var model = new Model({
    uid:0
  });
  
  model.login = function(){
    model.update({
      uid:1
    });
  };
  
  return model;
}
```

## 在react中使用

详细文档 [链接](https://github.com/mdeljs/mdel-react)

* 类组件

```jsx harmony
///list-model.js
import {Model} from 'mdel';

export default class ListModel extends Model{
  constructor(){
      super({
        loading:false,
        list:[]
      })
  }
  setLoading(status){
      this.update({loading:status})
  }
  setData(data){
     this.update({
        loading:false,
        list:data
     }) 
  }  
}

///login-log.jsx
import React from 'react'
import {observe} from 'mdel-react'
import ListModel from '../model/list-model'

@observe
class UserLoginLog extends React.Component{
    sUser = userStore;
    sList = new ListModel();
    
    componentDidMount(){
        this.sList.setLoading(true);
        
        getRequest('/api/user....').then(
            data=>this.sList.setData(data),
            ()=>this.sList.setLoading(false)
        );
    }
    
    render(){
        if(this.sUser.data.uid < 1){
            return <div>你还没有登录</div>
        }
        
        if(this.sList.data.loading){
            return <div>loading</div>
        }
        return this.sList.data.list.map(function(item,index) {
          return <div key={index}>{item.date}</div>
        })
    }
}

export default UserLoginLog;

```

* 无状态组件

```jsx harmony
import React from 'react'
import {observe} from 'mdel-react'

const LoginLogList = observe(function({sUser,sList}) {
   if(sUser.data.uid < 1){
        return <div>你还没有登录</div>
   }
   
   if(sList.data.loading){
        return <div>loading</div>
   }     
   return sList.data.list.map(function(item,index) {
        return <div key={index}>{item.date}</div>
   })
});

class UserLoginLog extends React.Component{
     sUser = userStore;
     sList = new ListModel();
     
     render(){
         return <LoginLogList sUser={this.sUser} sList={this.sList}/>
     }
}

export default UserLoginLog;
```

## API

### Model
#### 语法

`const store = new Model(initData:object)`

数据模型

#### 实例属性

##### data

返回数据（只读）

* data的数据结构应该在初始的时候时确定

#### 实例方法

##### update

`model.update(data: (() => void) | object | null):void`

更新数据，你必须使用update来更新data

##### subscribe

`model.subscribe(listener: () => () => void):unSubscribe`

订阅数据的更新，返回取消订阅

* listener是一个函数，在update调用之前执行，并返回一个函数，在update调用之后执行

### getIsStore

#### 语法

`const isStore = getIsStore(target:any):boolean;`

获取是否是数据容器，也就是数据模型的实例

## License

[MIT](http://opensource.org/licenses/MIT)
