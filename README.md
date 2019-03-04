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
        this.change({
            uid:1
        })
    }
}

const userStore = new UserModel();
const unSubscribe = userStore.subscribe(function(){
    const prevUid = userStore.data.uid;

    return function(){
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

const unSubscribe = userStore.subscribe(function(){
    const prevUid = userStore.data.uid;
          
    return function(){
        if(prevUid === 0 && userStore.data.uid > 0){
            console.log('您已登录');
        }
    }
});

userStore.login();
unSubscribe();

function createUserStore() {
  var store = new Model({
    uid:0
  });
  
  store.login = function(){
    store.change({
      uid:1
    });
  };
  
  return store;
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
      this.change({loading:status})
  }
  setData(data){
     this.change({
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

`const store = new Model(initData:object,name?:string = '')`

数据模型

#### 实例属性

##### name
返回名称（只读），在构造时定义

##### data

返回数据（只读）

* 建议data的数据结构在初始的时候时确定
* typescript中可通过泛型来约束data 
` class UserModel extends Model<IData>{}`

#### 实例方法

##### change

`model.change(data: Partial<D> = {},mode:('update' | 'set') = 'update'):void`

修改数据，你必须使用change来修改data

##### subscribe

`model.subscribe(listener: () => () => void):unSubscribe`

订阅数据的修改，返回取消订阅

* listener是一个函数，在change调用之前执行，并返回一个函数，在change调用之后执行

### getIsStore

#### 语法

`const isStore = getIsStore(target:any):boolean;`

获取是否是数据容器，也就是数据模型的实例

## License

[MIT](http://opensource.org/licenses/MIT)
