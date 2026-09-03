import json
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ.get("DEEPSEEK_API_KEY"),
    base_url="https://api.deepseek.com"
)

def reply_to(message, system_text):
    if system_text == "":
        return "助手：我收到了：" + message

    return "助手 (系统设定: " + system_text + ") : 我收到了：" + message

def save_messages(messages):
    with open("messages.json", "w", encoding="utf-8") as file:
        json.dump(messages, file, ensure_ascii=False, indent=2)

def load_messages():
    try:
        with open("messages.json", "r", encoding="utf-8") as file:
            return json.load(file)

    except FileNotFoundError:
        pass

    return []

system_text =""
messages = load_messages()

for item in messages:
    if item["role"] == "system":
        system_text = item["content"]
        break

while True:
    message = input("你：").strip()

    if message == "":
        print("消息不能为空")
        continue

    if message == "/system" or message.startswith("/system "):
        system_text = message[len("/system"):].strip()

        if system_text == "":
            print("用法: /system <内容>")
            continue

        system_found = False

        for item in messages:
            if item["role"] == "system":
                item["content"] = system_text
                system_found = True
                break

        if system_found == False:
            messages.insert(0, {
                "role": "system",
                "content": system_text
            })

        print("系统消息内容是:" + system_text)
        continue

    if message == "/quit":
        break

    if message == "/help":
        print("可用命令：/help /count /quit")
        continue

    if message == "/count":
        print("当前一共收到" + str(len(messages)) + "条消息")
        continue

    if message == "/history":
        print("历史消息：")

        for index, item in enumerate(messages,start=1):
            print(str(index) + ". " + item["content"])
        continue

    if message == "/save":
        save_messages(messages)
        print("历史消息已保存")
        continue

    if message == "/clear":
        messages.clear()
        system_text = ""
        save_messages(messages)
        print("历史消息已清空")
        continue

    messages.append({
        "role": "user",
        "content": message
    })

    reply = reply_to(message, system_text)

    messages.append({
        "role": "assistant",
        "content": reply
    })

    print(reply)

save_messages(messages)

print("本次一共收到" + str(len(messages)) + "条消息")
