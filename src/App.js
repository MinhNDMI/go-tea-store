import React, { useState, useEffect } from "react";
import { Layout, Menu, Card, Select, Checkbox, Button, Row, Col } from "antd";
import { DownOutlined } from "@ant-design/icons";
import productsData from "./data/products.json";
import storesData from "./data/stores.json";
import storeProductsData from "./data/storeProducts.json";
import "./App.css";

const { Header, Sider, Content } = Layout;
const { Option } = Select;

const App = () => {
  const [selectedStore, setSelectedStore] = useState(storesData[0]);
  const [toppingFilters, setToppingFilters] = useState([]);
  const [sortKey, setSortKey] = useState("name");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filterVisible, setFilterVisible] = useState(false);

  useEffect(() => {
    const getFilteredProducts = () => {
      const storeProductIds = storeProductsData
        .filter((sp) => sp.shop === selectedStore.id)
        .map((sp) => sp.product);

      let filteredProducts = productsData.filter((product) =>
        storeProductIds.includes(product.id)
      );

      if (toppingFilters.length > 0) {
        filteredProducts = filteredProducts.filter((product) =>
          toppingFilters.every((topping) =>
            product.toppings.toLowerCase().split(',').map(t => t.trim()).includes(topping.toLowerCase())
          )
        );
      }

      switch (sortKey) {
        case "name":
          filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case "name-desc":
          filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
          break;
        case "price":
          filteredProducts.sort((a, b) => a.price - b.price);
          break;
        case "price-desc":
          filteredProducts.sort((a, b) => b.price - a.price);
          break;
        default:
          break;
      }

      setFilteredProducts(filteredProducts);
    };

    getFilteredProducts();
  }, [selectedStore, toppingFilters, sortKey]);

  const handleStoreChange = (store) => {
    setSelectedStore(store);
  };

  const handleToppingChange = (topping) => {
    setToppingFilters((prevFilters) =>
      prevFilters.includes(topping)
        ? prevFilters.filter((t) => t !== topping)
        : [...prevFilters, topping]
    );
  };

  const handleSortChange = (value) => {
    setSortKey(value);
  };

  const toggleFilter = () => {
    setFilterVisible(!filterVisible);
    setToppingFilters([])
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider width={200} className="site-layout-background">
        <Menu
          mode="inline"
          defaultSelectedKeys={[`${selectedStore.id}`]}
          style={{ height: "100%", borderRight: 0 }}
        >
          {storesData.map((store) => (
            <Menu.Item
              key={store.id}
              onClick={() => handleStoreChange(store)}
            >
              {store.name}
            </Menu.Item>
          ))}
        </Menu>
      </Sider>
      <Layout style={{ padding: "0 24px 24px" }}>
        <Header>
          <h1 style={{ margin: "5px", textAlign:'center'}}>{selectedStore.name} Menu</h1>
        </Header>
        
        <Content
          className="site-layout-background"
          style={{
            padding: 24,
            margin: 0,
            minHeight: 280,
          }}
        >
          <Row justify="space-between">
            <Col>
              {/* <Button onClick={() => setToppingFilters([])}>Filter</Button> */}
              <Button onClick={toggleFilter}>
                Filter{" "}
                {filterVisible ? (
                  <DownOutlined />
                ) : (
                  <DownOutlined rotate={180} />
                )}
              </Button>
            </Col>
            <Col>
              <div style={{display: 'flex', alignItems: 'center', gap: 4}}>
                <p>Sort by</p>
              <Select
                defaultValue="name"
                style={{ width: 120 }}
                onChange={handleSortChange}
                dropdownMatchSelectWidth={false}
                suffixIcon={<DownOutlined />}
              >
                <Option value="name">Name (Asc)</Option>
                <Option value="name-desc">Name (Dsc)</Option>
                <Option value="price">Price (Asc)</Option>
                <Option value="price-desc">Price (Dsc)</Option>
              </Select>
              </div>
            </Col>
          </Row>
          {filterVisible && (
            <div style={{ marginBottom: 16 }}>
              <Checkbox.Group
                value={toppingFilters}
                onChange={setToppingFilters}
              >
                {["Milk foam", "White pearl", "Pearl", "Aloe"].map(
                  (topping) => (
                    <Checkbox key={topping} value={topping}>
                      {topping}
                    </Checkbox>
                  )
                )}
              </Checkbox.Group>
            </div>
          )}
          <Row gutter={16}>
            {filteredProducts.map((product) => (
              <Col span={8} key={product.id} style={{ marginBottom: 16 }}>
                <Card
                  title={product.name}
                  extra={<span>${product.price.toFixed(2)}</span>}
                >
                  <p>Toppings: {product.toppings}</p>
                </Card>
              </Col>
            ))}
          </Row>
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
