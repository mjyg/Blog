describe('函数+1基本测试用例', function(){
    it('+1测试函数',function() {
        expect(window.add(1)).toBe(1);
        expect(window.add(2)).toBe(3);
    })
})