# 安装指南

## 一键部署（推荐）

### Mac 系统
双击运行 `一键部署-MAC.command`

### Windows 系统  
双击运行 `一键部署-WIN.bat`

### 特性
- 全自动安装 Node.js、Chrome、项目依赖
- 自动配置网络访问权限
- 支持局域网多设备访问
- 零配置启动

### 快速启动（已部署用户）
- **Mac**: 双击 `start-mac.command`
- **Windows**: 双击 `start-windows.bat`

## 手动安装

### 环境要求

- Node.js 16+
- macOS/Windows/Linux 系统
- 至少 1GB 可用内存

### 快速开始

```bash
# 克隆仓库
git clone https://github.com/0xsongsu/cf-clearance-scraper.git
cd cf-clearance-scraper

# 安装依赖
npm install

# 启动服务
npm start
```

### hCaptcha 功能安装

如果需要使用hCaptcha解决功能，需要额外安装Python依赖：

```bash
# 进入hCaptcha解决器目录
cd captcha-solvers/hcaptcha

# 创建虚拟环境
python3 -m venv venv

# 激活虚拟环境
# Mac/Linux:
source venv/bin/activate
# Windows:
venv\Scripts\activate

# 安装依赖
pip install -e hcaptcha-challenger/

# 安装Playwright浏览器
playwright install chromium
```

### Docker 安装

```bash
# 克隆仓库
git clone https://github.com/0xsongsu/cf-clearance-scraper.git
cd cf-clearance-scraper

# 使用Docker Compose启动
docker-compose up -d
```

## 故障排除

### hCaptcha 相关问题

#### 1. **hcaptcha-challenger 未正确安装**
**错误**: `❌ hcaptcha-challenger 未正确安装`

**原因**: 项目包含了 hcaptcha-challenger 源代码，但未安装到 Python 虚拟环境

**解决方案**:
```bash
cd captcha-solvers/hcaptcha
source venv/bin/activate
pip install -e hcaptcha-challenger/
```

#### 2. **Playwright 浏览器缺失**
**错误**: `BrowserType.launch: Executable doesn't exist at /Users/.../ms-playwright/chromium_headless_shell-1169/chrome-mac/headless_shell`

**原因**: Playwright 包已安装但浏览器文件未下载

**解决方案**:
```bash
cd captcha-solvers/hcaptcha
source venv/bin/activate
playwright install chromium
```

#### 3. **Gemini API 密钥未配置**
**错误**: `hCaptcha solver failed with exit code 1` 或 `API密钥未配置或仍为示例值`

**原因**: `.env` 文件中的 `GEMINI_API_KEY` 还是示例值

**解决方案**:
1. 获取 Gemini API 密钥: https://aistudio.google.com/app/apikey
2. 编辑 `.env` 文件:
   ```
   GEMINI_API_KEY=你的真实API密钥
   ```
3. 重启服务

#### 4. **Python 虚拟环境问题**
**错误**: `❌ Python 虚拟环境不存在`

**解决方案**:
```bash
cd captcha-solvers/hcaptcha
python3 -m venv venv
source venv/bin/activate
pip install -e hcaptcha-challenger/
playwright install chromium
```

#### 5. **hCaptcha 解决超时**
**错误**: `hCaptcha solving timeout`

**可能原因及解决**:
- **网络连接问题**: 检查网络连接和代理设置
- **API 配额限制**: 检查 Gemini API 使用配额
- **超时设置过短**: 在 `.env` 中增加超时时间:
  ```
  HCAPTCHA_SOLVER_TIMEOUT=300000
  ```

### 环境配置问题

#### 1. **浏览器启动失败**
```bash
# 确保系统安装了必要的依赖
# macOS
brew install chromium

# Ubuntu/Debian
sudo apt-get install chromium-browser
```

#### 2. **Node.js版本过低**
```bash
# 使用nvm管理Node.js版本
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 20
nvm use 20
```

#### 3. **权限问题**
```bash
# Linux/Mac 给执行权限
chmod +x 一键部署-MAC.command
chmod +x start-mac.command
chmod +x deployment_check.sh
```

#### 4. **Python依赖安装失败**
```bash
# 更新pip
pip install --upgrade pip

# 使用国内镜像
pip install -e hcaptcha-challenger/ -i https://pypi.tuna.tsinghua.edu.cn/simple/
```

### 网络和服务问题

#### 1. **服务无法访问**
**错误**: `无法连接到服务`

**解决方案**:
1. 确认服务已启动: `npm start`
2. 检查端口配置 (默认 3000)
3. 检查防火墙设置:
   ```bash
   # macOS
   sudo pfctl -f /etc/pf.conf
   
   # Windows (管理员权限)
   netsh advfirewall firewall add rule name="CF Clearance Scraper" dir=in action=allow protocol=TCP localport=3000
   ```

#### 2. **局域网访问问题**
确保服务监听所有接口:
- 检查 `start.js` 中的监听地址设置
- 确保路由器/防火墙允许相应端口访问

### 完整诊断流程

如果遇到问题，建议按以下顺序排查：

#### 1. 运行部署自检
```bash
./tests/deployment_check.sh
```

#### 2. 查看详细错误
```bash
# 启动服务并查看详细日志
NODE_ENV=development npm start
```

#### 3. 运行完整测试
```bash
node tests/test_hcaptcha_deployment.js
```

#### 4. 快速功能测试
```bash
node tests/quick_test.js
```

### 常见错误代码

| 错误代码 | 含义 | 解决方案 |
|---------|------|----------|
| 400 | 请求参数错误 | 检查 websiteUrl 和 websiteKey 参数 |
| 500 | 服务器内部错误 | 检查日志，通常是配置或依赖问题 |
| 超时 | 请求处理超时 | 检查网络连接和服务器性能 |

### 获取帮助

如果以上解决方案都无法解决问题：

1. **查看日志**: 启动服务时的详细错误信息
2. **运行测试**: 使用测试脚本获取详细诊断信息
3. **提交 Issue**: 包含错误信息、系统信息和测试结果

### 性能优化建议

- **生产环境**: 推荐设置 `BROWSER_LIMIT=50-100`
- **开发环境**: 推荐设置 `BROWSER_LIMIT=5-10`
- **低内存设备**: 设置 `MAX_MEMORY_USAGE=256`

## 验证安装

安装完成后，可以使用以下方法验证：

### 快速验证

```bash
# 1. 运行部署自检
./tests/deployment_check.sh

# 2. 启动服务
npm start

# 3. 快速功能测试
node tests/quick_test.js
```

### 详细验证

```bash
# 完整环境和功能测试
node tests/test_hcaptcha_deployment.js

# 查看监控面板
open http://localhost:3000/monitor

# 检查服务健康状态
curl http://localhost:3000/monitor
```

### 远程验证

```bash
# 从其他机器测试部署的服务
node tests/quick_test.js --host 192.168.1.100 --port 3000
```

### 验证成功标志

✅ **部署自检通过**: 所有环境配置正确  
✅ **服务启动正常**: 可以访问监控面板  
✅ **hCaptcha 测试成功**: 能够解决验证码并返回有效 token  

如果以上三个条件都满足，说明部署完全成功！

## 下一步

- 📖 查看 [配置指南](CONFIGURATION.md)
- 🔧 查看 [API文档](API.md)
- 🤖 查看 [hCaptcha使用指南](HCAPTCHA.md)
- 📊 查看 [监控指南](MONITORING.md)