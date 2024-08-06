import React, { useState, useEffect } from "react";
import "./App.css";
import {
  Layout,
  Menu,
  Card,
  Select,
  Checkbox,
  Button,
  Row,
  Col,
  Drawer,
} from "antd";
import { DownOutlined, UpOutlined, MenuOutlined } from "@ant-design/icons";
import productsData from "./data/products.json";
import storesData from "./data/stores.json";
import storeProductsData from "./data/storeProducts.json";

const { Header, Sider, Content } = Layout;
const { Option } = Select;

const App = () => {
  const [selectedStore, setSelectedStore] = useState(storesData[0]);
  const [toppingFilters, setToppingFilters] = useState([]);
  const [sortKey, setSortKey] = useState("name");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filterVisible, setFilterVisible] = useState(false);
  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

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
            product.toppings
              .toLowerCase()
              .split(",")
              .map((t) => t.trim())
              .includes(topping.toLowerCase())
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
    onClose()
  };

  const handleSortChange = (value) => {
    setSortKey(value);
  };

  const toggleFilter = () => {
    setFilterVisible(!filterVisible);
    setToppingFilters([]);
  };

  return (
    <div className="container" style={{ minHeight: "100vh" }}>
      <Sider width={200} className="sider-menu">
        <Menu
          mode="inline"
          defaultSelectedKeys={[`${selectedStore.id}`]}
          style={{ height: "100%", borderRight: 0 }}
        >
          <h3 style={{textAlign:'center', padding:'24px'}}>Milk Tea Store</h3>
          {storesData.map((store) => (
            <Menu.Item key={store.id} onClick={() => handleStoreChange(store)}>
              <p style={{textAlign:'center'}}>{store.name}</p>
            </Menu.Item>
          ))}
        </Menu>
      </Sider>
      <Layout style={{ padding: "0 24px 24px" }}>
        <Header>
          <div style={{ display: "flex", justifyContent: "center"}}>
            <h1
              style={{
                margin: "5px",
              }}
            >
              {selectedStore.name} Menu
            </h1>
            <MenuOutlined className="menu-store" style={{position:'absolute', top:'15px', right:'15px'}} onClick={showDrawer}/>
          </div>
        </Header>

        <Content
          className="site-layout-background"
          style={{
            minHeight: 280,
          }}
        >
          <Row justify="space-between">
            <Col style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <Button onClick={toggleFilter}>
                Filter{" "}
                {filterVisible ? <UpOutlined /> : <UpOutlined rotate={180} />}
              </Button>
            </Col>
            <Col>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
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
              <Col
                key={product.id}
                xs={{ span: 24 }} // 1 cột trên màn hình nhỏ hơn 576px
                sm={{ span: 12 }} // 2 cột trên màn hình từ 576px đến 767px
                md={{ span: 8 }} // 3 cột trên màn hình từ 768px đến 991px
                style={{ marginBottom: 16 }}
              >
                <Card
                  title={product.name}
                  // extra={<span>${product.price.toFixed(2)}</span>}
                >
                  <p>Toppings: {product.toppings}</p>
                  <p style={{textAlign: 'end'}}>${product.price.toFixed(2)}</p>
                </Card>
              </Col>
            ))}
          </Row>
        </Content>
      </Layout>
      <Drawer title="Milk Tea Store" onClose={onClose} open={open}>
        <Menu
          mode="inline"
          defaultSelectedKeys={[`${selectedStore.id}`]}
          style={{ height: "100%", borderRight: 0 }}
        >
          {storesData.map((store) => (
            <Menu.Item key={store.id} onClick={() => handleStoreChange(store)}>
              {store.name}
            </Menu.Item>
          ))}
        </Menu>
      </Drawer>
    </div>
  );
};

export default App;
