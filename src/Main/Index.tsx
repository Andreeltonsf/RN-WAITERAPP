import { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import { Button } from "../components/Button";
import { Cart } from "../components/Cart";
import { Categories } from "../components/Categories";
import { Header } from "../components/Header";
import { Menu } from "../components/Menu";
import { TableModal } from "../components/TableModal";
import { Text } from "../components/text";
import { Empty } from "../Icons/Empty";
import { CartItem } from "../types/CartItem";
import { Category } from "../types/Categories";
import { Product } from "../types/Products";
import { api } from "../utils/api";
import {
  CategoriesContainer,
  CenteredContainer,
  Container,
  Footer,
  FooterContainer,
  MenuContainer,
} from "./styles";
export function Main() {
  const [isTableModalVisible, setIsTableModalVisible] = useState(false);
  const [selectedTable, setSelectedTable] = useState("");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  useEffect(() => {
    Promise.all([api.get("/categories"), api.get("/products")]).then(
      ([categoriesResponse, productsResponse]) => {
        setCategories(categoriesResponse.data);
        setProducts(productsResponse.data);
        setIsLoading(false);
      }
    );
  }, []);

  async function handleSelectCategory(categoryId: string) {
    const route = (categoryId = !categoryId
      ? "/products"
      : `/categories/${categoryId}/products`);

    setIsLoadingProducts(true);

    const { data } = await api.get(route);
    setProducts(data);

    setIsLoadingProducts(false);
  }

  function handleTableSave(table: string) {
    setSelectedTable(table);
    setIsTableModalVisible(false);
  }

  function handleResetOrder() {
    setSelectedTable("");
    setCartItems([]);
  }

  function handleCartItemAdd(product: Product) {
    if (!selectedTable) {
      setIsTableModalVisible(true);
    }
    setCartItems((prevState) => {
      const itemIndex = prevState.findIndex(
        (cartItem) => cartItem.product._id === product._id
      );

      if (itemIndex < 0) {
        return prevState.concat({
          product,
          quantity: 1,
        });
      }

      const newCartItems = [...prevState];
      const item = newCartItems[itemIndex];

      newCartItems[itemIndex] = {
        ...item,
        quantity: item.quantity + 1,
      };
      return newCartItems;
    });
  }

  function handleRemoveCartItem(product: Product) {
    setCartItems((prevState) => {
      const itemIndex = prevState.findIndex(
        (cartItem) => cartItem.product._id === product._id
      );

      const item = prevState[itemIndex];
      const newCartItems = [...prevState];

      if (item.quantity === 1) {
        newCartItems.splice(itemIndex, 1);
        return newCartItems;
      }

      newCartItems[itemIndex] = {
        ...item,
        quantity: item.quantity - 1,
      };

      return newCartItems;
    });
  }

  return (
    <>
      <Container>
        <Header
          selectedTable={selectedTable}
          onCancelOrder={handleResetOrder}
        />
        {isLoading && (
          <CenteredContainer>
            <ActivityIndicator color="#d73035" size="large" />
          </CenteredContainer>
        )}

        {isLoadingProducts ? (
           <CenteredContainer>
           <ActivityIndicator color="#d73035" size="large" />
         </CenteredContainer>
        ) : (
          <>
          {products.length > 0 ? (
            <MenuContainer>
              <Menu onAddToCart={handleCartItemAdd} products={products} />
            </MenuContainer>
          ) : (
            <CenteredContainer>
              <Empty />
              <Text color="#666" style={{ marginTop: 24 }}>
                Nenhum produto foi encontrado!
              </Text>
            </CenteredContainer>
          )}
          </>
        )}


        {!isLoading && (
          <>
            <CategoriesContainer>
              <Categories
                categories={categories}
                onSelectCategory={handleSelectCategory}
              />
            </CategoriesContainer>

            {products.length > 0 ? (
              <MenuContainer>
                <Menu onAddToCart={handleCartItemAdd} products={products} />
              </MenuContainer>
            ) : (
              <CenteredContainer>
                <Empty />
                <Text color="#666" style={{ marginTop: 24 }}>
                  Nenhum produto foi encontrado!
                </Text>
              </CenteredContainer>
            )}
          </>
        )}
      </Container>
      <Footer>
        <FooterContainer>
          {!selectedTable && (
            <Button
              onPress={() => setIsTableModalVisible(true)}
              disabled={isLoading}
            >
              Novo Pedido
            </Button>
          )}

          {selectedTable && (
            <Cart
              cartItems={cartItems}
              onAdd={handleCartItemAdd}
              onDecrement={handleRemoveCartItem}
              onConfirmOrder={handleResetOrder}
              selectedTable={selectedTable}
            />
          )}
        </FooterContainer>
      </Footer>
      <TableModal
        visible={isTableModalVisible}
        onClose={() => setIsTableModalVisible(false)}
        onSave={handleTableSave}
      />
    </>
  );
}
