DROP TABLE IF EXISTS `ytCookies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ytCookies` (
  `id` varchar(32) NOT NULL,
  `name` varchar(64) NOT NULL,
  `value` varchar(2048) NOT NULL,
  `domain` varchar(256) NOT NULL,
  `path` varchar(1024) NOT NULL,
  `expires` timestamp NULL DEFAULT NULL,
  `hostOnly` tinyint(1) DEFAULT '0',
  `httpOnly` tinyint(1) DEFAULT '0',
  `accessed` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `sameSite` varchar(6) DEFAULT NULL,
  `secure` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
