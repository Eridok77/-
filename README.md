# DeepSeek 聊天程序

一个最小可用的命令行聊天程序，使用 DeepSeek Chat Completions API。

## 环境要求

- Python 3.9+
- DeepSeek API Key

## 配置

设置环境变量：

```bash
export DEEPSEEK_API_KEY="你的_api_key"
```

可选环境变量：

- `DEEPSEEK_BASE_URL`（默认：`https://api.deepseek.com`）
- `DEEPSEEK_MODEL`（默认：`deepseek-chat`）

## 使用

```bash
python /home/runner/work/-/-/deepseek_chat.py
```

输入问题后按回车即可得到回复，输入 `exit` 或 `quit` 结束程序。