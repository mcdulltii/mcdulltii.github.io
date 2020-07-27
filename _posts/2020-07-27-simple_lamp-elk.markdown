---
layout: post
title:  "Simple_lamp-ELK"
author: Aaron Ti
date:   2020-07-27
category: Programming
abstract: Kibana Logging for Dockerised Load-Balanced LAMP (Linux, Apache, MySQL, PHP) Stack
website: https://github.com/mcdulltii/simple_lamp-elk
---

## Features
- Packetbeat
- Filebeat
- Metricbeat
- Heartbeat
- Suricata
- Load Balancer

## Setting up system
```shellsession
chmod +x ./setup.sh
./setup.sh
```
<Run SQL commands from [Config files](https://github.com/mcdulltii/simple_lamp-elk#config-files)>
```shellsession
chmod +x ./start.sh
./start.sh
```

## Load-Balancing

Using dockercloud/haproxy docker to automate load balancing for docker scaling of the LAMP server

Port forward web server via docker proxy from haproxy

```
lb:
  image: dockercloud/haproxy
  links:
    - lamp
    - mysql:mysql
  ports:
    - "80:80"
  volumes:
    - /var/run/docker.sock:/var/run/docker.sock
  networks:
    - elk
```

Scale up web server using docker-compose

```shellsession
docker-compose up --scale lamp=3 -d
```

## Logging system

Kibana dashboard can only be accessed on localhost

- Elasticsearch
- Logstash (Unused)
- Kibana

## Config files
*.yml files are stored within lamp/ and mysql/

MYSQL Database configured for simple_lamp-elk_mysql_1 as of below:
```sql
mysql -pPassw0rd!
CREATE USER 'sqldb'@'%' IDENTIFIED BY 'Passw0rd!';
CREATE DATABASE sqldb;
GRANT ALL PRIVILEGES ON sqldb.* TO 'sqldb'@'%';
use sqldb;
DROP TABLE IF EXISTS `upload_images`;
CREATE TABLE `upload_images` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) DEFAULT '',
  `filename` varchar(255) DEFAULT '',
  `timeline` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;
LOCK TABLES `upload_images` WRITE;
INSERT INTO `upload_images` VALUES (1,'Qingye Jiang','clouds1.jpg','2015-01-31 04:21:11'),(2,'Qingye Jiang','clouds2.jpg','2015-01-31 04:21:15'),(3,'Qingye Jiang','clouds3.jpg','2015-01-31 04:21:20'),(4,'Qingye Jiang','clouds4.jpg','2015-01-31 04:21:25'),(5,'Qingye Jiang','clouds5.jpg','2015-01-31 04:24:26'),(6,'Qingye Jiang','clouds6.jpg','2015-01-31 04:24:30'),(7,'Qingye Jiang','clouds7.jpg','2015-01-31 04:24:34'),(8,'Qingye Jiang','clouds8.jpg','2015-01-31 04:24:38'),(9,'Qingye Jiang','clouds9.jpg','2015-01-31 04:25:49'),(10,'Qingye Jiang','clouds10.jpg','2015-01-31 04:25:53');
UNLOCK TABLES;
```

## Credentials
- .env: elasticsearch_password
- ./kibana/config/kibana.yml: elasticsearch.password
