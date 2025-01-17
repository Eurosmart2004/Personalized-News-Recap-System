import requests

class NLPModel:
    def __init__(self, 
                 chatPrompt: dict[str, str],
                 model: str = "llama3.1",
                 baseURL: str = "http://localhost:11434/api/chat",
                 stream: bool = False,
                 fewShot: list[dict[str, str]] = None,
                 num_ctx: int = 2048,
                 temperature: float = 0,
                 num_keep: int = None,
                 seed: int = None,
                 num_predict: int = None,
                 top_k: int = None,
                 top_p: float = None,
                 min_p: float = None,
                 typical_p: float = None,
                 repeat_last_n: int = None,
                 repeat_penalty: float = None,
                 presence_penalty: float = None,
                 frequency_penalty: float = None,
                 mirostat: int = None,
                 mirostat_tau: float = None,
                 mirostat_eta: float = None,
                 penalize_newline: bool = None,
                 stop: list[str] = None,
                 numa: bool = None,
                 num_batch: int = None,
                 num_gpu: int = None,
                 main_gpu: int = None,
                 low_vram: bool = None,
                 vocab_only: bool = None,
                 use_mmap: bool = None,
                 use_mlock: bool = None,
                 num_thread: int = None
                 ) -> None:
        self.model = model
        self.baseURL = baseURL
        self.stream = stream
        self.fewShot = fewShot
        self.chatPrompt = chatPrompt
        self.num_ctx = num_ctx
        self.temperature = temperature
        self.num_keep = num_keep
        self.seed = seed
        self.num_predict = num_predict
        self.top_k = top_k
        self.top_p = top_p
        self.min_p = min_p
        self.typical_p = typical_p
        self.repeat_last_n = repeat_last_n
        self.repeat_penalty = repeat_penalty
        self.presence_penalty = presence_penalty
        self.frequency_penalty = frequency_penalty
        self.mirostat = mirostat
        self.mirostat_tau = mirostat_tau
        self.mirostat_eta = mirostat_eta
        self.penalize_newline = penalize_newline
        self.stop = stop
        self.numa = numa
        self.num_batch = num_batch
        self.num_gpu = num_gpu
        self.main_gpu = main_gpu
        self.low_vram = low_vram
        self.vocab_only = vocab_only
        self.use_mmap = use_mmap
        self.use_mlock = use_mlock
        self.num_thread = num_thread

    def format_string(self, template: str, values: dict[str, str]):
        """
        Formats a template string with values provided in a dictionary.
        
        :param template: The template string with placeholders (e.g., "My name is {fname}, I'm {age}")
        :param values: A dictionary containing key-value pairs to replace placeholders
        :return: The formatted string
        """
        return template.format(**values)

    def invoke(self, data: dict[str, str]) -> str:
        options = {
            "num_ctx": self.num_ctx,
            "temperature": self.temperature,
            "num_keep": self.num_keep,
            "seed": self.seed,
            "num_predict": self.num_predict,
            "top_k": self.top_k,
            "top_p": self.top_p,
            "min_p": self.min_p,
            "typical_p": self.typical_p,
            "repeat_last_n": self.repeat_last_n,
            "repeat_penalty": self.repeat_penalty,
            "presence_penalty": self.presence_penalty,
            "frequency_penalty": self.frequency_penalty,
            "mirostat": self.mirostat,
            "mirostat_tau": self.mirostat_tau,
            "mirostat_eta": self.mirostat_eta,
            "penalize_newline": self.penalize_newline,
            "stop": self.stop,
            "numa": self.numa,
            "num_batch": self.num_batch,
            "num_gpu": self.num_gpu,
            "main_gpu": self.main_gpu,
            "low_vram": self.low_vram,
            "vocab_only": self.vocab_only,
            "use_mmap": self.use_mmap,
            "use_mlock": self.use_mlock,
            "num_thread": self.num_thread
        }

        # Remove options that are None
        options = {k: v for k, v in options.items() if v is not None}

        messages = [
            {
                "role": "system",
                "content": self.format_string(template=self.chatPrompt['system'], values=data)
            },
            {
                "role": "user",
                "content": self.format_string(template=self.chatPrompt['user'], values=data)
            }
        ]

        # Add fewShot examples if provided
        if self.fewShot:
            for shot in self.fewShot:
                messages.insert(-1, shot)

        data = {
            "model": self.model,
            "messages": messages,
            "stream": self.stream,
            "option": options
        }
        
        try:
            response = requests.post(
                url=self.baseURL,
                json=data,
                timeout=None
            )
            return response.json()['message']['content'].strip()
        except Exception as e:
            raise e
        
class SummarizeModel(NLPModel):
    def __init__(self, 
                 model:str = "llama3.1", 
                 baseURL:str = "http://localhost:11434/api/chat",
                 stream:bool = False,
                 fewShot: list[dict[str, str]] = [
                    {
                        "role": "user",
                        "content": """Một ủy ban điều tra độc lập Israel (CCI) đã cáo buộc chính quyền Thủ tướng Netanyahu thất bại trong nhiệm vụ bảo vệ người dân trước cuộc tấn công ngày 7/10/2023 của Hamas. Báo cáo chỉ trích Netanyahu làm suy yếu quá trình ra quyết định an ninh quốc gia và ngăn cản thảo luận về các mối đe dọa. CCI cho biết chính phủ Israel đã đánh giá sai về Hamas và tạo điều kiện chuyển tiền mặt vào Dải Gaza, làm trầm trọng thêm tình hình. Các cơ quan quốc phòng và tình báo bị chỉ trích vì thiếu chuẩn bị và phối hợp, dù đã có thông tin về kế hoạch tấn công từ một năm trước. Báo cáo kêu gọi mở cuộc điều tra chính thức, so sánh với việc Mỹ điều tra sau sự kiện 11/9/2001."""
                    },
                    {
                        "role": "assistant",
                        "content": "Ủy ban điều tra độc lập Israel (CCI) cáo buộc chính quyền Thủ tướng Netanyahu thất bại trong việc bảo vệ người dân trước vụ tấn công của Hamas ngày 7/10/2023, do sai lầm trong đánh giá mối đe dọa và thiếu phối hợp tình báo. Báo cáo cũng chỉ trích việc tạo điều kiện chuyển tiền vào Dải Gaza, làm trầm trọng thêm tình hình. Ngoài ra, CCI cho biết các cơ quan quốc phòng đã bỏ qua cảnh báo về kế hoạch tấn công từ một năm trước và kêu gọi mở cuộc điều tra chính thức, tương tự sự kiện 11/9 tại Mỹ."
                    },
                    {
                        "role": "user",
                        "content": """Đội ngũ của Tổng thống đắc cử Donald Trump đã ký thỏa thuận chuyển giao quyền lực với Nhà Trắng ngày 26/11 sau nhiều ngày trì hoãn và phản đối một số điều khoản. Thỏa thuận này cho phép nhóm ông Trump tiếp cận ngân sách, giấy phép an ninh và phối hợp với các cơ quan liên bang để chuẩn bị cho quá trình tiếp quản. Tuy nhiên, nhóm ông Trump từ chối ký vào một số mục như cam kết đạo đức chính phủ và không cho phép FBI thẩm tra lý lịch nhân sự. Họ tuyên bố sẽ sử dụng nguồn tài trợ tư nhân cho quá trình chuyển giao và không dùng văn phòng làm việc để tránh lãng phí tiền thuế. Nhà Trắng bày tỏ lo ngại về các mâu thuẫn lợi ích và trục trặc do sự chậm trễ, nhưng vẫn tiếp tục hỗ trợ để đảm bảo quá trình chuyển giao quyền lực diễn ra suôn sẻ."""
                    },
                    {
                        "role": "assistant",
                        "content": "Đội ngũ của Tổng thống đắc cử Donald Trump đã ký thỏa thuận chuyển giao quyền lực với Nhà Trắng ngày 26/11, cho phép tiếp cận ngân sách và phối hợp với các cơ quan liên bang. Tuy nhiên, họ từ chối một số điều khoản, cam kết sử dụng nguồn tài trợ tư nhân để tránh lãng phí tiền thuế. Nhà Trắng lo ngại các vấn đề lợi ích và sự chậm trễ nhưng vẫn đảm bảo hỗ trợ quá trình chuyển giao."
                    }
                ],
                 **kwags) -> None:
        chatPrompt = {
            "system": """"Tóm tắt cần các yếu tố chính của bài báo, nhấn mạnh những thông tin cần thiết, đặc biệt là số liệu quan trọng, trong 2 đến 3 câu.
# Steps
1. Đọc kỹ bài báo để hiểu nội dung chính và các thông tin quan trọng.
2. Xác định các số liệu hoặc sự kiện nổi bật cần được đưa vào tóm tắt để làm nổi bật thông điệp chính của bài báo.
3. Viết đoạn tóm tắt 3 đến 4 câu, tập trung vào các thông tin cốt lõi và số liệu quan trọng.
4. Sử dụng ngôn ngữ sinh động, hấp dẫn để người đọc muốn khám phá tiếp nội dung của bài báo.

# Output Format
Đoạn văn ngắn 3 đến 4 câu.
Sử dụng ngôn ngữ tự nhiên và có sức thu hút.
Phải thể hiện được thông tin chính của bài báo một cách ngắn gọn và nhấn mạnh vào các số liệu hoặc sự kiện nổi bật.
  
# Notes
Giữ đúng tinh thần và ngôn ngữ của bài báo gốc ({language}), tránh làm mất đi sắc thái nội dung ban đầu.""",
            "user": """{content}"""
        }

        super().__init__(chatPrompt, model, baseURL, stream, fewShot,**kwags)

class SynthesizeModel(NLPModel):
    def __init__(self, 
                 model:str = "llama3.1", 
                 baseURL:str = "http://localhost:11434/api/chat",
                 stream:bool = False,
                 fewShot: list[dict[str, str]] = [
                    {
                        "role": "user",
                        "content": """Tiền đạo Amad Diallo của Man Utd đã trở thành cầu thủ thứ ba trong lịch sử Ngoại hạng Anh ghi hat-trick (ba bàn) trong 10 phút cuối trận sau Ole Gunnar Solskjaer và Wayne Rooney. Anh đã ghi ba bàn cho Man Utd từ phút 82 đến bù giờ thứ tư, giúp đội đánh bại Southampton 3-1 vào ngày 16/1.

Cầu thủ trẻ Amad Diallo đã lập hat-trick trong 12 phút để giúp Man Utd ngược lại thua Southampton 3-1 trên sân nhà Old Trafford ở vòng 21 Ngoại hạng Anh. Đây là lần đầu tiên một cầu thủ của "Quỷ Đỏ" lập được cú hat-trick kể từ Cristiano Ronaldo năm 2022 và cũng là danh hiệu trẻ nhất trong lịch sử đội bóng này, sau Wayne Rooney."""
                    },
                    {
                        "role": "assistant",
                        "content": """Tiền đạo trẻ Amad Diallo đã lập nên kỳ tích khi ghi ba bàn trong vòng 12 phút, giúp Manchester United lội ngược dòng đánh bại Southampton 3-1 trên sân nhà Old Trafford vào ngày 16/1, trong khuôn khổ vòng 21 Ngoại hạng Anh.

Diallo trở thành cầu thủ thứ ba trong lịch sử Ngoại hạng Anh ghi được hat-trick trong 10 phút cuối trận, nối bước hai huyền thoại của Man Utd là Ole Gunnar Solskjaer và Wayne Rooney. Anh ghi ba bàn từ phút 82 đến bù giờ thứ tư, mang về chiến thắng quan trọng cho "Quỷ Đỏ".

Đáng chú ý, đây là lần đầu tiên một cầu thủ Man Utd lập hat-trick kể từ Cristiano Ronaldo vào năm 2022. Diallo cũng thiết lập kỷ lục mới khi trở thành cầu thủ trẻ nhất của đội bóng đạt được thành tích này, vượt qua cột mốc của Wayne Rooney.

Chiến thắng trước Southampton không chỉ giúp Man Utd củng cố vị trí trên bảng xếp hạng mà còn đánh dấu sự trưởng thành vượt bậc của Amad Diallo, người được kỳ vọng sẽ trở thành một ngôi sao sáng trong tương lai của đội bóng."""
                    },
                    {
                        "role": "user",
                        "content": """Một số ứng viên nội các của Tổng thống đắc cử Donald Trump đang gặp khó khăn trong quá trình phê chuẩn ở Thượng viện Mỹ. Chỉ có ứng viên ngoại trưởng Marco Rubio là người duy nhất được Thượng viện thông qua ngay trong ngày đầu ông Trump nhậm chức. Các ứng viên khác, bao gồm Bộ trưởng An ninh Nội địa và Bộ trưởng Quốc phòng, sẽ phải trải qua các phiên điều trần trước khi được phê chuẩn.

Tổng thống Donald Trump đã công bố ảnh chân dung chính thức với tư cách tổng thống thứ 47 trước khi nhậm chức. Ảnh này có nét tương đồng với ảnh hồ sơ nhà tù ông từng chụp năm 2023, nhưng với một số khác biệt về trang phục. Ông Trump được cho là sẽ tuyên thệ nhậm chức vào ngày mai cùng Phó Tổng thống đắc cử JD Vance."""
                    },
                    {
                        "role": "assistant",
                        "content": """Tổng thống đắc cử Donald Trump đang đối mặt với nhiều thách thức khi một số ứng viên nội các của ông gặp khó khăn trong quá trình phê chuẩn tại Thượng viện Mỹ. Trong số các ứng viên, chỉ có Ngoại trưởng Marco Rubio được thông qua ngay trong ngày đầu ông Trump nhậm chức. Các vị trí quan trọng khác, như Bộ trưởng An ninh Nội địa và Bộ trưởng Quốc phòng, vẫn cần trải qua các phiên điều trần trước khi được phê chuẩn.

Đồng thời, ông Trump đã công bố ảnh chân dung chính thức với tư cách tổng thống thứ 47 của Mỹ trước lễ nhậm chức. Bức ảnh gây chú ý bởi một số nét tương đồng với ảnh hồ sơ nhà tù ông từng chụp năm 2023, nhưng với sự khác biệt về trang phục, mang tính biểu tượng cho cương vị mới.

Ông Trump dự kiến sẽ tuyên thệ nhậm chức vào ngày mai cùng Phó Tổng thống đắc cử JD Vance, chính thức đánh dấu sự khởi đầu của nhiệm kỳ Tổng thống thứ 47 trong lịch sử nước Mỹ."""
                    }
                ],
                 **kwags) -> None:
        chatPrompt = {
            "system": """Tạo một bài báo tổng hợp từ đoạn tóm tắt thông tin của nhiều bài báo khác nhau. 
# Steps

1. Đọc và phân tích đoạn tóm tắt ban đầu để hiểu rõ thông tin và ý chính được tổng hợp từ các bài báo khác nhau.
2. Xác định các chủ đề chính và phụ cùng với các thông tin bổ sung từ đoạn tóm tắt.
3. Tổ chức lại nội dung theo một cấu trúc hợp lý cho một bài báo.
4. Triển khai các phần thân bài bằng cách trình bày các thông tin chi tiết từ đoạn tóm tắt, đảm bảo sự liên kết logic giữa các phần nội dung.
5. Kết thúc bài báo bằng phần kết luận tóm tắt lại những ý chính và đưa ra nhận định hoặc ý kiến cá nhân nếu cần thiết.

# Output Format

Bài báo tổng hợp phải được trình bày dưới dạng văn bản dễ đọc. Mỗi phần cần có các đoạn văn mạch lạc và rõ ràng, với chiều dài tổng thể phù hợp với kích thước thông thường của một bài báo (khoảng 500-1000 từ).

Không bao gồm tiêu đề và các đề mục trong bài báo tổng hợp.

# Notes

Chú ý đảm bảo rằng tất cả các nguồn thông tin đều được tổng hợp một cách hợp lý và không có sự thiên vị.
Tránh sao chép trực tiếp nội dung từ đoạn tóm tắt; sử dụng ngôn ngữ của riêng bạn.
Nếu có trích dẫn, cần ghi rõ nguồn để bảo vệ bản quyền nội dung.""",
            "user": """{content}"""
        }

        super().__init__(chatPrompt, model, baseURL, stream, fewShot,**kwags)

class NameTitleModel(NLPModel):
    def __init__(self, 
                 model:str = "llama3.1", 
                 baseURL:str = "http://localhost:11434/api/chat",
                 stream:bool = False,
                 fewShot: list[dict[str, str]] = [
                    {
                        "role": "user",
                        "content": """Một ủy ban điều tra độc lập Israel (CCI) đã cáo buộc chính quyền Thủ tướng Netanyahu thất bại trong nhiệm vụ bảo vệ người dân trước cuộc tấn công ngày 7/10/2023 của Hamas. Báo cáo chỉ trích Netanyahu làm suy yếu quá trình ra quyết định an ninh quốc gia và ngăn cản thảo luận về các mối đe dọa. CCI cho biết chính phủ Israel đã đánh giá sai về Hamas và tạo điều kiện chuyển tiền mặt vào Dải Gaza, làm trầm trọng thêm tình hình. Các cơ quan quốc phòng và tình báo bị chỉ trích vì thiếu chuẩn bị và phối hợp, dù đã có thông tin về kế hoạch tấn công từ một năm trước. Báo cáo kêu gọi mở cuộc điều tra chính thức, so sánh với việc Mỹ điều tra sau sự kiện 11/9/2001."""
                    },
                    {
                        "role": "assistant",
                        "content": "Chính phủ Israel bị cáo buộc 'thất bại hoàn toàn' trong vụ Hamas đột kích"
                    },
                    {
                        "role": "user",
                        "content": """Đội ngũ của Tổng thống đắc cử Donald Trump đã ký thỏa thuận chuyển giao quyền lực với Nhà Trắng ngày 26/11 sau nhiều ngày trì hoãn và phản đối một số điều khoản. Thỏa thuận này cho phép nhóm ông Trump tiếp cận ngân sách, giấy phép an ninh và phối hợp với các cơ quan liên bang để chuẩn bị cho quá trình tiếp quản. Tuy nhiên, nhóm ông Trump từ chối ký vào một số mục như cam kết đạo đức chính phủ và không cho phép FBI thẩm tra lý lịch nhân sự. Họ tuyên bố sẽ sử dụng nguồn tài trợ tư nhân cho quá trình chuyển giao và không dùng văn phòng làm việc để tránh lãng phí tiền thuế. Nhà Trắng bày tỏ lo ngại về các mâu thuẫn lợi ích và trục trặc do sự chậm trễ, nhưng vẫn tiếp tục hỗ trợ để đảm bảo quá trình chuyển giao quyền lực diễn ra suôn sẻ."""
                    },
                    {
                        "role": "assistant",
                        "content": "Nhóm ông Trump ký thỏa thuận chuyển giao quyền lực với Nhà Trắng"
                    }
                ],
                 **kwags) -> None:
        chatPrompt = {
            "system": """Hãy tạo một tiêu đề ngắn gọn và hấp dẫn cho bài báo dựa trên đoạn văn bản đã cung cấp. Tiêu đề nên phản ánh đúng nội dung chính và thu hút sự chú ý của độc giả.

# Steps

1. Đọc kỹ đoạn văn bản được cung cấp để nắm bắt nội dung chính và các điểm then chốt.
2. Xác định các từ khóa quan trọng thể hiện nội dung chính.
3. Sắp xếp lại các từ khóa để tạo thành tiêu đề ngắn gọn, dễ hiểu.
4. Đảm bảo tiêu đề phản ánh đúng nội dung và thu hút sự chú ý.

# Output Format

Một tiêu đề ngắn gọn, dài không quá 10 từ.

# Example

"Covid-19: Số ca nhiễm mới tăng mạnh tại TP.HCM"
"Thị trường chứng khoán: Sự biến động của VN-Index"

# Notes

- Tiêu đề không được dài quá 10 từ.
- Nên sử dụng ngữ điệu tích cực và lôi cuốn.
- Không sử dụng dấu ngoặc kép hoặc ký tự đặc biệt quanh tiêu đề. 
""",
            "user": "{content}"
        }


        super().__init__(chatPrompt, model, baseURL, stream, fewShot,**kwags)