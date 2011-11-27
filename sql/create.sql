DROP TABLE IF EXISTS `category`;
CREATE TABLE category (
	id INT UNSIGNED NOT NULL PRIMARY KEY,
	name VARCHAR(255)
);

DROP TABLE IF EXISTS article;
CREATE TABLE article (
	id INT UNSIGNED NOT NULL PRIMARY KEY,
	name VARCHAR(255)
);

DROP TABLE IF EXISTS article_category;
CREATE TABLE article_category (
	id_article INT UNSIGNED NOT NULL,
	id_category INT UNSIGNED NOT NULL,
    INDEX (id_article),
    FOREIGN KEY (id_article) REFERENCES article(id),
    INDEX (id_category),
    FOREIGN KEY (id_category) REFERENCES category(id)
);

DROP TABLE IF EXISTS article_article;
CREATE TABLE article_article (
	id_article_from INT UNSIGNED NOT NULL,
	id_article_to INT UNSIGNED NOT NULL,
    INDEX (id_article_from),
    FOREIGN KEY (id_article_from) REFERENCES article(id),
    INDEX (id_article_to),
    FOREIGN KEY (id_article_to) REFERENCES article(id)
);
