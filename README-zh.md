# Go学习微信小程序
 
- [English](README.md)
 
这款微信小程序是使用Taro+Typescript+React开发的。实现了在微信小程序中可以浏览Golang代码示例。

## 微信扫码使用

<p style="text-align:center;"><img style="width:180px;height:180px;" src="gh_f3733e7f5d77_344_12.jpg"></img><p>

## 开发

```shell
# 克隆到本地
git clone https://github.com/jackdon/gowx-miniapp.git

# yarn安装npm依赖
yarn

# 开发运行
yarn dev:weapp
```
> `yarn dev:weapp`会将原代码编译成小程序代码至`dist`中，使用[微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)导入项目即可预览。
 
### 小程序服务端
请查看: [gowxapi](https://github.com/jackdon/gowxapi)
 
## License
- [BSD 3-Clause License](LICENSE)
