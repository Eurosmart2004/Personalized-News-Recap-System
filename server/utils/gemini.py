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

class SummarizeModel:
    def __init__(self):
        self.system_instruction = """Tóm tắt cần các yếu tố chính của bài báo viết lại thành đoạn văn, nhấn mạnh những thông tin cần thiết, đặc biệt là số liệu quan trọng, trong 2 đến 3 câu.
# Steps
1. Đọc kỹ bài báo để hiểu nội dung chính và các thông tin quan trọng.
2. Xác định các số liệu hoặc sự kiện nổi bật cần được đưa vào tóm tắt để làm nổi bật thông điệp chính của bài báo.
3. Viết đoạn tóm tắt 4 đến 5 câu, tập trung vào các thông tin cốt lõi và số liệu quan trọng.
4. Sử dụng ngôn ngữ sinh động, hấp dẫn để người đọc muốn khám phá tiếp nội dung của bài báo.
5. Viết tóm tắt dưới dạng một đoạn văn liền mạch, không sử dụng liệt kê hay mở đầu bằng cụm từ như 'Bài báo này nói về ..., Dưới đây là đoạn tóm tắt về ...'.

# Output Format
1. Đoạn văn ngắn 4 đến 5 câu.
2. Sử dụng ngôn ngữ tự nhiên và có sức thu hút.
3. Phải thể hiện được thông tin chính của bài báo một cách ngắn gọn và nhấn mạnh vào các số liệu hoặc sự kiện nổi bật.
4. không sử dụng liệt kê hay mở đầu bằng cụm từ như 'Bài báo này nói về ..., Dưới đây là đoạn tóm tắt về ...'.  
# Notes
Giữ đúng tinh thần và ngôn ngữ của bài báo gốc ({language}), tránh làm mất đi sắc thái nội dung ban đầu."""

        self.user_prompt = """Hãy tóm tắt bài viết sau, đưa ra câu trả lời không sử dụng liệt kê hay mở đầu bằng cụm từ như 'Bài báo này nói về ...,
        
        {content}"""

        self.few_shot = [
                    {
                        "role": "user",
                        "content": """Microsoft và Shell mua khoảng 20 triệu tín chỉ carbon trong năm ngoái, nhiều nhất thế giới, theo báo cáo của AlliedOffsets.

Tín chỉ carbon (carbon credit) là một loại giấy phép hoặc chứng chỉ có thể giao dịch, giá trị mua bán và cung cấp cho người nắm giữ tín chỉ quyền phát thải một tấn CO2 hoặc loại khí thải khác nằm trong danh sách khí thải nhà kính.

Theo báo cáo thị trường tín chỉ carbon tự nguyện 2024 và xu hướng 2025 của Công ty nghiên cứu thị trường và dữ liệu AlliedOffsets, Shell và Microsoft đã mua hàng triệu tín chỉ với mức giá chênh nhau tới 45 lần, do những khác nhau về nguồn gốc, chất lượng.

Shell mua 14,5 triệu tín chỉ trong năm qua, giá trung bình 4,15 USD mỗi tCO2. Khoản chi bù trừ của công ty nhiên liệu này tập trung vào các dự án năng lượng tái tạo và trồng rừng, hướng tới phát thải ròng bằng 0 (Net Zero) vào 2050.

Logo Microsoft tại triển lãm MWC ở Barcelona tháng 2/2023. Ảnh:Lưu Quý

Hãng công nghệ Microsoft mua 5,5 triệu tín chỉ carbon, nhưng giá trung bình lên tới 189 USD mỗi tCO2 (CO2 tương đương), tập trung vào các dự án loại bỏ carbon trực tiếp (CDR). Phần lớn trong số đó là giải pháp thu và lưu trữ carbon - một loại công nghệ mới nổi và đắt đỏ, có khả năng đưa phát thải carbon xuống mức âm.

Gần 80% tín chỉ carbon Microsoft mua trong 2024 đến từ các dự án trên, với giao dịch lớn nhất là 3,3 triệu từ công ty năng lượng Stockholm Exergi của Thụy Điển. Dù trong giai đoạn sơ khai, công nghệ này được giới chuyên gia kỳ vọng đóng vai trò quan trọng để toàn cầu đạt mục tiêu Net Zero. Thách thức lớn nhất trong giao dịch loại tín chỉ này là giá, có thể lên tới 389 USD cho mỗi tCO2.

Nguồn: AlliedOffsets

Thực tế, trên thị trường tín chỉ carbon tự nguyện, giá trung bình của mỗi tín chỉ giảm do dư cung quá mức, theo báo cáo của AlliedOffsets. Theo dữ liệu tổng hợp từ 25 tổ chức và chương trình cấp chứng nhận carbon cho lượng tín chỉ không bán được sau khi phát hành tiếp tục tăng, phần lớn là loại theo cơ chế phát triển sạch (CDM).

Xét từng loại tín chỉ, NBS (giải pháp phát hành tín chỉ dựa vào bảo tồn thiên nhiên) tiếp tục tăng, giá trung bình 20 USD mỗi tCO2.

Nguồn: AlliedOffsets

Phân khúc tín chỉ CDR (giải pháp loại bỏ trực tiếp CO2) ghi nhận lượng giao dịch trên sổ đăng ký trong năm qua nhiều hơn bao giờ hết, dù số công ty tham gia cung cấp tín chỉ không tăng. Phân khúc này được ví là sân chơi của "Microsoft và những người bạn", khi công ty công nghệ này chiếm 57% lượng giao dịch trên thị trường. Tính trung bình, cứ 6-7 công ty cung ứng tín chỉ sẽ có một đơn vị mua.

Tín chỉ từ các dự án trồng rừng thuộc chương trình REDD+ (cơ chế quốc tế nhằm giảm phát thải carbon từ rừng) hạ giá, dù lượng mua tăng do nhiều doanh nghiệp chuyển đổi từ tín chỉ năng lượng tái tạo.

Nhóm tác giả báo cáo của AlliedOffsets dự báo tín chỉ từ các dự án năng lượng tái tạo và REDD+ tiếp tục mất giá khoảng 20% vào 2040. Trong khi tín chỉ từ các giải pháp loại bỏ carbon dựa trên tự nhiên (than sinh học biocha và trồng rừng mới, tái tạo rừng, phục hồi thảm thực vật) sẽ thu hút nhiều bên mua trong tương lai."""
                    },
                    {
                        "role": "model",
                        "content": "Microsoft và Shell đã mua khoảng 20 triệu tín chỉ carbon trong năm ngoái, đứng đầu thế giới theo báo cáo của AlliedOffsets. Shell mua 14,5 triệu tín chỉ với giá trung bình 4,15 USD mỗi tCO2, tập trung vào năng lượng tái tạo và trồng rừng, trong khi Microsoft chi số tiền lớn hơn với giá trung bình 189 USD mỗi tCO2 cho các giải pháp loại bỏ carbon trực tiếp (CDR). Phân khúc tín chỉ CDR chứng kiến lượng giao dịch kỷ lục, với Microsoft chiếm 57% thị phần, mặc dù giá có thể cao tới 389 USD mỗi tCO2 do đặc điểm công nghệ mới nổi và chi phí cao.."
                    },
                    {
                        "role": "user",
                        "content": """UAERamy Naouss, người từng thắng căn bệnh ung thư, lập kỷ lục thế giới về cuộc chạy marathon nhanh nhất khi bịt mắt tại Dubai Marathon.

Khác với các runner dự giải, Ramy thực hiện thử thách khác biệt khi chạy cự ly 42,195 km với đôi mắt bị bịt kín và không đi giày hay tất.

Runner bịt mắt, chân trần chạy marathon Ramy Naouss bịt mắt, chân trần chạy marathon.

Khi về đích với thành tích 3 giờ 55 phút 27 giây, Ramy bật khóc trong lúc gỡ bỏ miếng bịt mắt được cố định chặt bằng băng dính. "Tôi vẫn đang cố gắng tìm từ ngữ diễn tả cảm xúc của mình. Tôi nghĩ nếu ai đó hỏi tôi cảm giác nhìn thấy Chúa trong một phút như thế nào, tôi sẽ nói kỳ tích này cũng giống như vậy", runner Lebanon sống tại Dubai 7 năm qua bày tỏ.

Ramy nảy ra ý tưởng về bịt mắt chạy khoảng hai tuần trước Dubai Marathon 2025, khi Guinness liên hệ và hỏi anh có làm điều gì phi thường trong cuộc chạy không. Vì thế, anh không có nhiều thời gian tập luyện và chỉ "tin vào ý tưởng và nỗ lực".

Kết quả, vị trí và các splits của Ramy ở Dubai Marathon 2025.

Ramy bị chẩn đoán mắc ung thư máu năm 2017, ở tuổi 25, nhưng đã chiến thắng căn bệnh quái ác này. Anh thực hiện thử thách tại Dubai Marathon nhằm nhấn mạnh ý tưởng về "ánh sáng, hy vọng cuối đường hầm, dù hiện tại có tăm tối đến đâu". Runner 33 tuổi nói: "Chạy chân trần cũng giống như cuộc sống vậy. Cuộc sống không phải lúc nào cũng dễ dàng nhưng bạn phải cảm thấy đau đớn và bạn phải tiếp tục tiến lên".

Ramy không phải lúc nào cũng có thể tập thể dục vì chứng đau lưng và gối mãn tính. Hai năm trước, anh lần đầu chạy chân trần tại quê nhà Lebanon tại một sự kiện nâng cao nhận thức về bệnh ung thư. "Lúc đầu thì đau đớn, nhưng tôi cảm thấy thoải mái trong sự không thoải mái đó", anh bày tỏ.

Ramy Naouss lập kỷ lục Guinness thế giới về cuộc chạy marathon nhanh nhất khi bịt mắt tại Dubai Marathon ngày 12/1.

Ramy cũng được truyền cảm hứng để thực hiện thử thách này thông qua một quyết định mang tính bước ngoặt khác trong cuộc sống cá nhân. "Cho đến gần đây, tôi đã phải trải qua một phương pháp điều trị nhất định mà các bác sĩ nói là cần thiết đến cuối đời, ngay cả sau khi chữa khỏi ung thư", anh cho biết. "Nhưng hai năm trước, tôi muốn dừng mọi phương pháp điều trị. Điều này không phải do thiếu hiểu biết mà là do hiểu được cơ thể, tâm trí của mình và cách bạn thực sự có thể tự chữa lành bản thân. Tôi nhận được kết quả trước cuộc thi marathon và tất cả đều bình thường, chứng minh rằng khoa học đã ủng hộ quyết định của tôi. Đó là lúc cuối cùng tôi nhìn thấy một tia sáng trong cuộc đời đã kéo tôi ra khỏi bóng tối mà tôi đã sống trong tám năm qua".

Ramy cũng viết sách và là người truyền cảm hứng trên mạng xã hội. Anh tích cực trong việc giúp mọi người không cảm thấy áp lực hoặc cảm thấy "chưa làm đủ" thông qua các video hoặc nội dung trực tuyến khác.

Cuốn sách của anh, Let's Live: Challenging Yourself is the Way, nói về những thay đổi trong cuộc sống, động lực và trải nghiệm của anh, từ đó rút ra những bài học mà mọi người có thể áp dụng vào cuộc sống cá nhân để thay đổi.

Lời khuyên của Ramy dành cho bất kỳ ai đang vật lộn để đạt được mục tiêu là "làm những điều đơn giản" mỗi ngày khiến bản thân cảm thấy tốt hơn. "Đó là lý do chạy bộ rất quan trọng với tôi, vì đây là cách để tôi chứng minh với bản thân rằng mình có thể tốt hơn 1% mỗi ngày. Tôi cảm thấy thành công hơn nếu chạy tốt hơn một chút mỗi ngày", runner từ Lebanon nói."""
                    },
                    {
                        "role": "model",
                        "content": """Ramy Naouss đã lập kỷ lục Guinness thế giới về chạy marathon nhanh nhất khi bịt mắt trong 3 giờ 55 phút 27 giây tại Dubai Marathon, dù không đi giày hay tất. Sau khi vượt qua căn bệnh ung thư máu và điều trị gây đau đớn, anh đã tìm thấy ánh sáng và cảm hứng để thử thách chính mình, minh chứng cho sự quyết tâm và sức mạnh tinh thần. Ramy cũng là tác giả của cuốn sách "Let's Live: Challenging Yourself is the Way", khuyến khích mọi người tạo ra những thay đổi tích cực trong cuộc sống."""
                    },
                    {
                        "role": "user",
                        "content": """Giá mua vào của nhẫn trơn sáng nay lập kỷ lục 90-91 triệu đồng, sau đó quay đầu giảm gần nửa triệu đồng một lượng.

9h ngày 19/2, các thương hiệu lớn nâng giá mua vào nhẫn trơn lên mức kỷ lục, dao động 90-91 triệu đồng một lượng, tăng khoảng một triệu đồng so với ngày hôm qua.

Cụ thể, Công ty Vàng bạc đá quý Sài Gòn (SJC) niêm yết giá nhẫn trơn 89,7 - 91,8 triệu đồng một lượng. Tại Công ty Vàng bạc đá quý Phú Nhuận (PNJ), nhẫn trơn lên 90,2 - 91,95 triệu. Bảo Tín Minh Châu cũng nâng nhẫn trơn lên gần 91 - 92 triệu đồng.

Cùng thời điểm, giá vàng miếng tại SJC và các thương hiệu khác cũng tăng khoảng 1 triệu đồng so với hôm qua, giao dịch tại 89,7 - 92 triệu đồng một lượng.

Tuy nhiên, mức này không duy trì được lâu. Lúc 10h, mỗi lượng nhẫn trơn và vàng miếng giảm 400.000-500.000 đồng sau khi giá thế giới quay đầu. Theo đó, SJC hạ giá vàng miếng xuống 89,3 - 91,6 triệu đồng; nhẫn trơn xuống 89,3 - 91,4 triệu đồng một lượng.

Trên thị trường quốc tế, kim loại quý có thời điểm giao dịch sát vùng đỉnh 2.936 USD một ounce sau đó quay đầu giảm xuống vùng 2.926 USD một ounce. Quy đổi theo tỷ giá bán Vietcombank, giá thế giới tương đương 90,7 triệu đồng một lượng. Chênh lệch giá vàng trong nước và thế giới dưới một triệu đồng mỗi lượng.

Sáng nay, giá USD tại các ngân hàng đi ngang.Vietcombank niêm yết tỷ giá tại 25.310 - 25.700 đồng. Hiện tỷ giá trên thị trường chính thức sát với thị trường tự do, đặc biệt là ở chiều bán ra. Một số điểm thu đổi ngoại tệ đang mua bán đôla Mỹ quanh vùng 25.300 - 25.700 đồng."""
                    },
                    {
                        "role": "model",
                        "content": """Sáng ngày 19/2, giá mua vào của nhẫn trơn lập kỷ lục ở mức 90-91 triệu đồng mỗi lượng, tăng một triệu đồng so với hôm trước, nhưng đã giảm gần nửa triệu đồng sau đó do giá thế giới quay đầu. Trên thị trường quốc tế, giá vàng từng đạt gần đỉnh 2.936 USD một ounce trước khi giảm, khiến sự chênh lệch giữa giá vàng trong nước và thế giới chỉ còn dưới một triệu đồng mỗi lượng, trong khi tỷ giá USD tại các ngân hàng ổn định quanh 25.310 - 25.700 đồng."""
                    }
                ]

    def format_string(self, template: str, values: dict[str, str]):
        """
        Formats a template string with values provided in a dictionary.
        
        :param template: The template string with placeholders (e.g., "My name is {fname}, I'm {age}")
        :param values: A dictionary containing key-value pairs to replace placeholders
        :return: The formatted string
        """
        return template.format(**values)
    
    def create_content(self, data):
        contents = []
        for message in self.few_shot:
            contents.append(
                types.Content(
                    role=message["role"],
                    parts=[
                        types.Part.from_text(
                            text=message['content']
                        ),
                    ],
                ),
            )

        contents.append(
            types.Content(
                role="user",
                parts=[
                    types.Part.from_text(
                        text=self.format_string(self.user_prompt, data)
                    ),
                ],
            ),
        )

        return contents
    
    def invoke(self, data) -> str:
        response = client.models.generate_content(
            model="gemini-2.0-flash-lite",
            config=types.GenerateContentConfig(
                system_instruction=self.format_string(self.system_instruction, data)),
            contents=self.create_content(data)
        )

        return response.text.strip()
    