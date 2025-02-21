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
                        "role": "assistant",
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
                        "role": "assistant",
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
                        "role": "assistant",
                        "content": """Sáng ngày 19/2, giá mua vào của nhẫn trơn lập kỷ lục ở mức 90-91 triệu đồng mỗi lượng, tăng một triệu đồng so với hôm trước, nhưng đã giảm gần nửa triệu đồng sau đó do giá thế giới quay đầu. Trên thị trường quốc tế, giá vàng từng đạt gần đỉnh 2.936 USD một ounce trước khi giảm, khiến sự chênh lệch giữa giá vàng trong nước và thế giới chỉ còn dưới một triệu đồng mỗi lượng, trong khi tỷ giá USD tại các ngân hàng ổn định quanh 25.310 - 25.700 đồng."""
                    }
                ],
                 **kwags) -> None:
        chatPrompt = {
            "system": """"Tóm tắt cần các yếu tố chính của bài báo viết lại thành đoạn văn, nhấn mạnh những thông tin cần thiết, đặc biệt là số liệu quan trọng, trong 2 đến 3 câu.
# Steps
1. Đọc kỹ bài báo để hiểu nội dung chính và các thông tin quan trọng.
2. Xác định các số liệu hoặc sự kiện nổi bật cần được đưa vào tóm tắt để làm nổi bật thông điệp chính của bài báo.
3. Viết đoạn tóm tắt 3 đến 4 câu, tập trung vào các thông tin cốt lõi và số liệu quan trọng.
4. Sử dụng ngôn ngữ sinh động, hấp dẫn để người đọc muốn khám phá tiếp nội dung của bài báo.
5. Viết tóm tắt dưới dạng một đoạn văn liền mạch, không sử dụng liệt kê hay mở đầu bằng cụm từ như 'Bài báo này nói về ..., Dưới đây là đoạn tóm tắt về ...'.

# Output Format
1. Đoạn văn ngắn 3 đến 4 câu.
2. Sử dụng ngôn ngữ tự nhiên và có sức thu hút.
3. Phải thể hiện được thông tin chính của bài báo một cách ngắn gọn và nhấn mạnh vào các số liệu hoặc sự kiện nổi bật.
4. không sử dụng liệt kê hay mở đầu bằng cụm từ như 'Bài báo này nói về ..., Dưới đây là đoạn tóm tắt về ...'.  
# Notes
Giữ đúng tinh thần và ngôn ngữ của bài báo gốc ({language}), tránh làm mất đi sắc thái nội dung ban đầu.""",
            "user": """Hãy tóm tắt bài viết sau, đưa ra câu trả lời không sử dụng liệt kê hay mở đầu bằng cụm từ như 'Bài báo này nói về ...,
            
            {content}"""
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
                        "content": """Năm 2024, Samsung Electronics ghi nhận lãi 25,3 tỷ USD từ hoạt động toàn cầu, tăng 122% so với năm trước, nhưng lãi của 4 nhà máy ở Việt Nam giảm 11,4% còn 3,2 tỷ USD.

Trong báo cáo tài chính hợp nhất năm 2024, Samsung Electronics cho biết doanh thu toàn cầu tăng 16,2% lên hơn 220 tỷ USD, nhưng con số ở Việt Nam chỉ tăng 0,6% lên 56,7 tỷ USD. Các nhà máy chính của Samsung Việt Nam đóng góp hơn 25% doanh thu toàn cầu của công ty này.

4 nhà máy chính tại Việt Nam gồm Samsung Thái Nguyên, Samsung Electronics Vietnam Bắc Ninh, Samsung Display Vietnam Bắc Ninh và Samsung Electronics HCMC CE Complex ở TP HCM. Ngoài ra, Samsung Việt Nam còn có 2 nhà máy lớn khác và một trung tâm nghiên cứu - phát triển. Tuy nhiên, Samsung Electro-Mechanics chuyên sản xuất camera và Samsung SDI, chuyên sản xuất pin, không đưa ra số liệu tại báo cáo này.

Nhà máy Samsung Electronics Việt Nam tại Bắc Ninh. Ảnh: TTXVN

Samsung Thái Nguyên (SEVT), đơn vị sản xuất điện thoại chính của Samsung, là nguồn doanh thu lớn nhất tại Việt Nam với 22,9 tỷ USD, tăng 7,6% so với cùng kỳ. Doanh thu của SEVT chỉ sau Samsung Electronics America và Samsung Semiconductor, đều ở Mỹ. Lãi năm 2024 của SEVT giảm 7,2% còn 1,4 tỷ USD.

Nhà máy Samsung Electronics Vietnam (SEV) tại Bắc Ninh, là một đơn vị khác chuyên sản xuất điện thoại, ghi nhận doanh thu 14,8 tỷ USD và lãi hơn 943 triệu USD, lần lượt tăng 5,7% và 18,9% so với cùng kỳ 2023.

So với kết quả 9 tháng đầu năm 2024, lãi của SEVT và SEV hầu như không tăng thêm trong quý cuối năm ngoái.

Cùng tại Bắc Ninh, nhà máy Samsung Display Vietnam (SDV), phụ trách sản xuất màn hình, giảm cả doanh thu và lãi. Doanh thu giảm 15,7% còn 14,2 tỷ USD, trong khi lãi giảm một nửa còn hơn 583 triệu USD.

Dù kết quả giảm đi, SDV vẫn tiếp tục đầu tư mạnh vào Việt Nam.Tháng 9/2024, Bắc Ninh và Samsung Display ký bản ghi nhớ phát triển dự án màn hình, linh kiện điện tử trị giá 1,8 tỷ USD. Tháng 1/2025, tỉnh Bắc Ninh chính thức trao giấy chứng nhận đăng ký đầu tư để SDV tăng vốn thêm 1,2 tỷ USD lên 7,7 tỷ USD.

Với Samsung Electronics HCMC CE Complex (SEHC) tại TP HCM, chuyên sản xuất Tivi, giảm lãi khoảng 5% còn khoảng 365 triệu USD, trong khi doanh thu tăng 13,9% lên 4,9 tỷ USD.

Samsung là nhà đầu tư trực tiếp nước ngoài lớn nhất ở Việt Nam, với tổng vốn đăng ký 23,2 tỷ USD. Tại cuộc gặp Thủ tướng Phạm Minh Chính chiều 12/2, ông Choi Joo Ho, Tổng giám đốc Samsung Việt Nam và người kế nhiệm là ông Na Ki Hong cho biết sẽ tiếp tục mở rộng đầu tư sang lĩnh vực mới.

Samsung cho biết năm nay chaebol Hàn Quốc này sẽ phải trả thêm thuế thu nhập tại Việt Nam theo quy định thuế tối thiểu toàn cầu. Samsung nói thêm rằng quy định này sẽ không ảnh hưởng hoặc ảnh hưởng rất ít tới việc nộp thuế của Samsung tại các nước, ngoại trừ Việt Nam vì mức thuế tại Việt Nam ít hơn 15%.

Cũng trong báo cáo tài chính, Samsung ghi nhận một khoản nộp thuế tối thiểu toàn cầu năm 2024 khoảng 429,8 tỷ won, tương đương 300 triệu USD, trong khi năm 2023 không phải nộp thuế này."""
                    },
                    {
                        "role": "assistant",
                        "content": """### Samsung Electronics Ghi Nhận Lãi Kỷ Lục
Trong năm 2024, **Samsung Electronics** đã ghi nhận mức lãi khủng khiếp lên đến **25,3 tỷ USD** từ hoạt động toàn cầu, tăng đáng kể lên đến **122%** so với năm trước. Tuy nhiên, phải chú ý rằng lãi của **4 nhà máy tại Việt Nam** đã giảm mạnh, giảm **11,4% đạt 3,2 tỷ USD**.

### Doanh Thu và Lãi Của Samsung Electronics Việt Nam
- Trên toàn thế giới, doanh thu của Samsung đã tăng **16,2% lên hơn 220 tỷ USD**, trong khi tại Việt Nam chỉ tăng **0,6% lên 56,7 tỷ USD**. Có thể thấy rằng các nhà máy chính của Samsung tại Việt Nam đã đóng góp hơn **25% doanh thu toàn cầu** của công ty này.
- **Samsung Thái Nguyên (SEVT)**, đơn vị sản xuất điện thoại chính của Samsung tại Việt Nam, đã mang về doanh thu lớn nhất, lên đến **22,9 tỷ USD**, tuy nhiên lãi của SEVT giảm **7,2% xuống còn 1,4 tỷ USD**.
- Nhà máy **Samsung Electronics Vietnam (SEV)** tại Bắc Ninh cũng ghi nhận sự tăng trưởng với **doanh thu 14,8 tỷ USD** và **lãi hơn 943 triệu USD**.

### Sự Đóng Góp của Nhà Máy tại Bắc Ninh
- **Samsung Display Vietnam (SDV)**, nhà máy chuyên sản xuất màn hình tại Bắc Ninh, đã ghi nhận sự sụt giảm với **doanh thu giảm 15,7% còn 14,2 tỷ USD** và **lãi giảm một nửa còn hơn 583 triệu USD**.
- Tuy kết quả không như kỳ vọng, SDV vẫn tiếp tục đầu tư mạnh mẽ vào Việt Nam, với kế hoạch tăng vốn hơn **1,2 tỷ USD**.

### Chi Tiết Tại TPHCM
- **Samsung Electronics HCMC CE Complex (SEHC)** tại TP HCM, chuyên sản xuất Tivi, ghi nhận sự giảm lãi khoảng **5% xuống còn 365 triệu USD**, trong khi doanh thu tăng **13,9% lên 4,9 tỷ USD**.

### Kế Hoạch Đầu Tư
- **Samsung** hiện là nhà đầu tư trực tiếp nước ngoài lớn nhất ở Việt Nam, với tổng vốn đăng ký lên đến **23,2 tỷ USD**. Ông **Choi Joo Ho**, Tổng giám đốc Samsung Việt Nam, đưa ra kế hoạch mở rộng đầu tư sang lĩnh vực mới.
- Samsung đã công bố sẽ phải trả thêm **thuế thu nhập tại Việt Nam** theo quy định thuế tối thiểu toàn cầu nhưng khẳng định sẽ không ảnh hưởng nhiều đến việc nộp thuế tại các nước khác.
"""
                    },
                    {
                        "role": "user",
                        "content": """Chứng khoán tăng hơn 10 điểm với thanh khoản cải thiện, sàn HoSE ghi nhận 15 cổ phiếu tăng hết biên độ, trong khi khối ngoại dứt đà bán ròng.

Thị trường chứng khoán có một phiên giao dịch hứng khởi. Chỉ số đại diện sàn HoSE đi trên tham chiếu cả ngày. Buổi sáng, thị trường di chuyển khá chậm, có lúc kiểm tra vùng tham chiếu nhưng sớm được nâng đỡ lên mức cao hơn.

Sang buổi chiều, chỉ số chung giữ đà tích cực. VN-Index chốt phiên trên 1.288,5 điểm, tích lũy hơn 10 điểm so với phiên trước. Đây là mức tăng mạnh nhất 2 tuần qua.

Sàn HoSE có 349 cổ phiếu xanh, nhiều gấp 3 lần so với lượng cổ phiếu giảm. Trong đó, thị trường ghi nhận 15 mã tím trần. Bên cạnh các cổ phiếu với thanh khoản nhỏ giọt, hôm nay có thêm một số đại diện được sang tay với giá trị lớn như TCH, REE hay SIP.

Saigon VRG (SIP) vừa được chấp nhận chủ trương đầu tư dự án xây dựng và kinh doanh kết cấu hạ tầng khu công nghiệp Long Đức (giai đoạn 2) có diện tích gần 294 ha tại Đồng Nai. Còn Tài chính Huy Hoàng (TCH) báo lãi sau thuế khoảng 867 tỷ đồng trong 9 tháng đầu niên độ 2024-2025, tăng 55% so với cùng kỳ và vượt 8% kế hoạch cả niên độ.

Loạt cổ phiếu tăng trần trên sàn HoSE trong phiên 19/2. Ảnh: Tất Đạt

Riêng REE, mã bluechip này đã không có phiên nào tăng trần trong gần 3 năm qua, lần cuối được ghi nhận là cuối tháng 6/2022. Hôm nay, hơn 3 triệu cổ phiếu được sang tay, gấp 3,5 lần mức bình quân 52 tuần qua. Chốt phiên, REE còn dư mua gần 925.000 cổ phiếu và trắng bên bán.

Doanh nghiệp này dự kiến thay đổi nhân sự cấp cao trước thềm đại hội cổ đông thường niên 2025. Thành viên Huỳnh Thanh Hải từ nhiệm nên Hội đồng quản trị REE đang nhận hồ sơ ứng cử, đề cử nhân sự bổ sung.

Điểm tích cực khác trong phiên hôm nay là thanh khoản diễn biến cùng chiều. Tổng giá trị giao dịch sàn HoSE ghi nhận gần 17.500 tỷ đồng, tăng hơn 3.200 tỷ.

Đáng chú ý, khối ngoại hôm nay mua ròng khoảng 354 tỷ đồng. Đây là lần đầu tiên nhà đầu tư nước ngoài ưu tiên gom hàng sau 12 bán ròng liên tiếp với giá trị lũy kế hơn 6.800 tỷ đồng. OCB, TCH, FPT, SIP hay DBC là những mã hút dòng tiền của họ nhiều nhất hôm nay."""
                    },
                    {
                        "role": "assistant",
                        "content": """### Thị Trường Chứng Khoán Đồng Loạt Tăng

Trên sàn HoSE, thị trường chứng khoán đã có một phiên giao dịch hứng khởi với chỉ số tăng hơn **10 điểm** và thanh khoản cải thiện. Trong phiên giao dịch, có **15 cổ phiếu** tăng hết biên độ, trong khi khối ngoại đang dần bắt đầu mua ròng.

### Chỉ Số Đại Diện và Chốt Phiên

- Chỉ số **VN-Index** trong phiên giao dịch đã vượt 1.288,5 điểm, tích lũy hơn **10 điểm** so với phiên trước, đây là mức tăng mạnh nhất trong **2 tuần** qua.
- Sàn HoSE ghi nhận **349 cổ phiếu tăng** và có **15 mã tím trần**, nhiều gấp **3 lần** so với cổ phiếu giảm. Khác biệt này thể hiện sự ổn định và tích cực trong thị trường.

### Về Các Doanh Nghiệp Chứng Khoán

- **Saigon VRG (SIP)** sẽ đầu tư vào dự án xây dựng và kinh doanh kết cấu hạ tầng khu công nghiệp Long Đức. Trong khi đó, **Tài chính Huy Hoàng (TCH)** báo lãi sau thuế 867 tỷ đồng trong 9 tháng đầu niên độ 2024-2025, vượt kế hoạch.
- **REE**, một mã bluechip, đã không có phiên tăng trần trong gần **3 năm**, nhưng hôm nay có sự chuyển biến, đồng thời công bố thay đổi nhân sự cấp cao và nhận hồ sơ ứng cử.

### Khối Ngoại và Thanh Khoản

- Tổng giá trị giao dịch sàn HoSE ghi nhận gần **17.500 tỷ đồng**, tăng hơn **3.200 tỷ**. Điều đáng chú ý là khối ngoại đã mua ròng khoảng **354 tỷ đồng**, sau **12 phiên bán ròng** liên tiếp. Các mã như OCB, TCH, FPT, SIP, DBC được nhà đầu tư nước ngoài quan tâm nhiều hôm nay."""
                    }
                ],
                 **kwags) -> None:
        chatPrompt = {
            "system": """# Mô tả yêu cầu
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
Bài báo có độ dài từ 500-1000 từ, phù hợp với một bài tổng hợp tiêu chuẩn.

## Lưu ý
1. Không cần tiêu đề chính, chỉ sử dụng các mục trong bài làm heading.
2. Nếu có số liệu thay đổi hãy in đậm để nhấn mạnh.
""",
            "user": """Dựa trên thông tin tóm tắt các bài báo sau hãy viết thành bài tổng hợp từ 800 - 1000 từ, sử dụng từ ngữ
tự nhiên, câu văn ngắn gọn tránh dài dòng hoặc lập ý.            
            {content}"""
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
""",
            "user": """Dựa trên nội dung bài viết hãy đưa ra một tiêu đề ngắn gọn phù hợp:
            
            {content}"""
        }


        super().__init__(chatPrompt, model, baseURL, stream, fewShot,**kwags)