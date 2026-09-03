import io
import json
import unittest
from pathlib import Path

from chat import EchoBackend, load_history, run_chat, save_history


class ChatTests(unittest.TestCase):
    def setUp(self) -> None:
        self.test_path = Path("test-output") / "history.json"
        self.test_path.parent.mkdir(exist_ok=True)

    def test_demo_backend_uses_latest_user_message(self) -> None:
        messages = [
            {"role": "user", "content": "第一句"},
            {"role": "assistant", "content": "回答"},
            {"role": "user", "content": "第二句"},
        ]
        self.assertIn("第二句", EchoBackend().reply(messages))

    def test_history_round_trip(self) -> None:
        messages = [{"role": "user", "content": "你好"}]
        save_history(self.test_path, messages)
        self.assertEqual(load_history(self.test_path), messages)
        payload = json.loads(self.test_path.read_text(encoding="utf-8"))
        self.assertIn("saved_at", payload)

    def test_chat_commands_and_auto_save(self) -> None:
        input_stream = io.StringIO("/help\n你好\n/quit\n")
        output_stream = io.StringIO()
        run_chat(EchoBackend(), self.test_path, input_stream, output_stream)
        output = output_stream.getvalue()
        self.assertIn("可用命令", output)
        self.assertIn("你好", output)
        self.assertEqual(load_history(self.test_path)[0]["content"], "你好")


if __name__ == "__main__":
    unittest.main()
