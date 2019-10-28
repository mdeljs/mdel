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
        this.setData({
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
    store.setData({
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
      this.setData({loading:status})
  }
  setData(data){
     this.setData({
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

```typescript
const store = new Model(initData:object)
```

数据模型

#### 实例属性

##### data
返回数据（只读）

* 必须使用 **setData** 方法来修改data
* 建议data的数据结构在初始的时候时确定
* typescript中可通过泛型来约束data  
```typescript
class UserModel extends Model<IData>{}
```

##### prevData
返回修改前的数据（只读）

#### 实例方法

##### setData

```typescript
interface ISetData {
  (data: Partial<D>):void
}
```

设置数据，会 **浅拷贝** 到实例data中

##### subscribe

```typescript
interface ISubscribe {
  (listener: () => void):IUnSubscribe
}
```

订阅数据的修改，返回取消订阅


## 更新日志

### 6.0.0
1. 废弃getIsStore，建议用 instanceof 判断
2. 废弃constructor中name参数

### 5.0.0
1. 新增prevData,取消subscribe中prevData参数
2. 新增setData方法,废弃change方法

## License

[MIT](http://opensource.org/licenses/MIT)
