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

const userModel = new UserModel();
const unSubscribe = userModel.subscribe(()=>{
    const prevUid = userModel.data.uid;

    return ()=>{
        if(prevUid === 0 && userModel.data.uid > 0){
          console.log('您已登录');
        }
    }
});
userModel.login();
unSubscribe();

```

* es5
```javascript
var Model = mdel.Model;
var userModel = createUserModel();

const unSubscribe = userModel.subscribe(()=>{
    const prevUid = userModel.data.uid;
          
    return ()=>{
        if(prevUid === 0 && userModel.data.uid > 0){
            console.log('您已登录');
        }
    }
});

userModel.login();
unSubscribe();

function createUserModel() {
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
  async getData(page){
      this.setLoading(true);
      const data = await getRequest('/api/user....');
      
      this.update({
        loading:false,
        list:data
      })
  }
}

///login-log.jsx
import {observe} from 'mdel-react'
import ListModel from '../model/list-model'

@observe
class UserLoginLog extends React.Component{
    mUser = userModel;
    mList = new ListModel();
    
    componentDidMount(){
        this.mList.getData(1);
    }
    
    render(){
        if(this.mUser.data.uid < 1){
            return <div>你还没有登录</div>
        }
        if(this.mList.data.loading){
            return <div>loading</div>
        }
        
        return this.mList.data.list.map(function(item,index) {
          return <div key={index}>{item.date}</div>
        })
    }
}

export default 

```

* 无状态组件

## API

### 语法

`const model = new Model(initData:object)`

数据模型

### 实例属性

#### data

返回数据（只读）

* data的数据结构应该在初始的时候时确定

### 实例方法

#### update

`model.update(data: (() => void) | object | null):void`

更新数据，你必须使用update来更新data

#### subscribe

`model.subscribe(listener: () => () => void):unSubscribe`

订阅数据的更新，返回取消订阅

* listener是一个函数，在update调用之前执行，并返回一个函数，在update调用之后执行

## License

[MIT](http://opensource.org/licenses/MIT)
