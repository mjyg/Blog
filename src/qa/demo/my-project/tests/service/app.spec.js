// const axios = require('axios')
const superagent = require('supertest')
const app = require('./app')
function request(){
    return superagent(app.listen())
}
describe('NodeUii 自动化脚本',function(){
    it('获取后台接口数据', function(done){
        request()
            .get('/')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res){
                if (err) {
                    done(new Error('请求出错'));
                } else {
                    console.log(res.body);
                    if (res.body.data == 'jie') {
                        done();
                    } else {
                        done(new Error('请求数据出错'));
                    }
                }
            })

    })
    it('404容错脚本', function(done){
        request().get('/user').expect(404, done)
    })
})