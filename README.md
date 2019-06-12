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
const unSubscribe = userStore.subscribe(function(){
    if(userStore.data.uid > 0 && userStore.prevData.uid === 0){
        console.log('您已登录');
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
    if(userStore.data.uid > 0 && userStore.prevData.uid === 0){
        console.log('您已登录');
    }
});

userStore.login();
unSubscribe();

function createUserStore() {
  var store = new Model({
    uid:0
  });
  
  store.login = function(){
    store.update({
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
    
    async componentDidMount(){
        this.sList.setLoading(true);
        
        try{
            const data = await getRequest('/api/user....');
            
            this.sList.setData(data)
        }
        catch (e) {
          this.sList.setLoading(false)
        }
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

`const store = new Model(initData:object,name?:string = '')`

数据模型

#### 实例属性

##### name
返回名称（只读），在构造时定义

##### data
返回数据（只读）

* 建议data的数据结构在初始的时候时确定
* typescript中可通过泛型来约束data  
```typescript
class UserModel extends Model<IData>{}
```

##### prevData
返回更新前的数据（只读）

#### 实例方法

##### update

```typescript
interface IUpdate {
  (data: Partial<D>):void
}
```

修改数据，你必须使用update来修改data  
* 先设置this.data到this.prevData,然后 **浅拷贝** 数据容器更新前的data对象

##### subscribe

```typescript
interface ISubscribe {
  (listener: () => void):IUnSubscribe
}
```

订阅数据的修改，返回取消订阅



### getIsStore

```typescript
interface IGetIsStore {
  (target:any):boolean
}
```

获取是否是数据容器，也就是数据模型的实例

## License

[MIT](http://opensource.org/licenses/MIT)
