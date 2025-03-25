import { useState } from "react";
import { FlatList, TouchableOpacity } from "react-native";
import { MinusCircle } from "../../Icons/MinusCircle";
import { PlusCircle } from "../../Icons/PlusCircle";
import { CartItem } from "../../types/CartItem";
import { Product } from "../../types/Products";
import { api } from "../../utils/api";
import { formatCurrency } from "../../utils/formatCurrency";
import { Button } from "../Button";
import { OrderConfirmModal } from "../OrderConfirmModal";
import { Text } from "../text";
import {
  Action,
  Image,
  Item,
  ProductContainer,
  ProductDetails,
  QuantifyContainer,
  Summary,
  TotalContainer,
} from "./styles";

interface CartProps {
  cartItems: CartItem[];
  onAdd: (product: Product) => void;
  onDecrement: (product: Product) => void;
  onConfirmOrder: () => void;
  selectedTable: string;
}

export function Cart({
  cartItems,
  onAdd,
  onDecrement,
  onConfirmOrder,
  selectedTable,
}: CartProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const total = cartItems.reduce(
    (acc, cartItem) => acc + cartItem.product.price * cartItem.quantity,
    0
  );

  async function handleConfirmOrder() {
    setIsLoading(true);
    const payload = {
      table: selectedTable,
      products: cartItems.map((cartItem) => ({
        product: cartItem.product._id,
        quantity: cartItem.quantity,
      })),
    };
    await api.post("/orders", payload);

    setIsLoading(false);
    setIsModalVisible(true);
  }

  function handleOk() {
    onConfirmOrder();
    setIsModalVisible(false);
  }

  return (
    <>
      <OrderConfirmModal visible={isModalVisible} onOk={handleOk} />
      {cartItems.length > 0 && (
        <FlatList
          data={cartItems}
          keyExtractor={(cartItem) => cartItem.product._id}
          showsVerticalScrollIndicator={false}
          style={{ marginBottom: 20, maxHeight: 150 }}
          renderItem={({ item: cartItem }) => (
            <Item>
              <ProductContainer>
                <Image
                  source={{
                    uri: `http://192.168.1.29/uploads/${cartItem.product.imagePath}`,
                  }}
                />
                <QuantifyContainer>
                  <Text size={14} color="#666">
                    {cartItem.quantity}x
                  </Text>
                </QuantifyContainer>

                <ProductDetails>
                  <Text size={14} weight="500">
                    {cartItem.product.name}
                  </Text>
                  <Text size={14} color="#666" style={{ marginTop: 4 }}>
                    {total}
                  </Text>
                </ProductDetails>
              </ProductContainer>
              <Action>
                <TouchableOpacity
                  style={{ marginRight: 24 }}
                  onPress={() => {
                    onAdd(cartItem.product);
                  }}
                >
                  <PlusCircle />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => onDecrement(cartItem.product)}>
                  <MinusCircle />
                </TouchableOpacity>
              </Action>
            </Item>
          )}
        />
      )}
      handleRemoveCartItem
      <Summary>
        <TotalContainer>
          {cartItems.length > 0 ? (
            <>
              <Text color="#666">Total</Text>
              <Text size={18} weight="500">
                {formatCurrency(total)}
              </Text>
            </>
          ) : (
            <Text>Seu carrinho está vazio</Text>
          )}
        </TotalContainer>

        <Button
          onPress={handleConfirmOrder}
          disabled={cartItems.length === 0}
          loading={isLoading}
        >
          Confirmar pedido
        </Button>
      </Summary>
    </>
  );
}
