let father5 = {
  publicFriends: ['f', 'g'],
  name: 'f',
  sayFriend: function () {
    console.log('这是父类的方法');
    return this.privateFriends + this.publicFriends;
  }
};
let friend = 'a';
let son6 = Object.create(father5,{
  privateFriends: {
    configurable: true,
    enumerable: true,
    writable: true,
    value: ['g','h'],
  },
  sayFriend: {
    configurable: true,
    enumerable: true,
    get: () => {
      return friend;
    },
    set: (newValue) => {
      console.log(this.privateFriends);
      friend = newValue;
    },
  },
  // add: () => {  //未报错，但是无效，只能加数据属性和访问器属性
  //     console.log('新定义的方法');
  // }
});
console.log(son6);//{ privateFriends: [ 'g', 'h' ], sayFriend: [Getter/Setter] }
console.log(son6.prototype);//undefined (不是方法，没有该属性)
console.log(son6.__proto__);//{ publicFriends: [ 'f', 'g' ],name: 'f',
// sayFriend: [Function: sayFriend]

son6.sayFriend = 'z';
console.log(son6.sayFriend);  //undefined z (不知道为啥this.privateFriends是undefined)
console.log(son6.publicFriends); //[ 'f', 'g' ]

let son7 = Object.create(father5);
son6.publicFriends.push('l');
console.log(son7.publicFriends);  //[ 'f', 'g', 'l' ] (不同对象共享的属性和方法引用地址相同)
