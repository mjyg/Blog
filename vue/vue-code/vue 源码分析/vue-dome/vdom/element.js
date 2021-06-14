class Element {
    constructor(tagName, attrs, children) {
        this.tagName = tagName;
        this.attrs = attrs;
        this.children = children || [];
    }
    //把一个虚拟的dom节点渲染成一个真实的dom节点
    render() {
        let element = document.createElement(this.tagName);
        //额外的属性放在当前dom节点上
        // for (let attr in this.attrs) {
        //     setAttr(element, attr, this.attrs[attr]);
        // }
        //先序深度遍历
        this.children.forEach(child => {
            //如果当前这个节点是元素的话 字符串创建一个文本节点
            let childElement = (child instanceof Element) ? child.render():document.createTextNode(child);
            element.appendChild(childElement);
        });
        return element;
    }
}
function createElement(agName, attrs, children) {
    return new Element(agName, attrs, children);
}
