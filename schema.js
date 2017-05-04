USE bamazondb;

CREATE TABLE products (
  item_id VARCHAR(10) NOT NULL,
  product_name VARCHAR(50) NOT NULL,
  department_name VARCHAR(50),
  price DECIMAL(20,4) NOT NULL,
  stock_qty INT(11) NOT NULL,
    PRIMARY KEY (item_id)
);

SELECT * FROM products;