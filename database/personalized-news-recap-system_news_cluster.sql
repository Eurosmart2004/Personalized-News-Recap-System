-- MySQL dump 10.13  Distrib 8.0.32, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: personalized-news-recap-system
-- ------------------------------------------------------
-- Server version	8.0.40

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `news_cluster`
--

DROP TABLE IF EXISTS `news_cluster`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `news_cluster` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `type` varchar(120) NOT NULL,
  `date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `title` (`title`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `news_cluster`
--

LOCK TABLES `news_cluster` WRITE;
/*!40000 ALTER TABLE `news_cluster` DISABLE KEYS */;
INSERT INTO `news_cluster` VALUES (1,'Real Madrid giành chiến thắng thuyết phục trước Celta Vigo, Endrick tỏa sáng','Real Madrid đã chứng minh khả năng chiến đấu và trở lại sau một trận đấu đầy thách thức trước Barca. Đội bóng này đã giành chiến thắng 5-2 trước Celta Vigo ở vòng 1/8 Cup Nhà Vua trong một trận đấu được cho là đầy hấp dẫn, buộc phải vào hiệp phụ.\n\nĐặc biệt, cầu thủ trẻ Endrick đã tỏa sáng với cú đúp xuất sắc. Trong đó có pha dứt điểm chân trái đẳng cấp và hoàn tất phạt góc bằng gót chân, đánh dấu thành tích ấn tượng 4 bàn trên mọi đấu trường của anh ta. Chiến thắng này đã giúp Real tiến vào tứ kết Cup Nhà Vua cùng với các đội mạnh khác như Atletico, Barca, Getafe, Leganes, Osasuna, Real Sociedad và Valencia.\n\nChiến dịch tại Cup Nhà Vua của Real Madrid đang có những bước phát triển tích cực sau khi chứng minh khả năng chiến đấu và trở lại. Với sự xuất sắc của Endrick cùng nhiều cầu thủ khác, đội bóng này sẽ hy vọng tiến sâu hơn trong giải đấu này.','week','2025-01-17 12:13:58'),(2,'Cầu thủ trẻ Amad Diallo lập kỷ lục lịch sử ở Manchester United','Tiền đạo trẻ Amad Diallo đã tạo nên kỳ tích khi ghi ba bàn liên tiếp trong vòng 12 phút, giúp Manchester United đảo ngược tình thế đánh bại Southampton với tỷ số 3-1 trên sân nhà Old Trafford vào ngày 16/1, trong khuôn khổ vòng 21 Ngoại hạng Anh.\n\nLần đầu tiên trong lịch sử Man Utd, một cầu thủ ghi được hat-trick trong vòng 10 phút cuối trận. Amad Diallo bước vào lịch sử khi lập kỷ lục về số bàn thắng nhanh nhất của đội bóng này sau Ole Gunnar Solskjaer và Wayne Rooney.\n\nDiallo đã có một ngày thi đấu xuất sắc với ba bàn thắng từ phút 82 đến bù giờ thứ tư, mang lại chiến thắng quan trọng cho \"Quỷ Đỏ\". Đây cũng là lần đầu tiên kể từ khi Cristiano Ronaldo ghi được hat-trick vào năm 2022. Kỷ lục này của Diallo càng trở nên ấn tượng bởi anh còn trẻ và mới chỉ bước vào tuổi trưởng thành.\n\nChiến thắng trước Southampton không chỉ giúp Man Utd củng cố vị trí trên bảng xếp hạng mà còn cho thấy sự tiến bộ vượt bậc của Amad Diallo, người được kỳ vọng sẽ trở thành một ngôi sao sáng trong tương lai của đội bóng.','week','2025-01-17 12:13:58');
/*!40000 ALTER TABLE `news_cluster` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-01-18 20:36:28
