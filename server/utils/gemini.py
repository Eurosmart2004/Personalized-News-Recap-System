from google import genai
from google.genai import types
from dotenv import load_dotenv
import os
load_dotenv()
client = genai.Client(api_key=os.getenv('GEMINI_API_KEY'))
class SynthesizeModel:
    def __init__(self):
        self.system_instruction = """# Mô tả yêu cầu
Tạo một bài báo tổng hợp dựa trên đoạn tóm tắt từ nhiều bài báo khác nhau. Nội dung cần được tổ chức theo các mục (heading) để đảm bảo bố cục rõ ràng, dễ đọc.

## Yêu cầu về nội dung
1. Phân tích thông tin: Đọc đoạn tóm tắt để xác định các chủ đề chính và thông tin quan trọng.
2. Cấu trúc bài viết: Chia nội dung thành các mục hợp lý để tạo sự liền mạch và dễ theo dõi.
3. Viết lại bằng ngôn ngữ tự nhiên: Không sao chép nguyên văn từ đoạn tóm tắt, mà diễn đạt lại theo cách mạch lạc và trung lập.
4. Tránh thiên vị: Tổng hợp thông tin từ nhiều nguồn một cách khách quan, không nghiêng về bất kỳ quan điểm nào.

## Yêu cầu về định dạng
1. Sử dụng markdown để tổ chức nội dung.
2. Dùng heading để chia rõ các phần trong bài. Sử dụng từ ngữ tự nhiên và dễ hiểu cho các heading.
3. In đậm các con số quan trọng và từ khóa để làm nổi bật dữ kiện chính.

## Độ dài bài viết
Bài báo có độ dài từ 700-800 từ, phù hợp với một bài tổng hợp tiêu chuẩn.

## Lưu ý
1. Không cần tiêu đề chính, chỉ sử dụng các mục trong bài làm heading.
2. Nếu có số liệu thay đổi hãy in đậm để nhấn mạnh.

## Kết quả
Bài viết tổng hợp (không bắt đầu bằng những từ như đây là kết quả hay sau đây là nội dung)"""

    def format_content(self, text: str) -> str:
        return text.replace("\\n", "\n")

    def invoke(self, data) -> str:
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            config=types.GenerateContentConfig(
                system_instruction=self.system_instruction),
            contents=[data['content']]
        )

        return self.format_content(response.text).strip()


class NameTitleModel:
    def __init__(self):
        self.system_instruction = """Hãy tạo 1 tiêu đề ngắn gọn và hấp dẫn cho bài báo dựa trên đoạn văn bản đã cung cấp. Tiêu đề nên phản ánh đúng nội dung chính và thu hút sự chú ý của độc giả.

# Steps

1. Đọc kỹ đoạn văn bản được cung cấp để nắm bắt nội dung chính và các điểm then chốt.
2. Xác định các từ khóa quan trọng thể hiện nội dung chính.
3. Sắp xếp lại các từ khóa để tạo thành tiêu đề ngắn gọn, dễ hiểu.
4. Đảm bảo tiêu đề phản ánh đúng nội dung và thu hút sự chú ý.

# Output Format

1 tiêu đề ngắn gọn"""

    def invoke(self, data) -> str:
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            config=types.GenerateContentConfig(
                system_instruction=self.system_instruction),
            contents=[data['content']]
        )

        return response.text.strip().replace("*", "").replace("#", "").replace("1.", "").strip()
