# MCP Vue3 React Bridge

这个工具允许设计师和开发者将设计稿（目前支持Figma）转换为Vue3或React组件。

## 功能特点

- 支持从Figma导入设计数据
- 支持将设计转换为Vue3组件
- 支持不同的样式适配器（PostCSS Mixins，CSS变量，SCSS变量）
- 自动生成组件属性和事件
- 配置灵活，易于扩展
- 可作为Cursor编辑器的MCP插件使用

## 安装

```bash
# 使用npm安装
npm install

# 构建项目使用
npm run build
```

## 使用方法

### 将Figma设计转换为Vue3组件

```typescript
import { convertDesignToVue3 } from 'mcp-vue3-react-bridge';

// 将设计转换为Vue3组件
const outputPath = await convertDesignToVue3(
  'YOUR_FIGMA_FILE_ID',  // Figma文件ID
  './output/components'  // 输出目录
);

console.log(`组件已生成: ${outputPath}`);
```

### 命令行使用

```bash
# 使用命令行
npm run start YOUR_FIGMA_FILE_ID ./output/components
```

## 配置

配置文件位于`config/framework-mapping.yaml`，可以自定义不同框架的模板和样式适配器：

```yaml
vue3:
  componentTemplate: "templates/vue-component.mustache"
  styleAdapter: "postcss-mixins"
react: 
  componentTemplate: "templates/react-component.mustache"
  styleAdapter: "styled-components"
```

## 在Cursor中使用

### 安装为Cursor MCP插件

1. 在GitHub上发布项目
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/您的用户名/mcp-vue3-react-bridge.git
   git push -u origin master
   ```

2. 在Cursor编辑器中添加MCP
   - 打开Cursor编辑器
   - 进入设置 > MCP集成
   - 选择"从GitHub安装" 
   - 输入仓库地址：`https://github.com/您的用户名/mcp-vue3-react-bridge`
   - 按照向导完成安装

### 本地开发

1. 启用Cursor开发者模式
   - 进入设置 > 开发者选项
   - 启用"开发者模式"

2. 添加本地MCP
   - 进入设置 > MCP集成
   - 选择"添加本地MCP"
   - 选择项目根目录
   - 完成配置

3. 使用MCP
   - 在编辑器中，使用命令面板(Ctrl+Shift+P)
   - 输入"将Figma设计转换为Vue3组件"
   - 按照提示操作

### 配置Cursor MCP

在Cursor中，您可以通过设置界面配置MCP的以下选项：

- **样式格式**：选择生成的样式格式(CSS, SCSS, LESS)
- **包含属性**：是否自动生成组件属性
- **包含事件**：是否自动生成组件事件

## 开发指南

1. 克隆存储库
2. 安装依赖: `npm install`
3. 修改代码
4. 构建项目: `npm run build`
5. 运行测试: `npm test`

## 扩展

### 添加新的设计工具支持

1. 创建一个新的处理器类，继承自`DesignProcessor`
2. 实现`extractDesignData`和`generateComponentData`方法
3. 在`index.ts`中导出新的处理器

### 添加新的框架支持

1. 创建一个新的适配器类，类似于`Vue3Adapter`
2. 在`config/framework-mapping.yaml`中添加新框架的配置
3. 在`index.ts`中添加相应的转换函数和导出

## 许可证

MIT 