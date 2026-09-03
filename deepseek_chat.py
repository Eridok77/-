import json
import os
import sys
import urllib.error
import urllib.request


def _read_required_env(name: str) -> str:
    value = os.getenv(name, "").strip()
    if not value:
        raise RuntimeError(f"Missing required environment variable: {name}")
    return value


def chat_completion(
    user_input: str,
    api_key: str,
    model: str = "deepseek-chat",
    base_url: str = "https://api.deepseek.com",
) -> str:
    url = f"{base_url.rstrip('/')}/v1/chat/completions"
    payload = {
        "model": model,
        "messages": [{"role": "user", "content": user_input}],
    }
    request = urllib.request.Request(
        url=url,
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Content-Type": "application/json",
            "Authorization": "Bearer " + api_key,
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(request, timeout=60) as response:
            response_data = json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="ignore")
        raise RuntimeError(f"DeepSeek API request failed: {exc.code} {detail}") from exc
    except urllib.error.URLError as exc:
        raise RuntimeError(f"Failed to connect DeepSeek API: {exc.reason}") from exc

    choices = response_data.get("choices")
    if not choices:
        raise RuntimeError(f"Unexpected response: {response_data}")
    message = choices[0].get("message", {})
    content = message.get("content", "")
    if not content:
        raise RuntimeError(f"Empty response content: {response_data}")
    return content


def main() -> int:
    try:
        api_key = _read_required_env("DEEPSEEK_API_KEY")
    except RuntimeError as exc:
        print(str(exc), file=sys.stderr)
        return 1

    model = os.getenv("DEEPSEEK_MODEL", "deepseek-chat")
    base_url = os.getenv("DEEPSEEK_BASE_URL", "https://api.deepseek.com")

    print("DeepSeek chat started. Type 'exit' or 'quit' to stop.")
    while True:
        try:
            user_input = input("You: ").strip()
        except (KeyboardInterrupt, EOFError):
            print("\nBye.")
            return 0

        if not user_input:
            continue
        if user_input.lower() in {"exit", "quit"}:
            print("Bye.")
            return 0

        try:
            answer = chat_completion(user_input, api_key=api_key, model=model, base_url=base_url)
        except RuntimeError as exc:
            print(f"Error: {exc}", file=sys.stderr)
            continue

        print(f"DeepSeek: {answer}")


if __name__ == "__main__":
    raise SystemExit(main())
